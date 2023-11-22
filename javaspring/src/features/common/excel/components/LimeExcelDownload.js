import React, { useEffect, useState } from "react";
import LimeButton from "features/common/button/components/LimeButton";
import { Modal } from "antd";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const LimeExcelDownload = ({
  dataSource,
  fileName = "제목없음",
  excelLayout,
  excelLayout2,
  defaultButtonTitle,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [validExcelForm, setValidExcelForm] = useState(false);
  const [excelData, setExcelData] = useState([]);

  const excelDownloadOnClick = () => {
    // 작업중이 아니면 download 진행
    // alert("다운로드");
    if (!loading) {
      setLoading(true);
      if (!excelLayout || excelLayout.length <= 0) {
        Modal.error({
          title: "엑셀 다운로드 오류",
          content: "엑셀에 사용될 컬럼이 없습니다.",
          okText: "확인",
          okButtonProps: {
            type: "default",
            size: "small",
          },
          getContainer: false,
        });
        return;
      }

      setValidExcelForm(true);
      // let filteringData = JSON.parse(JSON.stringify(dataSource)).map((item) => {
      //   item.subjectName = ;
      //   return item;
      // });
      // console.log("filteringData : ", filteringData);

      setExcelData(JSON.parse(JSON.stringify(dataSource)));
    } else {
      Modal.error({
        title: "다운로드 오류",
        content: "이미 엑셀다운로드가 진행중입니다.",
        okText: "확인",
        okButtonProps: {
          type: "default",
          size: "small",
        },
        getContainer: false,
      });
    }
  };

  useEffect(() => {
    if (excelData && excelData.length > 0) {
      // console.log(Math.floor(excelData.length / 10000));
      setTimeout(() => {
        setLoading(false);
        // setValidExcelForm(false);
        // setExcelData([]);
      }, 1000);
    }
  }, [excelData]);

  const generateExcelForm = (layout, layout2, targetData) => {
    if (layout && layout.length > 0) {
      return (
        <ExcelFile
          hideElement={true}
          filename={fileName ? fileName : "Download"}
        >
          <ExcelSheet key={"sheet1"} data={targetData} name="과제별 산정집계">
            {layout.map((col) => (
              <ExcelColumn
                key={col.dataIndex}
                label={col.title}
                value={col.dataIndex}
              />
            ))}
          </ExcelSheet>

          {targetData &&
            targetData.map((item, index) => {
              let sheetTitle = item.subjectName.replace("/", "");
              return (
                <ExcelSheet
                  key={`sheet${index + 2}`}
                  data={item.resultChildren}
                  name={sheetTitle}
                >
                  {layout2.map((col) => (
                    <ExcelColumn
                      key={col.dataIndex}
                      label={col.title}
                      value={col.dataIndex}
                    />
                  ))}
                </ExcelSheet>
              );
            })}
        </ExcelFile>
      );
    }
  };

  return (
    <>
      {children ? (
        React.cloneElement(children, { onClick: excelDownloadOnClick })
      ) : (
        <LimeButton
          type={"button"}
          classType={"secondary"}
          size={"sm"}
          title={defaultButtonTitle ? defaultButtonTitle : "다운로드"}
          onClick={excelDownloadOnClick}
        />
      )}
      {validExcelForm &&
        generateExcelForm(excelLayout, excelLayout2, excelData)}
    </>
  );
};

export default LimeExcelDownload;
