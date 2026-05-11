import React, {useEffect, useState} from 'react';
import LimeModal from "features/common/modal/LimeModal";
import ConditionForm from "features/evaluator/components/forms/ConditionForm";
import {Select} from "antd";

const AutoAssignModal = ({evalCondition, modalCloseHandler, autoAssignHandler, modalVisible}) => {



    const [condForm, setCondForm] = useState({
        recoCond: null,
        subjectCnt: 0,
        evlMbrCnt: 0,
        sido: null,
        degCd: null,
        orgnType : null,
        sbjtCnt1y: 0,
        excldCnt1y: 0,

    });

    useEffect(() => {
        if (evalCondition) {

            if(evalCondition.recoCond && evalCondition.recoCond.length>0){
                let recoCond = evalCondition.recoCond[0]

                let excludeCond = recoCond.excludeCond

                setCondForm((prev) => ({
                    ...prev,
                    recoCond: recoCond.recoCondId,
                    subjectCnt : recoCond.subjectCnt,
                    evlMbrCnt: recoCond.evlMbrCnt,
                    degCd : excludeCond["cmcarrSchs.degCd"],
                    sido : excludeCond.sido,
                    orgnType : excludeCond.orgnType,
                    sbjtCnt1y : excludeCond.sbjtCnt1y,
                    excldCnt1y : excludeCond.excldCnt1y,
                }))

            }


        }
    }, [evalCondition])

    useEffect(()=>{
        if(!modalVisible && condForm.recoCond){
            recCondChangeHandler(condForm.recoCond);
        }
    },[modalVisible])

    const recCondChangeHandler = (value) => {

        let index = evalCondition.recoCond.findIndex((item)=>item.recoCondId===value);

        let targetCond = evalCondition.recoCond[index]

        setCondForm((prev)=>({
            ...prev,
            recoCond: targetCond.recoCondId,
            subjectCnt : targetCond.subjectCnt,
            evlMbrCnt: targetCond.evlMbrCnt,
            sido : targetCond.excludeCond.sido,
            orgnType: targetCond.excludeCond.orgnType,
            sbjtCnt1y : targetCond.excludeCond.sbjtCnt1y,
            excldCnt1y : targetCond.excludeCond.excldCnt1y,
        }))

    }

    const assignClickHandler = () => {
        autoAssignHandler(condForm);
    }


    return (
        <LimeModal title={"자동배정"} titleClassName={"mb-8"} visible={modalVisible}
                   closeHandler={modalCloseHandler} closable={true} style={{maxHeight: "100%"}}>
            <div className="banner bg-gray-100 mb-32">
                <span className="mdi mdi-help-circle text-primary text-icon-20"></span>
                <p className="text-14-m">선택한 조건에 맞게 <strong>분과가 생성</strong>되며,
                    <strong>평가위원이 배정</strong>됩니다.</p>
            </div>
            <div style={{maxHeight: "calc(100vh - 526px)", overflow: "auto"}}>
                <div className="form-label-text mb-8">구성 조건<p>(필수)</p></div>
                <Select onChange={recCondChangeHandler} style={{width: "100%"}} value={condForm.recoCond}>
                    {
                        evalCondition.recoCond && evalCondition.recoCond.length > 0 && evalCondition.recoCond.map((item, idx) => (
                            <Select.Option value={item.recoCondId} key={idx}>
                                {item.recoCondNm}
                            </Select.Option>
                        ))
                    }
                </Select>
                <ConditionForm searchForm={condForm} setSearchForm={setCondForm} areaList={evalCondition.sido} orgnTypeList={evalCondition.orgnType}
                    degList={evalCondition.deg}
                />
            </div>
            <div className="modal-btn-2 mt-32">
                <button type="button" className="btn-tertiary-48" onClick={modalCloseHandler}>닫기</button>
                <button type="button" className="btn-primary-48 flex-1" onClick={assignClickHandler}>생성 및 배정하기</button>
            </div>

        </LimeModal>
    );
};

export default AutoAssignModal;