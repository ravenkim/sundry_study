import * as d3 from "d3";

const makeBarChartGraph = (id, chartData) => {
  // setting canvas
  const width = 430;
  const height = 370;

  const color = d3.scaleOrdinal([
    "#FB497C",
    "#FF7714",
    "#F9C921",
    "#03BDA0",
    "#4ECCFF",
    "#8474DB",
    "#3C3C3C",
    "#007AE2"
  ]);

  const svg = d3
    .select("#"+id)
    .attr("width", width+250)
    .attr("height", height+100);

  // data
  const data = chartData.chartData;

  const maxObj = data.reduce(function (max, obj) {
    return obj.value > max.value ? obj : max;
  });

  const chart = svg.append('g')
    .attr('transform', `translate(130, 50)`);

  // Draw X axis
  const xScale = d3.scaleLinear()
    .range([width, 0])
    .domain([maxObj.value, 0]);

  // Draw Y axis
  const yScale = d3.scaleBand()
    .range([0, height])
    .domain(data.map((s) => s.data_nm))
    .padding(0.1);

  const axisLeft = d3.axisLeft(yScale).tickFormat(function (d) {
    return d;
  });

  chart.append('g')
    .attr('transform', `translate(0, 0)`)
    .call(d3.axisTop(xScale))
    //.attr('class', 'domain').remove()
    .attr('font-size', '12px')
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "start")
  ;

  chart.append('g')
    .attr('transform', `translate(0, 0)`)
    .attr('class', 'y-axis')
    .call(axisLeft)
    .attr('font-size', '12px');

  d3.selectAll(".y-axis .tick text")
    .attr("class", "bar-label"); // Add a class to the bar labels

  // Draw gridlines - vertical
  chart.append('g')
    .attr('class', 'grid')
    .call(d3.axisTop()
      .scale(xScale)
      .tickSize(-height, 0, 0)
      .tickFormat(''))
    ;

  // chart.append("g")
  //   .attr("class", "x-axis")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(d3.axisTop(xScale))
  //   .selectAll("text")
  //   .attr("y", 0)
  //   .attr("x", 9)
  //   .attr("dy", ".35em")
  //   .attr("transform", "rotate(90)")
  //   .style("text-anchor", "start");

  // // Draw bars
  chart.selectAll()
    .data(data)
    .enter()
    .append('rect')
    .attr("class", "bar")
    //.attr("fill", (d, i) => color(i))
    .attr("fill", "#4472C4")
    .attr('y', (s) => yScale(s.data_nm)+ yScale.bandwidth() / 2 - 10)
    .attr('x', 0)
    .attr('width', (s) => xScale(s.value))
    .attr('height', yScale.bandwidth() / 2);

  chart.append("g")
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("class", "label-bar")
    .attr("x", d => xScale(d.value))
    .attr("y", d => yScale(d.data_nm))
    .attr("dx", 10)
    .attr("dy", 27)
    .text(d => d.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
};

export default makeBarChartGraph;
