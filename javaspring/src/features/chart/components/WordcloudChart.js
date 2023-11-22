import React, { useState, useEffect, useRef } from "react";
import WordCloud from "wordcloud";
import { Input, Tag } from "antd";
import { TweenOneGroup } from "rc-tween-one";
import { PlusOutlined } from "@ant-design/icons";
import { FONT_FAMILY_STRING } from "Constants";

// 가로, 세로 중 더 작은 사이즈에 맞춰서 chart size 반환
const getChartSize = (height, width, dataLength, data) => {
  let bigWordCount = 0;
  let resultValue = 4;
  let lengthCalValue = 0.9;
  let sizeCalValue = 0.9;
  if (data) {
    data.flat(2).forEach((val) => {
      if (typeof val === "number" && val >= 7) bigWordCount += 1;
    });
  }
  const min = Math.min(height, width);
  if (dataLength === 0) return 0.1;

  if (min < 250) {
    data[0].forEach((arr) => {
      if (arr[1] > 7) {
        resultValue = resultValue * sizeCalValue;
        if (arr[0].length > 7) {
          resultValue = resultValue * lengthCalValue;
        }
      }
    });

    if (resultValue < 3) return 2;
    return resultValue;
  }

  // 길이 10, 20, 30, ...
  const dataLengthRound = Math.round(dataLength / 100) * 0.9;

  resultValue = 10;
  if (dataLength <= 20) {
    return 5;
  } else if (20 < dataLength && dataLength <= 40) {
    return 7;
  }

  data[0].forEach((arr) => {
    if (arr[1] > 5) {
      resultValue = resultValue * dataLengthRound;
      if (arr[0].length > 5) {
        resultValue = resultValue * dataLengthRound;
      }
    }
  });

  if (resultValue < 5) return 4;
  return resultValue;
};

