from django.shortcuts import render
import urllib3
import json
import os
import base64

API_KEY = '8972d09b-9538-44a2-bf3d-f51c50e2edf0'

# Create your views here.
def index(request):
    msg = 'My Message'
    return render(request, 'main.html', {'message': msg})

def get_video_split(request):
    openApiURL = "http://aiopen.etri.re.kr:8000/VideoParse"
    accessKey = "8972d09b-9538-44a2-bf3d-f51c50e2edf0"
    videoFilePath = "C:/Users/sang9/vscode/api/files/demo-1.mp4"

    file = open(videoFilePath,'rb')
    fileContent = file.read()
    file.close()

    requestJson = {	
        "argument": {}
    }

    http = urllib3.PoolManager()
    response = http.request(
        "POST",
        openApiURL,
        headers={"Content-Type": "application/json; charset=UTF-8", "Authorization" :  accessKey},
        fields={
            'json': json.dumps(requestJson),
            'uploadfile': (os.path.basename(file.name), fileContent)
        }
    )

    print("[responseCode] " + str(response.status))
    print("[responBody]")
    print(response.data)

    return 

def get_object(request):
    openApiURL = "http://aiopen.etri.re.kr:8000/ObjectDetect"
    accessKey = "8972d09b-9538-44a2-bf3d-f51c50e2edf0"
    imageFilePath = "files/object_detect_airplane.jpg"
    type = "jpg"

    file = open(imageFilePath, "rb")
    imageContents = base64.b64encode(file.read()).decode("utf8")
    file.close()

    requestJson = { 
        "argument": {
            "type": type,
            "file": imageContents
        }
    }

    http = urllib3.PoolManager()
    response = http.request(
        "POST",
        openApiURL,
        headers={"Content-Type": "application/json; charset=UTF-8" , "Authorization": accessKey},
        body=json.dumps(requestJson)
    )

    print("[responseCode] " + str(response.status))
    print("[responBody]")
    print(response.data)

    return