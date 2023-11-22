#-*- coding:utf-8 -*-
import urllib3
import json
import re

# 언어 분석 기술 문어/구어 중 한가지만 선택해 사용
# 언어 분석 기술(문어)
openApiURL = "http://aiopen.etri.re.kr:8000/WiseNLU" 
# 언어 분석 기술(구어)
openApiURL = "http://aiopen.etri.re.kr:8000/WiseNLU_spoken"
    
accessKey = "8972d09b-9538-44a2-bf3d-f51c50e2edf0"
analysisCode = "morp"
text = ""
    
# 언어 분석 기술(문어)
text += "벤치에 앉아 새를 보고 있는 사람을 보여줘"
    
requestJson = {  
    "argument": {
        "text": text,
        "analysis_code": analysisCode
    }
}
    
http = urllib3.PoolManager()
response = http.request(
    "POST",
    openApiURL,
    headers={"Content-Type": "application/json; charset=UTF-8", "Authorization" :  accessKey},
    body=json.dumps(requestJson)
)
    
print("[responseCode] " + str(response.status))

morp_pattern = re.compile('\"morp\":\[(.*?)\]')
res = re.findall(morp_pattern, str(response.data,"utf-8"))[0]

nng_pattern = re.compile("{\"id\":\d+,\"lemma\":\"[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*\",\"type\":\"NNG\",\"position\":\d+,\"weight\":\d.\d+}")
nng_res = re.findall(nng_pattern, res)

nng_list = []
for nng in nng_res:
    nng_dict = json.loads(nng)
    nng_list.append(nng_dict)

lemmas = [nng['lemma'] for nng in nng_list]

print(lemmas)