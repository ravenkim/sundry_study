import React from 'react';
import {Progress, Spin} from "antd";

const EvalResultSmr = ({evalResult, sbjtPreEvalList, sbjtPreEvalListLoading}) => {

  return (
    <div className="grid-left col-span-2 p-16">
      <h5 className="mb-16">평가 결과 요약</h5>
      <Spin spinning={sbjtPreEvalListLoading}>
            {
              sbjtPreEvalList?.sbjtId ?
                <>
                <table className="table-info">
                  <tbody>
                    <tr>
                      <th></th>
                      <th className="text-center">분과 평균</th>
                      <th className="text-14-m text-center">수행기관</th>
                      <th className="text-center">수행기관 수준</th>
                    </tr>
                    <tr>
                      <th>기업 역량</th>
                      <td className="text-center"> {Math.round(sbjtPreEvalList?.coAvgInBsns)}</td>
                      <td className="text-16-m text-center"> {Math.round(sbjtPreEvalList?.coOrgn)}</td>
                      <td className="text-center"> {Math.round(sbjtPreEvalList?.coOrgnLvl)}</td>
                    </tr>
                    <tr>
                      <th>기술 역량</th>
                      <td className="text-center"> {Math.round(sbjtPreEvalList?.teAvgInBsns)}</td>
                      <td className="text-16-m text-center"> {Math.round(sbjtPreEvalList?.teOrgn)}</td>
                      <td className="text-center"> {Math.round(sbjtPreEvalList?.teOrgnLvl)}</td>
                    </tr>
                    <tr>
                      <th>사업화 역량</th>
                      <td className="text-center"> {Math.round(sbjtPreEvalList?.bsAvgInBsns)}</td>
                      <td className="text-16-m text-center"> {Math.round(sbjtPreEvalList?.bsOrgn)}</td>
                      <td className="text-center"> {Math.round(sbjtPreEvalList?.bsOrgnLvl)}</td>
                    </tr>
                    <tr>
                      <th>평점</th>
                      <td className="text-center"> {Math.round(sbjtPreEvalList?.aAvgInBsns)}</td>
                      <td className="text-16-m text-center"> {Math.round(sbjtPreEvalList?.aOrgn)}</td>
                      <td className="text-center"> {Math.round(sbjtPreEvalList?.aOrgnLvl)}</td>
                    </tr>
                    <tr>
                      <th>판정</th>
                      <td colSpan="3">
                        <Progress percent={Math.round(sbjtPreEvalList?.judge)} status="normal"/>
                      </td>
                    </tr>
                  </tbody>
                </table>

              <p className="text-14-m text-gray-600 mt-40 mb-8">판정 고려사항</p>
              <div className="frame p-16 overflow-auto" style={{maxHeight: "calc(100vh - 795px)"}}>
                <p className="ol text-gray-400">{sbjtPreEvalList?.judgeContents}</p>
              </div>
                </>
                :
              <div className="frame-cont bg-white" style={{height: "calc(100vh - 494px)"}}>
                <div className="flex-col items-center">
                  <span className="mdi mdi-table-multiple text-primary mb-24" style={{fontSize: "40px"}}/>
                    <p className="text-14-m text-gray-400">
                      {
                        sbjtPreEvalList === null ?
                          '예비평가 조회 후 확인할 수 있습니다.'
                          :
                          '조회된 내용이 없습니다.'
                      }
                    </p>
                </div>
              </div>

            }

      </Spin>
    </div>
  )
};

export default EvalResultSmr;