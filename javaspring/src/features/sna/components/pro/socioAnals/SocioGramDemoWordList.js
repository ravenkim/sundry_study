import React, { useEffect } from "react";
// import { getRandomColor } from "utils/commonUtils";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getLimeWordAutocomplete } from "modules/search/socioGram";
// import ReactResizeDetector from "react-resize-detector";
import sizeMe from "react-sizeme";

const SocioGramDemoWordList = ({ size: { width, height }, onClickWordListButton, backgroundColorMode, setWordListHeight }) => {
  const { socioWordList } = useSelector(({ socioReducer }) => ({
    //word list
    socioWordList: socioReducer.getLimeWordAutocomplete,
  }));
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLimeWordAutocomplete()); //워드 리스트 가져오기
  }, []);

  return (
    <>
      <div
        style={{
          background: `${backgroundColorMode ? "#000000" : "#ffffff"}`,
          padding: "3px",
        }}
      >
        {socioWordList &&
          socioWordList.map((word, key) => {
            return (
              <Button
                key={key}
                style={{
                  color: `${backgroundColorMode ? "#000000" : "#ffffff"}`,
                  backgroundColor: `${backgroundColorMode ? "#ffffff" : "#000000"}`,
                  fontSize: "14px",
                  padding: "3px 10px 3px 10px",
                  margin: "3px",
                }}
                onClick={() => onClickWordListButton(word)}
              >
                {word}
              </Button>
            );
          })}
        {setWordListHeight(height)}
      </div>
    </>
  );
};

export default React.memo(sizeMe({ monitorHeight: true })(SocioGramDemoWordList));
