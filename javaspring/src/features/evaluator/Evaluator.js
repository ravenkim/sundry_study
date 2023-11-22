import React, {useEffect, useState} from 'react';
import {Alert, DatePicker, message, Modal, Select, Spin, Tooltip} from "antd";
import locale from 'antd/es/date-picker/locale/ko_KR';
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {evaluatorAction} from "features/evaluator/evaluatorReducer";
import CmitArea from "features/evaluator/components/CmitArea";
import AutoAssignModal from "features/evaluator/components/modals/AutoAssignModal";
import EvaluatorResultArea from "features/evaluator/components/EvaluatorResultArea";
import {ASSIGN_TYPE} from "Constants";
import MbrDetailModal from "features/evaluator/components/modals/MbrDetailModal";
import AncmArea from "features/evaluator/components/AncmArea";

const {RangePicker} = DatePicker;

const Evaluator = () => {
    const dispatch = useDispatch();

    const {
        brdnOnelvlList,
        brdnTwolvlList,
        brdnThreelvlList,
        ancmList,
        ancmLoading,
        cmitList,
        cmitLoading,
        evalCondition,
        assignEvaluatorState,
        assignEvaluatorError,
        assignLoading,
        reAssignEvaluatorState,
        reAssignEvaluatorError,
        reAssignLoading,
        cmitDetail,
        cmitDetailLoading
    } = useSelector(({evaluatorReducer}) => ({
        brdnOnelvlList: evaluatorReducer.brdnOnelvlList.data,
        brdnTwolvlList: evaluatorReducer.brdnTwolvlList.data,
        brdnThreelvlList: evaluatorReducer.brdnThreelvlList.data,
        ancmList: evaluatorReducer.ancmList.data,
        ancmLoading: evaluatorReducer.ancmList.loading,
        cmitList: evaluatorReducer.cmitList.data,
        cmitLoading: evaluatorReducer.cmitList.loading,
        evalCondition: evaluatorReducer.evalCondition.data,
        assignEvaluatorState: evaluatorReducer.assignEvaluatorState.data,
        assignEvaluatorError: evaluatorReducer.assignEvaluatorState.error,
        assignLoading: evaluatorReducer.assignEvaluatorState.loading,
        reAssignEvaluatorState: evaluatorReducer.reAssignEvaluatorState.data,
        reAssignEvaluatorError: evaluatorReducer.reAssignEvaluatorState.error,
        reAssignLoading: evaluatorReducer.reAssignEvaluatorState.loading,
        cmitDetail: evaluatorReducer.cmitDetail.data,
        cmitDetailLoading: evaluatorReducer.cmitDetail.loading
    }));

    const [searchForm, setSearchForm] = useState({
        searchStrDt: moment().startOf('month').format("YYYYMMDD"),
        searchEndDt: moment().endOf('month').format("YYYYMMDD"),
        oneLvlBrdnBuclCd: null,
        twoLvlBrdnBuclCd: null,
        threeLvlBrdnBuclCd: null,
    });

    useEffect(() => {
        dispatch(evaluatorAction.getBrdnBuclCd({target: "brdnOnelvlList", hiBuclCd: "B0000"}));
        dispatch(evaluatorAction.getEvaluatorCondition());

        return () => {
            dispatch(evaluatorAction.initializeAll());
        }
    }, [])


    /**
     * 검색기간 Change handler
     * @param range
     */
    const dateChangeHandler = (range) => {
        if(range){
            setSearchForm((prev) => ({
                ...prev,
                searchStrDt: moment(range[0]).format("YYYYMMDD"),
                searchEndDt: moment(range[1]).format("YYYYMMDD"),
            }))
        }else{
            setSearchForm((prev) => ({
                ...prev,
                searchStrDt: null,
                searchEndDt: null,
            }))
        }
    }

    /**
     * 세부사업 Change handler
     * @param value
     */
    const oneLevelChangeHandler = (value) => {

        if (isDiff(value, searchForm.oneLvlBrdnBuclCd)) {

            value && dispatch(evaluatorAction.getBrdnBuclCd({target: "brdnTwolvlList", hiBuclCd: value}));

            dispatch(evaluatorAction.initialize("twoLvlBrdnBuclCd"));
            dispatch(evaluatorAction.initialize("threeLvlBrdnBuclCd"));

            setSearchForm((prev) => ({
                ...prev,
                oneLvlBrdnBuclCd: value,
                twoLvlBrdnBuclCd: null,
                threeLvlBrdnBuclCd: null,
            }));

        }

    }

    /**
     * 내역사업 Change handler
     * @param value
     */
    const twoLevelChangeHandler = (value) => {
        if (isDiff(value, searchForm.oneLvlBrdnBuclCd)) {

            value && dispatch(evaluatorAction.getBrdnBuclCd({target: "brdnThreelvlList", hiBuclCd: value}));
            dispatch(evaluatorAction.initialize("threeLvlBrdnBuclCd"));

            setSearchForm((prev) => ({
                ...prev,
                twoLvlBrdnBuclCd: value,
                threeLvlBrdnBuclCd: null,
            }));
        }
    }

    /**
     * 내내역사업 Change handler
     * @param value
     */
    const threeLevelChangeHandler = (value) => {
        setSearchForm((prev) => ({
            ...prev,
            threeLvlBrdnBuclCd: value
        }));
    }


    /**
     * 사업공고 조회 handler
     */
    const searchAncmListHandler = () => {
        if (validateSearchConditionHandler()) {
            Modal.error({title: "검색기간 혹은 사업을 선택해주세요.", okText: "확인"})
            return;
        }

        dispatch(evaluatorAction.getAncmList(searchForm));
    }

    /***************************************************************************
     * 사업공고
     ***************************************************************************/

    const [selectedAncmId, setSelectedAncmId] = useState();

    const ancmRowClickHandler = (ancmId) => {
        if (ancmId !== selectedAncmId) {
            setSelectedAncmId(ancmId);
            dispatch(evaluatorAction.initialize("cmitDetail"));
            setSelectedCmit();
        }
    }

    useEffect(() => {
        if (selectedAncmId) {
            dispatch(evaluatorAction.getCmitList({ancmId: selectedAncmId}));
        }
    }, [selectedAncmId])

    /***************************************************************************
     * 분과 선택 및 자동배정
     ***************************************************************************/

    const [selectedCmit, setSelectedCmit] = useState();

    const cmitRowClickHandler = (cmit) => {
        setSelectedCmit(cmit);
    }

    useEffect(() => {
        if (selectedCmit) {
            dispatch(evaluatorAction.getCmitDetail({cmitId: selectedCmit.cmitId}));
        }
    }, [selectedCmit])

    const [modalVisible, setModalVisible] = useState(false);
    const [assignType, setAssignType] = useState(ASSIGN_TYPE.ASSIGN);
    const modalCloseHandler = (visible) => {
        setModalVisible(false);
    }

    const modalOpenHandler = (visible, type) => {
        setAssignType(type);
        setModalVisible(true);
    }

    const autoAssignHandler = (searchForm, type) => {
        if (assignType === ASSIGN_TYPE.ASSIGN) {
            Modal.confirm({
                title: "평가위원 배정",
                content: "분과생성 및 평가위원을 배정하시겠습니까?",
                okText: "확인",
                cancelText: "취소",
                onOk: () => {

                    dispatch(evaluatorAction.assignEvaluator({
                        ...searchForm,
                        ancmId: selectedAncmId,
                    }));
                    setModalVisible(false);
                },
            })
        } else {
            Modal.confirm({
                title: "평가위원 재배정",
                content: "재배정 할 경우 기존의 분과, 평가위원정보가 삭제됩니다. 재배정하시겠습니까?",
                okText: "확인",
                cancelText: "취소",
                onOk: () => {

                    dispatch(evaluatorAction.reAssignEvaluator({
                        ...searchForm,
                        ancmId: selectedAncmId,
                    }));
                    setModalVisible(false);
                },
            })
        }

    }

    useEffect(() => {
        if (assignEvaluatorState !== null && assignEvaluatorState !== false) {
            Modal.success({
                title: "작업이 완료되었습니다.",
                content: "분과구성 및 평가위원 배정이 완료되었습니다.",
                okText: "확인",
                onOk: (closeHandler) => {
                    dispatch(evaluatorAction.getCmitList({ancmId: selectedAncmId}));
                    closeHandler();
                }
            })


        }
        dispatch(evaluatorAction.initialize("assignEvaluatorState"));
    }, [assignEvaluatorState])

    useEffect(() => {
        if (assignEvaluatorError===true) {
            Modal.error({title: "서버 오류 발생", content: "분과구성 및 평가위원 배정에 실패하였습니다.", okText: "확인"})
            dispatch(evaluatorAction.initialize("assignEvaluatorState"));
        }
    }, [assignEvaluatorState])


    useEffect(() => {
        if (reAssignEvaluatorState !== null && reAssignEvaluatorState !== false) {
            Modal.success({
                title: "재배정이 완료되었습니다.",
                content: "분과구성 및 평가위원 재배정이 완료되었습니다.",
                okText: "확인",
                onOk: (closeHandler) => {
                    dispatch(evaluatorAction.getCmitList({ancmId: selectedAncmId}));
                    closeHandler();
                }
            })
        }

        dispatch(evaluatorAction.initialize("reAssignEvaluatorState"));
    }, [reAssignEvaluatorState])

    useEffect(() => {
        if (reAssignEvaluatorError===true) {
            Modal.error({title: "서버 오류 발생", content: "분과구성 및 평가위원 재배정에 실패하였습니다.", okText: "확인"})
            dispatch(evaluatorAction.initialize("reAssignEvaluatorState"));
        }

    }, [reAssignEvaluatorError])

    /***************************************************************************
     * Result Tab handler
     ***************************************************************************/
    const [activeTab, setActiveTab] = useState("tab1");

    const tabChangeHandler = (tab) => {
        let test_data = {
            1 : "123123",
            2 : "1231231"
        }


        setActiveTab(tab);
    }

    const [mbrDetail, setMbrDetail] = useState();
    const [mbrDetailVisible, setMbrDetailVisible] = useState(false);

    const mbrDetailModalOpenHandler = (target) => {
        setMbrDetail(target);
        setMbrDetailVisible(true)
    }

    const mbrDetailModalCloseHandler = () => {
        setMbrDetailVisible(false);
    }


    /***************************************************************************
     * util handler
     ***************************************************************************/

    /**
     * 검색 필수조건 입력 여부 검증 handler
     * @returns {boolean}
     */
    const validateSearchConditionHandler = () => {
        return !(searchForm.searchStrDt && searchForm.searchEndDt && (searchForm.oneLvlBrdnBuclCd || searchForm.twoLvlBrdnBuclCd || searchForm.threeLvlBrdnBuclCd));
    }

    const isDiff = (target, diffTarget) => {
        return target !== diffTarget;
    }


    return (
        <Spin spinning={assignLoading || reAssignLoading} tip={
            <span>
                분석 및 배정중입니다.
                <br/>분석 대상의 양에 따라 시간이 소요됩니다.
            </span>
        }>
            <div className="grid-col-5 gap-16 items-center mb-8">
                <div className="col-span-2"><h4>사업 공고</h4></div>
                <div className="col-span-3 flex-row items-center">
                    <h4>분과 선택</h4>

                    {
                        selectedAncmId && cmitList && cmitList.length > 0 &&
                        <button type={"button"} className={"btn-primary-32 ml-auto"}
                                onClick={() => modalOpenHandler(true, ASSIGN_TYPE.RE_ASSIGN)}>재배정</button>
                    }

                </div>
            </div>

            <div className="grid-col-5 gap-16">
                <div className="grid-left col-span-2 p-0 overflow-visible">
                    <div className="p-16 flex-col gap-16">
                        <div className="ant-datepicker">
                            <RangePicker locale={locale} onChange={dateChangeHandler}
                                         value={[searchForm.searchStrDt ? moment(searchForm.searchStrDt) : null, searchForm.searchEndDt ? moment(searchForm.searchEndDt) : null]}/>
                        </div>
                        <div className="grid-col-5 gap-16">
                            <div className="form-label-text">세부사업</div>
                            <Select className={"col-span-4"} onChange={oneLevelChangeHandler}
                                    value={searchForm.oneLvlBrdnBuclCd} placeholder={"선택해주세요"}>
                                {
                                    brdnOnelvlList && brdnOnelvlList.map((item, idx) =>
                                        (
                                            <Select.Option key={idx} value={item.key}>
                                                {item.value}
                                            </Select.Option>
                                        )
                                    )
                                }
                            </Select>

                        </div>
                        <div className="grid-col-5 gap-16">
                            <div className="form-label-text">내역사업</div>

                            <Select className={"col-span-4"} onChange={twoLevelChangeHandler}
                                    value={searchForm.twoLvlBrdnBuclCd} placeholder={"선택해주세요"}>
                                {
                                    brdnTwolvlList && brdnTwolvlList.map((item, idx) =>
                                        (
                                            <Select.Option key={idx} value={item.key}>
                                                {item.value}
                                            </Select.Option>
                                        )
                                    )
                                }
                            </Select>


                        </div>
                        <div className="grid-col-5 gap-16">
                            <div className="form-label-text">내내역사업</div>

                            <Select className={"col-span-4"} onChange={threeLevelChangeHandler}
                                    value={searchForm.threeLvlBrdnBuclCd} placeholder={"선택해주세요"}>
                                {
                                    brdnThreelvlList && brdnThreelvlList.map((item, idx) =>
                                        (
                                            <Select.Option key={idx} value={item.key}>
                                                {item.value}
                                            </Select.Option>
                                        )
                                    )
                                }
                            </Select>

                        </div>
                        <button type="button" className="btn-secondary-48 w-full mt-8"
                                disabled={validateSearchConditionHandler()} onClick={searchAncmListHandler}>조회하기
                        </button>
                    </div>
                    <AncmArea loading={ancmLoading} ancmList={ancmList} selectedAncmId={selectedAncmId}
                              ancmRowClickHandler={ancmRowClickHandler}/>
                </div>

                <div className="grid-right col-span-3 p-0">
                    <CmitArea selectedAncmId={selectedAncmId} selectedCmitId={selectedCmit && selectedCmit.cmitId}
                              cmitList={cmitList} loading={cmitLoading}
                              modalOpenHandler={modalOpenHandler} cmitRowClickHandler={cmitRowClickHandler}/>


                    <EvaluatorResultArea loading={cmitDetailLoading} activeTab={activeTab}
                                         tabChangeHandler={tabChangeHandler}
                                         cmitDetail={cmitDetail} mbrDetailModalOpenHandler={mbrDetailModalOpenHandler}/>


                </div>
            </div>

            {evalCondition &&
            <AutoAssignModal evalCondition={evalCondition} autoAssignHandler={autoAssignHandler}
                             modalCloseHandler={modalCloseHandler}
                             modalVisible={modalVisible}/>
            }

            {mbrDetail &&
            <MbrDetailModal cmitDetail={selectedCmit} mbrDetail={mbrDetail} modalVisible={mbrDetailVisible}
                            modalCloseHandler={mbrDetailModalCloseHandler}/>
            }

        </Spin>
    );
};

export default Evaluator;