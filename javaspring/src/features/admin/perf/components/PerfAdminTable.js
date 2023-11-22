import React, { useState } from 'react'

import { Spin } from 'antd'
import PIAdminModal from 'features/admin/perf/components/PIAdminModal'
import { CONFIRM_STATE_CODE, convertConfirmNm } from 'features/perf/utils/PerfCode'
import { createUnitSymbol } from 'features/perf/utils/PerfMethod'

const PerfAdminTable = ({ piData, confirmRejectHandler, confirmCompHandler, loading,updatePIHandler }) => {
  const [modifyModalVisible, setModifyModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null)

  const showModal = (item) => {
    setSelectedItem(item)
    setModifyModalVisible(true)
  }

  const closeModal = () => {
    setSelectedItem(null)
    setModifyModalVisible(false)
  }



  return (
    <>
      <Spin spinning={loading}>
        <div className="table-wrap" style={{ height: `calc(100vh - 296px)` }}>
          <table className="striped">
            <colgroup>
              <col width="15%"/>
              <col width="15%"/>
              <col width="20%"/>
              <col width="15%"/>
              <col width="10%"/>
              <col width=""/>
            </colgroup>
            <thead>
            <tr>
              <th>주요성능지표</th>
              <th>측정지표</th>
              <th>측정방법</th>
              <th>단위</th>
              <th>승인상태</th>
              <th></th>
            </tr>
            </thead>
            <tbody id="tbody-for">
            {piData?.length > 0 &&
              piData.map(item => (
                <tr key={item.pi_mng_no} style={{cursor:"pointer"}}>
                  <td className="ptb-4">{item.pi_nm}</td>
                  <td className="ptb-4">{item.measure_indicator}</td>
                  <td className="ptb-4">{item.measure_method}</td>
                  <td className={`ptb - 4 ${item.unit_del_yn==='N'?'':'text-red font-bold-400'}`}>{createUnitSymbol(item)}</td>
                  <td className="ptb-4" >{convertConfirmNm(item.confirm_state)}</td>
                  <td className="overflow-visible text-right ptb-4">
                                    <span className="flex-row-cont gap-8">
                                      <button type="button" className="btn-tertiary-32 plr-16"
                                              onClick={()=>showModal(item)}>수정</button>
                                      <button type="button" className="btn-system-blue-heightlight-32 plr-16" disabled={item.unit_del_yn!=="N"}
                                              onClick={() => confirmCompHandler(item)}>승인</button>
                                      <button type="button" className="btn-system-red-heightlight-32 plr-16" disabled={item.unit_del_yn!=="N"}
                                              onClick={() => confirmRejectHandler(item)}>반려</button>
                                    </span>
                  </td>
                </tr>
              ))
            }

            </tbody>
          </table>
        </div>
      </Spin>
      <PIAdminModal item={selectedItem} visible={modifyModalVisible} closeHandler={closeModal} updatePIHandler={updatePIHandler}/>
    </>
  )
}

export default PerfAdminTable
