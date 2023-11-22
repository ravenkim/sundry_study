import React from 'react';
import {Spin} from "antd";
import {ASSIGN_TYPE} from "Constants";
import moment from "moment";

/**
 * 분과 영역
 * @param loading
 * @param selectedAncmId
 * @param selectedCmitId
 * @param cmitList
 * @param modalOpenHandler
 * @param cmitRowClickHandler
 * @returns {JSX.Element}
 * @constructor
 */
const CmitArea = ({loading, selectedAncmId, selectedCmitId, cmitList, modalOpenHandler, cmitRowClickHandler}) => {


        return (
            <Spin spinning={loading}>
                {selectedAncmId ?
                    cmitList && cmitList.length > 0 ?
                        <div className="table-wrap" style={{height: "264px"}}>
                            <table className="striped">
                                <colgroup>
                                    <col width="10%"/>
                                    <col width="30%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th className="text-center">No</th>
                                    <th className="text-center">분과명</th>
                                    <th className="text-center">과제수</th>
                                    <th className="text-center">평가위원 수</th>
                                    <th  className="text-center">생성일</th>
                                </tr>
                                </thead>
                                <tbody id="tbody-for2" className="tbody">
                                {
                                    cmitList.map((item, idx)=>(
                                        <tr className={selectedCmitId === item.cmitId ? "bg-light-blue" : ""} style={{cursor: "pointer"}} key={idx}
                                            onClick={() => cmitRowClickHandler(item)}
                                        >

                                            <td className="text-center">{idx+1}</td>
                                            <td>{item.cmitNm}</td>
                                            <td className="text-center">{item.sbjtCnt}</td>
                                            <td className="text-center">{item.mbrCnt}</td>
                                            <td className="text-center">
                                                {
                                                    moment(item.frstRegDt).format("YYYY-MM-DD")
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }

                                </tbody>
                            </table>
                        </div>
                        :
                        <div className="frame-cont" style={{height: "270px"}}>
                            <div className="flex-col items-center">
                            <span className={"mdi mdi-playlist-check text-primary mb-24"}
                                  style={{fontSize: "60px"}}></span>
                                <p className="text-14-m text-gray-400">자동배정 진행 시, 선택한 구성 조건에 맞게</p>
                                <p className="text-14-m text-gray-400"><strong>분과가 생성</strong>되며 <strong>평가위원이
                                    배정</strong>됩니다.
                                </p>
                                <button type={"button"} className={"btn-primary-48 w-full mt-8"}
                                        disabled={cmitList && cmitList.length > 0}
                                        onClick={()=>modalOpenHandler(true, ASSIGN_TYPE.ASSIGN)}
                                >자동배정
                                </button>
                            </div>
                        </div>


                    :
                    <div className="frame-cont" style={{height: "270px"}}>
                        <div className="flex-col items-center">
                            <span className={"mdi mdi-playlist-check text-primary mb-24"} style={{fontSize: "60px"}}></span>
                            <p className="text-14-m text-gray-400">사업공고를 선택해주세요</p>
                        </div>
                    </div>
                }
            </Spin>
        );
    }
;

export default CmitArea;