import React, { useEffect, useRef, useState, useCallback } from "react";
import Plotly from "plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";
import * as koLocale from "plotly.js/lib/locales/ko.js";
import { FONT_FAMILY_STRING } from "Constants";
import { numberForamat } from "utils/commonUtils";

Plotly.register(koLocale);
Plotly.setPlotConfig({ locale: "ko" });
const Plot = createPlotlyComponent(Plotly);

const getPlotlyTrace = (lookup, year, secondColumn) => {
  // lookup => {}
  let byYear, trace;
  if (!(byYear = lookup[year])) {
    byYear = lookup[year] = {};
  }
  if (!(trace = byYear[secondColumn])) {
    trace = byYear[secondColumn] = {
      x: [],
      y: [],
      id: [],
      text: [],
      marker: { size: [] },
    };
  }
  return trace;
};

const getRangeSpace = (range) => {
  //[0, 25308.800000000003]
  //[-108.52600000000001, 2035.0000000000002]
  const newRange = range.map((value) => {
    if (value === 0) {
      return -2;
    } else {
      return value * 1.2;
    }
  });
  return newRange;
};
const YAXIS_TITLE = "전년대비출현증가율";
const XAXIS_TITLE = "누적 출현 수";

const BubbleChart = ({
  dataSource,
  config,
  style,
  divId,
  autoStart = false,
  xrange,
  yrange,
  sizeRef = 0.05,
  layoutProps,
  sliderProps,
  updatemenusProps,
  xaxisProps,
  yaxisProps,
  chartTitle = "",
}) => {
  const [lastTrace, setLastTrace] = useState([]);
  const [currentYear, setCurrentYear] = useState();
  const [raceVariables, setRaceVariables] = useState({
    traces: [],
    layout: {},
    frames: [],
    name: [],
  });
  const [raceLayout, setRaceLayout] = useState(layoutProps ? layoutProps : {});

  // useEffect(() => {
  //   console.log("raceVariables.layout", raceVariables.layout);
  // }, [raceVariables.layout]);
  const getChartData = useCallback((data, xrange, yrange) => {
    let lookup = {};

    let frames = [];
    let names = [];
    let sliderSteps = [];

    let lastTrace = [];

    // for (let i = 0; i < data.length; i++) {
    data.map((datum) => {
      let trace = getPlotlyTrace(lookup, datum.year, datum.group);
      trace.text.push(
        datum.id +
          "<br>" +
          XAXIS_TITLE +
          ": " +
          numberForamat(datum.x) +
          "건<br>" +
          YAXIS_TITLE +
          ": " +
          datum.y +
          "%"
      );
      trace.id.push(datum.id);
      trace.y.push(datum.y);
      trace.x.push(datum.x);
      trace.marker.size.push(datum.size);
    });

    // }
    let years = Object.keys(lookup);

    if (years.length === 0) return;

    let firstYear = lookup[years[0]];
    let lastYear = lookup[years[years.length - 1]];
    let groups = Object.keys(firstYear);

    // if (DEBUG) console.log("lastYear", lastYear);
    groups.map((group) => {
      lastTrace.push({
        name: group,
        x: lastYear[group].x.slice(),
        y: lastYear[group].y.slice(),
        id: lastYear[group].id.slice(),
        text: lastYear[group].text.slice(),
        mode: "markers",
        marker: {
          size: lastYear[group].marker.size.slice(),
          sizemode: "area",
          sizeref: sizeRef,
          sizemin: 10, // 10px 고정
        },
      });
    });

    years.map((year) => {
      frames.push({
        name: year,
        data: groups.map(function (group) {
          return getPlotlyTrace(lookup, year, group);
        }),
      });
      names.push(year);

      sliderSteps.push({
        method: "animate",
        // autoplay: true,
        label: year,
        args: [
          [year],
          {
            mode: "immediate",
            transition: { duration: 500 },
            frame: { duration: 500, redraw: true },
          },
        ],
      });
    });
    // {size: 11648122, year: "2020", x: 7420, y: 0.06, id: "영상데이터", group: "영상데이터"}
    const layout = {
      // automargin: true,
      font: {
        family: FONT_FAMILY_STRING,
      },
      showlegend: true,
      // defaultanimationconfig: { autoplay: true },

      // autoscale: true,
      // autosize: true,
      xaxis: {
        title: XAXIS_TITLE + "(건)",
        // autorange: true,
        // fixedrange: false,

        range: xrange ? getRangeSpace(xrange.xrange) : [0, 1500], // TODO: range 오면 해당하는 데이터에서 넣기.
        ...xaxisProps,
      },
      yaxis: {
        title: YAXIS_TITLE + "(%)",
        ticksuffix: "%",
        // autorange: true,
        // fixedrange: false,
        // tickformat: "%",
        // type: "log",
        range: yrange ? getRangeSpace(yrange.yrange) : ["-200", 500],

        ...yaxisProps,
      },
      hovermode: "closest",
      hoverlabel: {
        align: "left",
      },
      updatemenus: [
        updatemenusProps
          ? updatemenusProps
          : {
              x: 0,
              y: 0,
              yanchor: "top",
              xanchor: "left",
              showactive: true,
              direction: "left",
              type: "buttons",
              pad: { t: 87, r: 10 },
              buttons: [
                {
                  method: "animate",
                  args: [
                    null,
                    {
                      // mode: "immediate",
                      fromcurrent: true,
                      transition: {
                        duration: 1000,
                        easing: "quadratic-in-out",
                      },
                      // frame: { duration: 1100, redraw: false },
                      frame: { duration: 1000, redraw: true },
                    },
                  ],
                  // label: "시작",
                  label: "<span style='font-size:14px'>▶</span>",
                },
                {
                  method: "animate",
                  args: [
                    [null],
                    {
                      mode: "immediate",
                      transition: { duration: 1000 },
                      frame: { duration: 1000, redraw: true },
                    },
                  ],
                  // label: "정지",
                  label: "<span style='font-size:14px'>■</span>",
                },
              ],
            },
      ],
      // Finally, add the slider and use `pad` to position it
      // nicely next to the buttons.
      sliders: [
        {
          active: names.length - 1,
          pad: { l: 130, t: 55 },
          currentvalue: {
            visible: true,
            prefix: "연도:",
            xanchor: "right",
            font: { size: 16, color: "#666" },
          },
          transition: { easing: "cubic-in-out" },
          steps: sliderSteps,
          ...sliderProps,
        },
      ],
      ...layoutProps,
      legend: {
        itemsizing: "constant",
        ...layoutProps.legend,
        // traceorder: "grouped",
      },
    };

    setLastTrace(lastTrace);
    setCurrentYear(names[names.length - 1]);
    setRaceVariables({
      traces: lastTrace,
      layout: layout,
      frames: frames,
      names: names,
    });
    setRaceLayout(layout);
  }, []);

  useEffect(() => {
    // console.log("race data : ", data);
    // console.log("data, config, style, divId, autoStart = false, xrange, yrange  : ", data, config, style, divId, xrange, yrange);
    if (dataSource) {
      getChartData(dataSource, xrange, yrange);
    }
  }, [dataSource, xrange, yrange]);

  // useEffect(() => {
  //   if (DEBUG) console.log("raceVariables", raceVariables);
  // const { traces, layout, frames } = raceVariables;
  // if (traces !== [] && frames !== []) {
  //   Plotly.newPlot("SliderRace", {
  //     data: traces,
  //     layout: layout,
  //     // frames: frames,
  //   }).then(function () {
  //     Plotly.addFrames("SliderRace", frames);
  //   });
  //   startAnimation();
  // }
  // }, [raceVariables]);

  // const startAnimation = () => {
  //   Plotly.animate(divId ? divId : "SliderRace", raceVariables.names, { mode: "afterall" });
  // };

  const raceChartRef = useRef();
  // const [chartIndex, setChartIndex] = useState(0);
  // useEffect(() => {
  //   if (raceChartRef && raceChartRef.current) {
  //     const { traces, layout, frames } = raceVariables;
  //     if (traces !== [] && frames !== []) {
  //       // console.log("raceChartRef.current", raceChartRef.current);
  //       // console.log("tmpXrange[chartIndex]", tmpXrange[chartIndex]);
  //     }
  //   }
  //   // setRaceLayout((prev) => ({
  //   //   xaxis: {
  //   //     ...prev.xaxis,
  //   //     autorange: false,
  //   //     range: tmpXrange[chartIndex],
  //   //   },
  //   // }));
  // }, [chartIndex]);

  // useEffect(() => {
  //   console.log("raceLayout", raceLayout);
  //   // Plotly.relayout(divId ? divId : "SliderRace", raceLayout);
  // }, [raceLayout]);

  return (
    <div>
      {chartTitle && <h4>{chartTitle}</h4>}

      <Plot
        config={config ? config : { displayModeBar: false }}
        style={{ height: "100%", width: "100%", ...style }}
        divId={divId ? divId : "SliderRace"}
        ref={raceChartRef}
        data={lastTrace}
        // data={raceVariables.traces}
        layout={raceVariables.layout}
        // layout={chartIndex === 0 ? raceVariables.layout : raceLayout}
        frames={raceVariables.frames}
        // onInitialized={({ data }) => {
        //   if (autoStart && data.length > 0) {
        //     startAnimation();
        //   }
        // }}
        // onSliderChange={({ slider, step }) => {
        //   if (slider && step) {
        //     const sliderIndex = slider.active;
        //     console.log("sliderIndex", sliderIndex);
        //     setCurrentYear(raceVariables.names[sliderIndex]);
        // const xrange = tmpXrange[sliderIndex];
        // console.log("xrange", xrange);
        // setChartIndex(sliderIndex);
        // setRaceVariables((prev) => {
        //   console.log("prev", prev);
        //   return {
        //     ...prev,
        //     layout: {
        //       ...prev.layout,
        //       xaxis: {
        //         ...prev.layout.xaxis,
        //         range: xrange,
        //       },
        //     },
        //   };
        // });
        //   }
        // }}
      />
    </div>
  );
};

export default React.memo(BubbleChart);
