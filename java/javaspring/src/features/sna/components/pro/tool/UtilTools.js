import React from "react";
import { Button, Col, Row } from "antd";

import ReactExport from "react-export-excel";
import Tutorial from "features/sna/components/common/modal/Tutorial";
import { DownloadOutlined } from "@ant-design/icons";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const UtilTools = ({ dataSource }) => {
  /**
   * canvas image download handler
   */
  const canvasImageDownloadHandler = () => {
    // console.log("graphRef. : ", graphRef.current.)
    let dataURL = document
      .getElementsByTagName("canvas")[0]
      .toDataURL("image/png", 1);
    dataURL = dataURL.replace(
      /^data:image\/[^;]*/,
      "data:application/octet-stream"
    );
    dataURL = dataURL.replace(
      /^data:application\/octet-stream/,
      "data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png"
    );
    let aTag = document.createElement("a");
    aTag.download = "from_sociogram.png";
    aTag.href = dataURL;
    aTag.click();
  };

  return (
    <Row>
      <Col>
        <Tutorial />
      </Col>
      <Col>
        <Button
          onClick={canvasImageDownloadHandler}
          style={{ marginLeft: "20px" }}
        >
          이미지 <DownloadOutlined />
        </Button>
      </Col>
      <Col>
        <ExcelFile
          element={
            <Button style={{ marginLeft: "5px" }}>
              Excel <DownloadOutlined />
            </Button>
          }
        >
          <ExcelSheet data={dataSource} name="sociogram Data">
            <ExcelColumn label="Title" value="t" />
            <ExcelColumn label="Approval Number" value="n" />
          </ExcelSheet>
        </ExcelFile>
      </Col>
    </Row>
  );
};

export default UtilTools;
