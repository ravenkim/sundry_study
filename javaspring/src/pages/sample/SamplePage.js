import React from 'react';
import LimeRadarChart from "features/chart/components/LimeRadarChart"
const SamplePage = () => {

  const dataSource = [
    {
      value: [80, 96, 62, 83, 72, 53],
      name: '평가위원',
      color: "blue"
    },
    {
      value: [100, 60, 72, 59, 70, 74],
      name: '분과'
    }
  ];

  const label = ['기술분류1', '기술분류2', '기술분류3', '기술분류4', '기술분류5', '기술분류6']

  return (
    <>
      <LimeRadarChart dataSource={dataSource} label={label}/>
    </>
  )
};

export default SamplePage;