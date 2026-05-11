#-*- coding:utf-8 -*-
import urllib3
import json
import base64
import os
accessKey = "8972d09b-9538-44a2-bf3d-f51c50e2edf0"
## 장면분할 
openApiURL = "http://aiopen.etri.re.kr:8000/VideoParse"
videoFilePath = "api_uses\sample\demo-1.mp4"
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
    headers={"Authorization": accessKey},
	fields={
		'json': json.dumps(requestJson),
		'uploadfile': (os.path.basename(file.name), fileContent)
	}
)

print("[responseCode] " + str(response.status))
print("[responBody]")
print(response.data)
