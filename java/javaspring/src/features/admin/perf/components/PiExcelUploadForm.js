import React, { useEffect, useState } from "react";
import {DownloadOutlined} from "@ant-design/icons";
import PiExcelUpload from "../../../perf/utils/PiExcelUpload";
import { useDispatch } from 'react-redux'
import { perfAction } from 'features/perf/perfReducer'

const PiExcelUploadForm = ({closeModal,uploadTemplateHandler}) => {

  const [uploadData, setUploadData] = useState([]);

  const uploadTemplateJson = () => {
    if(uploadTemplateHandler&&typeof uploadTemplateHandler==='function')
    uploadTemplateHandler(uploadData)
  }



  return (
    <>
      <div className="modal-pop show p-32" id="modal-pop" style={{top: `48px`, right: `auto`, left: `142px`}}>
        <div className="flex-col">
          {/*타이틀*/}
          <div className="title mb-16">
            <h3>성능지표 업로드</h3>
            <button type="button" className="close" onClick={closeModal}></button>
          </div>
          {/*다운로드 버튼*/}
          <a
            className={"btn-secondary-32 w-contsize mb-8"}
            href={"/samples/piUploadTemplate.xlsx"}
            download={"성능지표 템플릿 양식"}
          >
            <DownloadOutlined /> 템플릿 다운로드
          </a>

            {/*<button type="button" className="btn-secondary-32 w-contsize mb-8">템플릿 다운로드</button>*/}
          {/*파일 업로드*/}
          {/*<div className="file">
            <input type="file" className="file-input" id="inputFile2"
                   onChange="javascript:document.getElementById('fileName2').value = this.value"/>
            <span className="mdi mdi-file-upload-outline"></span>
            <p className="text-14-m">파일 업로드</p>
          </div>*/}
          <PiExcelUpload setExcelData={setUploadData}></PiExcelUpload>
          {/*업로드 후 파일명 리스트 화면으로 변경 (숨김: no-show, 보임: no-show삭제 또는 visible 로 제어 가능)*/}
          {/*버튼*/}
          <button type="button" className="btn-primary-48 w-full mt-32" onClick={uploadTemplateJson}>저장하기</button>
        </div>
      </div>
    </>
  );
};

export default PiExcelUploadForm;
