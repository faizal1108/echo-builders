from ultralytics import YOLO

model = YOLO("best.pt")

results = model.predict(
    source=r"A:/project/ECHO/testset",
    imgsz=640,
    conf=0.25,
    save=True
)

for result in results:
    if result.boxes is None or len(result.boxes) == 0:
        print("No pest detected.")
        continue

    for box in result.boxes:
        class_id = int(box.cls[0])
        confidence = float(box.conf[0])
        name = result.names[class_id]

        x1, y1, x2, y2 = box.xyxy[0].tolist()

        print(f"Pest       : {name}")
        print(f"Confidence : {confidence:.2%}")
        print(f"Bounding   : ({x1:.0f}, {y1:.0f}) -> ({x2:.0f}, {y2:.0f})")
        print("-" * 40)