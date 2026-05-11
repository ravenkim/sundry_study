import urllib3
import json
import base64

object_to_korean = {
    "person": "사람",
    "bicycle": "자전거",
    "car": "자동차",
    "motorcycle": "오토바이",
    "airplane": "비행기",
    "bus": "버스",
    "train": "기차",
    "truck": "트럭",
    "boat": "보트",
    "traffic light": "신호등",
    "fire hydrant": "소화전",
    "stop sign": "정지 신호",
    "parking meter": "주차 미터",
    "bench": "벤치",
    "bird": "새",
    "cat": "고양이",
    "dog": "개",
    "horse": "말",
    "sheep": "양",
    "cow": "소",
    "elephant": "코끼리",
    "bear": "곰",
    "zebra": "얼룩말",
    "giraffe": "기린",
    "backpack": "배낭",
    "umbrella": "우산",
    "handbag": "핸드백",
    "tie": "넥타이",
    "suitcase": "여행 가방",
    "frisbee": "프리스비",
    "skis": "스키",
    "snowboard": "스노보드",
    "sports ball": "스포츠 공",
    "kite": "연",
    "baseball bat": "야구 배트",
    "baseball glove": "야구 글러브",
    "skateboard": "스케이트보드",
    "surfboard": "서핑보드",
    "tennis racket": "테니스 라켓",
    "bottle": "병",
    "wine glass": "와인 잔",
    "cup": "컵",
    "fork": "포크",
    "knife": "칼",
    "spoon": "숟가락",
    "bowl": "그릇",
    "banana": "바나나",
    "apple": "사과",
    "sandwich": "샌드위치",
    "orange": "오렌지",
    "broccoli": "브로콜리",
    "carrot": "당근",
    "hot dog": "핫도그",
    "pizza": "피자",
    "donut": "도넛",
    "cake": "케이크",
    "chair": "의자",
    "couch": "소파",
    "potted plant": "화분",
    "bed": "침대",
    "dining table": "식탁",
    "toilet": "화장실",
    "tv": "텔레비전",
    "laptop": "노트북",
    "mouse": "마우스",
    "remote": "리모컨",
    "keyboard": "키보드",
    "cell phone": "휴대전화",
    "microwave": "전자레인지",
    "oven": "오븐",
    "toaster": "토스터",
    "sink": "싱크",
    "refrigerator": "냉장고",
    "book": "책",
    "clock": "시계",
    "vase": "꽃병",
    "scissors": "가위",
    "teddy bear": "테디 베어",
    "hair dryer": "헤어 드라이어",
    "toothbrush": "칫솔"
}

class ObjectDetect:
    def __init__(self, accessKey):
        self.objectDetectionApiURL = "http://aiopen.etri.re.kr:8000/ObjectDetect"
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

        obejctDetectionResponse = self.http.request(
            "POST",
            self.objectDetectionApiURL,
            headers={"Content-Type": "application/json; charset=UTF-8" , "Authorization": self.accessKey},
            body=json.dumps(imageRequestJson)
        )

        obejctDetectionJson = json.loads(str(obejctDetectionResponse.data, 'utf-8'))

        object_infos = obejctDetectionJson['return_object']['data']

        objectTags = []
        for object in object_infos:
            objectTags.append(object_to_korean[object['class']])

        return objectTags