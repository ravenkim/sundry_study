import React from 'react';

const Company = ({orgnList, getPemCommCd, orgn_cd, slider_value}) => {

  return (
    <div className="p-16 overflow-auto border-box" style={{height: "calc(100vh - 469px)"}}>
      <div className="text-14-m mb-8">기관역량 요약</div>

      <table className="table-info mb-16">
        <colgroup>
          <col width="20%"/>
          <col width="80%"/>
        </colgroup>
        <tr>
          <th>기관구성</th>
          <td>
            <div className="yebi-row">
              <div className={`yebi-col-3 ${orgn_cd(1).VAR_ITEM_VARI_VAL == "1" ? 'yebi-check' : '' }`}><span>{orgn_cd(1).VAR_NM}</span></div>
              <div className={`yebi-col-3 ${orgn_cd(6).VAR_ITEM_VARI_VAL == "1" ? 'yebi-check' : '' }`}><span>{orgn_cd(6).VAR_NM}</span></div>
              <div className={`yebi-col-3 ${orgn_cd(7).VAR_ITEM_VARI_VAL == "1" ? 'yebi-check' : '' }`}><span>{orgn_cd(7).VAR_NM}</span></div>
            </div>
          </td>
        </tr>
        <tr>
          <th>사업유형</th>
          <td>
            <div className="yebi-row">
              <div className={`yebi-col-3 ${orgn_cd(8).VAR_ITEM_VARI_VAL == "1" ? 'yebi-check' : '' }`}><span>{orgn_cd(8).VAR_NM}</span></div>
              <div className={`yebi-col-3 ${orgn_cd(9).VAR_ITEM_VARI_VAL == "1" ? 'yebi-check' : '' }`}><span>{orgn_cd(9).VAR_NM}</span></div>
              <div className={`yebi-col-3 ${orgn_cd(10).VAR_ITEM_VARI_VAL == "1" ? 'yebi-check' : '' }`}><span>{orgn_cd(10).VAR_NM}</span></div>
            </div>
          </td>
        </tr>
        <tr>
          <th>과제 참여형태</th>
          <td>
            <div className="yebi-row">
              {getPemCommCd.filter(function (el) {
                return el['hiCommCd'] == 'PT1000'
              }).map((item, index) => (
                <div key={index} className={`yebi-col-3 ${item.val == orgn_cd(20).VAR_ITEM_VARI_VAL ? 'yebi-check' : '' }`}><span>{item.cdNm}</span></div>
              ))
              }
            </div>
          </td>
        </tr>
        <tr>
          <th>융복합 산학연구분</th>
          <td>
            <div className="yebi-row">
              {getPemCommCd.filter(function (el) {
                return el['hiCommCd'] == 'IU1000' && el['val'] != '1'
              }).map((item, index) => (
                <div key={index} className={`yebi-col-3 ${item.val == orgn_cd(31).VAR_ITEM_VARI_VAL ? 'yebi-check' : '' }`}><span>{item.cdNm}</span></div>
              ))
              }
            </div>
          </td>
        </tr>
        <tr>
          <th>사업화 단계</th>
          <td>
            <div className="yebi-row">
              {getPemCommCd.filter(function (el) {
                return el['hiCommCd'] == 'ST1000'
              }).map((item, index) => (
                <div key={index} className={`yebi-col-3 ${item.val == orgn_cd(48).VAR_ITEM_VARI_VAL ? 'yebi-check' : '' }`}><span>{item.cdNm}</span></div>
              ))
              }
            </div>
          </td>
        </tr>
      </table>

      <div className="grid-col-2 gap-16">
        <div>
          <div className="text-14-m mb-8">기관 인력구성</div>

          <table className="table-info">
            <colgroup>
              <col width="40%"/>
              <col width="60%"/>
            </colgroup>
            <tr>
              <th>총 종업원 수 (명)</th>
              <td className="text-center">{slider_value(-1,1,orgn_cd(39).VAR_ITEM_VARI_VAL)+'%'}</td>
            </tr>
            <tr>
              <th>참여연구원 (명)</th>
              <td className="text-center">{orgn_cd(51) ? orgn_cd(51).VAR_DTL_VAL+'명' : ''}</td>
            </tr>
            <tr>
              <th>석사급이상 (명)</th>
              <td className="text-center">{orgn_cd(52) ? orgn_cd(52).VAR_DTL_VAL+'명' : ''}</td>
            </tr>
            <tr>
              <th>학사급 (명)</th>
              <td className="text-center">{orgn_cd(53) ? orgn_cd(53).VAR_DTL_VAL+'명' : ''}</td>
            </tr>
          </table>
        </div>
        <div>
          <div className="text-14-m mb-8">예상신규고용</div>
          <table className="table-info">
            <colgroup>
              <col width="40%"/>
              <col width="60%"/>
            </colgroup>
            <tr>
              <th>청년인력 (%)</th>
              <td className="text-center">{slider_value(-1,1,orgn_cd(37).VAR_ITEM_VARI_VAL)*100+'%'}</td>
            </tr>
            <tr>
              <th>청년외 인력 (%)</th>
              <td className="text-center">{slider_value(-1,1,orgn_cd(36).VAR_ITEM_VARI_VAL)*100+'%'}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  )
};

export default Company;