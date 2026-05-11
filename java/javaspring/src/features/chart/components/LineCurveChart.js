import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { getCurveStackbarlegendColor } from "features/chart/utils/chartUtils";
import "features/chart/styles/LineCurveChart.scss";
import { Spin } from "antd";

const WIDTH_PLUS_PX = 50;

const LineCurveChart = ({
  curveChartId,
  downloadFileName,
  width,
  height,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  dataSource,
}) => {
  const lineCurveChartRef = useRef();


  const lineColor = [
    "#F2BAC9",
    "#30C862",
    "#FF765A",
    "#FE5157",
    "#9C73F1",
    "#3D348B",
    "#FED449",
    "#FF765A",
    "#087E8B",
    "#06BEE1",
    "#539EFF",
  ];
  if (curveChartId === "keywordCurve") {
    dataSource.forEach(data => data.color = lineColor[dataSource.indexOf(data)]);
  }

  d3.select(lineCurveChartRef.current).html("<div></div>");
  let margin = {
    top: marginTop ? marginTop : 10,
    right: marginRight ? marginRight : 25,
    bottom: marginBottom ? marginBottom : 20,
    left: WIDTH_PLUS_PX,
    // left: marginLeft ? marginLeft : 30,
  };

  let w = width
    ? width - margin.left - margin.right
    : 1240 - margin.left - margin.right;
  let harfW = w - 60;
  let h = height
    ? height - margin.top - margin.bottom
    : 200 - margin.top - margin.bottom;

  const parseDate = d3.timeParse("%Y");

  let scaleX = d3.scaleTime().range([0, w]);

  let scaleY = d3.scaleLinear().range([h, 10]);

  let color = d3.scaleOrdinal(d3.schemeCategory10);

  let xAxis = d3.axisBottom().scale(scaleX);

  let yAxis = d3.axisLeft().scale(scaleY);

  let line = d3
    .line()
    .x(function (d) {
      return scaleX(d.date);
    })
    .y(function (d) {
      return scaleY(d.yCount);
    })
    .curve(d3.curveMonotoneX);

  let svg;

  useEffect(() => {
    if (dataSource && dataSource.length > 0 ) {
      svg = d3
        .select(lineCurveChartRef.current)
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        // .style("background-color","lightGreen")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      color.domain(
        d3.keys(dataSource[0].item[0]).filter(function (key) {
          return key !== "date";
        })
      );
    }
  },[dataSource])


  useEffect(() => {
    if (lineCurveChartRef.current && dataSource && dataSource.length > 0) {
      // data.forEach(function (d) {
      //   d.date = parseDate(String(d.date).trim());
      // });
      let rangeCity = color.domain().map(function (name) {
        return {
          name: name,
          values: dataSource.map(data => data.item.map(function (d) {
            return {
              date: d.date,
              yCount: +d[name],
            };
          }),
          )};
      });
      
      // X축 동적
      let valueYear = [];
      let allYear = [];
      dataSource.map(data =>
        data.item.map(i => {
          if (i.yCount !== 0) {
            valueYear.push(Number(i.date));
          } else {
            allYear.push(Number(i.date));
          }
      }));

      let minYear = Math.min(...valueYear);
      valueYear.length > 0 ? (minYear%2 === 1 ? minYear -=3 : minYear -=2) : minYear = Math.min(...allYear);

      dataSource.map(data => data.item = data.item.filter(d => Number(d.date) >= minYear));

      scaleX.domain([parseDate(String(`${minYear}`).trim()), parseDate(String("2020").trim())])

      scaleY.domain([
        d3.min(rangeCity, function (c) {
          return d3.min(c.values, function (v) {
            return d3.min(v, function (y) {
              return y.yCount;
            })
          });
        }),
        d3.max(rangeCity, function (c) {
          return d3.max(c.values, function (v) {
            return d3.max(v, function (y) {
              return y.yCount*1.2
            })
          });
        }),
      ]);

      const names = dataSource.map(data => data.name);

      const colors = dataSource.map(data =>data.color);

      dataSource.map(data => {
        if (data.visible) {
          let cities = color.domain().map(function (name) {
            return {
              name: name,
              values: data.item.map(function (d) {
                return {
                  date: parseDate(String(d.date).trim()),
                  yCount: +d[name],
                };
              }),
            };
          });

          // let data = myData;
          svg
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis)

          svg
            .append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("fill", "black")
            // .text("yCount (ºF)");
            .text("Count/건수");


          let city = svg
            .selectAll(`.city ${curveChartId} ${data.name}`)
            .data(cities)
            .enter()
            .append("g")
            .attr("class", `.city ${curveChartId} ${data.name}`);

          city
            .append("path")
            .attr("class", `lineCurve ${curveChartId}`)
            .attr("d", function (d) {
              return line(d.values);
            })
            // 라인 굵기
            .style("stroke-width", "3px")
            // 라인 컬러
            .style("stroke", `${data.color}`);

          city
            .append("text")
            .datum(function (d) {
              return {
                name: d.name,
                value: d.values[d.values.length - 1],
              };
            })
            .attr("transform", function (d) {
              return (
                "translate(" +
                scaleX(d.value.date) +
                "," +
                scaleY(d.value.yCount) +
                ")"
              );
            })
            .attr("x", 3)
            .attr("dy", ".35")
            .attr("font-size", "12px")
            .attr("color", function (d) {
              return getCurveStackbarlegendColor(d.name);
            });

          let mouseG = svg
            .append("g") // this the black vertical line to folow mouse
            .attr("class", `mouse-over-effects`);

          mouseG
            .append("path")
            .attr("class", `mouse-line-${curveChartId}`)
            .style("stroke", "none")
            .style("stroke-width", "1px")
            .style("opacity", "0");

          let lines = document.getElementsByClassName(`lineCurve ${curveChartId}`);

          let mousePerLine = mouseG
            .selectAll(`.mouse-per-line-${curveChartId}`)
            .data(cities)
            .enter()
            .append("g")
            .attr("class", `mouse-per-line-${curveChartId}`);

          mousePerLine
            .append("circle")
            .attr("r", 7)
            // 포인트 컬러
            .style("stroke", `${data.color}`)
            .style("fill", "none")
            .style("stroke-width", "1px")
            .style("opacity", "0");

          mousePerLine.append("text").attr("transform", "translate(10,3)");

          mouseG
            .append("rect")
            .attr("width", w)
            .attr("height", h)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("mouseout", function () {
              d3.select(`.mouse-line-${curveChartId}`).style("opacity", "0");
              d3.selectAll(`.mouse-per-line-${curveChartId} circle`).style("opacity", "0");
              d3.selectAll(`.mouse-per-line-${curveChartId} text`).style("opacity", "0");
            })
            .on("mouseover", function () {
              d3.select(`.mouse-line-${curveChartId}`).style("opacity", "1");
              d3.selectAll(`.mouse-per-line-${curveChartId} circle`).style("opacity", "1");
              d3.selectAll(`.mouse-per-line-${curveChartId} text`).style("opacity", "1");
            })
            .on("mousemove", function () {
              let mouse = d3.mouse(this);
              d3.select(`.mouse-line-${curveChartId}`).attr("d", function () {
                let d = "M" + mouse[0] + "," + h;
                d += " " + mouse[0] + "," + 0;
                return d;
              });

              d3.selectAll(`.mouse-per-line-${curveChartId}`).attr("transform", function (d, i) {
                let xDate = scaleX.invert(mouse[0]),
                  bisect = d3.bisector(function (d) {
                    return d.date;
                  }).right;
                let idx = bisect(d.values, xDate);
                let beginning = 0,
                  end = lines[i].getTotalLength(),
                  target = null;
                let pos;
                while (true) {
                  target = Math.floor((beginning + end) / 2);
                  pos = lines[i].getPointAtLength(target);
                  if (
                    (target === end || target === beginning) &&
                    pos.x !== mouse[0]
                  ) {
                    break;
                  }

                  if (pos.x > mouse[0]) end = target;
                  else if (pos.x < mouse[0]) beginning = target;
                  else break; // position found
                }
                d3.select(this)
                  .select("text")
                  // .text(scaleY.invert(pos.y).toFixed(1))
                  .text(`${names[i]} ${scaleY.invert(pos.y).toFixed(1)}`)
                  // 수치 컬러
                  .attr("fill", `${colors[i]}`)
                  .style("font-size","15px")
                  .style("text-anchor", function (d) {
                    return mouse[0] > harfW ? "end" : "start";
                  })
                  .attr("transform", function (d) {
                    return mouse[0] > harfW
                      ? "translate(-10,3)"
                      : "translate(10,3)";
                  });

                return "translate(" + mouse[0] + "," + pos.y + ")";
              });
            });
          }
        });
      }
  }, [lineCurveChartRef, dataSource]);

  return (
    <>
        <div
          className={`line-curve_chart ${curveChartId}`}
          ref={lineCurveChartRef}
          style={{width: width}}
        />
    </>
  );
};

export default React.memo(LineCurveChart);
