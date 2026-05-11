import React, { useEffect, useState } from 'react'
import LimeModal from 'features/common/modal/LimeModal'
import { Modal, notification, Select, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { perfAction } from 'features/perf/perfReducer'
import { createUnitSymbol } from 'features/perf/utils/PerfMethod'
import { convertConfirmNm } from 'features/perf/utils/PerfCode'

const { Option } = Select
const PIModal = ({ visible, closeHandler, addPIHandler }) => {

  const dispatch = useDispatch()
  const {
    unitInputboxList,
    piRequestStatus,
    piProposeList
  } = useSelector(({ perfReducer }) => ({
    unitInputboxList: perfReducer.unitInputboxList,
    piRequestStatus: perfReducer.piRequestStatus,
    piProposeList: perfReducer.piProposeList
  }))

  const [piName, setPIName] = useState('')
  const searchUnitHandler = value => dispatch(perfAction.getUnitInputboxList({ 'search_keyword': value }))

  const changePINameHandler = e => setPIName(e.target.value)

  const [unit, setUnit] = useState(null)

  const changeUnitHandler = value => setUnit(value)

  const [measureIndicator, setMeasureIndicator] = useState('')
  const changeMeasureIndicatorHandler = e => setMeasureIndicator(e.target.value)

  const [measureMethod, setMeasureMethod] = useState('')

  const changeMeasureMethodHandler = e => setMeasureMethod(e.target.value)

  const initHandler = () => {
    setPIName('')
    setUnit(null)
    setMeasureIndicator('')
    setMeasureMethod('')
  }

  const closeInitHandler = () => {
    initHandler()
    closeHandler()
  }
  const addPIInitHandler = () => {
    if (unit === '' || piName === '' || measureMethod === '') {
      notification.warn({
        message:  '스펙 값이 입력이 되지않았습니다.',
        duration: 5,
        placement: 'bottomRight'
      })
      return
    }
    if (addPIHandler && typeof addPIHandler === 'function')
      addPIHandler({
        'pi_nm': piName,
        'unit_no': unit,
        'measure_indicator': measureIndicator,
        'measure_method': measureMethod,
      })

  }

  const [unitList, setUnitList] = useState([])

  useEffect(() => {
    if (Array.isArray(unitInputboxList?.data?.result))
      setUnitList(unitInputboxList?.data?.result)
  }, [unitInputboxList])

  /**
   * 성능지표 요청 리스트 갱신
   */

  const [piRqList, setPiRqList] = useState([])

  useEffect(() => {
    if (piRequestStatus?.data?.state) {
      notification.success({
        message: piRequestStatus.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
      initHandler()
      dispatch(perfAction.getPiProposeList())
      dispatch(perfAction.initialize('piRequestStatus'))
    } else if (piRequestStatus?.data && !piRequestStatus?.data.state) {
      notification.warn({
        message: piRequestStatus.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
      dispatch(perfAction.initialize('piRequestStatus'))
    }
  }, [piRequestStatus])

  useEffect(() => {
    if (piProposeList?.data && piProposeList?.data.state) {
      setPiRqList(piProposeList?.data?.result)
    }
  }, [piProposeList])

  /**
   * 성능지표 요청 리스트 초기 값 설정
   */
  useEffect(() => {
    if (visible)
      dispatch(perfAction.getPiProposeList())
  }, [visible])

  return (
    <LimeModal title={'성능지표 관리'} className={'modal-large-unit'} visible={visible} closable={false}
               closeHandler={closeInitHandler}>
      <>
        <div className="grid-col-2 gap-16 items-center">
          <h4>승인요청 리스트</h4>
          <h4>승인요청</h4>
        </div>
        <Spin spinning={piProposeList?.loading}>
          <div className="grid-col-2 gap-16">
            <div className="grid-left p-0 mt-8">
              <div className="table-wrap" style={{ height: '380px' }}>
                <table className="striped">
                  <colgroup>
                    <col width="20%"/>
                    <col width="30%"/>
                    <col width="25%"/>
                    <col width="25%"/>
                  </colgroup>
                  <thead>
                  <tr>
                    <th>성능지표명</th>
                    <th>측정지표</th>
                    <th>단위</th>
                    <th>승인상태</th>
                  </tr>
                  </thead>
                  <tbody id="tbody-for4" className="tbody">
                  {piRqList?.map(item => (
                    <tr>
                      <td>{item.pi_nm}</td>
                      <td>{item.measure_indicator}</td>
                      <td>{createUnitSymbol(item)}</td>
                      <td>{convertConfirmNm(item.confirm_state)}</td>
                    </tr>
                  ))}

                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid-right p-0 pt-16 border-0">
              <div className="grid-col-3  gap-16 items-center">
                <div className="col-span-1">
                  <div className="form-label-text">성능지표명</div>
                </div>
                <div className="col-span-2">
                  <input type="text" placeholder="성능지표명 입력" value={piName} onChange={changePINameHandler} maxLength={150}/>
                </div>
              </div>
              <div className="grid-col-3 gap-16 items-center mtb-16">
                <div className="form-label-text">측정지표</div>
                <div className="col-span-2">
                  <input type="text" placeholder="측정지표 입력" value={measureIndicator} maxLength={150}
                         onChange={changeMeasureIndicatorHandler}/>
                </div>
              </div>
              <div className="grid-col-3  gap-16 items-center mtb-16">
                <div className="col-span-1">
                  <div className="form-label-text">단위</div>
                </div>
                <div className="col-span-2">
                  <Select placeholder="단위 검색어 입력"
                          showSearch
                          value={unit}
                          optionFilterProp="children"
                          style={{ width: '100%' }}
                          onSearch={searchUnitHandler}
                          onChange={changeUnitHandler}>
                    {
                      unitList.map((unit, index) => <Option key={index}
                                                            value={unit.unit_no}>{createUnitSymbol(unit)}</Option>)
                    }
                  </Select>
                </div>
              </div>
              <hr className="mtb-16"/>
              <div className="form-label-text mb-8">측정 방법</div>
              <textarea rows="3" className="mtb-8 noresize" value={measureMethod} onChange={changeMeasureMethodHandler}
                        placeholder="측정 방법 설명 입력하기"></textarea>
            </div>
          </div>
        </Spin>
        <div className="modal-btn-2 mt-16">
          <button type="button" className="btn-tertiary-48" onClick={closeInitHandler}>닫기</button>
          <button type="button" className="btn-primary-48 ml-auto" onClick={addPIInitHandler}>승인요청</button>
        </div>
      </>
    </LimeModal>
  )
}

export default PIModal
