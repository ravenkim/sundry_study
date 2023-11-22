import React, {useState} from "react";
import { Tooltip } from "antd";

const Toolbar = ({
  data,
  wrapperWidth,
  align,
  opacity = 0.2,
  downloadImageHandler,
  downloadExcelHandler,
  resetHandler,
  downloadFileName,
}) => {
  return (
    <div
      style={{
        backgroundColor: "transparent",
        textAlign: align,
        opacity: opacity,
        fontSize: "16px",
        width: "100px",
        bottom: 30,
        left: align === "right" ? wrapperWidth - 100 : wrapperWidth - 365,
        position: "relative",
      }}
    >
      <Tooltip title={"이미지 다운로드"}>
        <i
          className="xi-image-o xi-x square_in_icon"
          onClick={downloadImageHandler}
        ></i>
      </Tooltip>
      <Tooltip title={"엑셀 다운로드"}>
        <i
          className="xi-download xi-x square_in_icon"
          onClick={downloadExcelHandler}
        ></i>
      </Tooltip>
      {resetHandler && (
        <Tooltip title={"새로고침"}>
          <i
            className="xi-renew xi-x square_in_icon"
            onClick={resetHandler}
          ></i>
        </Tooltip>
      )}
    </div>
  );
};

export default Toolbar;
