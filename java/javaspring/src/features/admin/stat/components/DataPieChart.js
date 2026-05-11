import React, { useEffect } from "react";
import makePieChartGraph from "../MakePieChartGraph";

const DataPieChart = (chartData) => {
  useEffect(() => {
    if(chartData?.chartData)
    makePieChartGraph('data_piechart_svg', chartData);
  }, [chartData]);

  return <div id="data_piechart_svg"></div>;
};
export default DataPieChart;
