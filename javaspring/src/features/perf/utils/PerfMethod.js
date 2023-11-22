import React from 'react'

export const createUnitSymbol = (unit) => {
  if(('unit_del_yn' in unit && !(unit.unit_del_yn==="N")) || ('del_yn' in unit && !(unit.del_yn==="N")))
    return "단위 없음"
  const list = unit?.symbol?.split('<sup>')
  return list?.map((compose,index) => {
    if (compose.includes('</sup>')) {
      const last_list = compose.split('</sup>')
      if (last_list?.length > 1)
        return [<sup key={index}>{last_list[0]}</sup>,last_list[1]]
      else return null
    }
    return compose
  })
}
