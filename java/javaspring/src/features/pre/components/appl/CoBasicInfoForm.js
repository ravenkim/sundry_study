import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import moment from "moment";

const CoBasicInfoForm = (
  {
    visible=false,
    auth=false,
    updateCmpnDescHandler,
    cmpnData,
    loading
  }
) => {

  const [formData, setFormData] = useState();

  const wordChangeHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    if (cmpnData) {
      setFormData(cmpnData);
    }
  },[cmpnData]);

  return (
    <Spin spinning={loading}>
      <hr className="w-full m-0"/>
      {!visible ?
        <div className="frame-cont-bottom-r bg-white" style={{height: "calc(100vh - 322px)"}}>
          <div className="flex-col gap-16 items-center">
            <span className="mdi mdi-office-building text-primary" style={{fontSize: "50px"}}/>
            <p className="text-14-m text-gray-400">업체를 조회하시면 <strong>업체 기본정보</strong>를 확인할 수 있습니다.</p>
          </div>
        </div>
        :
        <div className="p-16 flex-col gap-8 overflow-auto" style={{height: "calc(100vh - 322px)"}}>
          <div className="flex-row items-center mb-16">
            <span className="mdi mdi-office-building text-primary text-icon-24 mr-4"/>
            <h5>업체 기본정보</h5>
          </div>

          <div className="grid-col-3 mb-4">
            <div className="form-label-text">사업자등록번호</div>
            <div className="col-span-2">
              <input
                type="text"
                name={'busirNo'}
                value={formData && formData.busirNo ? formData.busirNo : ""}
                onChange={(e) => wordChangeHandler(e)}
                disabled={true}
              />
            </div>
          </div>
          <div className="grid-col-3 mb-4">
            <div className="form-label-text">법인등록번호</div>
            <div className="col-span-2">
              <input
                type="text"                
                name={'corpNo'}
                value={formData && formData.corpNo ? formData.corpNo : ''}
                onChange={(e) => wordChangeHandler(e)}
                disabled={true}
              />
            </div>
          </div>
          <div className="grid-col-3 mb-4">
            <div className="form-label-text">기관명</div>
            <div className="col-span-2">
              <input
                type="text"                
                name={'orgnNm'}
                value={formData && formData.orgnNm ? formData.orgnNm : ''}
                onChange={(e) => wordChangeHandler(e)}
                disabled={true}
              />
            </div>
          </div>
          <div className="grid-col-3 mb-4">
            <div className="form-label-text">설립연월일</div>
            <div className="col-span-2">
              <input
                type="text"                
                name={'orgnFndtYmd'}
                value={formData && formData.orgnFndtYmd ? moment(formData.orgnFndtYmd).format("YYYY-MM-DD") : ''}
                //onChange={(e) => wordChangeHandler(e)}
                disabled={true}
              />
            </div>
          </div>
          <div className="grid-col-3 mb-4">
            <div className="form-label-text">본사주소</div>
            <div className="col-span-2">
              <input
                type="text"                
                name={'etcAd'}
                value={formData && formData.etcAd ? formData.etcAd : ''}
                onChange={(e) => wordChangeHandler(e)}
                disabled={true}
              />
            </div>
          </div>
          <div className="grid-col-3 mb-4">
            <div className="form-label-text">홈페이지</div>
            <div className="col-span-2">
              <input
                type="text"                
                name={'hmpgAd'}
                value={formData && formData.hmpgAd ? formData.hmpgAd : ''}
                onChange={(e) => wordChangeHandler(e)}
                disabled={true}
              />
            </div>
          </div>
          <div className="grid-col-3 mb-4">
            <div className="form-label-text">대표 전화번호</div>
            <div className="col-span-2">
              <input
                type="text"                
                name={'telNo'}
                value={formData && formData.telNo ? formData.telNo : ''}
                onChange={(e) => wordChangeHandler(e)}
                disabled={true}
              />
            </div>
          </div>
          <div className="grid-col-3 mb-4">
            <div className="form-label-text">주생산품</div>
            <div className="col-span-2">
              <input
                type="text"                
                name={'mainProdArt'}
                value={formData && formData.mainProdArt ? formData.mainProdArt : ''}
                onChange={(e) => wordChangeHandler(e)}
                disabled={true}
              />
            </div>
          </div>
          <div className="grid-col-3 mb-4">
            <div className="form-label-text">기정원 수행과제 수<p className="ml-4 mt-4">(건)</p></div>
            <div className="col-span-2">
              <input
                type="number"
                className="w-full"
                name={'sbjtNum'}
                value={formData && formData.cnt ? formData.cnt : 0}
                onChange={(e) => wordChangeHandler(e)}
                disabled={true}
              />
            </div>
          </div>
          <div className="flex-row items-center">
            <div className="form-label-text">기업소개</div>
            {auth &&
              <button
                type="button"
                className="btn-tertiary-32 plr-24 ml-auto"
                onClick={() => updateCmpnDescHandler(formData)}
                disabled={!auth}
              >수정완료</button>
            }
          </div>
          <textarea
            className="noresize textarea-min"
            placeholder="내용을 입력하세요"
            disabled={!auth}
            name={'intro'}
            value={formData && formData.intro ? formData.intro : ''}
            onChange={(e) => wordChangeHandler(e)}
          />
        </div>
      }
    </Spin>
  )
};

export default CoBasicInfoForm;