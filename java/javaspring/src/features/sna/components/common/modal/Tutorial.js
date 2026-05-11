import React, { useEffect, useRef, useState } from "react";
import { Button, Carousel, Modal } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const Tutorial = () => {
  const [helpStatus, setHelpStatus] = useState(false);
  const [tutorialIndex, setTutorailIndex] = useState(0);
  const [slideNumber, setSlideNumber] = useState(0);
  const idxClick = (idx) => {
    setTutorailIndex(idx);
    setSlideNumber(0);
  };

  const textList = [
    [
      "화면 표시 설정 값 조정",
      "검색어 입력",
      "포함어, 제외어 필터",
      "분류 별 검색 결과",
      "소시오그램 그래프 마우스 휠(줌인, 줌아웃) 드래그(이동)",
      "검색 결과 목록",
    ],
    [
      "제목 표기 방법",
      "제목길이",
      "노드크기",
      "연결선 두께",
      "검색 구분",
      "키워드",
    ],
    [
      "포함어, 제외어 필터",
      "분류 필터",
      "노드 상세 조회",
      "목록 상세 조회",
      "즐겨찾기",
    ],
  ];
  const helpText1 = (
    <>
      {textList[0].map((txt, index) => {
        return (
          <li
            onClick={() => setSlideNumber(index)}
            className={slideNumber === index ? "active" : ""}
            key={"helpText1" + index}
          >
            {" "}
            <span>{index + 1}</span> {txt}
          </li>
        );
      })}
    </>
  );
  const helpText2 = (
    <>
      {textList[1].map((txt, index) => {
        return (
          <li
            onClick={() => setSlideNumber(index)}
            className={slideNumber === index ? "active" : ""}
            key={"helpText2" + index}
          >
            {" "}
            <span>{index + 1}</span> {txt}
          </li>
        );
      })}
    </>
  );
  const helpText3 = (
    <>
      {textList[2].map((txt, index) => {
        return (
          <li
            onClick={() => setSlideNumber(index)}
            className={slideNumber === index ? "active" : ""}
            key={"helpText3" + index}
          >
            {" "}
            <span>{index + 1}</span> {txt}
          </li>
        );
      })}
    </>
  );
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.goTo(slideNumber);
    }
  }, [slideNumber]);

  const tutorialList = [
    {
      buttonName: "화면구성",
      images: [
        "1-1.png",
        "1-2.png",
        "1-3.png",
        "1-4.png",
        "1-5.png",
        "1-6.png",
      ],
      helpText: helpText1,
    },
    {
      buttonName: "설정 값 조정",
      images: [
        "2-1.png",
        "2-2.png",
        "2-3.png",
        "2-4.png",
        "2-5.png",
        "2-6.png",
      ],
      helpText: helpText2,
    },
    {
      buttonName: "검색/필터",
      images: ["3-1.png", "3-2.png", "3-3.png", "3-4.png", "3-5.png"],
      helpText: helpText3,
    },
  ];

  const onClickHelp = () => {
    if (helpStatus) {
      setHelpStatus(false);
    } else {
      setHelpStatus(true);
    }
  };
  let w = 1100;
  let h = 900;

  const onChangeCarousel = (a, b, c) => {
    // console.log(a, b, c);
  };

  const carouselRef = useRef();

  return (
    <div>
      <Button
        type={"link"}
        icon={<QuestionCircleOutlined style={{ fontSize: "24px" }} />}
        onClick={onClickHelp}
      ></Button>
      <Modal
        title="튜토리얼"
        width=/*  */ {w}
        height={h}
        centered
        visible={helpStatus}
        onOk={() => onClickHelp()}
        onCancel={() => onClickHelp()}
        closable={true}
        footer={null}
      >
        <ul className="tutorial_tab">
          {tutorialList.map((tut, index) => (
            <li key={"tutorial_a_" + index}>
              <Button
                className={index === tutorialIndex ? "active" : ""}
                onClick={() => idxClick(index)}
              >
                {tut.buttonName}
              </Button>
            </li>
          ))}
        </ul>
        <div className="tutorial_box">
          <div className="tutorial_img">
            <Carousel
              ref={carouselRef}
              afterChange={onChangeCarousel}
              style={{ width: "100%", height: "100%" }}
            >
              {tutorialList[tutorialIndex].images.map((img, index) => (
                <div key={"tutorial_img" + index}>
                  <img src={`/images/network_tutorial/${img}`} />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="tutorial_text">
            <ol className="tutorial_list">
              {tutorialList[tutorialIndex].helpText}
            </ol>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Tutorial;