const WordcloudChart = ({
  cloudId,
  customTopLeft = { top: 0, left: 0 },
  style,
  dataSource,
  options,
  wordClickHandler,
  useExcludes = true,
}) => {
  const wordCloudRef = useRef();

  const [localData, setLocalData] = useState(null);
  const [prevData, setPrevData] = useState(null);

  useEffect(() => {
    if (dataSource && dataSource.toString() !== prevData) {
      setPrevData(dataSource.toString());
      setLocalData(JSON.parse(JSON.stringify(dataSource)));
    } else {
      setPrevData(null);
      setLocalData(null);
    }
  }, [dataSource]);

  const openSearchWindow = (word) => {
    const windowParams = {
      popupId: "rome",
      url:
        window.location.protocol +
        "//" +
        window.location.hostname +
        ":" +
        window.location.port +
        "/search?word=" +
        word,
      width: window.screen.width,
      height: window.screen.height,
      otherOptions:
        ",directories=yes,titlebar=yes,toolbar=yes,location=yes,status=yes,menubar=yes,scrollbars=yes",
    };
    // romeOpenPopup(windowParams);
  };

  const drawBox = (item, dimension) => {
    if (drawBoxRef && drawBoxRef.current) {
      if (dimension) {
        drawBoxRef.current.style.display = "block";
        drawBoxRef.current.style.width = dimension.w + "px";
        drawBoxRef.current.style.height = dimension.h + "px";
        drawBoxRef.current.style.top =
          customTopLeft.top + dimension.y + 35 + "px";
        drawBoxRef.current.style.left =
          customTopLeft.left + dimension.x + 45 + "px";
      } else {
        drawBoxRef.current.style.display = "none";
      }
    }
  };

  const [wordCloudProps, setWordCloudProps] = useState({
    // size: getChartSize(style.height ? style.height : 200, style.width ? style.width : 200, data ? data.length : 0),
    // size: size ? size : 0.2,
    cloudId: cloudId,
    style: {
      ...style,
      width: style.width,
      height: style.height,
      cursor: "pointer",
    },
    // options: { color: "#f0f0c0", backgroundColor: "#001f00" },
    options: options
      ? {
          fontFamily: FONT_FAMILY_STRING,
          // shrinkToFit: false,
          // drawOutOfBound: true,
          // weightFactor: 3,
          gridSize: style.width > 300 ? 15 : 8,
          // gridSize: 15,
          ...options,
        }
      : {
          color: "#f0f0c0",
          backgroundColor: "rgba(255,0,0,0)",
          fontFamily: FONT_FAMILY_STRING,
          // shrinkToFit: false,
          // drawOutOfBound: true,

          weightFactor: 3,
          gridSize: style.width > 300 ? 15 : 8,
          // gridSize: style.width > 300 ? 5 : 1,
          // gridSize: 15,
        },
    hoverDimension: {},
    hover: drawBox,
    // click: customOnClickEvent ? (items) => customOnClickEvent(items[0]) : (items) => openSearchWindow(items[0]),
    // hover: (item, dimension, event) => {
    //   let el = document.getElementById("wcLabel");

    //   // // console.log('el : ', el)
    //   // // console.log('item, dimension, event : ', item, dimension, event)

    //   if (!item) {
    //     el.setAttribute("hidden", true);

    //     return;
    //   }

    //   el.removeAttribute("hidden");

    //   el.style.left = dimension.x + event.srcElement.offsetLeft + "px";
    //   el.style.top = dimension.y + event.srcElement.offsetTop + "px";
    //   el.style.width = dimension.w + "px";
    //   el.style.height = dimension.h + "px";

    //   // this.hoverDimension = dimension;
    //   setHoverProps((prevState) => ({
    //     ...prevState,
    //     text: item,
    //   }));

    //   if (item.length === 2) {
    //     document.getElementById("wcSpan").setAttribute("data-l10n-args", JSON.stringify({ word: item[0], count: item[1] }));
    //     document.getElementById("wcSpan").setAttribute("data-tooltip-text", JSON.stringify({ word: item[0], count: item[1] }));
    //     document.getElementById("wcSpan").innerHTML = item[0] + ":" + item[1];
    //   } else {
    //     document.getElementById("wcSpan").setAttribute("data-l10n-args", JSON.stringify({ word: item[0], count: item[1], events: item[2] }));
    //     document.getElementById("wcSpan").innerHTML = item[0] + ": " + item[1] + " words " + item[2] + " events";
    //   }
    // },
    // click: null,
  });

  const drawWordcloud = () => {
    const { cloudId, options, hover } = wordCloudProps;
    // const size = 1;
    const size = Math.floor(
      getChartSize(
        style.height ? style.height : 200,
        style.width ? style.width : 200,
        localData ? localData[0].length : 0,
        localData
      )
    );

    let params = Object.assign(
      {},
      { list: localData[0] },
      options,
      { weightFactor: size },
      { hover: hover },
      {
        click: wordClickHandler
          ? (items) => wordClickHandler(items[0], items[2])
          : (items) => openSearchWindow(items[0]),
      }
    );

    let el = wordCloudRef.current;
    let newCanvas = el.firstChild;
    newCanvas.id = cloudId;
    // TODO: setting up height and width according to container.
    newCanvas.height = wordCloudProps.style.height;
    newCanvas.width = wordCloudProps.style.width;

    WordCloud(el.firstChild, params);
  };

  useEffect(() => {
    if (wordCloudRef.current && localData && localData.length > 0) {
      drawWordcloud();
      // wordCloudRef.current.addEventListener("mousemove", (e) =>
      //   console.log("mouse move : ", e)
      // );
    }
    drawBoxRef.current.style.display = "none";
  }, [wordCloudRef, localData]);

  const [tagsExclude, setTagsExclude] = useState([]);
  const [inputExcludeVisible, setInputExcludeVisible] = useState(false);
  const [inputExclude, setInputExclude] = useState("");
  const handleInputExcludeChange = (e) => {
    setInputExclude(e.target.value);
  };
  const showInputExclude = () => {
    setInputExcludeVisible(true);
  };
  const handleInputExcludeConfirm = () => {
    if (inputExclude !== "") {
      if (inputExclude && tagsExclude.indexOf(inputExclude) === -1) {
        setTagsExclude([...tagsExclude, inputExclude]);
      }
    }
    setInputExcludeVisible(false);
    setInputExclude("");
  };
  const handleExcludeClose = (removedTag) => {
    setTagsExclude(tagsExclude.filter((tag) => tag !== removedTag));
  };
  useEffect(() => {
    if (inputExcludeVisible) {
      saveInputExcludeRef.current.focus();
    }
  }, [inputExcludeVisible]);
  useEffect(() => {
    if (
      tagsExclude &&
      tagsExclude.length > 0 &&
      localData &&
      localData.length > 0
    ) {
      let newData = dataSource[0].filter((word) => {
        let is = true;
        tagsExclude.map((tag) => {
          if (word[0].indexOf(tag) > -1) is = false;
        });
        return is;
      });
      setLocalData([newData]);
    }
  }, [tagsExclude]);

  const forMap = (tag, sort) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();

          handleExcludeClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };

  const drawBoxRef = useRef();
  const wordcloudCanvasRef = useRef();
  const saveInputExcludeRef = useRef();

  return (
    <div style={{ overflow: "hidden" }}>
      {localData && localData.length > 0 && (
        <div
          ref={wordCloudRef}
          style={{ width: style.width, height: style.height }}
        >
          <canvas ref={wordcloudCanvasRef}></canvas>
          <div id="wcLabel">{/* <span id="wcSpan"></span> */}</div>
          {/* {hoverProps.text && <span>{hoverProps.text}</span>} */}
        </div>
      )}
      <div
        ref={drawBoxRef}
        style={{
          overflow: "hidden",
          display: "none",
          pointerEvents: "none",
          position: "absolute",
          boxShadow: `0 0 ${customTopLeft.top === 0 ? 10 : 5}px ${
            customTopLeft.top === 0 ? 10 : 5
          }px rgba(0, 145, 234, 0.5)`,
          borderRadius: "50px",
          cursor: "pointer",
        }}
      ></div>
      {useExcludes && (
        <div
          style={{
            marginTop: `${
              cloudId.indexOf("main_popup_wordCloud") > -1 ? "" : "20px"
            }`,
          }}
        >
          {!inputExcludeVisible && (
            <Tag onClick={showInputExclude} className="site-tag-plus">
              <PlusOutlined /> 제외어
            </Tag>
          )}
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: "from",
              duration: 100,
              onComplete: (e) => {
                e.target.style = "";
              },
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}
          >
            {tagsExclude.map((tag) => forMap(tag, "EXCLUDE"))}
          </TweenOneGroup>

          {inputExcludeVisible && (
            <Input
              className="in"
              ref={saveInputExcludeRef}
              type="text"
              size="small"
              value={inputExclude}
              onChange={handleInputExcludeChange}
              onBlur={handleInputExcludeConfirm}
              onPressEnter={handleInputExcludeConfirm}
              style={{ width: "50px" }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(WordcloudChart);
