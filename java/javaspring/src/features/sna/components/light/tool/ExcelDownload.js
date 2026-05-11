import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

/**
 * 사용설명서
 * @param fileName
 * @param columns
 * @param dataSource
 * @returns {JSX.Element}
 * @constructor
 */
export const ExcelDownload = (
  dataSource,
  fileName = "제목없음",
  fileExtension = "xlsx",
  sheetName = "Sheet1"
) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const ws = XLSX.utils.json_to_sheet(dataSource);

  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, {
    bookType: fileExtension,
    type: "array",
  });
  const data = new Blob([excelBuffer], { type: fileType });
  try {
    saveAs(data, `${fileName}.${fileExtension}`);
  } catch (e) {
    console.error("saveAs");
  }

  return (
    <ExcelFile
      filename={fileName}
      element={
        <Tooltip title={"엑셀 다운로드"}>
          <i className="xi-download xi-x square_in_icon"></i>
        </Tooltip>
      }
    >
      <ExcelSheet data={dataSource} name="sociogram Data">
        <ExcelColumn label="Title" value="t" />
        <ExcelColumn label="Approval Number" value="n" />
      </ExcelSheet>
    </ExcelFile>
  );
};
