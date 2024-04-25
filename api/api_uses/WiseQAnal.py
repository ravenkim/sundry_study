import urllib3
import json
 
openApiURL = "http://aiopen.etri.re.kr:8000/WiseQAnal"
accessKey = "8972d09b-9538-44a2-bf3d-f51c50e2edf0"
text = "고양이와 사람이 같이 나오는 장면을 찾아줘"
 
requestJson = { 
    "argument": {
        "text": text
    }
}
 
http = urllib3.PoolManager()
response = http.request(
    "POST",
    openApiURL,
    headers={"Content-Type": "application/json; charset=UTF-8", "Authorization": accessKey},
    body=json.dumps(requestJson)
)
 
print("[responseCode] " + str(response.status))
print("[responBody]")
print(str(response.data,"utf-8"))