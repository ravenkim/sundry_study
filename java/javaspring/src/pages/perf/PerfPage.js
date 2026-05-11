/**
 * 시간 : 2022-03-16
 * 작성자 :
 **/
import React from 'react'
import LimeLayout from 'features/common/layout/components/LimeLayout'
import PerfIndicator from 'features/perf/PerfIndicator'
const PerfPage = ({ children }) => {
  return (
    <LimeLayout title={"제품성능지표"}>
      <PerfIndicator/>
    </LimeLayout>
  )
}

export default PerfPage
