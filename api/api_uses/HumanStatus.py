#-*- coding:utf-8 -*-
import urllib3
import json
import base64
openApiURL = "http://aiopen.etri.re.kr:8000/HumanStatus"
accessKey = "8972d09b-9538-44a2-bf3d-f51c50e2edf0"
imageFilePath = "api_uses\sample\humanstatus01.jpg"
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
headers={"Content-Type": "application/json; charset=UTF-8","Authorization": accessKey},
body=json.dumps(requestJson)
)

print("[responseCode] " + str(response.status))
print("[responBody]")
print(response.data)

english_to_korean = {
    "Standing": "서있는",
    "Walking": "걷는",
    "Crouch": "웅크리는",
    "Running": "달리는",
    "Lying": "누워 있는",
    "Sitting": "앉아 있는"
}