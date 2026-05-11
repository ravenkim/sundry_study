import React, { useEffect } from "react";
import * as d3 from "d3";
import makeBarChartGraph from "../MakeBarChartGraph";

const TableBarChart = (chartData) => {
  useEffect(() => {
    if(chartData?.chartData)
    makeBarChartGraph('table_barchart_svg', chartData);
  }, [chartData]);

  return <svg id="table_barchart_svg"></svg>;
};

export default TableBarChart;
