import React, { Fragment, useEffect, useState } from 'react'
import { Select } from 'antd'
import { getOperatorList, getUnitOperatorList, UNIT_STATE_CODE, UNIT_TYPE_CODE } from 'features/perf/utils/PerfCode'
import { createUnitSymbol } from 'features/perf/utils/PerfMethod'

const { Option } = Select

const UnitCompose = ({ unitCompose, setUnitCompose,unitList,composeResult ,composeResultHandler,unitState}) => {

  const compose = {
    operator: null,
    constant: '',
    ref_unit_no1: '',
    unit_symbol: '',
    multiplier: ''
  }

  const numberExit = ["0","1"]
  const [composeList, setComposeList] = useState([])

  const initCompose = () =>{
    setUnitCompose('')
    setComposeList([{ ...compose }])
  }

  const changeComposeHandler = (index,key,value)=>{
    composeList.forEach((compose,i)=>{
      if(i===index)
      {
        compose[key] = value
        if(key==="unit_symbol"){
          compose["ref_unit_no1"] = unitList.find(unit=>unit.symbol===value)?.unit_no
        }
        if(compose.unit_symbol.includes("<sup>"))
          compose.multiplier=""
      }
    })

    setComposeList([...composeList])

  }


  const addComposeHandler = ()=>{
    setComposeList(old=>[...old,{...compose}])
  }

  useEffect(()=>{
    if(composeResult?.length>0){
      setComposeList(composeResult.map(compose=>{
       compose["unit_symbol"] =  unitList.find(unit=>unit.unit_no===compose.ref_unit_no1)?.symbol
        return compose
      }))
    }
    else setComposeList([{...compose}])
  },[composeResult])

  useEffect(()=>{
    if(composeList?.length>0) {
      let result = ""
      composeList.forEach(compose => {
          result += `${compose.operator||""}${compose.constant&&!numberExit.find(n=>n===compose.constant)?compose.constant:""}${unitList.find(unit=>unit.unit_no===compose.ref_unit_no1)?.symbol||""}${compose.multiplier&&!numberExit.find(n=>n===compose.multiplier)?`<sup>${compose.multiplier}</sup>` : ""}`
      })
      setUnitCompose(result)
      composeResultHandler(composeList)
    }
  },[composeList])


  return (
    <>
      <div className="frame-border p-16 mt-16">
        <div className="flex-row items-center mb-16">
          <h5>단위조합</h5>
          <button type="button" disabled={unitState===UNIT_STATE_CODE.NONE.code} className="btn-icon-left-tertiary-32 plr-8 ml-auto" onClick={addComposeHandler}>
            <span className="mdi mdi-plus m-0"></span>추가하기&nbsp;&nbsp;
          </button>
        </div>

        <div className="overflow-auto" style={{ height: '102px' }}>
          {composeList?.map((compose, index) =>
            <React.Fragment key={index}>
              <div className={`form-label-text mb-8 ${index===0?"":"mt-16"}`}>조합 {index + 1}</div>
              <div className="grid-col-4 gap-8 items-center">
                <Select placeholder="operator" disabled={unitState===UNIT_STATE_CODE.NONE.code}
                                 style={{ width: '100%' }}
                                 value={compose.operator}
                                 onChange={v=>changeComposeHandler(index,"operator",v)}>
                  {
                    (index!==0)&&(getUnitOperatorList().map((based,index)=>
                      (
                        <Option key={index} value={based.code}>{based.code}</Option>
                      )
                    ))
                  }
                </Select>

                <input type="text" placeholder="계수"  value={compose.constant|| ''} disabled={unitState===UNIT_STATE_CODE.NONE.code || !compose.unit_symbol} maxLength={150}
                       onChange={e=>changeComposeHandler(index,"constant",e.target.value)}/>
                <Select placeholder="단위 선택" disabled={unitState===UNIT_STATE_CODE.NONE.code}
                        value={unitList.find(unit=>unit.unit_no===compose.ref_unit_no1)?.symbol}
                        style={{ width: '100%' }}
                        listItemHeight={20}
                        onChange={v=>changeComposeHandler(index,"unit_symbol",v)}>
                  {
                    unitList.map(unit => <Option key={unit.unit_no} value={unit.symbol|| ''}  >
                      {createUnitSymbol(unit)}
                    </Option>)
                  }
                </Select>
                <input type="text" placeholder="승수" className="square"  value={compose.multiplier || ''} disabled={unitState===UNIT_STATE_CODE.NONE.code || compose?.unit_symbol?.includes("<sup>") || !compose.unit_symbol} maxLength={150}
                       onChange={e=>changeComposeHandler(index,"multiplier",e.target.value)}/>
              </div>
            </React.Fragment>
          )
          }
        </div>
      </div>
      <div className="flex-row gap-16 items-center mt-16">
        <div className="form-label-text mr-24">조합 단위 결과</div>
        {/*<input type="text" className="flex-1" placeholder="ex. m/s (m, s 2개의 unit)" value={unitCompose} />*/}
        <div dangerouslySetInnerHTML={ {__html: unitCompose?unitCompose:"ex. m/s (m, s 2개의 unit)"} } className="frame-border p-16 ptb-8 flex-1"/>
        <button type="button" className="btn-tertiary-40 right"  disabled={unitState===UNIT_STATE_CODE.NONE.code} onClick={() => initCompose()}>초기화</button>
      </div>
    </>
  )
}

export default UnitCompose
