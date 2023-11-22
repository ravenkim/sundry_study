import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PerfAdminTable from 'features/admin/perf/components/PerfAdminTable'
import { perfAction } from 'features/perf/perfReducer'
import PiExcelUploadForm from './components/PiExcelUploadForm'
import { CONFIRM_STATE_CODE, getConfirmList } from 'features/perf/utils/PerfCode'
import { Modal, notification, Select } from 'antd'
import { Option } from 'antd/es/mentions'
import UnitModal from 'features/perf/components/UnitModal'

const CommPerf = () => {
  const dispatch = useDispatch()
  const {
    piList,
    piStatus,
    uploadPiStatus,
    piCodeList
  } = useSelector(({ perfReducer }) => ({
    piList: perfReducer.piList,
    piStatus: perfReducer.piStatus,
    uploadPiStatus: perfReducer.uploadPiStatus,
    piCodeList: perfReducer.piCodeList,
  }))
  const [showModalType, setShowModalType] = useState(null)
  const [pis, setPis] = useState([])
  const [filterPis, setFilterPis] = useState([])
  const showModal = (type) => {
    setShowModalType(type)
  }

  const closeModal = () => {
    setShowModalType(null)
    dispatch(perfAction.getPiList({ target: 'piList' }))
  }

  const uploadTemplateHandler = item => {
    dispatch(perfAction.uploadPiTemplate(item))
  }

  useEffect(() => {
    dispatch(perfAction.getPiCodeList())
    dispatch(perfAction.getPiList({ target: 'piList' }))
  }, [])

  useEffect(() => {
    if (uploadPiStatus?.data?.state) {
      notification.success({
        message: uploadPiStatus.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
      closeModal()
      dispatch(perfAction.initialize('uploadPiStatus'))

      dispatch(perfAction.getPiList({ target: 'piList' }))
    } else if (uploadPiStatus?.data && !uploadPiStatus?.data.state) {
      notification.warn({
        message: uploadPiStatus.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
      dispatch(perfAction.initialize('uploadPiStatus'))
    }
  }, [uploadPiStatus])

  useEffect(() => {
    if (piList) {
      setPis(piList?.data?.result)
    }
  }, [piList])

  const confirmRejectHandler = item =>
    dispatch(perfAction.updatePi({ pi_mng_no: item?.pi_mng_no, confirm_state: CONFIRM_STATE_CODE.REJECT.code }))

  const allConfirmCompHandler = () => {
    Modal.confirm({
      title: '단위가 없는 성능지표는 승인되지 않습니다. 전체 승인 하시겠습니까?',
      okText: '승인하기',
      okButtonProps: {
        type: 'primary',
      },
      // icon: <CloseCircleOutlined/>,
      onOk () {
        dispatch(perfAction.updateAllPi())
      },
      cancelText: '닫기',
      cancelButtonProps: {
        type: 'default',
      },
      onCancel () { },
      centered: true,
    })
  }

  const confirmCompHandler = item =>
    dispatch(perfAction.updatePi({ pi_mng_no: item?.pi_mng_no, confirm_state: CONFIRM_STATE_CODE.COMP.code }))

  const updatePIHandler = infos =>
    dispatch(perfAction.updatePi(infos))

  useEffect(() => {
    if (piStatus?.data?.state) {
      notification.success({
        message: piStatus.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
      dispatch(perfAction.initialize('piStatus'))

      dispatch(perfAction.getPiList({ target: 'piList' }))
    } else if (piStatus?.data && !piStatus?.data.state) {
      notification.warn({
        message: piStatus.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
      dispatch(perfAction.initialize('piStatus'))

    }
  }, [piStatus])

  /**
   * 성능지표 검색
   */

  const [searchType, setSearchType] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const changeSearchTypeHandler = value => {
    setSearchType(value)
    switch (value) {
      case '주요성능지표':
      case '측정방법':
        setSearchValue('')
        break
      case '승인상태':
        setSearchValue(CONFIRM_STATE_CODE.NONE.code)
        break
    }
  }
  const changeSearchValueHandler = value => {
    setSearchValue(value)
  }

  useEffect(() => {
    if (pis) {
      setFilterPis(pis.filter(pi => {
        if (!searchValue)
          return true
        switch (searchType) {
          case '주요성능지표':
            return pi.pi_nm.includes(searchValue)
          case '측정방법':
            return pi.measure_method.includes(searchValue)
          case '승인상태':
            return searchValue === CONFIRM_STATE_CODE.NONE.code || pi.confirm_state === searchValue
          default:
            return true
        }
      }))
    }
  }, [pis])

  const searchPiListHandler = () => {
    setFilterPis(pis.filter(pi => {
      if (!searchValue)
        return true
      switch (searchType) {
        case '주요성능지표':
          return pi.pi_nm.includes(searchValue)
        case '측정방법':
          return pi.measure_method.includes(searchValue)
        case '승인상태':
          return searchValue === CONFIRM_STATE_CODE.NONE.code || pi.confirm_state === searchValue
        default:
          return true
      }
    }))
  }

  const initSearchValueHandler = () => {
    switch (searchType) {
      case '주요성능지표':
      case '측정방법':
        setSearchValue('')
        break
      case '승인상태':
        setSearchValue(CONFIRM_STATE_CODE.NONE.code)
        break
    }
  }

  /**
   * 단위 관리 모달 관련 처리
   */
  const [codeInfos, setCodeInfos] = useState(null)

  useEffect(() => {
    setCodeInfos(piCodeList?.data?.result)
  }, [piCodeList])

  const addUnitHandler = unit => {
    dispatch(perfAction.insertUnit(unit))
  }

  return (
    <>
      <div className="grid-left pb-24 mb-16">
        {/* 타이틀 */}
        <h4>성능지표</h4>

        <div className="grid-col-2 mt-16">
          <div className="grid-col-6 gap-16">
            <div className="col-span-2">
              <Select placeholder="검색 종류"
                      style={{ width: '100%' }}
                      onChange={changeSearchTypeHandler}>
                <Option value={'주요성능지표'}>주요성능지표</Option>
                <Option value={'측정방법'}>측정방법</Option>
                <Option value={'승인상태'}>승인상태</Option>
              </Select>
            </div>
            <div className="col-span-4 flex-row gap-16 nowrap">
              {searchType && searchType === '승인상태' && (
                <Select placeholder="검색 종류"
                        style={{ width: '100%' }}
                        value={searchValue === '' ? CONFIRM_STATE_CODE.NONE.code : searchValue}
                        onChange={changeSearchValueHandler}>
                  {
                    getConfirmList().map((item, index) =>
                      <Option key={index} value={item.code}>{item.text}</Option>
                    )
                  }
                </Select>
              )}
              {searchType && searchType !== '승인상태' &&
                <input type="text"
                       value={searchValue}
                       onChange={e => changeSearchValueHandler(e.target.value)}
                       placeholder={searchType === '주요성능지표' ? '성능지표 명칭을 입력하세요.' : '측정방법을 입력하세요.'}/>
              }
              {!searchType &&
                <>
                  <input type="text"
                         disabled
                         placeholder={'검색 종류를 선택해주세요'}/>
                  <button type="button" disabled className="btn-size-40 plr-16">
                    <span className="mdi mdi-magnify text-icon-20"></span>
                  </button>
                </>
              }
              {searchType &&
                <>
                  <button type="button" className="btn-size-40 plr-16 bg-primary" onClick={searchPiListHandler}>
                    <span className="mdi mdi-magnify text-icon-20 text-white"></span>
                  </button>
                </>
              }
            </div>
          </div>
        </div>
      </div>


      <div className="grid-left p-0">
        <div className={`flex-row gap-16 items-center mlr-16 mt-16 mb-8 (modifyModalVisible ? relative : '')`}>
          <button type="button" className="btn-primary-40" onClick={allConfirmCompHandler}>전체 승인</button>
          <button type="button" className="btn-tertiary-40 plr-24" onClick={()=>showModal("excel")}>성능지표 업로드</button>
          <button type="button" className="btn-tertiary-40 plr-24" onClick={()=>showModal("unit")}>단위 관리</button>
          {showModalType==="excel" &&
            <PiExcelUploadForm
              closeModal={closeModal} uploadTemplateHandler={uploadTemplateHandler}
            />

          }
        </div>
        {/* 테이블 (이 테이블은 단일선택(row) light-blue 컬러가 적용되지 않도록 해주세요) */}
        <PerfAdminTable piData={filterPis} loading={piList.loading} confirmRejectHandler={confirmRejectHandler}
                        confirmCompHandler={confirmCompHandler} updatePIHandler={updatePIHandler}/>
        {/*<CondTable*/}
        {/*  selectRowHandler={selectRowHandler}*/}
        {/*  dataSource={condList.data}*/}
        {/*/>*/}

      </div>
      <UnitModal visible={showModalType === 'unit'}
                 infos={codeInfos}
                 auth={"admin"}
                 addUnitHandler={addUnitHandler}
                 closeHandler={closeModal}/>
    </>
  )
}

export default CommPerf
