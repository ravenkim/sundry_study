import React from 'react';
import BarChart from "../../../../chart/components/BarChart";

const Tech = ({orgnList, getPemCommCd, orgn_cd, slider_value}) => {

  const var_id_11 = slider_value(0,100,orgn_cd(11).VAR_ITEM_VARI_VAL) // 기술자립도 전
  const var_id_12 = slider_value(0,100,orgn_cd(12).VAR_ITEM_VARI_VAL) // 기술자립도 후
  const var_id_15 = slider_value(0,100,orgn_cd(15).VAR_ITEM_VARI_VAL) // 기술수준 전
  const var_id_16 = slider_value(0,100,orgn_cd(16).VAR_ITEM_VARI_VAL) // 기술수준 후

  const barData1 = {
    type: 'bar',
    x: ['기술자립도','기술수준'],
    y: [var_id_11,var_id_15],
    name: '수행 전'
  }

  const barData2 = {
    type: 'bar',
    x: ['기술자립도','기술수준'],
    y: [var_id_12,var_id_16],
    name: '수행 후'
  }

  const barData = [barData1, barData2]

  return (
    <div className="p-16 overflow-auto border-box" style={{height: "calc(100vh - 469px)"}}>
      <div className="grid-col-2 gap-16">
        <div>
          <div className="text-14-m mb-4">기술수준</div>

          <table className="table-info mb-8">
            <colgroup>
              <col width="50%"/>
              <col width="50%"/>
            </colgroup>
            <tr>
              <th>기술수명주기</th>
              <td className="text-center">{orgn_cd(47).CD_NM}</td>
            </tr>
            <tr>
              <th>기술자립도 (수행 전) (%)</th>
              <td className="text-center">{var_id_11}%</td>
            </tr>
            <tr>
              <th>기술자립도 (수행 후) (%)</th>
              <td className="text-center">{var_id_12}%</td>
            </tr>
            <tr>
              <th>기술수준 (수행 전) (%)</th>
              <td className="text-center">{var_id_15}%</td>
            </tr>
            <tr>
              <th>기술수준 (수행 후) (%)</th>
              <td className="text-center">{var_id_16}%</td>
            </tr>
          </table>
          <div className="text-14-m mb-4">성능지표</div>

          <table className="table-info mb-8">
            <colgroup>
              <col width="50%"/>
              <col width="50%"/>
            </colgroup>
            <tr>
              <th>성능지표 현재 수준 (%)</th>
              <td className="text-center">{orgn_cd(49) ? orgn_cd(49)?.VAR_DTL_VAL+'%' : ''}</td>
            </tr>
            <tr>
              <th>성능지표 목표 수준 (%)</th>
              <td className="text-center">{orgn_cd(50) ? orgn_cd(50)?.VAR_DTL_VAL+'%' : ''}</td>
            </tr>
          </table>
          <div className="text-14-m mb-4">R&D 성과</div>

          <table className="table-info">
            <colgroup>
              <col width="50%"/>
              <col width="50%"/>
            </colgroup>
            <tr>
              <th>특허 출원 (건)</th>
              <td className="text-center">{orgn_cd(54) ? orgn_cd(54)?.VAR_DTL_VAL+'건' : ''}</td>
            </tr>
            <tr>
              <th>특허 등록 (건)</th>
              <td className="text-center">{orgn_cd(55) ? orgn_cd(55)?.VAR_DTL_VAL+'건' : ''}</td>
            </tr>
          </table>
        </div>
        <div>

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
                  barmode: "group",
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
    </div>
  )
};

export default Tech;