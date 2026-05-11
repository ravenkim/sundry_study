import React, { useEffect } from "react";
import * as d3 from "d3";
import makeBarChartGraph from "../MakeBarChartGraph";

const DataBarChart = (chartData) => {
  useEffect(() => {
    if(chartData?.chartData)
    makeBarChartGraph('data_barchart_svg', chartData);
  }, [chartData]);

  return <svg id="data_barchart_svg"></svg>;
};

export default DataBarChart;
