import React from 'react';
import moment from "moment";
import {Tooltip} from "antd";

const SubjectTab = ({sbjtList}) => {
    return (
        <div className="table-wrap" style={{height: "calc(100vh - 437px)"}}>
            <table className="striped">
                <colgroup>
                    <col width="7%"/>
                    <col width="35%"/>
                    <col width="20%"/>
                    <col width="8%"/>
                    <col width="15%"/>
                    <col width="15%"/>
                </colgroup>
                <thead>
                <tr>
                    <th className="text-center">No</th>
                    <th>과제명</th>
                    <th>기술분류(ITC)</th>
                    <th className="text-center">연차</th>
                    <th className="text-center">과제 시작일</th>
                    <th className="text-center">과제 종료일</th>
                </tr>
                </thead>
                <tbody id="tbody-for3" className="tbody">
                {
                    sbjtList.length > 0 && sbjtList.map((item, idx) => (
                        <tr key={idx}>
                            <td className="text-center">{idx + 1}</td>
                            <td>
                                <Tooltip title={item.source.sbjtNm} zIndex={10002}>
                                    {item.source.sbjtNm}
                                </Tooltip>
                            </td>
                            <td>
                                {
                                    item.source.pmsSbjtTechClsf && item.source.pmsSbjtTechClsf.length > 0 && item.source.pmsSbjtTechClsf.map((item, idx) => (
                                        item.teclCdNm
                                    ))
                                }
                            </td>
                            <td className="text-center">
                                {item.source.sbjtAnnu}
                            </td>
                            <td className="text-center">
                                {moment(item.source.totDvlpSrtYmd).format("YYYY-MM-DD")}
                            </td>
                            <td className="text-center">
                                {moment(item.source.totDvlpEndYmd).format("YYYY-MM-DD")}
                            </td>
                        </tr>
                    ))

                }
                </tbody>
            </table>
        </div>
    );
};

export default SubjectTab;