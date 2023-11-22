import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import { createUnitSymbol } from 'features/perf/utils/PerfMethod'
import { CONFIRM_STATE_CODE } from 'features/perf/utils/PerfCode'

const PerfTable = ({
  type = 'indicator',
  title = '없음',
  buttonTitle = '없음',
  size = 'normal',//half
  loading = false,
  data,
  addButtonHandler = () => {},
  deleteButtonHandler = () => {},
  searchSubListHandler = () => {},
  openUpdateModalHandler= () => {},
  clickAble = false,
  tableConfig = {
    cols: ['tmp'],
    headers: [{ title: 'tmp', isClass: true }],
    keys: [{ data: 'tmp', isClass: true }]
  }
}) => {

  const [dataRows, setDataRows] = useState([])

  const [checkCount, setCheckCount] = useState(0)

  const [allCheckStatus, setAllCheckStatus] = useState(false)

  const checkItemListHandler = () => {
    return dataRows.filter(row => {
      return row.checked
    })
  }

  const rowClickHandler = (e, item) => {
    if (clickAble && e.target.localName !== 'input' && e.target.localName !== 'button') {
      dataRows.forEach(row => {
        if (row === item) {
          row.clicked = true
          if (typeof searchSubListHandler === 'function')
            searchSubListHandler(row.product_id)
        } else row.clicked = false
        return row
      })
      setDataRows(dataRows)

    }

  }
  const rowAllCancelHandler = () => {
    dataRows.forEach(row => {
      row.checked = false
    })
    setCheckCount(0)
    setDataRows(dataRows)
    setAllCheckStatus(false)
  }
  const rowAllCheckHandler = () => {
    dataRows.forEach(row => {
      row.checked = !allCheckStatus
    })
    setDataRows(dataRows)
    if (!allCheckStatus)
      setCheckCount(dataRows.length)
    else setCheckCount(0)
    setAllCheckStatus(!allCheckStatus)
  }

  const rowCheckHandler = (e, item) => {
    let checkCount = 0
    dataRows.forEach(row => {
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
    setAllCheckStatus(checkCount === dataRows.length)
    setCheckCount(checkCount)
    setDataRows(dataRows)

  }
  useEffect(() => {
    setAllCheckStatus(false)
    setCheckCount(0)
    if (data && data.length > 0){
      setDataRows(JSON.parse(JSON.stringify(data)).map(product => {
        product.checked = false
        product.clicked = false
        return product
      }))

    }
    else if (data) setDataRows([])
  }, [data])


  return (
    <>
      <Spin spinning={loading}>
        {title &&
          <div className="flex-row items-center gap-16 ptb-16 plr-16">
            <h4>{title}</h4>
            {type === 'product' && (
              <button type="button" className="btn-icon-left-primary-32 pr-24 ml-auto"
                      onClick={() => addButtonHandler('product')}>
                <span className="mdi mdi-plus"></span>{buttonTitle} 추가
              </button>
            )}
            {type === 'product_pi' && (
              <>
                <button type="button" className="btn-tertiary-32 ml-auto"
                        onClick={() => addButtonHandler('unit')}>단위관리
                </button>
                <button type="button" className="btn-tertiary-32 plr-24"
                        onClick={() => addButtonHandler('product_pi')}>성능지표 관리
                </button>
                <button type="button" className="btn-icon-left-secondary-32 pr-24"
                        onClick={() => addButtonHandler('product_pi_add')}>
                  <span className="mdi mdi-plus"></span>{buttonTitle} 추가
                </button>
              </>
            )}
            {type === 'comp_prod' && (
              <>
                <button type="button" className="btn-icon-left-secondary-32 pr-24 ml-auto"
                        onClick={() => addButtonHandler('comp_prod')}>
                  <span className="mdi mdi-plus"></span>{buttonTitle} 추가
                </button>
              </>
            )}
          </div>
        }
        <div className={`table-indicator plr-16 pt-0 pb-8`}>
          <span><b>{dataRows.length}</b>개의 {title} 중 <strong>{checkCount}</strong>개 선택</span>
          <button type="button" className="delete" disabled={!(checkCount > 0)} onClick={() =>deleteButtonHandler(checkItemListHandler())}>선택삭제</button>
          <button type="button" className="cancel" disabled={!(checkCount > 0)} onClick={rowAllCancelHandler}>선택취소</button>
        </div>
        <hr className="w-full m-0"/>
        <div className="table-wrap" style={{ height: `calc((100vh - 306px)${size === 'half' ? `/2 + 9px` : `/1`})` }}>
          <table className="striped">
            <colgroup>
              <col width={``}/>
              {tableConfig.cols.map((col, index) =>(<col key={index} width={`${col}`}/>))}
            </colgroup>
            <thead>
            <tr style={{cursor:'default'}}>
              <th className="table-check"><input type="checkbox" checked={allCheckStatus} readOnly
                                                 onClick={rowAllCheckHandler}/>
              </th>
              {tableConfig.headers.map((header, index) =>
                (<th key={index} className={`${header.isClass ? 'text-right' : ''}`}>{header.title}</th>)
              )}
            </tr>
            </thead>
            <tbody id="tbody-for" className="tbody">
            {dataRows && dataRows.map((row, index) =>
              (
                <tr key={index} className={`${row.clicked ? 'bg-light-blue' : ''}`}  style={{cursor:`${clickAble?"pointer":"Default"}`}}
                    onClick={e => rowClickHandler(e, row)}
                    readOnly>
                  <td className="table-check" onClick={e => rowCheckHandler(e, row)}><input type="checkbox" readOnly
                                                                                            checked={row.checked}
                  /></td>
                  {tableConfig.keys.map((key, index) => {
                      if (key.data.includes("_bt")) {
                        return (
                          <td  key={index} className="overflow-visible text-right">
                            <button type="button"
                                    className="btn-tertiary-32 plr-16"
                                    onClick={(e)=>openUpdateModalHandler(e,type,row)}>
                              {row[key.data]}
                            </button>
                          </td>
                        )
                      }
                    if (key.data==="unit_info") {
                      if(row[key.data]){
                        return (
                          (<td key={index} className={`${key.isClass ? 'text-right' : ''} ${(row["unit_del_yn"] === 'N' || key.data!=="unit_info") && (row["confirm_state"]!==CONFIRM_STATE_CODE.REJECT.code) ? '' : 'text-red font-bold-400'}}`}>{row.unit_nm}({createUnitSymbol(row[key.data])})</td>)
                        )
                      }

                      return (
                        (<td key={index} className={`${key.isClass ? 'text-right' : ''} ${(row["unit_del_yn"] === 'N' || key.data!=="unit_info") && (row["confirm_state"]!==CONFIRM_STATE_CODE.REJECT.code) ? '' : 'text-red font-bold-400'}}`}>단위 없음</td>)
                      )
                    }
                      return (<td key={index} className={`${key.isClass ? 'text-right' : ''} ${(row["unit_del_yn"] === 'N' || key.data!=="unit_info")&& (row["confirm_state"]!==CONFIRM_STATE_CODE.REJECT.code) ? '' : 'text-red font-bold-400'}`}>{row[key.data]}</td>)
                    }
                  )}
                </tr>
              )
            )}
            </tbody>
          </table>
        </div>
      </Spin>
    </>
  )
}

export default PerfTable
