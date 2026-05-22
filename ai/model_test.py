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
# 3. Gemini Analysis Function
# ==========================================
def check_status_with_gemini(original_img_path, crop_img_path):
    original_img = Image.load_from_file(original_img_path)
    crop_img = Image.load_from_file(crop_img_path)
    
    original_part = Part.from_image(original_img)
    crop_part = Part.from_image(crop_img)
    
    prompt = """
    You are a building energy management AI.
    The first image is the original full photo of a classroom. 
    The second image is a cropped close-up of a ceiling 4-way air conditioner.
    Analyze the following two power states:

    1. "ac_status": Look at the second image (AC). If the louvers (blades) are open or the operation LED is on, return "ON". If they are closed and inactive, return "OFF".
    2. "light_status": Look at the background of the first image (original). If the ceiling indoor lights (fluorescent/LED) are turned on and emitting light, return "ON". If they are turned off, return "OFF".

    Respond STRICTLY in the following JSON format only without any markdown formatting:
    {
        "ac_status": "ON or OFF",
        "light_status": "ON or OFF",
        "reason": "Your detailed reasoning"
    }
    """
    response = gemini_model.generate_content([original_part, crop_part, prompt])
    return response.text

# ==========================================
# 4. Inference & Visualization Pipeline
# ==========================================
def analyze_classroom_image(image_path, ac_model_path):
    print(f"\n--- [Analysis Started] {image_path} ---")
    
    # Pre-trained base YOLOv8 model for person detection
    person_model = YOLO("yolov8n.pt") 
    ac_model = YOLO(ac_model_path)
    
    # ---------------------------------------------------------
    # Step 1: Detect Person (Using COCO base model, class 0 is 'person')
    # ---------------------------------------------------------
    # classes=[0]을 추가하여 '사람'만 감지하도록 강제합니다. (책상, 의자 등 무시)
    person_results = person_model(image_path, conf=0.4, classes=[0])[0]
    
    annotated_person_img = person_results.plot()
    plt.figure(figsize=(10, 8))
    plt.imshow(cv2.cvtColor(annotated_person_img, cv2.COLOR_BGR2RGB))
    plt.title(f"Person Detection (Found: {len(person_results.boxes)} persons)")
    plt.axis('off')
    plt.show()

    person_count = len(person_results.boxes)
    if person_count > 0:
        return {"result": "PASS", "message": f"{person_count} Persons are present in the classroom. Status normal."}
    
    print("Classroom is empty. Checking for energy waste (AC and Lights)...")
    
    # ---------------------------------------------------------
    # Step 2: Detect AC (with Debug Visualization)
    # ---------------------------------------------------------
    ac_results = ac_model(image_path, conf=0.4)[0]
    
    annotated_ac_img = ac_results.plot()
    plt.figure(figsize=(10, 8))
    plt.imshow(cv2.cvtColor(annotated_ac_img, cv2.COLOR_BGR2RGB))
    plt.title(f"AC Detection (Found: {len(ac_results.boxes)})")
    plt.axis('off')
    plt.show()
    
    if len(ac_results.boxes) == 0:
        return {"result": "ERROR", "message": "Air conditioner not found in the image (Confidence < 0.4)."}
    
    # ---------------------------------------------------------
    # Step 3: Crop AC and Request Gemini Analysis
    # ---------------------------------------------------------
    img = cv2.imread(image_path)
    for i, box in enumerate(ac_results.boxes.xyxy):
        x1, y1, x2, y2 = map(int, box[:4])
        ac_crop = img[y1:y2, x1:x2] 
        
        plt.figure(figsize=(3, 3))
        plt.imshow(cv2.cvtColor(ac_crop, cv2.COLOR_BGR2RGB))
        plt.title(f"Cropped AC #{i+1}")
        plt.axis('off')
        plt.show()
        
        temp_crop_path = f"temp_ac_crop_{i}.jpg"
        cv2.imwrite(temp_crop_path, ac_crop)
        
        print(f"Sending Cropped AC #{i+1} to Gemini 2.5 Flash...")
        ai_response = check_status_with_gemini(image_path, temp_crop_path)
        os.remove(temp_crop_path)
        
        try:
            clean_json_str = ai_response.strip().strip("```json").strip("```").strip()
            status_data = json.loads(clean_json_str)
            
            ac_on = (status_data.get("ac_status") == "ON")
            light_on = (status_data.get("light_status") == "ON")
            
            if ac_on or light_on:
                return {
                    "result": "WASTE_DETECTED",
                    "message": "Energy waste detected in an empty classroom!",
                    "ac_status": status_data.get("ac_status"),
                    "light_status": status_data.get("light_status"),
                    "reason": status_data.get("reason")
                }
            else:
                return {"result": "PASS", "message": "Classroom is empty and all power sources are OFF."}
                
        except json.JSONDecodeError:
            return {"result": "ERROR", "message": f"Failed to parse Gemini response: {ai_response}"}

# ==========================================
# Execution Block
# ==========================================
if __name__ == "__main__":
    test_image = "test_classroom.png" 
    
    if not os.path.exists(test_image):
        print(f"Error: {test_image} 파일을 찾을 수 없습니다. 경로를 확인해주세요.")
    else:
        result = analyze_classroom_image(
            image_path=test_image, 
            # 학생 모델 경로는 사라졌으므로, 에어컨 모델 경로만 전달합니다.
            ac_model_path="train_result/detect/campus/ac_model/weights/best.pt"
        )
        print("\n--- Final Analysis Result ---")
        print(json.dumps(result, indent=4, ensure_ascii=False))
