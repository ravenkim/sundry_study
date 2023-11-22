import React, { useEffect, useState } from "react";
import {
  EXCEL_UPLOAD_ERROR,
  EXCEL_UPLOAD_TYPE,
  EXCEL_UPLOAD_REQUIRED,
} from "Constants";
import ExcelToJson from "features/common/excel/components/ExcelToJson";

const PiExcelUpload = ({ setExcelData }) => {
  const excelLayout = [
    {
      title: "성능지표명",
      dataIndex: "pi_nm",
      required: EXCEL_UPLOAD_REQUIRED.TRUE,
      type: EXCEL_UPLOAD_TYPE.STRING,
      width: 50,
      allowedCode: [],
    },
    {
      title: "측정지표",
      dataIndex: "measure_indicator",
      width: 70,
      required: EXCEL_UPLOAD_REQUIRED.TRUE,
      type: EXCEL_UPLOAD_TYPE.STRING,
      allowedCode: [],
    },
    {
      title: "측정방법",
      dataIndex: "measure_method",
      width: 100,
      required: EXCEL_UPLOAD_REQUIRED.TRUE,
      type: EXCEL_UPLOAD_TYPE.STRING,
      allowedCode: [],
    },
    {
      title: "단위",
      dataIndex: "symbol",
      width: 20,
      required: EXCEL_UPLOAD_REQUIRED.FALSE,
      type: EXCEL_UPLOAD_TYPE.STRING,
      allowedCode: [],
    },
    {
      title: "단위명",
      dataIndex: "unit_nm",
      width: 20,
      required: EXCEL_UPLOAD_REQUIRED.FALSE,
      type: EXCEL_UPLOAD_TYPE.STRING,
      allowedCode: [],
    },
    {
      title: "단위설명",
      dataIndex: "unit_explan",
      width: 100,
      required: EXCEL_UPLOAD_REQUIRED.FALSE,
      type: EXCEL_UPLOAD_TYPE.STRING,
      allowedCode: [],
    },
  ];

  return <ExcelToJson excelLayout={excelLayout} setExcelJson={setExcelData} />;
};

export default PiExcelUpload;
