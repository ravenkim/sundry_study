import * as d3 from "d3";

const makePieChartGraph = (id, chartData) => {
  // setting canvas
  const width = 550;
  const height = 430;
  const margin = 10;
  const radius = Math.min(width, height) / 2 - margin;
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

  // data
  const data = chartData.chartData;

  const pie = d3.pie().value(function(d) {
    return d.value;
  }).sort(null);

  const arc = d3.arc().innerRadius(radius*0.4).outerRadius(radius);

  const outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);
  const d3svg = d3.select("#"+id)
                  .append('svg')
                  .attr("width", width+130)
                  .attr("height", height+40);
  const tooltip = d3.select("#"+id)
                    .append('div')
                    .attr('class', 'tooltip')
                    .style('opacity',0);

  tooltip.append('div').attr('class', 'label');
  tooltip.append('div').attr('class', 'count');
  tooltip.append('div').attr('class', 'percent');

  const svg = d3svg
    .append("g")
    .attr("transform", "translate(" + (width / 2 + 50) + "," + (height / 2 + 10) + ")");

  const arcs = svg
    .selectAll(".allSlices")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs.append("path")
      .attr("fill", (d, i) => color(i))
      .attr("d", arc)
      .attr("stroke", "white")
      .style("stroke-width", "0px")
      .on('mouseover', function(d) {
        tooltip.select(".label").html(d.data.data_nm)
        tooltip.select(".count").html(d.data.value > 0 ? d.data.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0)
        const total = d3.sum(data, function (d) {
          return d.value
        });
        tooltip.select(".percent").html(Math.round(d.data.value / total * 100)+"%")

        tooltip.style("left", (d3.event.pageX+12) + "px")
            .style("top", (d3.event.pageY-10) + "px")
            .style("opacity", 0.9)
            .style('position', 'absolute')
            .style('width', '150px')
            .style('height', 'auto')
            .style('padding', '10px')
            .style('background-color', 'white')
            .style('-webkit-border-radius', '10px')
            .style('-moz-border-radius', '10px')
            .style('border-radius', '10px')
            .style('-webkit-box-shadow', '4px 4px 10px rgba(0, 0, 0, 0.4)')
            .style('-moz-box-shadow', '4px 4px 10px rgba(0, 0, 0, 0.4)')
            .style('box-shadow', '4px 4px 10px rgba(0, 0, 0, 0.4)')
            .style('pointer-events', 'none')

        var endAngle = d.endAngle + 0.2;
        var startAngle = d.startAngle - 0.2;

        var arcOver = d3.arc().innerRadius(radius*0.3).outerRadius(radius*1.1);
        d3.select(this)
          .attr("stroke","white")
          .transition()
          //.duration(1000)
          .attr("d", arcOver)
          .attr("stroke-width",6);

      })
      .on('mouseout', function() {
        tooltip.style("opacity", 0);
        d3.select(this).transition()
          .attr("d", arc)
          .attr("stroke","none");
      });

  const midAngle = (d) => {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  const text = svg.selectAll(".labels")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "labels");

  // Append text labels to each arc
  text.append("text")
    .attr("transform", function(d, i) {
      const pos = outerArc.centroid(d);
      pos[0] = radius * (midAngle(d) < Math.PI ? 1.1 : -1.1);

      const percent = (d.endAngle - d.startAngle)/(2*Math.PI)*100
      if(percent<3){
        pos[1] += i*30
      }else{
        pos[1] += i*0.6
      }

      return "translate("+ pos +")";
    })
    .attr("fill", function(d,i) { return color(i); })
    .attr("text-anchor", 'left')
    .attr("dx", function(d){
      const ac = midAngle(d) < Math.PI ? 0:-50
      return ac
    })
    .attr("dy", 5 )
    .text(function(d, i) {
      return d.data.value > 0 ? d.data.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
    });

  const polyline = text.selectAll("polyline")
    .data(pie(data), function(d) {
      return d.data.value;
    })
    .enter()
    .append("polyline")
    .attr("points", function(d,i) {
      const pos = outerArc.centroid(d);
      pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
      const o = outerArc.centroid(d)
      const percent = (d.endAngle -d.startAngle)/(2*Math.PI)*100
      if(percent<3){
        pos[1] += i*30
      }else{
        pos[1] += i*0.6
      }
      return [outerArc.centroid(d),[o[0],pos[1]] , pos];
    })
    .style("fill", "none")
    .attr("stroke", function(d,i) { return color(i); })
    .style("stroke-width", "1px");


  // const legend = d3svg.selectAll(".legend")
  //   .data(pie(data))
  //   .enter().append("g")
  //   .attr("transform", function(d,i){
  //     return "translate(" + (width - 5) + "," + (i * 20 + 300) + ")";
  //   })
  //   .attr("class", "legend");
  //
  // legend.append("rect")
  //   .attr("width", 10)
  //   .attr("height", 10)
  //   .attr("fill", function(d, i) {
  //     return color(i);
  //   });
  //
  // legend.append("text")
  //   .text(function(d){
  //     return d.data.data_nm;
  //   })
  //   .style("font-size", 15)
  //   .attr("y", 10)
  //   .attr("x", 11);

};

export default makePieChartGraph;