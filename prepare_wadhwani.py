import pandas as pd
from pathlib import Path
from collections import defaultdict
import subprocess
import random
import re

# ============================================================
# CONFIG
# ============================================================

CSV_PATH = Path(r"A:\project\ECHO\dataset\wadhwani_metadata\dev.csv.gz")

OUTPUT_DIR = Path(r"A:\project\ECHO\dataset\wadhwani_yolo")

MAX_TRAIN_IMAGES = 4500
MAX_VAL_IMAGES = 500

CLASS_ID = 3   # ECHO: bollworm

RANDOM_SEED = 42

random.seed(RANDOM_SEED)


# ============================================================
# CREATE DIRECTORIES
# ============================================================

for split in ["train", "val"]:
    (OUTPUT_DIR / "images" / split).mkdir(
        parents=True,
        exist_ok=True
    )

    (OUTPUT_DIR / "labels" / split).mkdir(
        parents=True,
        exist_ok=True
    )


# ============================================================
# LOAD METADATA
# ============================================================

print("Loading Wadhwani metadata...")

df = pd.read_csv(CSV_PATH)

print(f"Total annotations: {len(df)}")

# Only bollworm classes
df = df[df["label"].isin(["pbw", "abw"])].copy()

print(f"Bollworm annotations: {len(df)}")

# ============================================================
# IMAGE URL GROUPING
# ============================================================

groups = df.groupby(["split", "url"])

image_groups = {
    "train": [],
    "val": []
}

for (split, url), group in groups:

    if split not in image_groups:
        continue

    image_groups[split].append(
        (url, group)
    )

print()
print("Unique images:")

for split in image_groups:
    print(
        f"{split}: {len(image_groups[split])}"
    )


# ============================================================
# SAMPLE IMAGES
# ============================================================

random.shuffle(image_groups["train"])
random.shuffle(image_groups["val"])

train_images = image_groups["train"][:MAX_TRAIN_IMAGES]
val_images = image_groups["val"][:MAX_VAL_IMAGES]

selected = {
    "train": train_images,
    "val": val_images
}


# ============================================================
# POLYGON → BOUNDING BOX
# ============================================================

def polygon_to_bbox(geometry):

    """
    Convert:

    POLYGON ((x1 y1, x2 y2, ...))

    into:

    xmin ymin xmax ymax
    """

    numbers = re.findall(
        r"[-+]?\d*\.?\d+",
        str(geometry)
    )

    # First number is not coordinate metadata;
    # coordinates occur as x,y pairs.

    values = [float(x) for x in numbers]

    if len(values) < 4:
        return None

    xs = values[0::2]
    ys = values[1::2]

    xmin = min(xs)
    xmax = max(xs)

    ymin = min(ys)
    ymax = max(ys)

    return xmin, ymin, xmax, ymax


# ============================================================
# IMAGE DIMENSIONS
# ============================================================

# Wadhwani images commonly use 640x480 / similar dimensions.
# We will determine dimensions when downloading.
# For now, bbox conversion is deferred until image exists.


# ============================================================
# DOWNLOAD + CREATE LABEL
# ============================================================

total_images = 0
total_boxes = 0


for split, images in selected.items():

    print()
    print("=" * 60)
    print(f"PROCESSING {split.upper()}")
    print("=" * 60)

    for index, (url, group) in enumerate(images, start=1):

        # ----------------------------------------------------
        # S3 URL
        # ----------------------------------------------------

        s3_url = url.strip()

        filename = s3_url.split("/")[-1]

        output_image = (
            OUTPUT_DIR
            / "images"
            / split
            / filename
        )

        output_label = (
            OUTPUT_DIR
            / "labels"
            / split
            / f"{Path(filename).stem}.txt"
        )

        # ----------------------------------------------------
        # Download image
        # ----------------------------------------------------

        if not output_image.exists():

            command = [
                "aws",
                "s3",
                "cp",
                s3_url,
                str(output_image),
                "--no-sign-request"
            ]

            result = subprocess.run(
                command,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.PIPE,
                text=True
            )

            if result.returncode != 0:

                print(
                    f"DOWNLOAD FAILED: {filename}"
                )

                continue

        # ----------------------------------------------------
        # Read image dimensions
        # ----------------------------------------------------

        try:

            from PIL import Image

            with Image.open(output_image) as img:

                image_width, image_height = img.size

        except Exception as e:

            print(
                f"IMAGE ERROR: {filename}: {e}"
            )

            continue

        # ----------------------------------------------------
        # Create YOLO labels
        # ----------------------------------------------------

        labels = []

        for _, row in group.iterrows():

            bbox = polygon_to_bbox(
                row["geometry"]
            )

            if bbox is None:
                continue

            xmin, ymin, xmax, ymax = bbox

            # Clamp coordinates
            xmin = max(0, min(xmin, image_width))
            xmax = max(0, min(xmax, image_width))

            ymin = max(0, min(ymin, image_height))
            ymax = max(0, min(ymax, image_height))

            box_width = xmax - xmin
            box_height = ymax - ymin

            if box_width <= 0 or box_height <= 0:
                continue

            # YOLO normalized format
            x_center = (
                (xmin + xmax) / 2
            ) / image_width

            y_center = (
                (ymin + ymax) / 2
            ) / image_height

            width = box_width / image_width
            height = box_height / image_height

            labels.append(
                f"{CLASS_ID} "
                f"{x_center:.6f} "
                f"{y_center:.6f} "
                f"{width:.6f} "
                f"{height:.6f}"
            )

            total_boxes += 1

        if not labels:
            continue

        # ----------------------------------------------------
        # Write label
        # ----------------------------------------------------

        with open(
            output_label,
            "w"
        ) as f:

            f.write(
                "\n".join(labels)
            )

        total_images += 1

        if index % 100 == 0:

            print(
                f"Processed {index}/{len(images)}"
            )


# ============================================================
# DATA YAML
# ============================================================

yaml_content = f"""path: {OUTPUT_DIR.as_posix()}

train: images/train
val: images/val

names:
  0: aphids
  1: armyworm
  2: beetle
  3: bollworm
  4: grasshopper
  5: mites
  6: mosquito
  7: sawfly
  8: stem_borer
"""

with open(
    OUTPUT_DIR / "data.yaml",
    "w"
) as f:

    f.write(yaml_content)


# ============================================================
# SUMMARY
# ============================================================

print()
print("=" * 60)
print("WADHWANI YOLO DATASET COMPLETE")
print("=" * 60)

print(f"Images processed : {total_images}")
print(f"Bounding boxes   : {total_boxes}")

print()
print("Dataset:")
print(OUTPUT_DIR)

print()
print("YAML:")
print(OUTPUT_DIR / "data.yaml")