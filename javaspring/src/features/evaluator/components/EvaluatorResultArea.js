import React, {useEffect, useState} from 'react';
import {ORDERING} from "Constants";
import {Spin, Tooltip} from "antd";
import MbrTab from "features/evaluator/components/tabs/MbrTab";
import SubjectTab from "features/evaluator/components/tabs/SubjectTab";
import CmitDetailTab from "features/evaluator/components/tabs/CmitDetailTab";

/**
 * 분과 결과영역 (평가위원, 대상과제 등)
 * @param loading
 * @param activeTab
 * @param tabChangeHandler
 * @param cmitDetail
 * @param mbrDetailModalOpenHandler
 * @returns {JSX.Element}
 * @constructor
 */
const EvaluatorResultTab = ({loading, activeTab, tabChangeHandler, cmitDetail, mbrDetailModalOpenHandler}) => {

        const [mbrList, setMbrList] = useState([]);
        const [sbjtList, setSbjtList] = useState([]);

        useEffect(() => {
            if (cmitDetail) {
                setMbrList(cmitDetail.mbrList);
                setSbjtList(cmitDetail.sbjtList);
            }
        }, [cmitDetail])

        const [orderData, setOrderData] = useState({
            itcFitness: ORDERING.DEFAULT,
            score: ORDERING.DEFAULT,
            csnSmrlty: ORDERING.DEFAULT,
            scssPcnt5y: ORDERING.DEFAULT,
            sbjtCnt1y: ORDERING.DEFAULT,
        })

        const sortingChangeHandler = (targetKey, sorting) => {
            setOrderData((prev) => ({
                ...prev,
                [targetKey]: sorting
            }))
        }

        useEffect(() => {
            if (mbrList && mbrList.length > 0) {
                if (orderData.score === ORDERING.DEFAULT && orderData.itcFitness === ORDERING.DEFAULT && orderData.csnSmrlty === ORDERING.DEFAULT && orderData.scssPcnt5y === ORDERING.DEFAULT && orderData.sbjtCnt1y === ORDERING.DEFAULT) {
                    setMbrList(cmitDetail.mbrList);
                } else {
                    let orderingList = JSON.parse(JSON.stringify(mbrList)).sort(
                        firstBy(function (v1, v2) {
                            if (orderData.score === ORDERING.ASC) {
                                return v1.score - v2.score;
                            } else if (orderData.score === ORDERING.DESC) {
                                return v2.score - v1.score;
                            }
                        })
                            .thenBy(function (v1, v2) {
                                if (orderData.itcFitness === ORDERING.ASC) {
                                    return v1.itcFitness - v2.itcFitness;
                                } else if (orderData.itcFitness === ORDERING.DESC) {
                                    return v2.itcFitness - v1.itcFitness;
                                }
                            })
                            .thenBy(function (v1, v2) {
                                if (orderData.csnSmrlty === ORDERING.ASC) {
                                    return v1.csnSmrlty - v2.csnSmrlty;
                                } else if (orderData.csnSmrlty === ORDERING.DESC) {
                                    return v2.csnSmrlty - v1.csnSmrlty;
                                }
                            })
                            .thenBy(function (v1, v2) {
                                if (orderData.scssPcnt5y === ORDERING.ASC) {
                                    return v1.source.scssPcnt5y - v2.source.scssPcnt5y;
                                } else if (orderData.scssPcnt5y === ORDERING.DESC) {
                                    return v2.source.scssPcnt5y - v1.source.scssPcnt5y;
                                }
                            })
                            .thenBy(function (v1, v2) {
                                if (orderData.sbjtCnt1y === ORDERING.ASC) {
                                    return v1.source.sbjtCnt1y - v2.source.sbjtCnt1y;
                                } else if (orderData.sbjtCnt1y === ORDERING.DESC) {
                                    return v2.source.sbjtCnt1y - v1.source.sbjtCnt1y;
                                }
                            })
                    );

                    setMbrList(orderingList);
                }
            }
        }, [orderData]);


        let firstBy = (function () {
            function extend(f) {
                f.thenBy = tb;
                return f;
            }

            function tb(y) {
                let x = this;
                return extend(function (a, b) {
                    return x(a, b) || y(a, b);
                });
            }

            return extend;
        })();

        return (
            <Spin spinning={loading}>
                <div className="tab-wrap">
                    <div className="tabs gap-8">
                        <a className={`section-tab plr-24 ${activeTab === "tab1" ? "active-section-tab" : ""}`}
                           onClick={() => tabChangeHandler("tab1")}>평가위원 <p>{mbrList.length}</p></a>
                        <a className={`section-tab plr-24 ${activeTab === "tab2" ? "active-section-tab" : ""}`}
                           onClick={() => tabChangeHandler("tab2")}>대상과제 <p>{sbjtList.length}</p></a>
                        {/*<a className={`section-tab plr-24 ${activeTab === "tab3" ? "active-section-tab" : ""}`}*/}
                        {/*   onClick={() => tabChangeHandler("tab3")}>분과 요약정보 </a>*/}
                    </div>
                </div>
                {
                    cmitDetail ?

                        activeTab === "tab1" ? (
                                <MbrTab orderData={orderData} mbrList={mbrList} sortingChangeHandler={sortingChangeHandler}
                                        mbrDetailModalOpenHandler={mbrDetailModalOpenHandler}/>
                            )
                            :
                            (
                                activeTab=== "tab2" ?
                                <SubjectTab sbjtList={sbjtList}/>
                                :
                                <CmitDetailTab/>
                            )

                        :

                        <div className="frame-cont" style={{height: "calc(100vh - 437px)"}}>
                            <div className="flex-col gap-16 items-center">
                                <div className="flex-row items-center">
                                    <span className="mdi mdi-account-outline text-primary"
                                          style={{fontSize: "40px"}}></span>
                                    <span className="mdi mdi-sticker-text-outline text-primary"
                                          style={{fontSize: "35px"}}></span>
                                </div>
                                <p className="text-14-m text-gray-400">분과를 선택하면 해당 평가위원과 대상과제 정보가 표출됩니다.</p>
                            </div>
                        </div>
                }

            </Spin>
        );
    }
;

export default EvaluatorResultTab;