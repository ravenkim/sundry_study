import React, { useEffect, useState, useCallback } from "react";
import Plotly from "plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";
import * as koLocale from "plotly.js/lib/locales/ko.js";
import { FONT_FAMILY_STRING, DEBUG } from "Constants";

Plotly.register(koLocale);
Plotly.setPlotConfig({ locale: "ko" });
const Plot = createPlotlyComponent(Plotly);

/**
 * Plotly Treemap Chart
 * @param width
 * @param height
 * @param dataSource
 * @param layout
 * @param config
 * @param style
 * @param title
 * @returns {JSX.Element}
 * @constructor
 */
const TreemapChart = ({
  width,
  height,
  dataSource,
  layout,
  config,
  style,
  title,
}) => {
  const [_parents, set_parents] = useState();
  const [_labels, set_labels] = useState();
  const [_values, set_values] = useState();
  const [_ids, set_ids] = useState();
  const [_text, set_text] = useState();

  const setChartDataHandler = useCallback((data) => {
    set_parents(data[0].parents);
    set_labels(data[0].labels);
    set_values(data[0].values);
    set_ids(data[0].ids);
    set_text(data[0].text);
  }, []);

  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      setChartDataHandler(dataSource);
    }
  }, [dataSource]);

  return (
    <>
      {title && <h4>{title}</h4>}
      {dataSource && (
        <Plot
          config={config ? config : { displayModeBar: false, scrollZoom: true }}
          data={[
            {
              type: "treemap",
              parents: _parents,
              labels: _labels,
              values: _values,
              ids: _ids,
              outsidetextfont: {
                size: 15,
                color: "#333",
                family: "Noto Sans Korean",
              },
              leaf: { opacity: 0.4 },
              marker: { line: { width: 2 } },
              hoverinfo: "text",
              hovertext: _text,
            },
          ]}
          layout={
            layout
              ? {
                  ...layout,
                  font: {
                    ...layout.font,
                    family: FONT_FAMILY_STRING,
                  },
                  hoverlabel: {
                    align: "left",
                  },
                }
              : {
                  font: {
                    family: FONT_FAMILY_STRING,
                  },
                  margin: {
                    l: 1,
                    r: 1,
                    b: 1,
                    t: 1,
                    pad: 0,
                  },
                  paper_bgcolor: "rgba(255,0,0,0)",
                  hoverlabel: {
                    align: "left",
                  },
                }
          }
          style={{
            height: height ? height : "100%",
            width: width ? width : "100%",
            backgroundColor: "rgba(255,0,0,0)",
            ...style,
          }}
        />
      )}
    </>
  );
};

export default React.memo(TreemapChart);
