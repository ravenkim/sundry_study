import React, { useEffect } from "react";
import makePieChartGraph from "../MakePieChartGraph";

const TablePieChart = (chartData) => {
  useEffect(() => {
    if(chartData?.chartData)
    makePieChartGraph('table_piechart_svg', chartData);
  }, [chartData]);

  return <div id="table_piechart_svg"></div>;
};
export default TablePieChart;
