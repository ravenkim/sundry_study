import React, { useEffect, useState } from 'react'
import LimeModal from 'features/common/modal/LimeModal'
import { Modal, notification, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { perfAction } from 'features/perf/perfReducer'
import { createUnitSymbol } from 'features/perf/utils/PerfMethod'

const { Option } = Select;
const PIAdminModal = ({ visible, closeHandler, updatePIHandler,item}) => {

  const dispatch = useDispatch()
  const {
    unitInputboxList
  } = useSelector(({ perfReducer }) => ({
    unitInputboxList: perfReducer.unitInputboxList
  }))


  const [piId, setPIId] = useState('')
  const [piName, setPIName] = useState('')
  const searchUnitHandler = value => dispatch(perfAction.getUnitInputboxList({"search_keyword":value}))

  const changePINameHandler = e => setPIName(e.target.value)

  const [unit, setUnit] = useState('')

  const changeUnitHandler = value => setUnit(value)

  const [measureIndicator, setMeasureIndicator] = useState('')
  const changeMeasureIndicatorHandler = e => setMeasureIndicator(e.target.value)

  const [measureMethod, setMeasureMethod] = useState('')

  const changeMeasureMethodHandler = e => setMeasureMethod(e.target.value)
  const closeInitHandler = () => {
    setUnit('')
    setPIId('')
    setPIName('')
    setMeasureMethod('')
    setMeasureIndicator('')
    closeHandler()
  }
  const updatePIInitHandler = () => {
    if (unit === '' || piName === '' || measureMethod === '' ) {
      notification.warn({
        message:  '입력값이 존재하지 않습니다.',
        duration: 5,
        placement: 'bottomRight'
      })
      return
    }
    if (updatePIHandler && typeof updatePIHandler === 'function')
      updatePIHandler({
        'pi_mng_no':piId,
        'pi_nm': piName,
        'unit_no': unit,
        'measure_indicator':measureIndicator,
        'measure_method': measureMethod,
      })
    closeInitHandler()
  }

  const [unitList, setUnitList] = useState([])
  useEffect(()=>{
    dispatch(perfAction.getUnitInputboxList())
  },[])

  useEffect(() => {
    if(Array.isArray(unitInputboxList?.data?.result))
      setUnitList(unitInputboxList?.data?.result)
  }, [unitInputboxList])

  useEffect(()=>{
    if(item) {
      setPIId(item?.pi_mng_no)
      setPIName(item?.pi_nm)
      setUnit(item?.unit_del_yn === "N" ? item?.unit_no : '재설정필요')
      setMeasureIndicator(item?.measure_indicator)
      setMeasureMethod(item?.measure_method)
    }
  },[item])


  return (
    <LimeModal title={'성능지표 수정'} visible={visible} closable={false} closeHandler={closeInitHandler}>
      <>
        <div className="grid-col-3 items-center">
          <div className="col-span-1">
            <div className="form-label-text">성능지표명</div>
          </div>
          <div className="col-span-2">
            <input type="text" placeholder="성능지표명 입력" value={piName} onChange={changePINameHandler}/>
          </div>
        </div>
        <div className="grid-col-3 items-center pt-16">
          <div className="form-label-text">측정지표</div>
          <div className="col-span-2">
            <input type="text" placeholder="측정지표 입력" value={measureIndicator} onChange={changeMeasureIndicatorHandler}/>
          </div>
        </div>
        <div className="grid-col-3 items-center pt-16">
          <div className="col-span-1">
            <div className="form-label-text">단위</div>
          </div>
          <div className="col-span-2">
            {unit&&<Select placeholder="단위 검색어 입력"
                             showSearch
                             defaultValue={unit || ''}
                             optionFilterProp="children"
                             style={{ width: '100%' }}
                             onSearch={searchUnitHandler}
                             onChange={changeUnitHandler}>
              {
                unitList.map(unit => <Option key={unit.unit_no} value={unit.unit_no}> {createUnitSymbol(unit)}</Option>)
              }
            </Select>
            }
          </div>
        </div>
        <hr className="w-full mtb-24"/>
        <div className="form-label-text mb-8">측정 방법</div>
        <textarea rows="3" className="mtb-8 noresize" value={measureMethod} onChange={changeMeasureMethodHandler} placeholder="측정 방법 설명 입력하기"></textarea>
        <div className="modal-btn-2 mt-16">
          <button type="button" className="btn-tertiary-48" onClick={closeInitHandler}>닫기</button>
          <button type="button" className="btn-primary-48 flex-1" onClick={updatePIInitHandler}>수정하기</button>
        </div>
      </>
    </LimeModal>
  )
}

export default PIAdminModal
