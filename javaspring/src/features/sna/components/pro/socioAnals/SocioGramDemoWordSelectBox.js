import React, { useEffect, useState } from "react";
import { Select, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { snaAction } from "features/sna/snaReducer";

const { Option } = Select;
const SocioGramDemoWordSelectBox = ({
  onChangeWordSelectBox,
  backgroundColorMode,
  useEnterEvent = false,
  getEnterEvent,
  setWordListHeight,
  sort,
}) => {
  const { socioWordList } = useSelector(({ snaReducer }) => ({
    socioWordList: snaReducer.limeWordAutocomplete.data,
  }));

  const dispatch = useDispatch();
  const [words, setWords] = useState([]);

  useEffect(() => {
    setWords((prev) => []);
    socioWordList &&
      socioWordList.map((word) => {
        setWords((prev) => [...prev, <Option key={word}>{word}</Option>]);
      });
  }, [socioWordList]);

  useEffect(() => {
    // dispatch(getSocioESWordList({ word: pWord})); //워드 리스트 가져오기
  }, []);

  let timerHandler = null;

  /**
   * 검색단어 LIST 지연 검색
   */
  const searchWordListHandler = (pWord) => {
    if (
      pWord !== undefined &&
      pWord !== null &&
      pWord !== "" &&
      pWord.length > 1
    ) {
      if (timerHandler !== undefined && timerHandler !== null) {
        clearTimeout(timerHandler);
      }
      timerHandler = setTimeout(() => {
        dispatch(
          snaAction.getLimeWordAutocomplete({ word: pWord, sort: sort })
        );
      }, 100);
    }
  };

  const onInputKeyDown = (event) => {};
  const onKeyDown = (event) => {
    // console.log("onKeyDown ; ", event.target.value);
  };

  // useEffect(() => {
  //   // setTooltipVisible

  //   // const handler = setTimeout(setWindowResizeEvent, 1000);
  //   // return () => clearTimeout(handler);

  //   console.log("word : ", word);
  //   console.log("data : ", data);
  // }, [word]);

  return (
    <Select
      showSearch
      placeholder="검색어를 입력하세요."
      onSearch={searchWordListHandler}
      onChange={onChangeWordSelectBox}
      //defaultActiveFirstOption={true}
      style={{ width: "100%" }}
      onInputKeyDown={
        useEnterEvent ? (e) => getEnterEvent(e, socioWordList) : onInputKeyDown
      }
      onKeyDown={onKeyDown}
    >
      {words}
    </Select>
  );
};

export default React.memo(SocioGramDemoWordSelectBox);
