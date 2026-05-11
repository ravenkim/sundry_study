import React, {useEffect, useState} from 'react';
import {Spin, Tooltip} from "antd";
import LimeSortingLabel from "../../../common/tool/sorting/LimeSortingLabel";
import {ORDERING} from "../../../../Constants";

const PreAnalSmr = (
  {
    modalVisibleHandler,
    getSbjtPreEvalPopup,
    getSbjtPreEvalPopupLoading
  }
) => {

  const retVal = getSbjtPreEvalPopup
  const [cmitDetailList, setCmitDetailList] = useState([]);
  const [orderData, setOrderData] = useState({
    //orgnNm: ORDERING.DEFAULT,
    cmitRank: ORDERING.DEFAULT,
    ancmRank: ORDERING.DEFAULT,
  })

  const sortingChangeHandler = (targetKey, sorting) => {
    setOrderData((prev) => ({
      ...prev,
      [targetKey]: sorting
    }))
  }

  useEffect(() => {
    if (retVal) {
      setCmitDetailList(retVal);
    }
  }, [retVal])

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

  useEffect(() => {
    if (retVal && retVal.length > 0) {
      // if (orderData.orgnNm === ORDERING.DEFAULT) {
      //   setCmitDetailList(retVal);
      //   console.log('11')
      // } else {
        let orderingList = JSON.parse(JSON.stringify(retVal)).sort(
          firstBy(function (v1, v2) {
            if (orderData.cmitRank === ORDERING.ASC) {
              return v1.cmitRank - v2.cmitRank;
            } else if (orderData.cmitRank === ORDERING.DESC) {
              return v2.cmitRank - v1.cmitRank;
            }
          })
          .thenBy(function (v1, v2) {
              if (orderData.cmitRank === ORDERING.ASC) {
                  return v1.cmitRank - v2.cmitRank;
              } else if (orderData.cmitRank === ORDERING.DESC) {
                  return v2.cmitRank - v1.cmitRank;
              }
          })
            .thenBy(function (v1, v2) {
              if (orderData.ancmRank === ORDERING.ASC) {
                return v1.ancmRank - v2.ancmRank;
              } else if (orderData.ancmRank === ORDERING.DESC) {
                return v2.ancmRank - v1.ancmRank;
              }
            })
        );

        setCmitDetailList(orderingList);
      // }
    }
  }, [orderData]);

  const fnJudgeContents = (sbjtAvg) => {
    console.log(sbjtAvg)
    if(sbjtAvg < 40){
      return "비추천"
    }else if(sbjtAvg >= 40 && sbjtAvg < 60){
      return "부적합"
    }else if(sbjtAvg >= 60 && sbjtAvg < 80){
      return "적합"
    }else{
      return "추천"  
    }
    return ""
  }

return (
    <>
      <div className="modal-mask"/>
        <div className="modal modal-large-table">
          <div className="title">
            <h3>과제 신청기관 예비평가 요약</h3>
            <button type="button" className="close" onClick={modalVisibleHandler}/>
          </div>
          <Spin spinning={getSbjtPreEvalPopupLoading}>
            {
            <div className="table-wrap m-0">
              <table className="striped">
                <colgroup>
                  <col width="6%"/>
                  <col width="20%"/>
                  <col width="8%"/>
                  <col width="8%"/>
                  <col width="8%"/>
                  <col width="8%"/>
                  <col width="22%"/>
                  <col width="11%"/>
                  <col width="8%"/>
                </colgroup>
                <thead>
                <tr>
                  <th className="text-center">NO</th>
                  <th>기업명</th>
                  <th className="text-center font-space-1">기업<br/>역량</th>
                  <th className="text-center font-space-1">기술<br/>역량</th>
                  <th className="text-center font-space-1">사업화<br/>역량</th>
                  <th className="text-center">평점</th>
                  <th className="text-center">
                    <LimeSortingLabel
                      targetKey={"cmitRank"}
                      label={<>분과내<br/>순위</>}
                      labelStyle={{color: "#636871"}}
                      defaultSorting={orderData.cmitRank}
                      sortingChangeHandler={sortingChangeHandler}
                    />
                  </th>
                  <th className="text-center">
                    <LimeSortingLabel
                      targetKey={"ancmRank"}
                      label={<>사업내<br/>순위</>}
                      labelStyle={{color: "#636871"}}
                      defaultSorting={orderData.ancmRank}
                      sortingChangeHandler={sortingChangeHandler}
                    />
                  </th>
                  <th className="text-center">판정</th>
                </tr>
                </thead>
                <tbody id="tbody-for">
                    {
                      cmitDetailList &&
                      cmitDetailList.length > 0 &&
                      cmitDetailList.map((item, idx) => (
                        <tr>
                          <td className="text-center">{idx+1}</td>
                          <td>{item.orgnNm}</td>
                          <td className="text-center">{Math.round(item.coAbility)}</td>
                          <td className="text-center">{Math.round(item.teAbility)}</td>
                          <td className="text-center">{Math.round(item.bsAbility)}</td>
                          <td className="text-center">{Math.round(item.sbjtAvg)}</td>
                          <td className="text-center text-orange">
                            <Tooltip placement="topLeft" title={item.cmitNm} zIndex={10002}>
                              {item.cmitRank} ({item.cmitNm})
                            </Tooltip>
                          </td>
                          <td className="text-center text-primary">{item.ancmRank}</td>
                          {/* 추천 일때 text-color 변경 */}
                          <td className="text-center text-primary">
                            {
                              fnJudgeContents(Math.round(item.sbjtAvg))
                            }
                          </td>
                        </tr>
                      ))
                    }
                </tbody>
              </table>
            </div>
            }
          </Spin>
        </div>
    </>
  )
};

export default PreAnalSmr;