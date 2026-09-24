from ultralytics import YOLO

model = YOLO(r"A:\project\ECHO\pest-detection-model\best.pt")

print("================================")
print("Model task:", model.task)
print("Number of classes:", len(model.names))
print("Classes:")
print(model.names)
print("================================")