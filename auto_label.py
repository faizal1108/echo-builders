from ultralytics import YOLO
from pathlib import Path
import shutil
import random

# ============================================================
# CONFIG
# ============================================================

MODEL_PATH = Path(r"A:\project\ECHO\pest-detection-model\best.pt")

SOURCE_DIR = Path(r"A:\project\ECHO\dataset\pest\train")

OUTPUT_DIR = Path(r"A:\project\ECHO\dataset\echo_yolo")

CONFIDENCE = 0.50
VAL_RATIO = 0.20

# Your new 9 classes
CLASS_MAP = {
    "aphids": 0,
    "armyworm": 1,
    "beetle": 2,
    "bollworm": 3,
    "grasshopper": 4,
    "mites": 5,
    "mosquito": 6,
    "sawfly": 7,
    "stem_borer": 8,
}

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
}

random.seed(42)


# ============================================================
# CREATE DIRECTORIES
# ============================================================

for folder in [
    OUTPUT_DIR / "images" / "train",
    OUTPUT_DIR / "images" / "val",
    OUTPUT_DIR / "labels" / "train",
    OUTPUT_DIR / "labels" / "val",
]:
    folder.mkdir(parents=True, exist_ok=True)


# ============================================================
# LOAD MODEL
# ============================================================

print("Loading model...")

model = YOLO(str(MODEL_PATH))

print("Model loaded.")
print("Model classes:", len(model.names))


# ============================================================
# REVIEW FILE
# ============================================================

review_file = OUTPUT_DIR / "review.txt"

review = []

total = 0
accepted = 0
no_detection = 0


# ============================================================
# PROCESS EACH CLASS
# ============================================================

for folder_name, target_class_id in CLASS_MAP.items():

    source_class_dir = SOURCE_DIR / folder_name

    if not source_class_dir.exists():
        print(f"\nWARNING: Folder not found: {source_class_dir}")
        continue

    print("\n==============================================")
    print(f"Processing: {folder_name}")
    print("==============================================")

    images = [
        p for p in source_class_dir.iterdir()
        if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS
    ]

    random.shuffle(images)

    # Split images
    val_count = int(len(images) * VAL_RATIO)

    val_images = images[:val_count]
    train_images = images[val_count:]

    split_data = [
        ("train", train_images),
        ("val", val_images),
    ]

    for split_name, split_images in split_data:

        for image_path in split_images:

            total += 1

            print(f"[{total}] {folder_name}/{image_path.name}")

            try:

                results = model.predict(
                    source=str(image_path),
                    conf=CONFIDENCE,
                    verbose=False
                )

                result = results[0]

                if result.boxes is None or len(result.boxes) == 0:

                    print("    NO DETECTION")

                    no_detection += 1

                    review.append(
                        f"NO_DETECTION | {folder_name} | {image_path}"
                    )

                    continue

                # ------------------------------------------------
                # Choose highest confidence detection
                # ------------------------------------------------

                best_box = None
                best_conf = 0

                for box in result.boxes:

                    conf = float(box.conf[0])

                    if conf > best_conf:
                        best_conf = conf
                        best_box = box

                if best_box is None:
                    continue

                # ------------------------------------------------
                # Get YOLO normalized coordinates
                # ------------------------------------------------

                xywhn = best_box.xywhn[0].tolist()

                x_center = xywhn[0]
                y_center = xywhn[1]
                width = xywhn[2]
                height = xywhn[3]

                # ------------------------------------------------
                # Output paths
                # ------------------------------------------------

                output_image = (
                    OUTPUT_DIR
                    / "images"
                    / split_name
                    / image_path.name
                )

                output_label = (
                    OUTPUT_DIR
                    / "labels"
                    / split_name
                    / f"{image_path.stem}.txt"
                )

                # Avoid overwriting if duplicate filename exists
                if output_image.exists():

                    unique_name = (
                        f"{folder_name}_{image_path.name}"
                    )

                    output_image = (
                        OUTPUT_DIR
                        / "images"
                        / split_name
                        / unique_name
                    )

                    output_label = (
                        OUTPUT_DIR
                        / "labels"
                        / split_name
                        / f"{folder_name}_{image_path.stem}.txt"
                    )

                # ------------------------------------------------
                # Copy image
                # ------------------------------------------------

                shutil.copy2(
                    image_path,
                    output_image
                )

                # ------------------------------------------------
                # Write YOLO label
                # ------------------------------------------------

                with open(output_label, "w") as f:

                    f.write(
                        f"{target_class_id} "
                        f"{x_center:.6f} "
                        f"{y_center:.6f} "
                        f"{width:.6f} "
                        f"{height:.6f}\n"
                    )

                accepted += 1

                print(
                    f"    ACCEPTED "
                    f"confidence={best_conf:.2f} "
                    f"class={folder_name}"
                )

            except Exception as e:

                print(f"    ERROR: {e}")

                review.append(
                    f"ERROR | {folder_name} | {image_path} | {e}"
                )


# ============================================================
# CREATE data.yaml
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

with open(OUTPUT_DIR / "data.yaml", "w") as f:
    f.write(yaml_content)


# ============================================================
# WRITE REVIEW FILE
# ============================================================

with open(review_file, "w") as f:

    f.write("ECHO AUTO-LABEL REVIEW\n")
    f.write("======================\n\n")

    for item in review:
        f.write(item + "\n")


# ============================================================
# SUMMARY
# ============================================================

print("\n")
print("===================================================")
print("AUTO-LABELING COMPLETE")
print("===================================================")

print(f"Total images processed : {total}")
print(f"Accepted               : {accepted}")
print(f"No detection           : {no_detection}")
print(f"Needs review           : {len(review)}")

print("\nDataset created at:")

print(OUTPUT_DIR)

print("\nData YAML:")

print(OUTPUT_DIR / "data.yaml")

print("\nReview file:")

print(review_file)

print("\nNext step:")
print("Check the generated labels before training.")