import React from "react";
import React, { useEffect, useState } from "react";
import Plotly from "plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";
import * as koLocale from "plotly.js/lib/locales/ko.js";
import { getRamdomCustomColor } from "utils/commonUtils";
import { FONT_FAMILY_STRING, DEBUG } from "Constants";

Plotly.register(koLocale);
Plotly.setPlotConfig({ locale: "ko" });
const Plot = createPlotlyComponent(Plotly);

const ScatterChart = ({
  dataSource,
  dataType,
  layout,
  onClickClass,
  config,
  style,
  unitString = "건",
  showlegend = true,
}) => {
  const HOVER_TEMPLATE = "%{x}<br>%{y:,} " + unitString + "<extra></extra>";
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setChartData(() => {
      if (dataType === "socio" && dataSource && dataSource.length > 0) {
        const colorMap = dataSource[0]["x"].map(
          (index) =>
            // getRamdomCustomColor(125, 255, 0, 185, 0, 185) // 붉은색계열
            getRamdomCustomColor(0, 185, 0, 185, 125, 255) // 푸른색계열
        );
        return [
          {
            ...dataSource[0],
            type: "scatter",
            marker: { color: colorMap },
            hovertemplate: HOVER_TEMPLATE,
          },
        ];
      } else if (
        dataType === "socio_network" &&
        dataSource &&
        dataSource.length > 0
      ) {
        let tmpChartData = dataSource.splice(1, dataSource.length - 1);
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
        return [{ ...returnOdj, type: "scatter" }];
      } else if (dataType === "group" && dataSource && dataSource.length > 0) {
        let groupData = [];
        dataSource.map((g) => {
          g.type = "scatter";
          groupData.push(g);
          // g.hovertemplate = HOVER_TEMPLATE;
        });

        return groupData;
      } else {
        return dataSource;
      }
    });
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
            }
          : {
              hovermode: "closest",
              xaxis: {
                tickmode: "auto",
              },
              // width: width ? width : 600,
              // height: height ? height : 600,
              // title: "A Fancy Plot",
              showlegend: showlegend, // 레전드가 하나여도 노출
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
      config={config ? config : { displayModebar: true, displaylogo: false }}
      style={{ height: "95%", width: "100%", ...style }}
      useResizeHandler={true}
      onClick={({ points }) => {
        if (dataType === "socio_network") {
          onClickClass(points[0].data.classCode[points[0].pointIndex]);
        }
      }}
    />
  );
};

export default React.memo(ScatterChart);
