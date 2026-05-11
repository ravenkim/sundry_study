import React from 'react'
import { Select } from 'antd'
import { UNIT_STATE_CODE } from 'features/perf/utils/PerfCode'

const UnitSelect = ({ unitInput, changeUnitInputHandler ,unitState }) => {

  return (
    <>
      <div className="frame-border p-16 mt-16">
        <div className="grid-col-3 gap-16 items-center">
          <div className="form-label-text">단위 직접 입력</div>
          <div className="col-span-2">
            <input type="text" id="searchAuto" maxLength={150} disabled={unitState===UNIT_STATE_CODE.NONE.code} className="search-auto" placeholder="단위 검색어 입력" value={unitInput} onChange={changeUnitInputHandler}/>
          </div>
        </div>
      </div>
    </>
  )
}

export default UnitSelect
