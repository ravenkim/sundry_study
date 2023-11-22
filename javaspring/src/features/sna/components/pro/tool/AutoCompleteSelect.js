import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { snaAction } from "features/sna/snaReducer";
import { Select } from "antd";

const { Option } = Select;

const AutoCompleteSelect = ({ changeAutocompleteHandler, category }) => {
  const dispatch = useDispatch();
  let timerHandler = null;

  const { socioWordList } = useSelector(({ snaReducer }) => ({
    socioWordList: snaReducer.limeWordAutocomplete.data,
  }));

  const [words, setWords] = useState([]);

  useEffect(() => {
    setWords((prev) => []);
    socioWordList &&
      socioWordList.map((word) => {
        setWords((prev) => [...prev, <Option key={word}>{word}</Option>]);
      });
  }, [socioWordList]);

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
          snaAction.getLimeWordAutocomplete({ word: pWord, sort: category })
        );
      }, 100);
    }
  };

  return (
    <Select
      showSearch
      placeholder="검색어를 입력하세요."
      onSearch={searchWordListHandler}
      onChange={changeAutocompleteHandler}
      style={{ width: "100%" }}
    >
      {words}
    </Select>
  );
};

export default React.memo(AutoCompleteSelect);
