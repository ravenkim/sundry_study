from objectDetect import ObjectDetect
from humanStatus import HumanStatus
from wiseNLU import WiseNLU
from similarity import TextSimilarity

accessKey = "8972d09b-9538-44a2-bf3d-f51c50e2edf0"
imageFilePath = "api_uses\sample\walkingWithDog2.png"
text = "개와 함께 걷고 있는 사람을 찾아줘"
THRES = 0.5

def main():
    objectDetect = ObjectDetect(accessKey)
    humanStatus = HumanStatus(accessKey)
    wiseNLU = WiseNLU(accessKey)

    objectTags = objectDetect.inferAPI(imageFilePath)
    statusTags = humanStatus.inferAPI(imageFilePath)
    nng_list, vv_list = wiseNLU.inferAPI(text)

    ratio = TextSimilarity.get_sim_ratio(objectTags, statusTags, nng_list, vv_list)

    if ratio > THRES:
        print(imageFilePath)

if __name__ == "__main__":
    main()