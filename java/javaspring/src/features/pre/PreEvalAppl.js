import React, { useEffect, useState } from 'react';

import CoBasicInfoForm from "features/pre/components/appl/CoBasicInfoForm";
import ApplSbjtSmr from "features/pre/components/appl/ApplSbjtSmr";
import ReqrInputItems from "features/pre/components/appl/ReqrInputItems";
import ReqrSrchItems from "features/pre/components/appl/ReqrSrchItems";
import CmpnSrchForm from "features/pre/components/appl/CmpnSrchForm";

import { useDispatch, useSelector } from "react-redux";
import { ROLE } from "Constants";
import { preEvalAction } from "features/pre/preEvalReducer";
import {Modal, notification, Spin} from "antd";


const TAB_TYPE = {
    TAB1 : "tab1",
    TAB2 : "tab2",
    TAB3 : "tab3",
    TAB4 : "tab4",
};

const openNotification = (type, msg, desc) => {
    notification[type]({
        message: msg,
        description: desc,
        placement: "bottomRight"
    })
}

const PreEvalAppl = () => {

    const dispatch = useDispatch();
    const { user } = useSelector(({ userReducer }) => ({
        user: userReducer.user.data,
    }));

    const { cmpnList, cmpnSbjtList, sbjtData, updateCmpnDescState, submitBusinessPlanState } = useSelector(({ preEvalReducer }) => ({
        cmpnList: preEvalReducer.cmpnList.data,
        cmpnSbjtList: preEvalReducer.cmpnSbjtList,
        sbjtData: preEvalReducer.sbjtData,
        updateCmpnDescState: preEvalReducer.updateCmpnDescState.data,
        submitBusinessPlanState: preEvalReducer.submitBusinessPlanState,
    }));

    useEffect(() => {
        dispatch(preEvalAction.initializeAll());
    },[]);

    /*담당자 권한 체크*/
    const [auth, setAuth] = useState();
    useEffect(() => {
      setAuth(user.groups.includes(ROLE.ROLE_CHARGER));
    },[user]);

    /*탭 (추후 수정)*/
    const [activeTab, setActiveTab] = useState();
    const tabChangeHandler = (tab) => {
      setActiveTab(tab);
    };

    /*업체 조회*/
    // 업체 조회 검색어
    const [searchWord, setSearchWord] = useState('');
    const searchWordChangeHandler = (value) => {
      setSearchWord(value);
    };
    // 업체 조회 검색어 2글자 이상 시, 업체 리스트
    useEffect(() => {
      if (searchWord && searchWord.length > 1) {
        dispatch(preEvalAction.getCmpnList({searchWord}))
      }
    },[searchWord]);

    /*업체 조회 기능*/
    const [visible, setVisible] = useState(false);
    const searchHandler = (formData) => {
      if (formData.orgnId && formData.date) {
        setVisible(true);
        setActiveTab(TAB_TYPE.TAB1);
        dispatch(preEvalAction.getCmpnSbjt(formData));
        setSbjtSmrData({});
        setSelectedSubject('');
      } else {
        openNotification('warning', '검색어와 기간을 입력해주세요.');
      }
    };
    const [orgnId, setOrgnId] = useState();
    const orgnIdChangeHandler = (value) => {
        setOrgnId(value)
    };
    /*업체 조회 시, 조회 결과 데이터(cmpnSbjtList)에서 업체 기본정보(cmpnData), 업체 수행 과제 목록(sbjtList), 각 슬라이더 레이블 데이터(labelData)를 각각 담아 전달*/
    const [cmpnData, setCmpnData] = useState();
    const [sbjtList, setSbjtList] = useState();
    const [labelData, setLabelData] = useState();

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (cmpnSbjtList.data) {
            setCmpnData(cmpnSbjtList.data.cmpnData);
            setLabelData(cmpnSbjtList.data.labelData);
            cmpnSbjtList.data.sbjtData && cmpnSbjtList.data.sbjtData.length > 0 ? setSbjtList(cmpnSbjtList.data.sbjtData) : setSbjtList([])
        }
        setLoading(cmpnSbjtList.loading);
    },[cmpnSbjtList]);

    /*업체 수행 과제 목록(sbjtList)에서 과제 선택 시, 해당 과제 데이터 호출, 전달*/
    // 과제 선택
    const [selectedSubject, setSelectedSubject] = useState();
    const selectSubjectHandler = (value) => {
      setSelectedSubject(value);
      dispatch(preEvalAction.getSbjt({sbjtId: value, orgnId: orgnId}));
    };
    // 과제 선택 시, 과제
    const [sbjtSmrData, setSbjtSmrData] = useState();
    useEffect(() => {
        if (sbjtData.data) {
            setSbjtSmrData(sbjtData.data);
        }
    },[sbjtData]);

    /*기업소개 수정*/
    const updateCmpnDescHandler = (formData) => {
        Modal.confirm({
            title: '기업소개 수정',
            content: '기업소개를 수정하시겠습니까?',
            okText: '확인',
            cancelText: '취소',
            onOk: () => {
                dispatch(preEvalAction.updateCmpnDesc(formData));
            }
        })
    };
    useEffect(() => {
        if (updateCmpnDescState) {
            updateCmpnDescState.state ? openNotification('success', '기업소개를 수정하였습니다.') : openNotification('error','기업소개 수정에 실패하였습니다.');
            dispatch(preEvalAction.initialize('updateCmpnDescState'));
        }

    },[updateCmpnDescState]);

    /*사업계획서 보완자료 제출*/
    const submitBusinessPlanHandler = (formData) => {
        Modal.confirm({
            title: '사업계획서 보완자료 제출',
            content: '사업계획서 보완자료를 제출하시겠습니까?',
            okText: '확인',
            cancelText: '취소',
            onOk: () => {
                dispatch(preEvalAction.submitBusinessPlan({formData: formData, sbjtId: selectedSubject, orgnId: orgnId}));
            }
        })
    };

    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        if (submitBusinessPlanState) {
            if (submitBusinessPlanState.data) {
                submitBusinessPlanState.data.state ? openNotification('success', '사업계획서 보완자료 제출 성공하였습니다.') : openNotification('error', '사업계획서 보완자료 제출 실패하였습니다.')
            }
            setSubmitLoading(submitBusinessPlanState.loading);
        }
    },[submitBusinessPlanState])


    return (
        <Spin spinning={submitLoading}>
          <div className="grid-col-5 gap-16 items-center mb-8">
              <div className="col-span-2"><h4>업체 정보</h4></div>
              <div className="col-span-3 flex-row items-center">
                  <h4>신청과제 요약</h4>
              </div>
          </div>

          <div className="grid-col-5 gap-16">
              <div className="grid-left col-span-2 p-0">
                  <CmpnSrchForm
                    searchHandler={searchHandler}
                    searchWord={searchWord}
                    searchWordChangeHandler={searchWordChangeHandler}
                    cmpnList={cmpnList}
                    orgnIdChangeHandler={orgnIdChangeHandler}
                  />
                  <CoBasicInfoForm
                    visible={visible}
                    auth={auth}
                    cmpnData={cmpnData}
                    updateCmpnDescHandler={updateCmpnDescHandler}
                    loading={loading}
                  />

              </div>

              <div className="grid-right col-span-3 p-0">
                  <ApplSbjtSmr
                    visible={visible}
                    selectedSubject={selectedSubject}
                    selectSubjectHandler={selectSubjectHandler}
                    sbjtList={sbjtList}
                    loading={loading}
                    sbjtSmrData={sbjtSmrData}
                  />
                  <div className="tab-wrap bg-white">
                      <div className="tabs gap-8">
                          <a className={`${activeTab===TAB_TYPE.TAB1 ? "active-section-tab" : ""} section-tab plr-24`} onClick={(e)=>tabChangeHandler(TAB_TYPE.TAB1)}>필요입력항목</a>
                          {/*<a className={`${activeTab===TAB_TYPE.TAB2 ? "active-section-tab" : ""} section-tab plr-24`} onClick={(e)=>tabChangeHandler(TAB_TYPE.TAB2)}>연구목표</a>*/}
                          {/*<a className={`${activeTab===TAB_TYPE.TAB3 ? "active-section-tab" : ""} section-tab plr-24`} onClick={(e)=>tabChangeHandler(TAB_TYPE.TAB3)}>과제상세</a>*/}
                          {/*<a className={`${activeTab===TAB_TYPE.TAB4 ? "active-section-tab" : ""} section-tab plr-24`} onClick={(e)=>tabChangeHandler(TAB_TYPE.TAB4)}>과제요약</a>*/}
                      </div>
                  </div>
                  {auth ?
                    <ReqrInputItems
                      visible={visible}
                      submitBusinessPlanHandler={submitBusinessPlanHandler}
                      sbjtSmrData={sbjtSmrData}
                      labelData={labelData}
                      selectedSubject={selectedSubject}
                    />
                    :
                    <ReqrSrchItems
                      visible={visible}
                      sbjtSmrData={sbjtSmrData}
                    />
                  }
              </div>
          </div>
      </Spin>
    );
};

export default PreEvalAppl;