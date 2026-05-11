import React, { useEffect, useState } from 'react'
import LimeModal from 'features/common/modal/LimeModal'
import { Modal, notification, Select } from 'antd'
import { perfAction } from 'features/perf/perfReducer'
import { useDispatch, useSelector } from 'react-redux'

const Option = Select.Option;
const ProductModal = ({ visible , closeHandler, addProductHandler, id,mainCdList }) => {
  const dispatch = useDispatch()

  const {
    prdClassCdList
  } = useSelector(({ perfReducer }) => ({
    prdClassCdList: perfReducer.prdClassCdList,
  }))

  useEffect(()=>{
    if(prdClassCdList?.data?.result){
      if(prdClassCdList?.data?.prd_class==="middle")
        setMiddleCdList(prdClassCdList.data.result)
      else  if(prdClassCdList?.data?.prd_class==="sub")
        setSubCdList(prdClassCdList.data.result)
    }
  },[prdClassCdList])

  const [name ,setName] = useState("")

  const changeNameHandler = e => setName(e.target.value)

  const [price ,setPrice] = useState("")

  const changePriceHandler = e => setPrice(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,').replace(/(^0+)/, ""))

  const [advantage ,setAdvantage] = useState("")

  const changeAdvantageHandler = e => setAdvantage(e.target.value)

  const [feature ,setFeature] = useState("")

  const changeFeatureHandler = e => setFeature(e.target.value)

  const [mainCd ,setMainCd] = useState(null)

  const changeMainCdHandler =value => {
    setMiddleCd(null)
    setMiddleCdList([])
    setSubCd(null)
    setSubCdList([])
    setMainCd(value)
  }

  useEffect(()=>{
    if(mainCd){
      dispatch(perfAction.getPrdClassCdList({"prd_class_cd_id":mainCd}))
    }
  },[mainCd])

  const [middleCdList ,setMiddleCdList] = useState([])

  const [middleCd ,setMiddleCd] = useState(null)

  const changeMiddleCdHandler =value => {
    setMiddleCd(value)
    setSubCd(null)
    setSubCdList([])
  }

  useEffect(()=>{
    if(middleCd){
      dispatch(perfAction.getPrdClassCdList({"prd_class_cd_id":middleCd}))
    }
  },[middleCd])

  const [subCdList ,setSubCdList] = useState([])

  const [subCd ,setSubCd] = useState(null)

  const changeSubCdHandler =value => setSubCd(value)

  const closeInitHandler = ()=>{
    setName("")
    setPrice("")
    setAdvantage("")
    setFeature("")
    setMainCd(null)
    setMiddleCd(null)
    setSubCd(null)
    setMiddleCdList([])
    setSubCdList([])
    closeHandler()
  }
  const  addProductInitHandler = ()=>{
    if(name==="" || price==="" || advantage==="" || feature===""||
      mainCd===""||middleCd===""||subCd==="" ){
      notification.warn({
        message:  '입력값이 존재하지 않습니다.',
        duration: 5,
        placement: 'bottomRight'
      })
      return
    }

    if(addProductHandler && typeof addProductHandler ==='function')
      addProductHandler({
        "product_nm" : name,
        "prd_price" : price.replaceAll(",",""),
        "prd_merits" : advantage,
        "prd_majer_fn" : feature,
        'sbjt_id': id,
        "prd_class_main_cd":mainCd,
        "prd_class_middle_cd":middleCd,
        "prd_class_sub_cd":subCd,
      })
    closeInitHandler()
  }

  return (
    <LimeModal title={'제품 추가'} visible={visible} closable={false}  closeHandler={closeInitHandler}>
      <>
        <div className="grid-col-3 items-center">
          <div className="col-span-1">
            <div className="form-label-text">제품명</div>
          </div>
          <div className="col-span-2">
            <input type="text" value={name||""} onChange={changeNameHandler} placeholder="제품명 입력" maxLength={150}/>
          </div>
        </div>
        <div className="grid-col-3 items-center pt-16">
          <div className="form-label-text">제품 분류코드</div>
          <div className="col-span-2 flex-row-cont select-sets">
            <Select placeholder="대분류"
                    style={{ width: '100%' }}
                    value={mainCd ? mainCd : null}
                    disabled={prdClassCdList.loading}
                    onChange={changeMainCdHandler}>
              {mainCdList?.map(main=><Option key={main.prd_class_cd_id} value={main.prd_class_cd_id}>{main.prd_class_cd}</Option>)}
            </Select>
            <Select placeholder="중분류"
                    value={middleCd ? middleCd : null}
                    style={{ width: '100%' }}
                    disabled={prdClassCdList.loading}
                    onChange={changeMiddleCdHandler}>
              {middleCdList?.map(middle=><Option key={middle.prd_class_cd_id} value={middle.prd_class_cd_id}>{middle.prd_class_cd}</Option>)}

            </Select>
            <Select placeholder="소분류"
                    value={subCd ? subCd : null}
                    disabled={prdClassCdList.loading}
                    style={{ width: '100%' }}
                    onChange={changeSubCdHandler}>
              {subCdList?.map(sub=><Option key={sub.prd_class_cd_id} value={sub.prd_class_cd_id}>{sub.prd_class_cd}</Option>)}

            </Select>
          </div>
        </div>
        <div className="grid-col-3 items-center pt-16">
          <div className="col-span-2">
            <div className="form-label-text">제품 가격</div>
          </div>
          <div className="col-span-1">
            <input type="text" pattern="[0-9]+" value={price||0} onChange={changePriceHandler}  className="text-right" placeholder="원" maxLength={150}/>
          </div>
        </div>
        <hr className="w-full mtb-24"/>
        <div className="form-label-text mb-8">제품 장점</div>
        <textarea rows="3" className="mtb-8 noresize"  placeholder="제품 장점 입력하기" value={advantage||""} onChange={changeAdvantageHandler} ></textarea>
        <div className="form-label-text mb-8 mt-16">제품 주요 기능</div>
        <textarea rows="3" className="mtb-8 noresize" placeholder="제품 주요 기능 입력하기" value={feature||""} onChange={changeFeatureHandler} ></textarea>
        <div className="modal-btn-2 mt-16">
          <button type="button" className="btn-tertiary-48" onClick={closeInitHandler}>닫기</button>
          <button type="button" className="btn-primary-48 flex-1" onClick={addProductInitHandler} >추가하기</button>
        </div>
      </>
    </LimeModal>
  )
}

export default ProductModal
