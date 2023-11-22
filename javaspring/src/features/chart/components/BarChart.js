import React, { useEffect, useState } from "react";
import Plotly from "plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";
import * as koLocale from "plotly.js/lib/locales/ko.js";
import { getRamdomCustomColor } from "utils/commonUtils";
import { getCurveStackbarlegendColor } from "features/chart/utils/chartUtils";
import { FONT_FAMILY_STRING } from "Constants";

Plotly.register(koLocale);
Plotly.setPlotConfig({ locale: "ko" });
const Plot = createPlotlyComponent(Plotly);
/**
 *  // {
        //   x: [1, 2, flase
        //   y: [2, 6, 3],
        //   type: "alc scatter",
        //   mode: "lines+markers",
        //   marker: { color: "red" },
        // },`
 */

const getWidthArray = (dataLength) => {
  let emptyArray = Array.apply(null, Array(dataLength));
  return emptyArray.map((v) => dataLength * 0.08);
};

const BarChart = ({
  dataSource,
  dataType,
  layout,
  onClickClass,
  config,
  style,
  unitString = "건",
  widthEdit = false,
}) => {
  const HOVER_TEMPLATE = "%{x}<br>%{y:,} " + unitString + "<extra></extra>";

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      //Immutable data parsing
      let data = JSON.parse(JSON.stringify(dataSource));
      setChartData(() => {
        switch (dataType) {
          case "socio":
            const colorMap = data[0]["x"].map(
              () =>
                // getRamdomCustomColor(125, 255, 0, 185, 0, 185) // 붉은색계열
                getRamdomCustomColor(0, 185, 0, 185, 125, 255) // 푸른색계열
            );
            if (widthEdit) {
              return [
                {
                  ...data[0],
                  type: "bar",
                  width: getWidthArray(colorMap.length),
                  marker: { color: colorMap },
                  hovertemplate: HOVER_TEMPLATE,
                },
              ];
            } else {
              return [
                {
                  ...data[0],
                  type: "bar",
                  marker: { color: colorMap },
                  hovertemplate: HOVER_TEMPLATE,
                },
              ];
            }
            break;
          case "socio_network":
            let tmpChartData = data.splice(1, data.length - 1);
            let returnOdj = {
              x: [],
              y: [],
              marker: { color: [] },
              classCode: [],
              hovertemplate: [],
            };
            tmpChartData.map((value) => {
              returnOdj.x.push(value[0]);
              returnOdj.y.push(value[1]);
              returnOdj.marker.color.push(value[2]);
              returnOdj.classCode.push(value[4]);
              returnOdj.hovertemplate.push(HOVER_TEMPLATE);
            });
            return [{ ...returnOdj, type: "bar" }];
          case "group":
            let groupData = [];
            // console.log("data", data);
            data.map((g, index) => {
              let groupColorMap = [];
              for (let i = 0; i < g.x.length; i++) {
                groupColorMap.push(getCurveStackbarlegendColor(g.name));
              }

              g.type = "bar";
              g.hovertemplate =
                g.name +
                "<br>%{x}년<br>%{y:,} " +
                unitString +
                "<extra></extra>";
              g.marker = { color: groupColorMap };
              groupData.push(g);
            });
            return groupData;
            break;
          default:
            return data;
            break;
        }
      });
    }
  }, [dataSource, dataType]);

  return (
    <Plot
      data={chartData}
      layout={
        layout
          ? {
              ...layout,
              font: {
                ...layout.font,
                family: FONT_FAMILY_STRING,
              },
              autosize: true,
              xaxis: {
                tickmode: "auto",
              },
              hoverlabel: {
                align: "left",
              },
              hovermode: "closest",
            }
          : {
              xaxis: {
                tickmode: "auto",
              },
              hovermode: "closest",
              // width: width ? width : 600,
              // height: height ? height : 600,
              // title: "A Fancy Plot",
              // showlegend: showlegend, // 레전드가 하나여도 노출
              autosize: true,
              margin: {
                l: 30,
                r: 10,
                b: 25,
                t: 10,
                // pad: 4,
              },
              font: {
                family: FONT_FAMILY_STRING,
              },
              hoverlabel: {
                align: "left",
              },
            }
      }
      config={config ? config : { displayModeBar: true, displaylogo: false }}
      style={{ height: "100%", width: "100%", ...style }}
      useResizeHandler={true}
      onClick={({ points }) => {
        if (dataType === "socio_network") {
          onClickClass(points[0].data.classCode[points[0].pointIndex]);
        }
      }}
    />
  );
};

export default React.memo(BarChart);
