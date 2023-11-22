import React, {useState} from 'react';
import BarChart from "../../../../chart/components/BarChart";

const Business = ({orgnList, getPemCommCd, orgn_cd, slider_value}) => {

  const var_id_24 = slider_value(0,2,orgn_cd(24).VAR_ITEM_VARI_VAL) // 매출액
  const var_id_28 = slider_value(-1,1,orgn_cd(28).VAR_ITEM_VARI_VAL) // 수출액
  const var_id_30 = slider_value(-1,1,orgn_cd(30).VAR_ITEM_VARI_VAL) // 영업이익 예상 증감
  const var_id_17 = slider_value(0,2,orgn_cd(17).VAR_ITEM_VARI_VAL) // 투자회수율(ROI)

  const [isTooltipShown, setIsTooltipShown] = useState({'tooltipId': ''});

  const mngIndicators = (mnsiCd) => {
    const commCd = orgnList?.mngIndicatorsResult.filter(function (el) {
      return el['MNSI_CD'] == mnsiCd
    })
    return commCd[0]
  }

  const barData = [{
    type: 'bar',
    x: ['매출액','수출액', '영업이익 예상 증감', '투자회수율(ROI)예상'],
    y: [Math.round((var_id_24-1) * 50),
      Math.round(var_id_28 * 50),
      Math.round(var_id_30 * 50),
      Math.round(var_id_17 * 100)]
  }]

  const convertMngIndicatorsFormat = (item) => {
    return item ? Number(item).toFixed(2)+"%" : null
  }

  const convertMoneyAmountFormat = (item) => {

    let itemVal = parseFloat(item.toFixed(3));
    itemVal = parseInt(itemVal * 1000000);

    return itemVal ? itemVal.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') : 0
  }

  return (
    <div className="p-16 overflow-auto border-box" style={{height: "calc(100vh - 469px)"}}>
      <div className="grid-col-2 gap-16">
        <div>
          <div className="text-14-m mb-8">사업화 역량 - 모델 예측</div>
          {/*<!-- 사업화 역량 - 모델 예측 테이블 -->*/}
          <table className="table-info mb-16">
            <colgroup>
              <col width="50%"/>
              <col width="50%"/>
            </colgroup>
            <tr>
              <th>매출액 증감 (%)</th>
              <td className="text-center">{Math.round((var_id_24-1) * 50)}%</td>
            </tr>
            <tr>
              <th>수출액 증감 (%)</th>
              <td className="text-center">{Math.round(var_id_28 * 50)}%</td>
            </tr>
            <tr>
              <th>영업이익 증감 (%)</th>
              <td className="text-center">{Math.round(var_id_30 * 50)}%</td>
            </tr>
            <tr>
              <th>투자회수율(ROI)(%)</th>
              <td className="text-center">{Math.round(var_id_17 * 100)}%</td>
            </tr>
            <tr>
              <th className="text-16-m">과제누적매출액(예상치)</th>
              <td className="text-16-m text-center">{convertMoneyAmountFormat(orgn_cd(56)?.VAR_DTL_VAL)}원</td>
            </tr>
          </table>

          <div className="text-14-m mb-8">경영현황 - 주요지표</div>
          {/*<!-- 경영 현황 테이블(우선 고정값으로 테이블 생성하라는 요청) -->*/}
          <table className="table-info">
            <colgroup>
              <col width="50%"/>
              <col width="50%"/>
            </colgroup>
            <tr>
              <th>최근 결산기준 년도</th>
              <td className="text-center">{mngIndicators("S00001")?.MNGM_SITU_VL}</td>
            </tr>
            <tr>
              <th>
                <span className="flex-row items-start">부채비율 (%)
                  <span className="mdi mdi-help-circle text-gray-400 text-14 ml-auto"
                        onMouseEnter={() => setIsTooltipShown({'tooltipId': 'tooltip_1'})}
                        onMouseLeave={() => setIsTooltipShown({'tooltipId': ''})}>
                  </span>
                </span>
              </th>
              <td className="text-center">{convertMngIndicatorsFormat(mngIndicators("S00007")?.MNGM_SITU_VL)}</td>
            </tr>
            <tr>
              <th>
                <span className="flex-row items-start">자기자본비율 (%)
                  <span className="mdi mdi-help-circle text-gray-400 text-14 ml-auto"
                        onMouseEnter={() => setIsTooltipShown({'tooltipId': 'tooltip_2'})}
                        onMouseLeave={() => setIsTooltipShown({'tooltipId': ''})}>
                  </span>
                </span>
              </th>
              <td className="text-center">{convertMngIndicatorsFormat(mngIndicators("S00009")?.MNGM_SITU_VL)}</td>
            </tr>
            <tr>
              <th>
                <span className="flex-row items-start">매출액 영업이익율 (%)
                  <span className="mdi mdi-help-circle text-gray-400 text-14 ml-auto"
                        onMouseEnter={() => setIsTooltipShown({'tooltipId': 'tooltip_3'})}
                        onMouseLeave={() => setIsTooltipShown({'tooltipId': ''})}>
                  </span>
                </span>
              </th>
              <td className="text-center">{convertMngIndicatorsFormat(mngIndicators("S00012")?.MNGM_SITU_VL)}</td>
            </tr>
            <tr>
              <th>
                <span className="flex-row items-start">R&D 투자비율 (%)
                  <span className="mdi mdi-help-circle text-gray-400 text-14 ml-auto"
                        onMouseEnter={() => setIsTooltipShown({'tooltipId': 'tooltip_4'})}
                        onMouseLeave={() => setIsTooltipShown({'tooltipId': ''})}>
                  </span>
                </span>
              </th>
              <td className="text-center">{convertMngIndicatorsFormat(mngIndicators("S00014")?.MNGM_SITU_VL)}</td>
            </tr>
          </table>
        </div>
        <div>
          {/*<!-- 그래프 공간 -->
          <!-- ※ 그래프 적용후 border(라인) 없애는 방법 : "frame" class 삭제! -->*/}
          <div className="frame border-box overflow-auto" style={{height: "calc(100vh - 501px)"}}>
            <BarChart
              // style={{ width: 1100, height: 500 }}
              dataSource={barData}
              config={{
                displayModeBar: false,
                displaylogo: false,
                //scrollZoom: true,
              }}
              layout={{

                legend: {
                  bgcolor: "rgba(0,0,0,0)",
                  yanchor: "top",
                  //y: 1.6,
                  xanchor: "right",
                  x: 1.3,
                  //orientation: "h",
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className={isTooltipShown.tooltipId == 'tooltip_1' ? 'tooltip-helper tooltip-helper-hover w-contsize' : 'tooltip-helper w-contsize'} style={{top: `284px`, left: `17%`}}>
        <div className="flex-col">
          <p>부채총계 / 자본총계 × 100%</p>
        </div>
      </div>

      <div className={isTooltipShown.tooltipId == 'tooltip_2' ? 'tooltip-helper tooltip-helper-hover w-contsize' : 'tooltip-helper w-contsize'} style={{top: `322px`, left: `17%`}}>
        <div className="flex-col">
          <p>자본총계 / 자산총계 × 100%</p>
        </div>
      </div>

      <div className={isTooltipShown.tooltipId == 'tooltip_3' ? 'tooltip-helper tooltip-helper-hover w-contsize' : 'tooltip-helper w-contsize'} style={{top: `359px`, left: `17%`}}>
        <div className="flex-col">
          <p>영업이익 / 매출액 × 100%</p>
        </div>
      </div>

      <div className={isTooltipShown.tooltipId == 'tooltip_4' ? 'tooltip-helper tooltip-helper-hover w-contsize' : 'tooltip-helper w-contsize'} style={{top: `396px`, left: `17%`}}>
        <div className="flex-col">
          <p>R&D 투자액 / 매출액 × 100%</p>
        </div>
      </div>
    </div>
  )
};

export default Business;