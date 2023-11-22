import React, { useEffect, useState } from 'react'
import LimeModal from 'features/common/modal/LimeModal'
import { useDispatch, useSelector } from 'react-redux'
import { perfAction } from 'features/perf/perfReducer'
import { Modal, notification, Select, Spin, Tooltip } from 'antd'
import UnitCompose from 'features/perf/components/UnitCompose'
import UnitSelect from 'features/perf/components/UnitSelect'
import { UNIT_STATE_CODE, UNIT_TYPE_CODE } from 'features/perf/utils/PerfCode'

const { Option } = Select

const UnitModal = ({
  visible,
  closeHandler,
  infos,
  auth = 'user'
}) => {
  const dispatch = useDispatch()
  const {
    unitInputboxList,
    unitStatus
  } = useSelector(({ perfReducer }) => ({
    unitInputboxList: perfReducer.unitInputboxList,
    unitStatus: perfReducer.unitStatus
  }))

  useEffect(() => {
    dispatch(perfAction.getUnitInputboxList())
  }, [])

  useEffect(() => {
    console.log(unitStatus)
    if (unitStatus?.data?.state) {
      notification.success({
        message: unitStatus.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
      setDomain(null)
      setCategory(3)
      setCertType(null)
      setUnitName('')
      setUnitExplan('')
      setComposeResult([])
      setUnitInput('')
      setUnitCompose('')
      setUnitState(UNIT_STATE_CODE.CREATE.code)
      dispatch(perfAction.initialize('unitStatus'))

      dispatch(perfAction.getUnitInputboxList())
    } else if (!unitStatus?.data?.state && unitStatus?.data?.msg) {
      notification.warn({
        message: unitStatus.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
      dispatch(perfAction.initialize('unitStatus'))
    }
  }, [unitStatus])

  /**
   * 단위 리스트 전체 리스트 가져오기
   */
  const [unitList, setUnitList] = useState([])

  useEffect(() => {
    if (unitInputboxList?.data) {
      setUnitList(JSON.parse(JSON.stringify(unitInputboxList.data.result)).map(unit => {
        unit.checked = false
        return unit
      }))
    }
  }, [unitInputboxList])

  /**
   * 단위 관련 기본 선택 리스트
   */

  const [domainList, setDomainList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [certTypeList, setCertTypeList] = useState([])

  useEffect(() => {
    if (infos) {
      if (infos.unit_domain)
        setDomainList(infos.unit_domain)
      if (infos.unit_category)
        setCategoryList(infos.unit_category)
      if (infos.unit_cert_type)
        setCertTypeList(infos.unit_cert_type)
    }
  }, [infos])

  /**
   * 단위 등록 하기
   */


  const [composeResult, setComposeResult] = useState([])
  const [ucResult, setUcResult] = useState([])
  const [domain, setDomain] = useState(null)
  const [category, setCategory] = useState(3)
  const [certType, setCertType] = useState(null)
  const [unitState, setUnitState] = useState(UNIT_STATE_CODE.CREATE.code)
  const [unitNo, setUnitNo] = useState(null)
  const [unitName, setUnitName] = useState('')

  const changeUnitNameHandler = e => setUnitName(e.target.value)

  const [unitExplan, setUnitExplan] = useState('')

  const changeUnitExplanHandler = e => setUnitExplan(e.target.value)

  const [unitCompose, setUnitCompose] = useState('')

  const [unitType, setUnitType] = useState(UNIT_TYPE_CODE.US.code) // compose

  const [unitInput, setUnitInput] = useState('')

  const addUnitHandler = unit => {
    dispatch(perfAction.insertUnit(unit))
  }
  const updateUnitHandler = unit => {
    dispatch(perfAction.updateUnit(unit))
  }
  const composeResultHandler = infos => {
    setUcResult(infos)
  }

  const initModifyHandler = item => {
    setDomain(item?.ref_domain_no)
    setUnitState(item?.ref_cate_no === 3 ? UNIT_STATE_CODE.MODIFY.code : UNIT_STATE_CODE.NONE.code)
    setCategory(item?.ref_cate_no)
    setCertType(item?.cert_type_no)
    setUnitName(item?.unit_nm)
    setUnitNo(item?.unit_no)
    setUnitExplan(item?.unit_explan)
    setUnitType(item?.unit_input_type)
    setComposeResult(item?.uc)
    setUnitInput(item?.unit_input_type === UNIT_TYPE_CODE.US.code ? item?.symbol : '')
    // setUnitCompose(item?.unit_input_type === UNIT_TYPE_CODE.UC.code ? item?.symbol : "")
  }

  const initHandler = () => {
    setDomain(null)
    setUnitState(UNIT_STATE_CODE.CREATE.code)
    setCategory(3)
    setCertType(null)
    setUnitNo(null)
    setUnitName('')
    setUnitExplan('')
    setComposeResult([])
    setUnitType(UNIT_TYPE_CODE.US.code)
    setUnitInput('')
    setUnitCompose('')
  }

  const closeInitHandler = () => {
    initHandler()
    closeHandler()
  }
  const modifyPiHandler = () => {
    const symbol = unitType === UNIT_TYPE_CODE.US.code ? unitInput : unitCompose
    if (!domain || !category || !certType
      || unitName === ''
      || symbol === ''
    ) {
      notification.warn({
        message: '입력값이 존재하지 않습니다.',
        duration: 5,
        placement: 'bottomRight'
      })
      return
    }
    // if (unitList.find(unit => unit.symbol === symbol)
    // ) {
    //   Modal.warn({title: '기존에 존재하는 단위 기호입니다.'})
    //   return
    // }

    if (updateUnitHandler && typeof updateUnitHandler === 'function')
      updateUnitHandler({
        'unit_no': unitNo,
        'unit_nm': unitName,
        'unit_explan': unitExplan,
        'unit_input_type': unitType,
        'symbol': unitType === UNIT_TYPE_CODE.US.code ? unitInput : unitCompose,
        'ref_cate_no': category,
        'ref_domain_no': domain,
        'cert_type_no': certType,
        'us': {
          'us_unit': unitInput //단위 직접입력
        },
        'uc': ucResult?.map(compose => {
          return {
            'operator': compose.operator,  //연산자
            'ref_unit_no1': compose.ref_unit_no1, //참조단위
            'constant': compose.constant, //상수
            'multiplier': compose.multiplier //승수
          }
        })
      })

  }

  const addPIInitHandler = () => {
    const symbol = unitType === UNIT_TYPE_CODE.US.code ? unitInput : unitCompose
    if (!domain || !category || !certType
      || unitName === ''
      || symbol === ''
    ) {
      notification.warn({
        message: '입력값이 존재하지 않습니다.',
        duration: 5,
        placement: 'bottomRight'
      })
      return
    }
    if (unitList.find(unit => unit.symbol === symbol)
    ) {
      notification.warn({
        message: '기존에 존재하는 단위 기호입니다.',
        duration: 5,
        placement: 'bottomRight'
      })
      return
    }

    if (addUnitHandler && typeof addUnitHandler === 'function')
      addUnitHandler({
        'unit_nm': unitName,
        'unit_explan': unitExplan,
        'unit_input_type': unitType,
        'symbol': unitType === UNIT_TYPE_CODE.US.code ? unitInput : unitCompose,
        'ref_cate_no': category,
        'ref_domain_no': domain,
        'cert_type_no': certType,
        'us': {
          'us_unit': unitInput //단위 직접입력
        },
        'uc': ucResult?.map(compose => {
          return {
            'operator': compose.operator,  //연산자
            'ref_unit_no1': compose.ref_unit_no1, //참조단위
            'constant': compose.constant, //상수
            'multiplier': compose.multiplier //승수
          }
        })
      })

    // closeInitHandler()
  }

  /**
   * 단위 수정 기능을 위한 테이블 클릭 이벤트 ㅊ리
   */
  const rowClickHandler = (e, item) => {
    if (e.target.localName !== 'input' && e.target.localName !== 'button') {
      initModifyHandler(item)
    }

  }

  /**
   * 테이블 체크 관련 이벤트 처리
   */
  const [allCheckStatus, setAllCheckStatus] = useState(false)

  const rowAllCheckHandler = () => {
    unitList.forEach(row => {
      if (row.ref_cate_no === 3)
        row.checked = !allCheckStatus
    })
    setUnitList(unitList)
    setAllCheckStatus(!allCheckStatus)
  }

  const rowCheckHandler = (e, item) => {
    if (item.ref_cate_no !== 3)
      return
    setUnitList(oldList => {
      let checkCount = 0
      const newList = oldList.map(row => {
        if (row === item) {
          if (item.checked)
            item.checked = false
          else item.checked = true
          row.checked = item.checked
        }
        if (row.checked)
          checkCount++
        return row
      })
      setAllCheckStatus(checkCount === unitList.length)
      return newList
    })
  }

  /**
   * 단위 삭제하기
   */

  const deleteUnitHandler = () => {
    const ids = unitList.filter(unit => unit.checked)?.map(u => u.unit_no)
    if (ids?.length === 0 || !ids) {
      notification.warn({
        message: '삭제할 단위가 선택되지 않았습니다.',
        duration: 5,
        placement: 'bottomRight'
      })
      return
    }
    Modal.confirm({
      title: '선택된 항목을 삭제하시겠습니까?',
      okText: '삭제하기',
      okButtonProps: {
        type: 'primary',
      },
      // icon: <CloseCircleOutlined/>,
      onOk () {
        dispatch(perfAction.deleteUnit({ unit_ids: ids }))
      },
      cancelText: '닫기',
      cancelButtonProps: {
        type: 'default',
      },
      onCancel () { },
      centered: true,
    })
  }

  /**
   * 단위 입력 관련 정규식 처리
   */

  const changeUnitInputHandler = e => {
    setUnitInput(e.target.value.replace(/[^ \r\nㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9~!@#$%^&*()_+|{}:"<>?`\-=\\[\];',.\/]/, ''))//
  }

  return (
    // 모달 modal-large-unit class 적용 필요
    <LimeModal title={'단위 관리'} className={'modal-large-unit'} visible={visible} closable={true}
               closeHandler={closeInitHandler}>
      <>

        <div className="grid-col-2 gap-16 items-center">
          <div className="flex-row items-center">
            <h4 style={{cursor:'default'}}>
              <Tooltip title={' 삭제하기 기능은 관리자 페이지에서만 사용 가능합니다.'}  placement="right" >
                단위 정보
              </Tooltip>
            </h4>
            <button type="button" className="btn-tertiary-32 plr-24 ml-auto"
                    onClick={initHandler}
            >등록하기
            </button>
            <button type="button" className="btn-system-red-32 ml-8" disabled={auth !== 'admin'}
                    onClick={() => deleteUnitHandler()}>
              삭제하기
            </button>

          </div>
          <h4>단위 입력</h4>
        </div>

        <div className="grid-col-2 gap-16">
          <Spin spinning={unitInputboxList.loading}>
            <div className="grid-left p-0 mt-8">
              <div className="table-wrap" style={{ height: '590px' }}>
                <table className="striped">
                  <colgroup>
                    <col width=""/>
                    <col width="20%"/>
                    <col width="30%"/>
                    <col width="25%"/>
                    <col width="25%"/>
                  </colgroup>
                  <thead>
                  <tr style={{cursor:'default'}}>
                    <th className="table-check"><input type="checkbox" checked={allCheckStatus} readOnly
                                                       onClick={rowAllCheckHandler}/></th>
                    <th>NO</th>
                    <th>단위명</th>
                    <th>단위 설명</th>
                    {/*<th>단위 번호</th>*/}
                    <th>기호</th>
                  </tr>
                  </thead>
                  <tbody id="tbody-for4" className="tbody">
                  {
                    unitList.map((unit, index) =>
                      (
                        // onClick={e => rowCheckHandler(e, unit)}
                        //     readOnly
                        // checked={unit.checked}
                        <tr key={index} onClick={e => rowClickHandler(e, unit)} style={{ cursor: `pointer` }}>
                          <td className="table-check" onClick={e => rowCheckHandler(e, unit)}>
                            <input disabled={unit.ref_cate_no !== 3} type="checkbox" readOnly checked={unit.checked}/>
                          </td>
                          <td>{index}</td>
                          <td>{unit.unit_nm}</td>
                          <td>{unit.unit_explan}</td>
                          <td dangerouslySetInnerHTML={{ __html: unit.symbol }}></td>
                        </tr>
                      )
                    )
                  }

                  </tbody>
                </table>
              </div>
            </div>
          </Spin>
          <div className="grid-right p-0 pt-24 border-0">
            <div className="grid-col-3 gap-16 items-center">
              <div className="form-label-text">카테고리 구분</div>
              <div className="col-span-2">
                <Select placeholder="선택하기" style={{ width: '100%' }} value={category}
                        disabled={unitState === UNIT_STATE_CODE.NONE.code} onChange={setCategory}>
                  {
                    categoryList.map((category, index) => <Option key={index} disabled={category.cate_nm !== '조합단위'}
                                                                  value={category.cate_no}>{category.cate_nm}</Option>)
                  }
                </Select>
              </div>
            </div>
            <div className="grid-col-3 gap-16 items-center mtb-16">
              <div className="form-label-text">도메인 구분</div>
              <div className="col-span-2">
                <Select placeholder="선택하기" style={{ width: '100%' }} value={domain}
                        disabled={unitState === UNIT_STATE_CODE.NONE.code} onChange={setDomain}>
                  {
                    domainList.map((domain, index) => <Option key={index}
                                                              value={domain.domain_no}>{domain.domain_nm}</Option>)
                  }
                </Select>
              </div>
            </div>
            <div className="grid-col-3 gap-16 items-center">
              <div className="form-label-text">단위명</div>
              <div className="col-span-2">
                <input type="text" placeholder="단위 명칭 입력" value={unitName}
                       disabled={unitState === UNIT_STATE_CODE.NONE.code} onChange={changeUnitNameHandler}
                       maxLength={150}/>
              </div>
            </div>
            <div className="grid-col-3 gap-16 items-center mtb-16">
              <div className="form-label-text">단위 설명</div>
              <div className="col-span-2">
                <input type="text" placeholder="단위 설명 입력" value={unitExplan}
                       disabled={unitState === UNIT_STATE_CODE.NONE.code} onChange={changeUnitExplanHandler}
                       maxLength={150}/>
              </div>
            </div>
            <div className="grid-col-3 gap-16 items-center mtb-16">
              <div className="form-label-text">인증 유형</div>
              <div className="col-span-2">
                <Select placeholder="선택하기" style={{ width: '100%' }} value={certType}
                        disabled={unitState === UNIT_STATE_CODE.NONE.code} onChange={setCertType}>
                  {
                    certTypeList.map((certType, index) => <Option key={index}
                                                                  value={certType.cert_type_no}>{certType.cert_type}</Option>)
                  }
                </Select>
              </div>
            </div>
            <div className="grid-col-3 gap-16 items-center">
              <div className="form-label-text">입력 구분</div>
              <div className="radio-box-type">
                <input disabled={unitState === UNIT_STATE_CODE.NONE.code} type="radio" name="unit_group"
                       id="radio-box-type-select" readOnly
                       checked={unitType === UNIT_TYPE_CODE.US.code}
                       onClick={() => setUnitType(UNIT_TYPE_CODE.US.code)}/>
                <label htmlFor="radio-box-type-select" className="w-full">{UNIT_TYPE_CODE.US.text}</label>
              </div>
              <div className="radio-box-type">
                <input disabled={unitState === UNIT_STATE_CODE.NONE.code} type="radio" name="unit_group"
                       id="radio-box-type-compose" readOnly
                       checked={unitType === UNIT_TYPE_CODE.UC.code}
                       onClick={() => setUnitType(UNIT_TYPE_CODE.UC.code)}/>
                <label htmlFor="radio-box-type-compose" className="w-full">{UNIT_TYPE_CODE.UC.text}</label>
              </div>
            </div>
            {
              unitType === UNIT_TYPE_CODE.US.code &&
              (<UnitSelect unitInput={unitInput} changeUnitInputHandler={changeUnitInputHandler}
                           unitState={unitState}/>)
            }
            {
              unitType === UNIT_TYPE_CODE.UC.code &&
              (<UnitCompose unitCompose={unitCompose} setUnitCompose={setUnitCompose} composeResult={composeResult}
                            unitList={unitList} unitState={unitState}
                            composeResultHandler={composeResultHandler}/>)
            }
          </div>
        </div>

        <button type="button" disabled={unitState === UNIT_STATE_CODE.NONE.code}
                className="btn-primary-48 mt-24 ml-auto"
                onClick={unitState === UNIT_STATE_CODE.CREATE.code ? addPIInitHandler : modifyPiHandler}>{unitState === UNIT_STATE_CODE.CREATE.code ? '등록하기' : '수정하기'}</button>
      </>
    </LimeModal>
  )
}

export default UnitModal
