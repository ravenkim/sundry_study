import React, { useEffect, useMemo, useState } from "react";
import ReactWordcloud from "react-wordcloud";
import { select } from "d3-selection";
import { Popover, Slider } from "antd";

const Wordcloud = ({
  dataSource,
  onWordClick,
  onSelectClick,
  onRemoveClick,
  onSelectAllClick,
  useWordMenu = false,
  useSlider = true,
  maxWords = 100,
  size = [600, 400],
  useSelectAll = false,
}) => {
  const [word, setWord] = useState([]);
  const [originWord, setOriginWord] = useState([]);

  const [minValue, setMinValue] = useState();
  const [maxValue, setMaxValue] = useState();

  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      let minValue = 2;
      let maxValue = null;
      let wordList = dataSource.map((item, index) => {
        let returnObj = {
          text: item.term,
          value: item.normDocFreqSum
            ? item.normDocFreqSum
            : item.norm_doc_freq_sum,
          doc_ids: item.docIds ? item.docIds : item.doc_ids,
        };
        if (minValue) {
          if (minValue > returnObj.value) {
            minValue = returnObj.value;
          }
        } else {
          minValue = returnObj.value;
        }

        if (maxValue) {
          if (maxValue < returnObj.value) {
            maxValue = returnObj.value;
          }
        } else {
          maxValue = returnObj.value;
        }

        return returnObj;
      });

      setMinValue(minValue);
      setMaxValue(maxValue);

      setRangeValue([minValue, maxValue]);

      setWord(wordList);
      setOriginWord(wordList);
    }
  }, [dataSource]);

  /********************************************************************
   * Slider Action
   *******************************************************************/
  const [rangeValue, setRangeValue] = useState([1, 12]);
  const [wordLoading, setWordLoading] = useState(false);

  const rangeChangeHandler = (range) => {
    setWordLoading(true);
    setRangeValue(range);
  };

  /********************************************************************
   * word button Action
   *******************************************************************/
  // const [wrapperStyle, setWrapperStyle] = useState();
  const [selectLocation, setSelectLocation] = useState();
  const [removeLocation, setRemoveLocation] = useState();

  const [selectWordData, setSelectWordData] = useState();

  const [menuVisible, setMenuVisible] = useState(false);

  const wordMenuHandler = (data) => {
    // setButtonVisible(true);

    setSelectWordData(data);

    setMenuVisible(true);

    setSelectLocation({
      transform: `translate(${data.x + 265 + data.x0}px,${data.y - 235}px)`,
      color: "#2F80ED",
      backgroundColor: "#EFF2FF",
    });
    setRemoveLocation({
      transform: `translate(${data.x + 290 + data.x1}px,${data.y - 235}px)`,
      color: "#EB5757",
      backgroundColor: "#FDEEEE",
    });
  };
  /**
   * 워드 메뉴 중 '선택' 클릭 Handler
   */
  const selectMenuClickHandler = (selectWord) => {
    if (onSelectClick && typeof onSelectClick === "function") {
      onSelectClick(selectWord);
    }
  };

  /**
   * 워드 메뉴 중 '제거' 클릭 Handler
   */
  const removeMenuClickHandler = (removeWord) => {
    if (onRemoveClick && typeof onRemoveClick === "function") {
      onRemoveClick(removeWord);
    }
  };

  /**
   * 워드 메뉴 중 '클라우드 적용' 클릭 Handler
   */
  const selectAllClickHandler = (data) => {
    if (onSelectAllClick && typeof onSelectAllClick === "function") {
      onSelectAllClick(data);
    }
  };
  /********************************************************************
   * 워드클라우드 Option
   *******************************************************************/

  // const size = useMemo(() => {
  //   return [600, 400];
  // }, []);

  const callbacks = {
    // getWordColor: (word) =>
    //   "#" + Math.round(Math.random() * 0xffffff).toString(word.value),

    // onWordMouseOver: console.log,
    onWordClick: (data, pointer) => {
      if (useWordMenu) {
        wordMenuHandler(data);
      } else {
        //워드클라우드 메뉴버튼 표출없이 주입받은 clickhandler 실행
        if (onWordClick && typeof onWordClick === "function") {
          onWordClick(data, pointer);
        }
      }
    },
    getWordColor: (word) => {
      if (word.value >= 3 && word.value < 6) {
        return "#535C99";
      } else if (word.value >= 6 && word.value < 9) {
        return "#373D66";
      } else if (word.value >= 9 && word.value < 12) {
        return "#121A4D";
      } else if (word.value >= 12) {
        return "#121A4D";
      } else {
        return "#8F92AA";
      }
    },
  };

  const options = useMemo(() => {
    return {
      colors: "#121A4D",
      fontFamily: "impact",
      fontSizes: [20, 60],
      fontStyle: "normal",
      fontWeight: "bold",
      rotations: 3,
      rotationAngles: [0],
      transitionDuration: 1000,
      deterministic: true,
      enableTooltip: true,
      scale: "sqrt",
      spiral: "archimedean",
      padding: 1,
      // width: 660,
      // height: 400,
    };
  }, []);
  // const words = [...];
  const callBackMemo = useMemo(() => {
    return callbacks;
  }, []);
  const cloudSize = useMemo(() => {
    return size;
  }, []);

  const dataFilter = useMemo(() => {
    if (
      word &&
      word.length > 0 &&
      originWord &&
      originWord.length > 0 &&
      useSlider
    ) {
      setMenuVisible(false);
      setWord(
        originWord.filter(
          (item) => item.value >= rangeValue[0] && item.value <= rangeValue[1]
        )
      );
      setWordLoading(false);
    }
  }, [rangeValue]);

  const sliderStyle = useSelectAll ? {textAlign: "left"} : {}
  useEffect(()=>{
    clearTimeout();
    clearInterval();
  },[maxWords,callBackMemo,cloudSize,options,word])

  return (
    <>
      {word && (
        <ReactWordcloud
          maxWords={maxWords}
          callbacks={callBackMemo}
          options={options}
          size={cloudSize}
          words={word}
          style={{ height: "unset" }}
        />
      )}
      {useWordMenu && menuVisible && selectWordData && (
        <>
          <button
            className={"btn btn-primary"}
            style={{
              position: "absolute",
              ...selectLocation,
            }}
            onClick={() => selectMenuClickHandler(selectWordData)}
          >
            {"선택"}
          </button>
          <button
            className={"btn btn-primary"}
            style={{
              position: "absolute",
              ...removeLocation,
            }}
            onClick={() => removeMenuClickHandler(selectWordData)}
          >
            {"제거"}
          </button>
        </>
      )}

      {useSlider && (
        <div className="filter-area">
          <div className="filter-controller L-size specific">
            <span style={{float: "left", marginRight: "10px"}}>범위 조정</span>
            <ul style={{float: "left"}}>
              <li className="slider-box">
                <Slider
                  disabled={wordLoading}
                  range
                  style={size[0] === 880 ? {width: "600px"} : { width: `${cloudSize[0]*0.6}px` }}
                  onChange={(value) => rangeChangeHandler(value)}
                  min={minValue}
                  max={maxValue}
                  value={rangeValue}
                />
              </li>
              {useSelectAll &&
                <li>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => selectAllClickHandler(word)}>클라우드 적용</button>
                </li>
              }
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Wordcloud);
