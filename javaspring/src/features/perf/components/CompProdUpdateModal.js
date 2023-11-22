import React, { useEffect, useState } from 'react'
import LimeModal from 'features/common/modal/LimeModal'
import { Modal, notification } from 'antd'

const CompProdUpdateModal = ({ visible, closeHandler, updateCompProdHandler, item }) => {

  const [id, setId] = useState('')

  const [companyName, setCompanyName] = useState('')

  const changeCompanyNameHandler = e => setCompanyName(e.target.value)

  const [productName, setProductName] = useState('')

  const changeProductNameHandler = e => setProductName(e.target.value)

  const [productNumber, setProductNumber] = useState('')

  const changeProductNumberHandler = e => setProductNumber(e.target.value)

  const [price, setPrice] = useState('')

  const changePriceHandler = e => setPrice(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,').replace(/(^0+)/, ""))

  const [nationId, setNationId] = useState('')

  const changeNationIdHandler = e => setNationId(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))

  const closeInitHandler = () => {
    closeHandler()
  }
  const addCompProductInitHandler = () => {
    if (companyName === '' || productName === '' || productNumber === '' || price === '' || nationId === '') {
      notification.warn({
        message:  '입력값이 존재하지 않습니다.',
        duration: 5,
        placement: 'bottomRight'
      })
      return
    }
    if (updateCompProdHandler && typeof updateCompProdHandler === 'function')
      updateCompProdHandler({
        'company_nm': companyName,
        'company_prd': productName,
        'com_prd_number': productNumber,
        'com_prd_price':  price.replaceAll(",",""),
        'nation_id': nationId,
        'comp_prd_id': id
      })
    closeInitHandler()
  }
  useEffect(()=>{
    if(item) {
      setId(item?.comp_prd_id)
      setCompanyName(item?.company_nm)
      setPrice(item.com_prd_price?.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,').replace(/(^0+)/, ""))
      setProductName(item?.company_prd)
      setProductNumber(item?.com_prd_number)
      setNationId(item?.nation_id)
    }

  },[item])
  return (
    <LimeModal title={'경쟁제품 수정'} visible={visible} closable={false} closeHandler={closeHandler}>
      <>
        <div className="grid-col-3 items-center pt-16">
          <div className="form-label-text">회사명</div>
          <div className="col-span-2">
            <input type="text" placeholder="회사명 입력"  maxLength={150} value={companyName || ""} onChange={changeCompanyNameHandler} />
          </div>
        </div>
        <div className="grid-col-3 items-center pt-16">
          <div className="form-label-text">회사 제품</div>
          <div className="col-span-2">
            <input type="text" placeholder="제품명 입력" maxLength={150} value={productName|| ""} onChange={changeProductNameHandler} />
          </div>
        </div>
        <div className="grid-col-3 items-center pt-16">
          <div className="form-label-text">회사 제품번호</div>
          <div className="col-span-2">
            <input type="text" placeholder="제품번호 입력"  maxLength={150} value={productNumber|| 0} onChange={changeProductNumberHandler} />
          </div>
        </div>
        <div className="grid-col-3 items-center pt-16">
          <div className="col-span-2">
            <div className="form-label-text">회사 제품가격</div>
          </div>
          <input type="text" className="text-right" placeholder="원"  maxLength={150} value={price|| 0} onChange={changePriceHandler} />
        </div>
        <div className="grid-col-3 items-center pt-16">
          <div className="col-span-2">
            <div className="form-label-text"  >국가번호</div>
          </div>
          <input type="text" placeholder="ex. 82"  value={nationId|| ""} maxLength={150} pattern="[0-9]+" onChange={changeNationIdHandler}/>
        </div>
        <div className="modal-btn-2 mt-24">
          <button type="button" className="btn-tertiary-48" onClick={closeHandler}>닫기</button>
          <button type="button" className="btn-primary-48 flex-1" onClick={addCompProductInitHandler}>수정하기</button>
        </div>
      </>
    </LimeModal>
  )
}

export default CompProdUpdateModal
