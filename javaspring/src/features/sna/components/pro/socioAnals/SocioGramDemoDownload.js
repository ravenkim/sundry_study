import React from "react";
import { Button } from "antd";

import ReactExport from "react-export-excel";
import { FileTextOutlined } from "@ant-design/icons";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const SocioGramDemoDownload = ({ downloadData }) => {
  return (
    <ExcelFile
      element={
        <Button size="small" className="network_btn">
          엑셀
        </Button>
      }
    >
      <ExcelSheet data={downloadData} name="sociogram Data">
        <ExcelColumn label="Title" value="t" />
        <ExcelColumn label="Approval Number" value="n" />
      </ExcelSheet>
    </ExcelFile>
  );
};

export default SocioGramDemoDownload;
