import urllib3
import json
import re

status_to_korean = {
    "Standing": "서",
    "Walking": "걷",
    "Crouch": "웅크리",
    "Running": "달리",
    "Lying": "눕",
    "Sitting": "앉"
}

class WiseNLU:
    def __init__(self, accessKey):
        self.WiseNLUApiURL = "http://aiopen.etri.re.kr:8000/WiseNLU_spoken"
        self.http = urllib3.PoolManager()
        self.accessKey = accessKey
        self.analysisCode = "morp"

    def inferAPI(self, text):
        wordRequestJson = {  
            "argument": {
                "text": text,
                "analysis_code": self.analysisCode
            }
        }
            
        wiseNLUResponse = self.http.request(
            "POST",
            self.WiseNLUApiURL,
            headers={"Content-Type": "application/json; charset=UTF-8", "Authorization" :  self.accessKey},
            body=json.dumps(wordRequestJson)
        )

        morp_pattern = re.compile('\"morp\":\[(.*?)\]')
        res = re.findall(morp_pattern, str(wiseNLUResponse.data,"utf-8"))[0]

        nng_pattern = re.compile("{\"id\":\d+,\"lemma\":\"[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*\",\"type\":\"NNG\",\"position\":\d+,\"weight\":\d.\d+}")
        nng_res = re.findall(nng_pattern, res)

        nng_list = []
        for nng in nng_res:
            nng_dict = json.loads(nng)
            nng_list.append(nng_dict)

        nng_lemmas = [nng['lemma'] for nng in nng_list]

        morp_pattern = re.compile('\"morp\":\[(.*?)\]')
        res = re.findall(morp_pattern, str(wiseNLUResponse.data,"utf-8"))[0]

        vv_pattern = re.compile("{\"id\":\d+,\"lemma\":\"[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*\",\"type\":\"VV\",\"position\":\d+,\"weight\":\d.\d+}")
        vv_res = re.findall(vv_pattern, res)

        vv_list = []
        for vv in vv_res:
            vv_dict = json.loads(vv)
            vv_list.append(vv_dict)

        vv_lemmas = [vv['lemma'] for vv in vv_list]

        vv_status = self.extractStatus(vv_lemmas)

        return nng_lemmas, vv_status
    
    def extractStatus(self, vv_lemmas):
        tmp = []
        for status in status_to_korean.values():
            if status in vv_lemmas:
                tmp.append(status)

        return tmp