import React, { useEffect } from "react";
import * as d3 from "d3";

const MixChart = (chartData) => {
  useEffect(() => {
    if(chartData?.chartData)
    makeGraph(chartData);
  }, [chartData]);

  const makeGraph = (chartData) => {
    // setting canvas
    const width = 1300;
    const height = 400;
    const margin = { top: 60, left: 40, bottom: 40, right: 40 };

    const svg = d3
      .select("#mixchart_svg")
      .attr("width", width)
      .attr("height", height);

    // data
    const data = chartData.chartData;

    // setting axis
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.data_nm))
      .range([margin.left + 130, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.data_value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const y1 = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.table_value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g) => {
      return g
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));
    };

    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left + 130}, 0)`)
        .call(
          d3
            .axisLeft(y)
            .tickValues([0, 4000000, 8000000, 12000000, 16000000, 20000000])
          //.tickSize(-width)
        )
        .call((g) => g.select(".domain").remove())
        .attr("class", "grid");

    const yAxisRight = (g) =>
      g
        .attr("transform", `translate(1270, 0)`)
        .call(
          d3
            .axisRight(y1)
            .tickValues([0, 4, 8, 12, 16, 20])
            .tickSize(-width + 200)
        )

        .call((g) => g.select(".domain").remove())
        .attr("class", "grid");

    // apply axis to canvas
    svg.append("g").call(xAxis).attr('font-size', '14px');
    svg.append("g").call(yAxis).attr('font-size', '14px');
    svg.append("g").call(yAxisRight).attr('font-size', '14px');

    // vertical bar chart
    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (data) => x(data.data_nm) + (x.bandwidth() / 2 - 20))
      .attr("y", (data) => y(data.data_value))
      .attr("width", 40)
      .attr("height", (data) => y(0) - y(data.data_value))
      .attr("class", "bar-chart")
      .attr("fill", "#4472C4");

    svg.selectAll(".text")
      .data(data)
      .enter()
      .append("text")
      .attr("class","label")
      .attr("x", (function(d) { return x(d.data_nm) + 30; }  ))
      .attr("y", function(d) { return y(d.data_value) - 20; })
      .attr("dy", ".75em")
      .text(function(d) { return d.data_value; })
      .text(d => d.data_value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))

    //line chart
    const line = d3
      .line()
      .x((d) => x(d.data_nm) + x.bandwidth() / 2)
      .y((d) => y1(d.table_value));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 5)
      .attr("d", line);

    const legend = svg.append("g")
          .attr("text-anchor", "end")
          .selectAll("g")
          .data([{'text':'테이블현황','color':'orange'},{'text':'데이터현황','color':'#4472C4'}])
          .enter().append("g")
          .attr("transform", function(d, i) { return "translate(0," + (i * 20) + ")"; });

    legend.append("rect")
      .attr("x", width - 20)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", function(d) { return d.color; });

    legend.append("text")
      .attr("x", width - 30)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d.text; });

  };

  return <svg id={"mixchart_svg"}></svg>;
};
export default MixChart;
