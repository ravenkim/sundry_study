import os
import cv2
import json
import matplotlib.pyplot as plt
import vertexai
from vertexai.generative_models import GenerativeModel, Part, Image
from ultralytics import YOLO
from roboflow import Roboflow

# ==========================================
# 1. Configuration & Initialization
# ==========================================
ROBOFLOW_API_KEY = "PIlWf3SW88eM18FTSeCr"
GCP_PROJECT_ID = "duyuthon"  # 본인의 GCP 프로젝트 ID
gemini_model = GenerativeModel("gemini-2.5-flash")

# ==========================================
# 2. Training Pipeline (Only AC model needed now)
# ==========================================
def train_models():
    """
    기본 YOLO 모델이 사람(학생)을 감지하므로, 에어컨 모델만 학습하면 됩니다!
    """
    rf = Roboflow(api_key=ROBOFLOW_API_KEY)
    
    print("--- Starting Air Conditioner Model Training ---")
    ac_project = rf.workspace("4-52p2c").project("office-air-condition").version(1)
    ac_dataset = ac_project.download("yolov8")
    
    model_ac = YOLO("yolov8n.pt")
    # CPU 환경에서 100 epoch 학습
    model_ac.train(data=f"{ac_dataset.location}/data.yaml", epochs=75, imgsz=640, project="campus", name="ac_model", device="cpu")
    
    print("Training Complete! Remember to STOP the VM instance to avoid charges.")

# ==========================================
# Execution Block
# ==========================================
if __name__ == "__main__":
    train_models()
    print("train finished.")
    