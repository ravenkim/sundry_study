import React, { useEffect, useState } from 'react'
import LimeLayout from 'features/common/layout/components/LimeLayout'
import BubbleChart from 'features/chart/components/BubbleChart'
import sample from 'features/chart/chartDataSample.json'
import sample5 from 'features/chart/sample5.json'
import sampleTest from 'features/chart/sample10.json'
import samplebar from 'features/chart/samplebar.json'
import { Button, Input, List, message, Spin, Switch, Upload } from 'antd'
import BarChart from 'features/chart/components/BarChart'
import SociogramChart from 'features/chart/components/SociogramChart'
import { SNA_TYPE } from 'Constants'
import { UploadOutlined } from '@ant-design/icons'
import LimeGrid from 'features/common/layout/components/grid/LimeGrid'
import LimeGridRow from 'features/common/layout/components/grid/LimeGridRow'
import LimeGridCol from 'features/common/layout/components/grid/LimeGridCol'

const SnaTestPage = () => {

  const [data, setData] = useState(null)
  const [dataType,setDataType] = useState(SNA_TYPE.WORD)

  const onChange=(checked)=> {
    console.log(`switch to ${checked}`);
    setDataType(checked?SNA_TYPE.WORD:SNA_TYPE.PAPER)
  }

 const handleUpload = (e) => {
    console.log(e.target.files[0])
    // You can use any AJAX library you like
   var reader = new FileReader();
   reader.onload = function(event) {
     // The file's text will be printed here
     const sna = JSON.parse(event.target.result)
     if(sna.nodes&&sna.nodes.length>0)
     setData(sna)
     else alert("잘못된 형식의 파일 입력")
   };
   if(e.target.files[0])
   reader.readAsText(e.target.files[0]);
   else alert("파일없음")
  };

  return (
    <LimeLayout>
      <LimeGrid>

        <div style={{ backgroundColor: 'white' }}>
          <input
            type="file"
            onChange={handleUpload}
            accept={".json"}
          />
          <div style={{ width: '600px' }}>
          {/*<Switch checkedChildren="V" unCheckedChildren="YEAR" onChange={onChange}/>*/}
          <SociogramChart
            dataSource={data}
            isUseVRange={true}
            isUseYearRange={true}
            snaType={dataType}
          />
          </div>
        </div>
      </LimeGrid>
    </LimeLayout>
  )
}

export default SnaTestPage
