import React, {useEffect, useState} from 'react';
import SbjtSrchForm from "features/pre/components/analResult/SbjtSrchForm";
import EvalResultSmr from "features/pre/components/analResult/EvalResultSmr"
import Company from "features/pre/components/analResult/tabs/Company";
import Tech from "features/pre/components/analResult/tabs/Tech";
import Business from "features/pre/components/analResult/tabs/Business";
import PreAnalSmr from "features/pre/components/analResult/PreAnalSmr";
import {useDispatch, useSelector} from "react-redux";
import {preEvalAction} from "features/pre/preEvalReducer";
import {Spin} from "antd";

const PreEval = () => {

    const dispatch = useDispatch();

    const {
        sbjtPreEvalList,
        sbjtPreEvalListLoading,
        getSbjtPreEvalPopup,
        getSbjtPreEvalPopupLoading,
        orgnList,
        orgnLoading,
        getPemCommCd
    } = useSelector(({preEvalReducer}) => ({
        sbjtPreEvalList: preEvalReducer.getSbjtPreEvalList.data,
        sbjtPreEvalListLoading: preEvalReducer.getSbjtPreEvalList.loading,
        getSbjtPreEvalPopup: preEvalReducer.getSbjtPreEvalPopup.data,
        getSbjtPreEvalPopupLoading: preEvalReducer.getSbjtPreEvalPopup.loading,
        orgnList: preEvalReducer.orgnList.data,
        orgnLoading: preEvalReducer.orgnList.loading,
        getPemCommCd: preEvalReducer.getPemCommCd.data
    }));

    /********************************************************************
     * 예비평가 공통 Handler
     ********************************************************************/

    const [activeTab, setActiveTab] = useState();

    const tabClickHandler = (tab) => {
        setActiveTab(tab);
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [evalResult, setEvalResult] = useState({});
    const [isPreEvalClicked, setIsPreEvalClicked] = useState(false);

    const modalVisibleHandler = () => {
        setModalVisible(!modalVisible);
        dispatch(preEvalAction.getSbjtPreEvalPopup({ancmId: evalResult.ancmId, cmitId: evalResult.cmitId}));
        //dispatch(preEvalAction.getSbjtPreEvalPopup({ancmId: evalResult.ancmId, cmitId: "S0050305"}));
    };

    /********************************************************************
     * 예비평가 모델 결과 Tab
     ********************************************************************/

    useEffect(() => {
        if (isPreEvalClicked && evalResult.orgnId && evalResult.sbjtId) {
            dispatch(preEvalAction.getOrgnList({orgnId: evalResult.orgnId, sbjtId: evalResult.sbjtId}));
        }

    }, [evalResult])

    useEffect(() => {
        if (orgnList) {
            tabClickHandler('company')
            dispatch(preEvalAction.getSbjtPreEvalList({orgnId: evalResult.orgnId, sbjtId: evalResult.sbjtId}));
            //dispatch(preEvalAction.getSbjtPreEvalList({orgnId: "10045846", sbjtId: "S2711179"}));
        }
    }, [orgnList])

    /********************************************************************
     * 공통 util
     ********************************************************************/

    const orgn_cd = (varId) => {
        const commCd = orgnList?.result.filter(function (el) {
            return el['VAR_ID'] == varId
        })
        return commCd[0]
    }

    const slider_value = (start_value, end_value, slider_val) => {
        return (start_value + (((end_value-start_value)/10)*(slider_val-1))).toFixed(2)
    }

    useEffect(() => {
        dispatch(preEvalAction.getPemCommCd());
    }, [])

    return (
      <>
          {modalVisible && <PreAnalSmr modalVisibleHandler={modalVisibleHandler} getSbjtPreEvalPopup={getSbjtPreEvalPopup} getSbjtPreEvalPopupLoading={getSbjtPreEvalPopupLoading}/>}
          <div className="flex-row items-center">
              <h4>평가 과제 선택</h4>
              <button type="button" className="btn-tertiary-32 ml-auto plr-16" onClick={modalVisibleHandler} disabled={!isPreEvalClicked}>과제 신청기관 예비평가 요약</button>
          </div>

          <SbjtSrchForm setEvalResult={setEvalResult} setIsPreEvalClicked={setIsPreEvalClicked}/>

          <div className="grid-col-5 gap-16">

              <EvalResultSmr evalResult={evalResult} sbjtPreEvalList={sbjtPreEvalList} sbjtPreEvalListLoading={sbjtPreEvalListLoading}/>

              {/*// <!-- grid-left(레이아웃 왼쪽) End -->*/}

              <div className="grid-right col-span-3 p-0">
                  <div className="tab-wrap-top bg-white">
                      <div className="tabs gap-8">
                          <a href="#" className={`section-tab plr-24 ${activeTab === "company" ? "active-section-tab" : ""}`} onClick={() => tabClickHandler('company')}>기업 역량</a>
                          <a href="#" className={`section-tab plr-24 ${activeTab === "tech" ? "active-section-tab" : ""}`} onClick={() => tabClickHandler('tech')}>기술 역량</a>
                          <a href="#" className={`section-tab plr-24 ${activeTab === "business" ? "active-section-tab" : ""}`} onClick={() => tabClickHandler('business')}>사업화 역량</a>
                      </div>
                  </div>
                  <Spin spinning={orgnLoading}>
                      {orgnList?.result ?
                        <>
                            {
                               orgnList?.result.length > 0 ?
                                 <>
                                     {activeTab === 'company' && <Company orgnList={orgnList} getPemCommCd={getPemCommCd} orgn_cd={orgn_cd} slider_value={slider_value}/>}
                                     {activeTab === 'tech' && <Tech orgnList={orgnList} getPemCommCd={getPemCommCd} orgn_cd={orgn_cd} slider_value={slider_value}/>}
                                     {activeTab === 'business' && <Business orgnList={orgnList} getPemCommCd={getPemCommCd} orgn_cd={orgn_cd} slider_value={slider_value}/>}                                 
                                 </>
                                 :
                                 <div className="frame-cont bg-white" style={{height: "calc(100vh - 469px)"}}>
                                     <p className="text-14-m text-gray-400">조회된 내용이 없습니다.</p>
                                 </div>
                            }
                        </>
                        :
                        <div className="frame-cont bg-white" style={{height: "calc(100vh - 469px)"}}>
                          <p className="text-14-m text-gray-400">예비평가 조회 후 확인할 수 있습니다.</p>
                        </div>
                      }
                  </Spin>
              </div>

              {/*// <!-- grid-right(레이아웃 오른쪽) End -->*/}
          </div>
      </>
    );
};

export default PreEval;