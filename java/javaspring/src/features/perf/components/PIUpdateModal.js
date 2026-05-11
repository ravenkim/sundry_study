import React, { useEffect, useState } from 'react'
import LimeModal from 'features/common/modal/LimeModal'
import { Modal, notification, Select } from 'antd'
import { perfAction } from 'features/perf/perfReducer'
import { useDispatch, useSelector } from 'react-redux'
import { CONFIRM_STATE_CODE, getOperatorList, OPERATOR_CODE, PRODUCT_PI_CODE } from 'features/perf/utils/PerfCode'

const { Option } = Select
const PIUpdateModal = ({ visible, closeHandler, updateProductPiHandler, infos, item }) => {
  const dispatch = useDispatch()
  const {
    piList
  } = useSelector(({ perfReducer }) => ({
    piList: perfReducer.piList
  }))
  useEffect(() => {
    dispatch(perfAction.getPiList({ 'search_keyword': '', 'confirm_state': CONFIRM_STATE_CODE.COMP.code }))
  }, [])

  const [name, setName] = useState('')
  const [productPIId, setProductPIId] = useState('')
  const [piId, setPIId] = useState('')
  const searchNameHandler = value =>
    dispatch(perfAction.getPiList({ 'search_keyword': value, 'confirm_state': CONFIRM_STATE_CODE.COMP.code }))

  const changeNameHandler = value => {
    const unit_info = searchPiList.find(pi => pi.pi_mng_no === value)
    setUnit(unit_info ? `${unit_info.unit_nm}(${unit_info.symbol})` : '단위 없음')
    setPIId(value)
  }

  const [unit, setUnit] = useState('')

  const [baseSpec, setBaseSpec] = useState('')

  const changeBaseSpecHandler = e => setBaseSpec(e.target.value.replace(/[^-?\d*(\.\d+)?$]/g, '').replace(/(\..*)\./g, '$1'))

  const [globalSpec, setGlobalSpec] = useState('')

  const [goalSpec, setGoalSpec] = useState('')

  const changeGoalSpecHandler = e => setGoalSpec(e.target.value.replace(/[^-?\d*(\.\d+)?$]/g, '').replace(/(\..*)\./g, '$1'))

  const changeGlobalSpecHandler = e => setGlobalSpec(e.target.value.replace(/[^-?\d*(\.\d+)?$]/g, '').replace(/(\..*)\./g, '$1'))

  const [baseSpecStart, setBaseSpecStart] = useState('')

  const changeBaseSpecStartHandler = e => setBaseSpecStart(e.target.value.replace(/[^-?\d*(\.\d+)?$]/g, '').replace(/(\..*)\./g, '$1'))

  const [baseSpecEnd, setBaseSpecEnd] = useState('')

  const changeBaseSpecEndHandler = e => setBaseSpecEnd(e.target.value.replace(/[^-?\d*(\.\d+)?$]/g, '').replace(/(\..*)\./g, '$1'))

  const [globalSpecStart, setGlobalSpecStart] = useState('')

  const [goalSpecStart, setGoalSpecStart] = useState('')

  const changeGoalSpecStartHandler = e => setGoalSpecStart(e.target.value.replace(/[^-?\d*(\.\d+)?$]/g, '').replace(/(\..*)\./g, '$1'))

  const [goalSpecEnd, setGoalSpecEnd] = useState('')

  const changeGoalSpecEndHandler = e => setGoalSpecEnd(e.target.value.replace(/[^-?\d*(\.\d+)?$]/g, '').replace(/(\..*)\./g, '$1'))

  const changeGlobalSpecStartHandler = e => setGlobalSpecStart(e.target.value.replace(/[^-?\d*(\.\d+)?$]/g, '').replace(/(\..*)\./g, '$1'))

  const [globalSpecEnd, setGlobalSpecEnd] = useState('')

  const changeGlobalSpecEndHandler = e => setGlobalSpecEnd(e.target.value.replace(/[^-?\d*(\.\d+)?$]/g, '').replace(/(\..*)\./g, '$1'))

  const [valueOperator, setValueOperator] = useState(null)
  const [rangeOperator, setRangeOperator] = useState(null)
  const changeOperatorHandler = value => {
    if (inputType === PRODUCT_PI_CODE.VALUE.code)
      setValueOperator(value)
    else setRangeOperator(value)
  }

  const [basedOnType, setBasedOnType] = useState('')
  const changeBasedOnTypeHandler = value => setBasedOnType(value)

  const [inputType, setInputType] = useState(PRODUCT_PI_CODE.VALUE.code)

  const _closeInitHandler = () => {
    setName('')
    setProductPIId('')
    setPIId('')
    setUnit('')
    setBaseSpec('')
    setGoalSpec('')
    setGlobalSpec('')
    setBaseSpecStart('')
    setBaseSpecEnd('')
    setGoalSpecStart('')
    setGoalSpecEnd('')
    setGlobalSpecStart('')
    setGlobalSpecEnd('')
    setValueOperator(null)
    setRangeOperator(null)
    setBasedOnType('')
    setInputType(PRODUCT_PI_CODE.VALUE.code)
    closeHandler()
  }
  const _updatePiInitHandler = () => {
    if (
      !piId || !basedOnType) {
      notification.warn({
        message:  '입력값이 존재하지 않습니다.',
        duration: 5,
        placement: 'bottomRight'
      })
      return
    }
    if ((!baseSpec || !globalSpec || !goalSpec || !valueOperator) && inputType === PRODUCT_PI_CODE.VALUE.code) {
      notification.warn({
        message:  '스펙 값이 입력이 되지않았습니다.',
        duration: 5,
        placement: 'bottomRight'
      })
      return
    }
    if ((!goalSpecStart || !goalSpecEnd
      || !baseSpecStart || !baseSpecEnd
      || !globalSpecStart || !globalSpecEnd || !rangeOperator) && inputType === PRODUCT_PI_CODE.RANGE.code) {
      notification.warn({
        message:  '스펙 범위 값이 입력이 되지않았습니다.',
        duration: 5,
        placement: 'bottomRight'
      })
      return
    }
    if (updateProductPiHandler && typeof updateProductPiHandler === 'function') {
      updateProductPiHandler({
        'product_pi_id': productPIId,
        'pi_mng_no': piId,
        'spec_input_type': inputType, //range
        'prd_spec_based': baseSpec,
        'goal_spec_based': goalSpec,
        'global_spec_based': globalSpec,
        'prd_spec_srt': baseSpecStart,
        'prd_spec_end': baseSpecEnd,
        'goal_spec_srt': goalSpecStart,
        'goal_spec_end': goalSpecEnd,
        'global_spec_srt': globalSpecStart,
        'global_spec_end': globalSpecEnd,
        'operator': inputType === PRODUCT_PI_CODE.VALUE.code ? valueOperator : rangeOperator,
        'basedon_type_no': basedOnType,
      })
      _closeInitHandler()
    }

  }

  /**
   * 성능지표 리스트 실시간 검색
   */
  const [searchPiList, setSearchPiList] = useState([])

  useEffect(() => {
    setSearchPiList(piList?.data?.result)
  }, [piList])

  const [basedList, setBasedList] = useState([])

  useEffect(() => {
    setBasedList(infos?.basedon_type)
  }, [infos])

  /**
   * 기존값 불러오기
   */
  useEffect(() => {
    if (item && basedList) {
      if(item.confirm_state===CONFIRM_STATE_CODE.REJECT.code)
      {
        setPIId(null)
        setUnit('단위 없음')

      }
      else {
        setPIId(item?.pi_mng_no)
        const unit_info = searchPiList.find(pi => pi?.pi_mng_no === item?.pi_mng_no)
        setUnit(unit_info && unit_info?.unit_del_yn === 'N' ? `${unit_info?.unit_nm}(${unit_info?.symbol})` : '단위 없음')

      }
      setName('')
      setProductPIId(item?.product_pi_id)
       setBaseSpec(item?.prd_spec_based)
      setGoalSpec(item?.goal_spec_based)
      setGlobalSpec(item?.global_spec_based)
      setBaseSpecStart(item?.prd_spec_srt)
      setBaseSpecEnd(item?.prd_spec_end)
      setGoalSpecStart(item?.goal_spec_srt)
      setGoalSpecEnd(item?.goal_spec_end)
      setGlobalSpecStart(item?.global_spec_srt)
      setGlobalSpecEnd(item?.global_spec_end)
      if (item?.spec_input_type === PRODUCT_PI_CODE.VALUE.code) {
        setValueOperator(item?.operator)
        setRangeOperator(null)
      } else {
        setValueOperator(null)
        setRangeOperator(item?.operator)
      }

      setBasedOnType(item?.basedon_type_no)
      setInputType(item?.spec_input_type ? item.spec_input_type : PRODUCT_PI_CODE.VALUE.code)
    }
  }, [item, basedList])

  return (
    <LimeModal title={'제품 성능지표 수정'} visible={visible} closable={false} closeHandler={_closeInitHandler}>
      <>
        <div className="grid-col-3 items-center">
          <div className="form-label-text">성능지표명</div>
          <div className="col-span-2">
            { <Select placeholder="성능지표 검색어 입력"
                             showSearch
                             value={piId}
                             optionFilterProp="children"
                             filterOption={(input, option) =>
                               option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                             }
                             style={{ width: '100%' }}
                             onSearch={searchNameHandler}
                             onChange={changeNameHandler}>
              {
                searchPiList?.map(pi => <Option key={pi.pi_mng_no} value={pi.pi_mng_no}>{pi.pi_nm}</Option>)
              }
            </Select>}
          </div>
        </div>
        <div className="grid-col-3 items-center pt-16">
          <div className="form-label-text">단위</div>
          <div className="col-span-2">
            <div dangerouslySetInnerHTML={ {__html: unit} } className="frame-border p-16 ptb-8 flex-1"/>
          </div>
        </div>

        <div className="flex-row gap-16 items-center mt-24">
          <div className="form-label-text col-span-2">스펙구분</div>
          <div className="radio-box-type ml-auto">
            <input type="radio" name="pi_update_group" id="radio-box-type-update1" readOnly
                   checked={inputType === PRODUCT_PI_CODE.VALUE.code}
                   onClick={() => setInputType(PRODUCT_PI_CODE.VALUE.code)}/>
            <label htmlFor="radio-box-type-update1" className="plr-40">값</label>
          </div>
          <div className="radio-box-type">
            <input type="radio" name="pi_update_group" id="radio-box-type-update2" readOnly
                   checked={inputType === PRODUCT_PI_CODE.RANGE.code}
                   onClick={() => setInputType(PRODUCT_PI_CODE.RANGE.code)}/>
            <label htmlFor="radio-box-type-update2" className="plr-32">범위</label>
          </div>
        </div>
        {inputType === PRODUCT_PI_CODE.VALUE.code &&
          (
            <>
              <div className="frame-border p-16 mt-8 mb-24">
                <div className="grid-col-3 items-center">
                  <div className="form-label-text">현재수준</div>
                  <div className="col-span-2">
                    <div className="flex-row items-center gap-8">
                      <span className="text-14-m flex-fixed-50 text-center"> {valueOperator} </span>
                      <input type="text" placeholder="입력하기" className="flex-1" value={baseSpec} maxLength={150}
                             onChange={changeBaseSpecHandler}/>
                    </div>
                  </div>
                </div>
                <div className="grid-col-3 items-center mt-16">
                  <div className="form-label-text">목표수준</div>
                  <div className="col-span-2">
                    <div className="flex-row items-center gap-8">
                      <span className="text-14-m flex-fixed-50 text-center"> {valueOperator} </span>
                      <input type="text" placeholder="입력하기" className="flex-1" value={goalSpec} maxLength={150}
                             onChange={changeGoalSpecHandler}/>
                    </div>
                  </div>
                </div>
                <div className="grid-col-3 items-center mt-16">
                  <div className="form-label-text">세계수준</div>
                  <div className="col-span-2">
                    <div className="flex-row items-center gap-8">
                      <span className="text-14-m flex-fixed-50 text-center"> {valueOperator} </span>
                      <input type="text" placeholder="입력하기" className="flex-1" value={globalSpec} maxLength={150}
                             onChange={changeGlobalSpecHandler}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid-col-3 items-center">
                <div className="form-label-text">연산자</div>
                <div className="col-span-2">
                  {<Select placeholder="선택하기" value={valueOperator} style={{ width: '100%' }}
                           onChange={changeOperatorHandler}>
                    {
                      getOperatorList(inputType).map((based, index) =>
                        (
                          <Option key={index} value={based.code}>{based.code}</Option>
                        )
                      )
                    }
                  </Select>}
                </div>
              </div>
            </>
          )
        }
        {inputType === PRODUCT_PI_CODE.RANGE.code &&
          (
            <>
              <div className="frame-border p-16 mt-8 mb-24">
                <div className="grid-col-4 items-center">
                  <div className="form-label-text">현재수준</div>
                  <div className="col-span-3">
                    <div className="flex-row items-center">
                      <span
                        className="text-14-m flex-fixed-50 text-center">{rangeOperator === OPERATOR_CODE.NOT_BETWEEN.code ? 'not ( ' : ''} </span>
                      <input type="text" placeholder="입력하기" className="flex-1" value={baseSpecStart} maxLength={150}
                             onChange={changeBaseSpecStartHandler}/>
                      <span className="text-14-m flex-fixed-25 text-center">{rangeOperator ? '~' : ''}</span>
                      <input type="text" placeholder="입력하기" className="flex-1" value={baseSpecEnd} maxLength={150}
                             onChange={changeBaseSpecEndHandler}/>
                      <span
                        className="text-14-m flex-fixed-25 text-center">{rangeOperator === OPERATOR_CODE.NOT_BETWEEN.code ? ')' : ''}</span>
                    </div>
                  </div>
                </div>
                <div className="grid-col-4 items-center mt-16">
                  <div className="form-label-text">목표수준</div>
                  <div className="col-span-3">
                    <div className="flex-row items-center">
                    <span
                      className="text-14-m flex-fixed-50 text-center">{rangeOperator === OPERATOR_CODE.NOT_BETWEEN.code ? 'not ( ' : ''}  </span>
                      <input type="text" placeholder="입력하기" className="flex-1" value={goalSpecStart} maxLength={150}
                             onChange={changeGoalSpecStartHandler}/>
                      <span className="text-14-m flex-fixed-25 text-center">{rangeOperator ? '~' : ''}</span>
                      <input type="text" placeholder="입력하기" className="flex-1" value={goalSpecEnd} maxLength={150}
                             onChange={changeGoalSpecEndHandler}/>
                      <span
                        className="text-14-m flex-fixed-25 text-center">{rangeOperator === OPERATOR_CODE.NOT_BETWEEN.code ? ')' : ''}</span>
                    </div>
                  </div>
                </div>
                <div className="grid-col-4 items-center mt-16">
                  <div className="form-label-text">세계수준</div>
                  <div className="col-span-3">
                    <div className="flex-row items-center">
                      <span
                        className="text-14-m flex-fixed-50 text-center">{rangeOperator === OPERATOR_CODE.NOT_BETWEEN.code ? 'not ( ' : ''}  </span>
                      <input type="text" placeholder="입력하기" className="flex-1" value={globalSpecStart} maxLength={150}
                             onChange={changeGlobalSpecStartHandler}/>
                      <span className="text-14-m flex-fixed-25 text-center">{rangeOperator ? '~' : ''}</span>
                      <input type="text" placeholder="입력하기" className="flex-1" value={globalSpecEnd} maxLength={150}
                             onChange={changeGlobalSpecEndHandler}/>
                      <span
                        className="text-14-m flex-fixed-25 text-center">{rangeOperator === OPERATOR_CODE.NOT_BETWEEN.code ? ')' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid-col-3 items-center">
                <div className="form-label-text">연산자</div>
                <div className="col-span-2">
                  {<Select placeholder="선택하기" value={rangeOperator} style={{ width: '100%' }}
                           onChange={changeOperatorHandler}>
                    {
                      getOperatorList(inputType).map((based, index) =>
                        (
                          <Option key={index} value={based.code}>{based.code}</Option>
                        )
                      )
                    }
                  </Select>}
                </div>
              </div>
            </>
          )
        }


        <div className="grid-col-3 items-center mt-16">
          <div className="form-label-text">근거유형</div>
          <div className="col-span-2">
            {basedOnType &&
              <Select placeholder="선택하기" defaultValue={basedOnType} style={{ width: '100%' }}
                      onChange={changeBasedOnTypeHandler}>
                {
                  basedList.map((based, index) =>
                    (
                      <Option key={index} value={based.basedon_type_no}>{based.basedon_type}</Option>
                    )
                  )
                }
              </Select>}
          </div>
        </div>
        <div className="modal-btn-2 mt-24">
          <button type="button" className="btn-tertiary-48" onClick={_closeInitHandler}>닫기</button>
          <button type="button" className="btn-primary-48 flex-1" onClick={_updatePiInitHandler}>수정하기</button>
        </div>
      </>
    </LimeModal>
  )
}

export default PIUpdateModal
