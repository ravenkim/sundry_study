import React, {useEffect, useState} from 'react';

const ReqrSrchItems = (
  {
    visible=false,
    sbjtSmrData,
  }
) => {

  const [formData, setFormData] = useState({orgnData: [], bsnData: []});
  const orgnDataNum = [1,6,7]
  const bsnTypeNum = [8,9,10]
  const selectBoxDataSet = {
    iur: 31,
    sbjtPtcpStts: 20,
    cmrStg: 48,
    tlc: 47
  };
  const sliderDataSet = {
    pstTchIdp: 11,
    aftTchIdp: 12,
    pstTchLv: 15,
    aftTchLv: 16,
    roi: 17,
    sales: 24,
    exports: 28,
    oprtPrft: 30,
    oldNum: 36,
    ythNum: 37,
    empNum: 39,
    rvnRpc: 57,
    rdcPdtCst: 58,
  };
  const inputDataSet = {
    ptcpNum: 51,
    mstNum: 52,
    bchNum: 53,
    ptnAppl: 54,
    ptnReg: 55,
    pstPerf: 49,
    aftPerf: 50,
  };

  useEffect(() => {
    if (sbjtSmrData && Object.keys(sbjtSmrData).includes('crntData')) {
      setFormData({orgnData: [], bsnData: []})
      sbjtSmrData.crntData.map((orgn) => {
        const dataHandler = (set, name) => {
          const keys = Object.keys(set);
          keys.map((key) => {
            if (set[key] === orgn['VAR_ID']) {
              setFormData((prevState) => ({
                ...prevState,
                [key]: set === sliderDataSet ? (Number(orgn[name].split('_')[1]) - 1) * 10 : orgn[name]
              }))
            }
          })
        };

        if (orgnDataNum.includes(orgn['VAR_ID']) && orgn['CD_NM'] === '보유') {
          const crntKeys = Object.keys(formData);
          setFormData((prevState) => ({
            ...prevState,
            orgnData: crntKeys.includes('orgnData') ? [...prevState.orgnData, orgn['VAR_NM']] : [orgn['VAR_NM']]
          }))
        }
        if (bsnTypeNum.includes(orgn['VAR_ID']) && orgn['CD_NM'] === '보유') {
          const crntKeys = Object.keys(formData);
          setFormData((prevState) => ({
            ...prevState,
            bsnData: crntKeys.includes('bsnData') ? [...prevState.bsnData, orgn['VAR_NM']] : [orgn['VAR_NM']]
          }))
        }
        dataHandler(inputDataSet, 'VAR_DTL_VAL')
        dataHandler(selectBoxDataSet, 'CD_NM')
        dataHandler(sliderDataSet, 'CD_NM')
      });
    } else {
      setFormData({orgnData: [], bsnData: []})
    }
  },[sbjtSmrData])

  return (
    <>
      {!visible ?
        <div className="frame-cont bg-white" style={{height: "calc(100vh - 437px)"}}>
          <div className="flex-col gap-16 items-center">
            <p className="text-14-m text-gray-400">업체 조회 후 확인할 수 있습니다.</p>
          </div>
        </div>
        :
        <div className="p-16 overflow-auto" style={{height: "calc(100vh - 397px)"}}>
          <div className="grid-col-2">
            <div className="border-right-200 pr-24">
              <h5 className="font-bold-500 mb-8">기관 요약</h5>
              <table className="table-info mb-16">
                <colgroup>
                  <col width="40%"/>
                    <col width="60%"/>
                </colgroup>
                <tbody>
                  <tr>
                    <th>기관구성</th>
                    <td>{formData && formData.orgnData.map((data) => data + " ")}</td>
                  </tr>
                  <tr>
                    <th>사업유형</th>
                    <td>{formData && formData.bsnData.map((data) => data + " ")}</td>
                  </tr>
                  <tr>
                    <th>과제 참여형태</th>
                    <td>{formData && formData.sbjtPtcpStts}</td>
                  </tr>
                  <tr>
                    <th>융복합 신학연</th>
                    <td>{formData && formData.iur}</td>
                  </tr>
                  <tr>
                    <th>사업화 단계</th>
                    <td>{formData && formData.cmrStg}</td>
                  </tr>
                </tbody>
              </table>
              <h5 className="font-bold-500 mb-8">기술 요약</h5>
              <table className="table-info">
                <colgroup>
                  <col width="40%"/>
                    <col width="41%"/>
                      <col width="19%"/>
                </colgroup>
                <tbody>
                  <tr>
                    <th>기술수명주기</th>
                    <td colSpan="2" className="text-center">{formData && formData.tlc ? formData.tlc + ' / ' + formData.pstTchLv + ' / ' + formData.aftTchLv : ""}</td>
                  </tr>
                  <tr>
                    <th>기술수준 (수행 전) (%)</th>
                    <td colSpan="2" className="text-right">{formData && formData.pstTchLv}{formData.pstTchLv && '%'}</td>
                  </tr>
                  <tr>
                    <th>기술수준 (수행 후) (%)</th>
                    <td colSpan="2" className="text-right">{formData && formData.aftTchLv}{formData.aftTchLv && '%'}</td>
                  </tr>
                  <tr>
                    <th>기술자립도 (수행 전) (%)</th>
                    <td colSpan="2" className="text-right">{formData && formData.pstTchIdp}{formData.pstTchIdp && '%'}</td>
                  </tr>
                  <tr>
                    <th>기술자립도 (수행 후) (%)</th>
                    <td colSpan="2" className="text-right">{formData && formData.aftTchIdp}{formData.aftTchIdp && '%'}</td>
                  </tr>
                  <tr>
                    <th rowSpan="2">성능지표</th>
                    <th>제품성능지표 (현재) (%)</th>
                    <td className="text-right">{formData && formData.pstPerf}{formData.pstPerf && '%'}</td>
                  </tr>
                  <tr>
                    <th>제품성능지표 (목표) (%)</th>
                    <td className="text-right">{formData && formData.aftPerf}{formData.aftPerf && '%'}</td>
                  </tr>
                  <tr>
                    <th rowSpan="2">R&D 성과 (연간등록)</th>
                    <th>특허 출원 (건)</th>
                    <td className="text-right">{formData && formData.ptnAppl}{formData.ptnAppl && '건'}</td>
                  </tr>
                  <tr>
                    <th>특허 등록 (건)</th>
                    <td className="text-right">{formData && formData.ptnReg}{formData.ptnReg && '건'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pl-24">
              <h5 className="font-bold-500 mb-8">인력 구성</h5>
              <table className="table-info mb-8">
                <colgroup>
                  <col width="40%"/>
                    <col width="60%"/>
                </colgroup>
                <tbody>
                  <tr>
                    <th>총 종업원 수 (명)</th>
                    <td className="text-right">{formData && isNaN((formData.empNum-50)*2) ? '' : (formData.empNum-50)*2 +'%'}</td>
                  </tr>
                </tbody>
              </table>
              <table className="table-info mb-8">
                <colgroup>
                  <col width="40%"/>
                    <col width="60%"/>
                </colgroup>
                <tbody>
                  <tr>
                    <th>참여연구원</th>
                    <td className="text-right">{formData && formData.ptcpNum}</td>
                  </tr>
                  <tr>
                    <th>석사급이상</th>
                    <td className="text-right">{formData && formData.mstNum}</td>
                  </tr>
                  <tr>
                    <th>학사급</th>
                    <td className="text-right">{formData && formData.bchNum}</td>
                  </tr>
              </tbody>
              </table>
              <table className="table-info mb-16">
                <colgroup>
                  <col width="40%"/>
                    <col width="30%"/>
                      <col width="30%"/>
                </colgroup>
                <tbody>
                  <tr>
                    <th rowSpan="2">예상 신규고용</th>
                    <th>청년인력 (%)</th>
                    <td className="text-right">{formData && isNaN((formData.ythNum-50)*2) ? '' : (formData.ythNum-50)*2 +'%'}</td>
                  </tr>
                  <tr>
                    <th>청년외 인력 (%)</th>
                    <td className="text-right">{formData && isNaN((formData.oldNum-50)*2) ? '' : (formData.oldNum-50)*2 +'%'}</td>
                  </tr>
                </tbody>
              </table>
              <h5 className="font-bold-500 mb-8">사업성 요약</h5>
              <table className="table-info">
                <colgroup>
                  <col width="40%"/>
                    <col width="60%"/>
                </colgroup>
                <tbody>
                  <tr>
                    <th>
                      <span className="flex-row items-center">매출액 예상 증감 (%)
                      </span>
                    </th>
                    <td className="text-right">{formData && isNaN(formData.sales*2) ? '' : formData.sales*2 +'%'}</td>
                  </tr>
                  <tr>
                    <th>
                      <span className="flex-row items-center">수출액 예상 증감 (%)
                      </span>
                    </th>
                    <td className="text-right">{formData && isNaN((formData.exports-50)*2) ? '' : (formData.exports-50)*2 +'%'}</td>
                  </tr>
                  <tr>
                    <th>
                      <span className="flex-row items-start">영업이익 예상 증감 (%)
                      </span>
                    </th>
                    <td className="text-right">{formData && isNaN((formData.oprtPrft-50)*2) ? '' : (formData.oprtPrft-50)*2 +'%'}</td>
                  </tr>
                  <tr>
                    <th>
                      <span className="flex-row items-start">투자회수율 (ROI)예상 (%)
                      </span>
                    </th>
                    <td className="text-right">{formData && isNaN(formData.roi*2) ? '' : formData.roi*2 +'%'}</td>
                  </tr>
                  <tr>
                    <th>
                      <span className="flex-row items-start">생산비용절감 예상 (%)
                      </span>
                    </th>
                    <td className="text-right">{formData && isNaN((formData.rdcPdtCst-50)*2) ? '' : (formData.rdcPdtCst-50)*2 +'%'}</td>
                  </tr>
                  <tr>
                    <th>
                      <span className="flex-row items-start">수입대체 예상 (%)
                      </span>
                    </th>
                    <td className="text-right">{formData && isNaN((formData.rvnRpc-50)*2) ? '' : (formData.rvnRpc-50)*2 +'%'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    </>
  )
};

export default ReqrSrchItems;