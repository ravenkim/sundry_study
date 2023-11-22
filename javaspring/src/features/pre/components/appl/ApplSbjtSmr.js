import React, {useEffect} from 'react';
import { Select, Spin } from "antd";
import moment from "moment";
const { Option } = Select;

const ApplSbjtSmr = (
  {
    visible=false,
    selectedSubject,
    selectSubjectHandler,
    sbjtList,
    loading,
    sbjtSmrData,
  }
) => {

  const convertMoneyAmountFormat = (item) => {
    return item ? item.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') : 0
  };

  return (
    <Spin spinning={loading}>
      {!visible ?
        <div className="frame-cont bg-white" style={{height: "264px"}}>
          <div className="flex-col items-center">
            <span className="mdi mdi-playlist-check text-primary mb-24" style={{fontSize: "60px"}}/>
            <p className="text-14-m text-gray-400">업체를 조회하시면 <strong>신청과제 및 역량 정보</strong>를 확인할 수 있습니다.</p>
          </div>
        </div>
        :
        <div className="p-16 pb-8" style={{height: "230px"}}>
          <div className="grid-col-6 gap-16 mb-8">
            <div className="form-label-text">과제명</div>
            <Select
              className={'col-span-5'}
              value={selectedSubject}
              onChange={(value) => selectSubjectHandler(value)}
              notFoundContent={'해당 기관이 수행한 과제가 없습니다.'}
            >
              {sbjtList && sbjtList.map((sbjt) =>
                <Option key={sbjt.sbjtId} value={sbjt.sbjtId}>
                  {sbjt.sbjtNm} (개발기간 : {moment(sbjt.totDvlpSrtYmd).format("YYYY-MM-DD")} ~ {moment(sbjt.totDvlpEndYmd).format("YYYY-MM-DD")})
                </Option>)}
            </Select>
          </div>


          <div className="grid-col-6 gap-16 items-start">
            {/*// <!-- 1. 과제신청일 테이블 -->*/}
            <table className="table-info">
              <tbody>
                <tr>
                  <th>과제신청일</th>
                </tr>
                <tr>
                  <td>{Object.keys(sbjtSmrData).includes('regDt') && sbjtSmrData.regDt ? moment(sbjtSmrData.regDt).format("YYYY-MM-DD") : '-'}</td>
                </tr>
              </tbody>
            </table>

            <div className="col-span-5">
              {/*// <!-- 2. 분류(ITC) 테이블 -->*/}
              <table className="table-info">
                <colgroup>
                  <col width="20%" />
                  <col width="30%" />
                  <col width="25%" />
                  <col width="25%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>부처기술분류(ITC)</th>
                    {sbjtSmrData && Object.keys(sbjtSmrData).includes('itc') ?
                      sbjtSmrData.itc.map((data, index) => {
                        return (
                          <td key={index}>{`${index+1}분류 : ${data ? data : ''}`}</td>
                        )
                      })
                      :
                      <>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                      </>
                    }
                  </tr>
                </tbody>
              </table>
              <div className="grid-col-2 gap-16 mt-8">
                {/*// <!-- 3. 사업기간/연차 테이블 -->*/}
                <table className="table-info">
                  <colgroup>
                    <col width="20%" />
                    <col width="80%" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th colSpan="2">사업기간</th>
                    </tr>
                    <tr>
                      <td colSpan="2">{Object.keys(sbjtSmrData).includes('strDt')  && sbjtSmrData.strDt?
                        `${moment(sbjtSmrData.strDt).format("YYYY-MM-DD")} ~ ${moment(sbjtSmrData.endDt).format("YYYY-MM-DD")}` : '-'}</td>
                    </tr>
                    <tr>
                      <th>연차</th>
                      <td>{Object.keys(sbjtSmrData).includes('annu') && sbjtSmrData.annu ? `${sbjtSmrData.annu}년차` : '-'}</td>
                    </tr>
                  </tbody>
                </table>
                {/*// <!-- 4. 정부지원/기관부담/총연구개발비 테이블 -->*/}
                <table className="table-info">
                  <tbody>
                    <tr>
                      <th>정부지원</th>
                      <td className="text-right">{Object.keys(sbjtSmrData).includes('govCost') ? convertMoneyAmountFormat(sbjtSmrData.govCost) : ''}</td>
                    </tr>
                    <tr>
                      <th>기관부담</th>
                      <td className="text-right">{Object.keys(sbjtSmrData).includes('orgnCost') ? convertMoneyAmountFormat(sbjtSmrData.orgnCost) : ''}</td>
                    </tr>
                    <tr>
                      <th>총연구개발비</th>
                      <td className="text-right">{Object.keys(sbjtSmrData).includes('totalCost') ? convertMoneyAmountFormat(sbjtSmrData.totalCost) : ''}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        // <!-- 신청과제 요약 (윗쪽) -->
      }
    </Spin>
  )
};

export default ApplSbjtSmr;