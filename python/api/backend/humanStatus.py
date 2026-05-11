import urllib3
import json
import base64

status_to_korean = {
    "Standing": "서",
    "Walking": "걷",
    "Crouch": "웅크리",
    "Running": "달리",
    "Lying": "눕",
    "Sitting": "앉"
}

class HumanStatus:
    def __init__(self, accessKey):
        self.humanStatusApiURL = "http://aiopen.etri.re.kr:8000/HumanStatus"
        self.http = urllib3.PoolManager()
        self.accessKey = accessKey
        self.type = "jpg"

    def inferAPI(self, image_path):
        file = open(image_path, "rb")
        imageContents = base64.b64encode(file.read()).decode("utf8")
        file.close()

        imageRequestJson = { 
            "argument": {
                "type": self.type,
                "file": imageContents
            }
        }

        humanStatusResponse = self.http.request(
            "POST",
            self.humanStatusApiURL,
            headers={"Content-Type": "application/json; charset=UTF-8","Authorization": self.accessKey},
            body=json.dumps(imageRequestJson)
        )

        humanStatusJson = json.loads(str(humanStatusResponse.data, 'utf-8'))

        statusTags = []
        for return_object in humanStatusJson['return_object']:
            for data in return_object['data'][1:]:
                if float(data['confidence']) > 0.6:
                    statusTags.append(status_to_korean[data['class']])

        return statusTags