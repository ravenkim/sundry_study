import React, {useEffect, useState} from "react";
import ReactPlot from "react-plotly.js";

const LimeRadarChart = (
  {
    dataSource=[],
    label=[],
    axisVisible=true,
    autoRange= false,
    range,
    showLegend=true,
    size= [700, 450],
    useForced=false,
  }
) => {



  const [validate, setValidate] = useState({error: false, detail: ""});
  const [maxLength, setMaxLength] = useState(0);
  useEffect(() => {
    if (label && label.length > 0) {
      const dataLength = label.length;
      label.push(label[0]);
      dataSource.forEach(data => {
        if (data.value.length !== dataLength) {
          setValidate({error: true, detail: "데이터-라벨 length 불일치"});
        }
        let maxValue = Math.max(...data.value);

        if(!range){
          maxValue > maxLength ? setMaxLength(maxValue) : setMaxLength(maxLength);
        }else{
          setMaxLength(range);
        }

      })
    } else {
      setValidate({error: true, detail: "label 없음"});
    }
  },[]);

  const layout = {
    polar: {
      radialaxis: {
        visible: axisVisible,
        // range: range ? range : [0, maxLength],
        range: [0, maxLength],
        autorange: autoRange
      }
    },
    showlegend: showLegend,
    width: size[0],
    height: size[1]
  };
  const data = dataSource.map((data) => {
    return {
      type: "scatterpolar",
      r: data.value,
      theta: label,
      fill: 'toself',  // 'none', 'toself', 'tonext'
      name: data.name,
      hovertemplate: "%{theta}: %{r}",
      marker: {
        color: data.color ? data.color : "",
        // size: 50  // dot size
      },
      hoveron: "points" // 'points', 'fills', 'points + fills'
    }
  });

  return (
    <>
      {validate.error && !useForced ?
        <span>{validate.detail}</span>
        :
        <ReactPlot data={data} layout={layout} />
      }
    </>

  )
}

export default LimeRadarChart;