import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MixChart from './components/MixChart'
import TablePieChart from './components/TablePieChart'
import DataPieChart from './components/DataPieChart'
import TableBarChart from './components/TableBarChart'
import DataBarChart from './components/DataBarChart'
import { statAction } from 'features/admin/stat/statReducer'
import BarChart from 'features/chart/components/BarChart'

const CommStat = () => {
  const dispatch = useDispatch()
  const {
    statList,

  } = useSelector(({ statReducer }) => ({
    statList: statReducer.statList,
  }))

  const [data, setData] = useState(null)
  const [dataValueList, setDataValueList] = useState(null)
  const [tableValueList, setTableValueList] = useState(null)
  const [barTableData, setBarTableData] = useState(null)
  const [barData, setBarData] = useState(null)
  const [pieTableData, setPieTableData] = useState(null)
  const [pieData, setPieData] = useState(null)
  useEffect(() => {
    dispatch(statAction.getStatList())
  }, [])

  useEffect(() => {
    if (statList?.data && statList.data.state) {
      setData(statList.data.result)
    }
  }, [statList])

  useEffect(() => {
    if (data) {
      console.log(data)
      setDataValueList(data.map(item => {
        return { data_nm: item.data_nm, value: item.data_value }
      }))
      setTableValueList(data.map(item => {
        return { data_nm: item.data_nm, value: item.table_value }
      }))
      setPieData([{
        type: 'pie',
        labels: data.map(item => {
          return item.data_nm
        }),
        values: data.map(item => {
          return item.data_value
        }),
        texttemplate: "%{value}",
      }])
      setPieTableData( [{
        type: 'pie',
        labels: data.map(item => {
          return item.data_nm
        }),
        values: data.map(item => {
          return item.table_value
        }),
        texttemplate: "%{value}",
        }]
      )
      setBarData([{
        type: 'bar',
        x: data.map(item => {
          return item.data_nm
        }),
        y: data.map(item => {
          return item.data_value
        })
      }])
      setBarTableData( [{
        type: 'bar',
        x: data.map(item => {
          return item.data_nm
        }),
        y: data.map(item => {
          return item.table_value
        })
      }])
    }
  }, [data])

  // data
  // const data = [
  //   { data_nm: "PMS 사업 정보", data_value: 6937, table_value: 6 },
  //   { data_nm: "예산 및 공고 정보", data_value: 3942, table_value: 3 },
  //   { data_nm: "인력 정보", data_value: 685473, table_value: 2 },
  //   { data_nm: "평가위원 정보", data_value: 3536757, table_value: 15 },
  //   { data_nm: "평가위원 신청 정보", data_value: 303667, table_value: 2 },
  //   { data_nm: "평가위원회 정보", data_value: 19184939, table_value: 11 },
  //   { data_nm: "평가 및 평가지 정보", data_value: 13223072, table_value: 20 },
  //   { data_nm: "기타", data_value: 6148535, table_value: 4 },
  // ];

  // const dataValueList = data.map(item => {
  //   return {data_nm:item.data_nm, value:item.data_value}
  // });
  //
  // const tableValueList = data.map(item => {
  //   return {data_nm:item.data_nm, value:item.table_value}
  // });

  return (
    <>
      <div className="grid-col-full p-16">
        <div className="main-height-chart">
          <div className="grid-left p-0 border-box" style={{ height: '500px' }}>
            <h4 className="p-16 pt-24">수집데이터 현황</h4>
            <div style={{ height: '426px' }}>
              <MixChart chartData={data}></MixChart>
            </div>
          </div>

          <div className="grid-col-2 gap-16 mtb-24 border-box" style={{ height: '560px' }}>
            <div className="grid-left p-0">
              <h4 className="p-16 pt-24">테이블 현황</h4>
              <div style={{ height: '486px' }}>
                <TablePieChart chartData={tableValueList}></TablePieChart>
              </div>

            </div>
            <div className="grid-right p-0">
              <h4 className="p-16 pt-24">데이터 현황</h4>
              <div style={{ height: '486px' }}>
                <DataPieChart chartData={dataValueList}></DataPieChart>
              </div>
            </div>
          </div>

          {/*<div className="grid-col-2 gap-16 mtb-24 border-box">*/}
          {/*  <div className="grid-left p-0">*/}
          {/*    <h4 className="p-16 pt-24">테이블 현황</h4>*/}
          {/*    <div style={{ height: '600px' }}>*/}
          {/*      <BarChart*/}
          {/*        // style={{ width: 1100, height: 500 }}*/}
          {/*        dataSource={pieTableData}*/}

          {/*      />*/}
          {/*    </div>*/}

          {/*  </div>*/}
          {/*  <div className="grid-right p-0">*/}
          {/*    <h4 className="p-16 pt-24">데이터 현황</h4>*/}
          {/*    <div style={{ height: '600px' }}>*/}
          {/*      <BarChart*/}
          {/*        // style={{ width: 1100, height: 500 }}*/}
          {/*        dataSource={pieData}*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}

          <div className="grid-col-2 gap-16 mt-24 border-box" style={{ height: '630px' }}>
            <div className="grid-left p-0">
              <h4 className="p-16 pt-24">테이블 현황</h4>
              <div style={{ height: '546px' }}>
                <TableBarChart chartData={tableValueList}></TableBarChart>
              </div>
            </div>

            <div className="grid-right p-0">
              <h4 className="p-16 pt-24">데이터 현황</h4>
              <div style={{ height: '546px' }}>
                <DataBarChart chartData={dataValueList}></DataBarChart>
              </div>
            </div>
          </div>

          {/*<div className="grid-col-2 gap-16">*/}
          {/*  <div className="grid-left p-0">*/}
          {/*    <h4 className="p-16 pt-24">테이블 현황</h4>*/}
          {/*    <div style={{ height: '600px' }}>*/}
          {/*      <BarChart*/}
          {/*        // style={{ width: 1100, height: 500 }}*/}
          {/*        dataSource={barTableData}*/}
          {/*        layout={{*/}
          {/*          legend: {*/}
          {/*            bgcolor: "rgba(0,0,0,0)",*/}
          {/*            yanchor: "top",*/}
          {/*            y: 1.6,*/}
          {/*            xanchor: "left",*/}
          {/*            x: 0.01,*/}
          {/*            orientation: "h",*/}
          {/*          },*/}
          {/*        }}*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*  </div>*/}

          {/*  <div className="grid-right p-0">*/}
          {/*    <h4 className="p-16 pt-24">데이터 현황</h4>*/}
          {/*    <div style={{ height: '600px' }}>*/}
          {/*      <BarChart*/}
          {/*        // style={{ width: 1100, height: 500 }}*/}
          {/*        dataSource={barData}*/}
          {/*        layout={{*/}
          {/*          legend: {*/}
          {/*            bgcolor: "rgba(0,0,0,0)",*/}
          {/*            yanchor: "top",*/}
          {/*            y: 1.6,*/}
          {/*            xanchor: "left",*/}
          {/*            x: 0.01,*/}
          {/*            orientation: "h",*/}
          {/*          },*/}
          {/*        }}*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}

        </div>
      </div>

    </>
  )
}

export default CommStat
