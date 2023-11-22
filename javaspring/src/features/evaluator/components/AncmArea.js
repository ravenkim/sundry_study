import React from 'react';
import {Spin, Tooltip} from "antd";
import moment from "moment";

/**
 * 사업공고 영역
 * @param loading
 * @param ancmList
 * @param selectedAncmId
 * @param ancmRowClickHandler
 * @returns {JSX.Element}
 * @constructor
 */
const AncmArea = ({loading, ancmList, selectedAncmId, ancmRowClickHandler}) => {
    return (
        <Spin spinning={loading}>
            {
                ancmList && ancmList.length > 0 ?

                    <div className="table-wrap" style={{height: "calc(100vh - 439px)"}}>
                        <table className="striped">
                            <colgroup>
                                <col width="5%"/>
                                <col width="60%"/>
                                <col width="15%"/>
                                <col width="10%"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th className="text-center">No</th>
                                <th className="text-center">사업공고</th>
                                <th className="text-center">공고일</th>
                                <th className="text-center">과제수</th>
                            </tr>
                            </thead>
                            <tbody id="tbody">
                            {ancmList.map((item, idx) =>
                                <tr className={selectedAncmId === item.ancmId ? "bg-light-blue" : ""}
                                    key={idx} onClick={() => ancmRowClickHandler(item.ancmId)}
                                    style={{cursor: "pointer"}}>
                                    <td className="text-center">{idx + 1}</td>
                                    <td>
                                        <Tooltip title={item.ancmTlNm}>
                                            {item.ancmTlNm}
                                        </Tooltip>
                                    </td>
                                    <td className="text-center"> {moment(item.ancmYmd).format('YYYY-MM-DD')}</td>
                                    <td className="text-center">{item.sbjtCnt}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    :
                    <div className="frame-cont-bottom-r" style={{height: "calc(100vh - 433px)"}}>
                        <div className="flex-col gap-16 items-center">
                                        <span className="mdi mdi-magnify text-primary"
                                              style={{fontSize: "50px"}}></span>
                            <p className="text-14-m text-gray-400">공고 조회 후 확인할 수 있습니다.</p>
                        </div>
                    </div>
            }
        </Spin>
    );
};

export default AncmArea;