/**
 * 시간 : 2022-05-11
 * 작성자 : 김명훈
 *
 * variable, handler, func 그룹 기준 : 기능별 구분
 *
 **/

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { perfAction } from 'features/perf/perfReducer'
import {
  getCompProdList,
} from 'features/perf/perfApi'
import PerfTable from 'features/perf/components/PerfTable'
import ProductModal from 'features/perf/components/ProductModal'
import PIModal from 'features/perf/components/PIModal'
import PIAdditionModal from 'features/perf/components/PIAdditionModal'
import UnitModal from 'features/perf/components/UnitModal'
import CompProdModal from 'features/perf/components/CompProdModal'
import { Modal, notification } from 'antd'
import ProductUpdateModal from 'features/perf/components/ProductUpdateModal'
import PIUpdateModal from 'features/perf/components/PIUpdateModal'
import CompProdUpdateModal from 'features/perf/components/CompProdUpdateModal'
import { CONFIRM_STATE_CODE, getOperatorList, OPERATOR_CODE, PRODUCT_PI_CODE } from 'features/perf/utils/PerfCode'

const PerfIndicator = () => {
  /************************************************
   * init Func 시작
   ***********************************************/
  const dispatch = useDispatch()

  const {
    productList,
    piList,
    productPiList,
    compProList,
    productStatus,
    unitInputboxList,
    piRequestStatus,
    productPiStatus,
    compProdStatus,
    unitStatus,
    piCodeList,
    prdClassCdList
  } = useSelector(({ perfReducer }) => ({
    productList: perfReducer.productList,
    piList: perfReducer.piList,
    productPiList: perfReducer.productPiList,
    compProList: perfReducer.compProList,
    productStatus: perfReducer.productStatus,
    unitInputboxList: perfReducer.unitInputboxList,
    piRequestStatus: perfReducer.piRequestStatus,
    productPiStatus: perfReducer.productPiStatus,
    compProdStatus: perfReducer.compProdStatus,
    unitStatus: perfReducer.unitStatus,
    piStatus: perfReducer.piStatus,
    piCodeList: perfReducer.piCodeList,
    prdClassCdList: perfReducer.prdClassCdList,
  }))
  const initProductStateHandler = () => {

    dispatch(perfAction.initialize('productPiList'))
    dispatch(perfAction.initialize('compProList'))
    setProdPis(null)
    setCompProds(null)
  }
  const initStateHandler = () => {
    // dispatch(perfAction.initialize('productList'))
    // dispatch(perfAction.initialize('productPiList'))
    // dispatch(perfAction.initialize('compProList'))
    dispatch(perfAction.initializeAll())
    setSubjectTitle('과제 검색후 확인할 수 있습니다.')
    setProducts(null)
    setProdPis(null)
    setCompProds(null)
  }
  /**
   * 처음에 가져올 리스트 항목
   */
  useEffect(() => {
    initStateHandler()
    dispatch(perfAction.getPiCodeList())
    dispatch(perfAction.getPrdClassCdList({ prd_class_cd_id: 'main_list' }))
  }, [])

  /************************************************
   * init Func 끝
   ***********************************************/

  /************************************************
   * 과제를 통한 제품 검색 부분 시작
   ***********************************************/
  const [products, setProducts] = useState(null)
  /**
   * 과제  입력
   */
  const [subjectInputValue, setSubjectInputValue] = useState('')
  const [subjectTitle, setSubjectTitle] = useState('과제 검색후 확인할 수 있습니다.')
  const inputChangeHandler = e => setSubjectInputValue(e.target.value)
  const inputInitHandler = e => setSubjectInputValue('')
  /**
   * 과제를 통한 제품 검색 이벤트
   */
  const searchClickHandler = e => {
    dispatch(perfAction.getProductList({ 'sbjt_id': subjectInputValue }))
  }

  const searchSubListHandler = id => {
    setProductId(id)
    getProductPiHandler(id)
    getCompProdHandler(id)
  }

  useEffect(() => {
    if (productList?.data?.result && productList?.data?.state) {
      setSubjectTitle(productList.data.pms_sbjt_result.SBJT_NM)
      setProducts(productList.data.result.map(product => {
        return {
          ...product,
          prd_price: product.prd_price.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'),
          update_bt: '수정'
        }
      }))
      dispatch(perfAction.initialize('productList'))
      initProductStateHandler()
    }
    else if(productList?.data&&!(productList?.data?.state)){
      initStateHandler()
      notification.warn({
        message: productList.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
    }
  }, [productList])

  /**
   * 제품 수정
   */
  const updateProductHandler = info => {
    dispatch(perfAction.updateProduct(info))
  }
  /**
   * 제품 추가
   */
  const addProductHandler = (info) => {
    const product_info = { ...info, 'pi_trgt_no': 1 }
    dispatch(perfAction.insertProduct(product_info))
  }

  /**
   * 제품 삭제
   */
  const deleteProductHandler = items => {
    Modal.confirm({
      title: '선택된 항목을 삭제하시겠습니까?',
      okText: '삭제하기',
      okButtonProps: {
        type: 'primary',
      },
      // icon: <CloseCircleOutlined/>,
      onOk () {
        const ids = items.map(item => {
          return item.product_id
        })
        dispatch(perfAction.deleteProduct({ product_ids: ids }))
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
   * 제품 추가/수정/삭제 상태 확인
   */
  useEffect(() => {
    if (productStatus?.data?.state) {
      notification.success({
        message: productStatus.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
      dispatch(perfAction.initialize('productStatus'))
      dispatch(perfAction.getProductList({ 'sbjt_id': subjectInputValue }))
    } else if (productStatus?.data && !productStatus?.data.state) {
      notification.warn({
        message: productStatus.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
      dispatch(perfAction.initialize('productStatus'))
    }
  }, [productStatus])

  /**
   * 선택된 제품 id 값
   */
  const [productId, setProductId] = useState(null)

  /**
   * 제품 카테고리 관련 설정
   */

  const [mainCdList, setMainCdList] = useState([])

  useEffect(() => {
    if (prdClassCdList?.data) {
      if (prdClassCdList?.data?.prd_class === 'main')
        setMainCdList(prdClassCdList.data.result)
    }
  }, [prdClassCdList])

  /************************************************
   * 과제를 통한 제품 검색 부분 끝
   ***********************************************/

  /************************************************
   * 성능지표 부분 시작
   ***********************************************/
  const [prodPis, setProdPis] = useState(null)
  /**
   * 과제 성능 지표 가져오기
   */
  const getProductPiHandler = id => {
    dispatch(perfAction.getProductPiList({ 'product_id': id }))
  }
  useEffect(() => {
    if (productPiList?.data?.result) {
      if (Array.isArray(productPiList.data.result))
        setProdPis(productPiList.data.result.map(pi => {
          let base = '없음'
          let goal = '없음'
          let global = '없음'
          if (pi.spec_input_type === PRODUCT_PI_CODE.VALUE.code) {
            base = pi.operator + ' ' + pi.prd_spec_based
            goal = pi.operator + ' ' + pi.goal_spec_based
            global = pi.operator + ' ' + pi.global_spec_based
          } else if (pi.spec_input_type === PRODUCT_PI_CODE.RANGE.code) {
            base = (OPERATOR_CODE.NOT_BETWEEN.code===pi.operator?"not(":"") +
              pi.prd_spec_srt + ` ${getOperatorList('range').map(i => i.code).includes(pi.operator) ? '~' : pi.operator} ` + pi.prd_spec_end
              + (OPERATOR_CODE.NOT_BETWEEN.code===pi.operator?")":"")
            goal = (OPERATOR_CODE.NOT_BETWEEN.code===pi.operator?"not(":"") + +
              pi.goal_spec_srt + ` ${getOperatorList('range').map(i => i.code).includes(pi.operator) ? '~' : pi.operator} ` + pi.goal_spec_end
              + (OPERATOR_CODE.NOT_BETWEEN.code===pi.operator?")":"")
            global = (OPERATOR_CODE.NOT_BETWEEN.code===pi.operator?"not(":"") +
              pi.global_spec_srt + ` ${getOperatorList('range').map(i => i.code).includes(pi.operator) ? '~' : pi.operator} ` + pi.global_spec_end
              + (OPERATOR_CODE.NOT_BETWEEN.code===pi.operator?")":"")
          }
          let unit_info = pi.unit_del_yn === 'Y' ? null : pi
          let pi_nm = pi.unit_del_yn === 'Y' ? '단위가 삭제된 성능지표' : pi.pi_nm
          let measure_indicator = pi.measure_indicator
          let measure_method = pi.measure_method
          if(pi.confirm_state===CONFIRM_STATE_CODE.REJECT.code) {
            pi_nm = "반려된 성능지표입니다."
            unit_info=null
            measure_indicator="-"
            measure_method="-"
          }
          return {
            ...pi,
            pi_nm: pi_nm,
            measure_indicator:measure_indicator,
            measure_method:measure_method,
            'base_spec': base,
            'goal_spec': goal,
            'global_spec': global,
            unit_info: unit_info,
            update_bt: '수정',
          }
        }))
      dispatch(perfAction.initialize('productPiList'))

    }
  }, [productPiList])

  /**
   * 성능지표 수정
   */
  const updateProductPiHandler = info => {
    dispatch(perfAction.updateProductPi(info))
  }

  /**
   * 성능지표 추가
   */
  const addProductPiHandler = info => {
    dispatch(perfAction.insertProductPi(info))
  }
  /**
   * 성능지표 삭제
   */
  const deleteProductPiHandler = items => {
    Modal.confirm({
      title: '선택된 항목을 삭제하시겠습니까?',
      okText: '삭제하기',
      okButtonProps: {
        type: 'primary',
      },
      // icon: <CloseCircleOutlined/>,
      onOk () {
        const ids = items.map(item => {
          return item.product_pi_id
        })
        dispatch(perfAction.deleteProductPi({ product_pi_ids: ids }))
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
   * 성능지표 추가/수정/삭제 상태 확인
   */
  useEffect(() => {
    if (productPiStatus?.data?.state) {
      notification.success({
        message: productPiStatus.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
      dispatch(perfAction.initialize('productPiStatus'))
      dispatch(perfAction.getProductPiList({ 'product_id': productId }))
    } else if (productPiStatus?.data && !productPiStatus?.data.state) {
      notification.warn({
        message: productPiStatus.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
      dispatch(perfAction.initialize('productPiStatus'))
    }
  }, [productPiStatus])

  /**
   * 성능지표 승인 요청
   */
  const addPIHandler = info => {
    dispatch(perfAction.insertPiRequestData(info))
  }
  /************************************************
   * 성능지표 부분 끝
   ***********************************************/
  /************************************************
   * 경쟁 제품 부분 시작
   ***********************************************/

  const [compProds, setCompProds] = useState(null)

  const getCompProdHandler = id => {
    dispatch(perfAction.getCompProdList({ 'product_id': id }))
  }
  useEffect(() => {
    if (compProList?.data?.result) {
      if (Array.isArray(compProList.data.result))
        setCompProds(compProList.data.result.map(compPro => {
          return {
            ...compPro,
            com_prd_price: compPro.com_prd_price.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'),
            update_bt: '수정',
          }
        }))
      dispatch(perfAction.initialize('compProList'))
    }
  }, [compProList])

  /**
   * 성능지표 수정
   */
  const updateCompProdHandler = info => {
    dispatch(perfAction.updateCompPrd(info))
  }
  /**
   * 경쟁제품 추가
   */
  const addCompProdHandler = (info) => {
    dispatch(perfAction.insertCompPrd(info))
  }
  /**
   * 경쟁제품 삭제
   */
  const deleteCompProdHandler = items => {
    Modal.confirm({
      title: '선택된 항목을 삭제하시겠습니까?',
      okText: '삭제하기',
      okButtonProps: {
        type: 'primary',
      },
      // icon: <CloseCircleOutlined/>,
      onOk () {
        const ids = items.map(item => {
          return item.comp_prd_id
        })
        dispatch(perfAction.deleteCompPrd({ comp_prd_ids: ids }))
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
   * 경쟁제품 추가/수정/삭제 상태 확인
   */
  useEffect(() => {
    if (compProdStatus?.data?.state) {
      notification.success({
        message: compProdStatus.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
      dispatch(perfAction.initialize('compProdStatus'))
      dispatch(perfAction.getCompProdList({ 'product_id': productId }))
    } else if (compProdStatus?.data && !compProdStatus?.data.state) {
      notification.warn({
        message: compProdStatus.data.msg,
        duration: 5,
        placement: 'bottomRight'
      })
      dispatch(perfAction.initialize('compProdStatus'))
    }
  }, [compProdStatus])

  /************************************************
   * 경쟁 제품 부분 끝
   ***********************************************/
  /************************************************
   * 단위 부분
   ***********************************************/
  const addUnitHandler = unit => {
    dispatch(perfAction.insertUnit(unit))
  }
  /************************************************
   * 단위부분 끝
   ***********************************************/

  /************************************************
   * 모달 공통 부분
   ***********************************************/
  /*
   none : 모달 상태 없음
   product : 제품 추가 모달 visible 상태
   product_pi : 성능지표 승인요청 모달 visible 상태
   product_pi_add : 성능지표 추가 모달 visible 상태
   comp_prod : 경쟁 제품 추가 모달 visible 상태
   unit : 단위 관리 모달 visible 상태
   */
  const [modalStatus, setModalStatus] = useState('none')

  const [updateItem, setUpdateItem] = useState(null)

  const openUpdateModalHandler = (e, type, item) => {
    setUpdateItem(item)
    openModalHandler(`${type}_update`)
  }

  const closeModalHandler = () => {
    setModalStatus('none')
    setUpdateItem(null)
  }
  const openModalHandler = (type) => {
    setModalStatus(type)
  }

  const [codeInfos, setCodeInfos] = useState(null)

  useEffect(() => {
    setCodeInfos(piCodeList?.data?.result)
  }, [piCodeList])

  /************************************************
   * 모달 공통 부분 끝
   ***********************************************/
  return (
    <>
      <div className="grid-col-2 gap-16">
        <div className="grid-left p-0">
          <div className="flex-row items-center p-16">
            <h4>과제 검색</h4>
            <div className="search-40 ml-auto">
              <input type="search" placeholder="과제번호 입력" value={subjectInputValue} onChange={inputChangeHandler}/>
              <button type="button" className="search-btn" onClick={searchClickHandler}/>
              <button type="button" className="search-btn-close" onClick={inputInitHandler}/>
            </div>
            <div className="frame bg-gray-100 w-full p-16 ptb-8 mt-16">
              <p className="text-14-r">과제명 : {subjectTitle}</p>
            </div>
          </div>

          <hr className="w-full m-0"/>
          {/*{products&&products.length>0 && */}
          {/*  <PerfProductTable products={products} searchSubListHandler={searchSubListHandler}/>*/}
          {/*}*/}
          {products &&
            <PerfTable
              type={'product'}
              loading={productStatus.loading || productList.loading}
              data={products}
              title={'제품'}
              buttonTitle={'제품'}
              addButtonHandler={openModalHandler}
              openUpdateModalHandler={openUpdateModalHandler}
              deleteButtonHandler={deleteProductHandler}
              searchSubListHandler={searchSubListHandler}
              clickAble={true}
              tableConfig={{
                cols: ['20%', '28%', '20%', '20%', '12%'],
                headers: [
                  { title: '제품명' },
                  { title: '제품 장점' },
                  { title: '제품 주요 기능' },
                  { title: '제품 가격', isClass: true },
                  { title: '' }
                ],
                keys: [
                  { data: 'product_nm' },
                  { data: 'prd_merits' },
                  { data: 'prd_majer_fn' },
                  { data: 'prd_price', isClass: true },
                  { data: 'update_bt' }
                ]
              }
              }
            />
          }
          {!products && (
            <div className="frame-cont-bottom-r" style={{ height: 'calc(100vh - 213px)' }}>
              <div className="flex-col gap-16 items-center">
                <span className="mdi mdi-magnify text-primary" style={{ fontSize: '50px' }}></span>
                <p className="text-14-m text-gray-400">과제 검색 후 확인할 수 있습니다.</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-col gap-16">
          <div className="grid-right bg-gray-100 p-0">
            {/*{prodPis && <PrefIndicatorTable indicators={prodPis}/>}*/}
            {prodPis &&
              <PerfTable
                type={'product_pi'}
                title={'제품 성능지표'}
                loading={productPiStatus.loading || productPiList.loading}
                buttonTitle={'제품 성능지표'}
                addButtonHandler={openModalHandler}
                openUpdateModalHandler={openUpdateModalHandler}
                deleteButtonHandler={deleteProductPiHandler}
                data={prodPis}
                size={'half'}
                clickAble={false}
                tableConfig={{
                  cols: ['17%', '14%', '14%', '14%', '14%', '15%', '12%'],
                  headers: [
                    { title: '주요성능지표' },
                    { title: '측정지표' },
                    { title: '단위' },
                    { title: '현재 수준' },
                    { title: '목표 수준' },
                    { title: '세계 수준' },
                    { title: '' }
                  ],
                  keys: [
                    { data: 'pi_nm' },
                    { data: 'measure_indicator' },
                    { data: 'unit_info' },
                    { data: 'base_spec' },
                    { data: 'goal_spec' },
                    { data: 'global_spec' },
                    { data: 'update_bt' }
                  ]
                }}/>
            }
            {!prodPis && (
              <>
                <h4 className="pt-24 pb-0 plr-16">제품 성능지표</h4>
                <div className="frame-cont" style={{ height: 'calc((100vh - 202px)/2' }}>
                  <div className="flex-col items-center">
                    <span className="mdi mdi-playlist-check text-primary mb-24" style={{ fontSize: '60px' }}></span>
                    <p className="text-14-m text-gray-400">제품 선택 후 확인할 수 있습니다.</p>
                  </div>
                </div>
              </>
            )}

          </div>
          <div className="grid-right bg-gray-100 p-0">

            {/*{compProds && <PrefCompProdTable compProds={compProds}/>}*/}
            {compProds &&
              <PerfTable
                type={'comp_prod'}
                title={'경쟁제품'}
                buttonTitle={'경쟁제품'}
                loading={compProdStatus.loading || compProList.loading}
                addButtonHandler={openModalHandler}
                openUpdateModalHandler={openUpdateModalHandler}
                deleteButtonHandler={deleteCompProdHandler}
                data={compProds}
                clickAble={false}
                size={'half'}
                tableConfig={{
                  cols: ['20%', '18%', '19%', '13%', '18%', '12%'],
                  headers: [
                    { title: '회사명' },
                    { title: '회사제품' },
                    { title: '회사제품번호' },
                    { title: '국가번호' },
                    { title: '회사제품가격', isClass: true },
                    { title: '' }
                  ],
                  keys: [
                    { data: 'company_nm' },
                    { data: 'company_prd' },
                    { data: 'com_prd_number' },
                    { data: 'nation_id' },
                    { data: 'com_prd_price', isClass: true },
                    { data: 'update_bt' }
                  ]
                }}/>}
            {!compProds && (
              <>
                <h4 className="pt-24 pb-0 plr-16">경쟁제품</h4>
                <div className="frame-cont" style={{ height: 'calc((100vh - 202px)/2' }}>
                  <div className="flex-col items-center">
                    <span className="mdi mdi-playlist-check text-primary mb-24" style={{ fontSize: '60px' }}></span>
                    <p className="text-14-m text-gray-400">제품 선택 후 확인할 수 있습니다.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>


      {/*none : 모달 상태 없음*/}
      {/*product : 제품 추가 모달 visible 상태*/}
      {/*product_pi : 성능지표 승인요청 모달 visible 상태*/}
      {/*product_pi_add : 성능지표 추가 모달 visible 상태*/}
      {/*comp_prod : 경쟁 제품 추가 모달 visible 상태*/}
      {/*unit : 단위 관리 모달 visible 상태*/}
      <ProductModal visible={modalStatus === 'product'}
                    closeHandler={closeModalHandler}
                    addProductHandler={addProductHandler}
                    mainCdList={mainCdList}
                    id={subjectInputValue}
      />
      <ProductUpdateModal visible={modalStatus === 'product_update'}
                          closeHandler={closeModalHandler}
                          updateProductHandler={updateProductHandler}
                          mainCdList={mainCdList}
                          item={updateItem}
      />
      <PIModal visible={modalStatus === 'product_pi'}
               closeHandler={closeModalHandler}
               addPIHandler={addPIHandler}
      />
      <PIUpdateModal visible={modalStatus === 'product_pi_update'}
                     closeHandler={closeModalHandler}
                     infos={codeInfos}
                     updateProductPiHandler={updateProductPiHandler}
                     item={updateItem}/>
      <PIAdditionModal
        visible={modalStatus === 'product_pi_add'}
        infos={codeInfos}
        closeHandler={closeModalHandler}
        addPIHandler={addProductPiHandler}
        id={productId}/>
      <UnitModal visible={modalStatus === 'unit'}
                 infos={codeInfos}
                 addUnitHandler={addUnitHandler}
                 closeHandler={closeModalHandler}/>
      <CompProdModal visible={modalStatus === 'comp_prod'}
                     closeHandler={closeModalHandler}
                     addCompProdHandler={addCompProdHandler}
                     id={productId}/>
      <CompProdUpdateModal visible={modalStatus === 'comp_prod_update'}
                           closeHandler={closeModalHandler}
                           updateCompProdHandler={updateCompProdHandler}
                           item={updateItem}/>


    </>
  )
}

export default PerfIndicator
