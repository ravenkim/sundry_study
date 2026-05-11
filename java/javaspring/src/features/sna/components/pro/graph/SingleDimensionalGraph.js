import React, { useCallback, useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { FIELD_TYPE, GRAPH_TITLE_MODE } from "Constants";
import { isNumeric, getColor, stringToSubstring } from "utils/commonUtils";
import * as d3 from "d3";
import ReactResizeDetector from "react-resize-detector";

const SingleDimensionalGraph = ({
  snaKey,
  snaId,
  graphRef,
  darkMode = false,
  titleMode,
  titleLength,
  nodeSize,
  linkLineWidth,

  dataSource,

  zoom,
  width = 1200,
  height = 1200,

  dagMode = "zout", //노드의 배치 형태 td (top-down), bu (bottom-up), lr (left-to-right), rl (right-to-left), zout (near-to-far), zin (far-to-near), radialout (outwards-radially) or radialin (inwards-radially)
  d3AlphaDecay = 0.0128,
  d3VelocityDecay = 0.4,
  dagLevelDistance = 30,

  polygon = false,

  zoomChangeHandler,
  graphWrapResizeHandler,
}) => {
  const [zoomToFixTypeSpace, setZoomToFixTypeSpace] = useState([]);
  const [graphZoom, setGraphZoom] = useState(zoom);

  useEffect(() => {
    let space = "";
    let arr = [];
    for (let i = 0; i < 100; i++) {
      space = space + " ";
      arr.push(space);
    }
    setZoomToFixTypeSpace(arr);
  }, []);

  /*******************************************************************************
   * NODE
   *******************************************************************************/
  const [highlightNodes, setHighlightNodes] = useState([]);

  /**
   * SNA 노드 클릭 HANDLER
   */
  const nodeClickHandler = (node) => {
    console.log("node : ", node);
    // if (sort === FIELD_TYPE.MBR) {
    //   if (node.openYn === "N") {
    //     return false;
    //   }
    // }
    //
    // if (isWord) {
    //   // ntis 기과닝ㄹ 경우에 다르게
    //   if (sort === FIELD_TYPE.ORGN_NTIS) {
    //     let nodes = node.n.split(",");
    //     let nodeList = [];
    //     if (nodes) {
    //       nodes.map((node, idx) => {
    //         let listObj = { key: node, title: node, action: false };
    //         nodeList.push(listObj);
    //       });
    //     }
    //     setDetailWordDataList(nodeList);
    //     setDetailWordVisible(true);
    //   } else if (sort === FIELD_TYPE.ORGN_KEIT) {
    //     let nodes = node.n.split(",");
    //     let nodeList = [];
    //     if (nodes) {
    //       nodes.forEach((node, idx) => {
    //         let nodeTitle = "";
    //         if (node && node.length > 0) {
    //           const nodeSplit = node.split(":::");
    //           if (nodeSplit && nodeSplit.length === 2) {
    //             nodeTitle = nodeSplit[1];
    //           } else {
    //             nodeTitle = "상세정보가 없습니다.";
    //           }
    //         } else {
    //           nodeTitle = "상세정보가 없습니다.";
    //         }
    //         let listObj = { key: node, title: nodeTitle, action: false };
    //         nodeList.push(listObj);
    //       });
    //     }
    //     setDetailWordDataList(nodeList);
    //     setDetailWordVisible(true);
    //
    //     // let nodes = node.n.split(",");
    //     // let nodeList = [];
    //     // if (nodes) {
    //     //   nodes.map((node, idx) => {
    //     //     let listObj = { key: node, title: node, action: false };
    //     //     nodeList.push(listObj);
    //     //   });
    //     // }
    //     // setDetailWordDataList(nodeList);
    //     // setDetailWordVisible(true);
    //   } else {
    //     detailWordViewClickHandler(node.n);
    //   }
    // } else {
    //   if (sort === FIELD_TYPE.ORGN_NTIS) {
    //     detailWordViewClickHandler(node.n);
    //   } else if (sort === FIELD_TYPE.ORGN_KEIT) {
    //     detailWordViewClickHandler(node.n);
    //   } else {
    //     detailViewClickHandler(node.n);
    //   }
    // }
  };

  /**
   * SNA 노드 우클릭 HANDLER
   */
  const nodeRightClickHandler = (node) => {
    // setDropDownVisibleState((prev) => true); //노드 우클릭 시 만 context menu 활성
    // let filterNode = data.nodes.filter(
    //         (filterNode) => filterNode.id === clickNode.id
    // );
    // if (filterNode && filterNode.length > 0) {
    //   setSocioClickedNodeObject((prev) => filterNode[0]);
    // }
  };

  /**
   * SNA NODE HOVER HANDLER
   */
  const nodeHoverHandler = useCallback(
    (node) => {
      setHighlightNodes(node ? [node] : []);
    },
    [setHighlightNodes]
  );

  /*******************************************************************************
   * LINK
   *******************************************************************************/

  const [highlightLink, setHighlightLink] = useState(null);

  /**
   * SNA LINK 클릭 HANDLER
   */
  const linkClickHandler = () => {};

  /**
   * SNA ZOOM HANDLER
   */
  const zoomHandler = ({ k, x, y }, e) => {};

  /**
   * SNA ZOOM END HANDLER
   */
  const zoomEndHandler = ({ k, x, y }) => {
    setGraphZoom(k);
  };

  useEffect(() => {
    zoomChangeHandler(graphZoom);
  }, [graphZoom]);

  return (
    <>
      {dataSource && (
        <>
          <ForceGraph2D
            key={`sociogram_${snaKey}`}
            ref={graphRef}
            id={snaId} // id is mandatory, if no id is defined rd3g will throw an error
            nodeId="id"
            graphData={dataSource}
            backgroundColor={darkMode ? "#000000" : "#ffffff"}
            // nodeRelSize={6 * nodeSizeRate} //노드 마우스 오버 영역 크기
            nodeLabel={(d) => {
              return `<div style="text-align:center">${d.t}</div>`;
            }}
            // linkLabel={({ id, x, y, source, target, v }) => {t
            //   return `<div style="text-align:center">${source.t} <br /> ↓↓↓↓↓↓ <br /> ${target.t}</div>`;
            // }}
            width={width}
            height={height}
            linkSource="source"
            linkTarget="target"
            // zoom={zoom}
            /*
                                Force Engine Properties
                                */
            dagMode={dagMode}
            d3AlphaDecay={d3AlphaDecay} //시뮬레이션 강도 감소 파라미터를 설정 default = 0.0228
            d3VelocityDecay={d3VelocityDecay} //중간 저항을 시뮬레이션하는 노드의 속도 감소 default = 0.4
            dagLevelDistance={dagLevelDistance} //노드간 거리
            cooldownTime={7000}
            d3Force={({ charge, link }) => {
              link.distance(30);
              charge.strength(0.05);
            }}
            onLinkClick={linkClickHandler}
            onNodeClick={nodeClickHandler}
            onNodeRightClick={nodeRightClickHandler}
            // onBackgroundClick={() => alert("onBackgroundClick")}
            onBackgroundRightClick={(event) =>
              alert("background Click[x,y]=[" + event.x + ", " + event.y + "]")
            }
            onZoom={zoomHandler}
            onZoomEnd={zoomEndHandler}
            onNodeHover={nodeHoverHandler}
            onNodeDragEnd={(node) => {
              node.fx = node.x;
              node.fy = node.y;
            }}
            nodeCanvasObject={(
              { id, t, x, y, g, s, n, cq, cg },
              ctx,
              globalScale
            ) => {
              let group = isNumeric(g)
                ? Number(g)
                : g != undefined
                ? g.charCodeAt(0)
                : "";
              let groupColor = getColor(group);
              ctx.alpha = false;
              ctx.cursor = "pointer";
              // ctx.font = `${12 / globalScale}px Sans-Serif`;
              ctx.textAlign = "left";
              ctx.textBaseline = "middle";

              if (titleMode === GRAPH_TITLE_MODE.CLUSTERING) {
                let clusterRate = 3;

                //근접 CLOSENESS, EIGENVECTOR
                if (cq === "C" || cq === "E" || cq === "E,C") {
                  if (polygon) {
                    let node_coords = [];
                    cg.split(",").map((cgSingle) => {
                      if (cgSingle !== null && cgSingle.length > 0) {
                        dataSource.nodes
                          .filter((prev) => {
                            return prev.cg.indexOf(cgSingle + ",") > -1;
                          })
                          .map((prev) => {
                            node_coords.push(prev);
                          });
                      }
                    });

                    let node_coordsXY = node_coords.map((d) => {
                      return [d.x, d.y];
                    });

                    if (node_coordsXY.length >= 3) {
                      let charToInteger = 0;
                      for (let i = 0; i < cg.length; i++) {
                        charToInteger += cg.charCodeAt(i);
                      }

                      let cliqueColor = getColor(charToInteger);
                      let polygon = d3.polygonHull(node_coordsXY);

                      let polyScale = 1;
                      let valueLines = polygon.map(function (point) {
                        return [
                          Math.round(point[0] * polyScale),
                          Math.round(point[1] * polyScale),
                        ];
                      });
                      //ctx.scale(1.1, 1.1);
                      let firstPos = null;
                      let secondPos = null;
                      ctx.beginPath();
                      ctx.lineWidth = 0.2;
                      if (valueLines.length >= 3) {
                        firstPos = valueLines[0];
                        ctx.moveTo(firstPos[0], firstPos[1]);
                        valueLines.map((point) => {
                          if (secondPos === null) {
                            secondPos = point;
                          } else {
                            // 세점을 이용해 커브 그리기 : 시작x, 시작y, 중간x, 중간y, 끝x, 끝y
                            ctx.bezierCurveTo(
                              firstPos[0],
                              firstPos[1],
                              secondPos[0],
                              secondPos[1],
                              point[0],
                              point[1]
                            );
                            firstPos = point;
                            secondPos = null;
                            ctx.strokeStyle = cliqueColor;
                            ctx.stroke();
                          }
                        });

                        if (secondPos === null) {
                          //루프의 마지막까지 딱맞춰 그린 후 마지막점과 처음점만 이으면 polygon 완성
                          ctx.quadraticCurveTo(
                            valueLines[valueLines.length - 1][0],
                            valueLines[valueLines.length - 1][1],
                            valueLines[0][0],
                            valueLines[0][1]
                          );
                          ctx.strokeStyle = cliqueColor;
                          ctx.stroke();
                        } else if (secondPos !== null) {
                          // 마지막 드로잉이 두점에서 멈춘경우 최초발생점 까지 세점을 이용해 커브 그리기 : 시작x, 시작y, 중간x, 중간y, 끝x, 끝y
                          ctx.bezierCurveTo(
                            firstPos[0],
                            firstPos[1],
                            secondPos[0],
                            secondPos[1],
                            valueLines[0][0],
                            valueLines[0][1]
                          );
                          ctx.strokeStyle = cliqueColor;
                          ctx.stroke();
                        }
                        ctx.globalAlpha = 0.1;
                        ctx.fillStyle = cliqueColor;
                        ctx.fill();
                      }
                    }
                  }

                  ctx.globalAlpha = 1;
                  ctx.font = `${s * nodeSize * clusterRate}px Sans-Serif`;
                  ctx.fillStyle = groupColor;
                  ctx.fillText(
                    "  " + stringToSubstring(t, titleLength),
                    Math.round(x),
                    Math.round(y)
                  );
                }
              } else if (titleMode === GRAPH_TITLE_MODE.AUTO_SCALE) {
                ctx.font = `${s * nodeSize}px Sans-Serif`;
                ctx.fillStyle = groupColor;
                ctx.fillText(
                  "   " + stringToSubstring(t, titleLength),
                  Math.round(x + s + 1),
                  Math.round(y)
                );
              } else if (titleMode === GRAPH_TITLE_MODE.FIX) {
                ctx.font = `${14 / globalScale}px Sans-Serif`;
                ctx.fillStyle = groupColor;

                ctx.fillText(
                  zoomToFixTypeSpace[Math.ceil(s * zoom * 0.23) - 1] +
                    stringToSubstring(t, titleLength),
                  Math.round(x + s + 1),
                  Math.round(y)
                );
              }

              [
                () => {
                  ctx.beginPath();
                  ctx.fillStyle = groupColor;
                  ctx.arc(
                    Math.round(x),
                    Math.round(y),
                    Math.round(s * nodeSize),
                    0,
                    Math.round(2 * Math.PI),
                    false
                  );
                  ctx.fill();
                },
              ][0]();
            }}
            nodeCanvasObjectMode={(node) =>
              highlightNodes.indexOf(node) !== -1 ? undefined : "replace"
            }
            // nodeCanvasObject={paintRing}

            /*
                                Link Styling
                                */
            // linkLabel="value"
            // linkWidth={1}
            // linkDirectionalArrowLength={1.5}
            // linkDirectionalArrowRelPos={5}
            linkDirectionalParticles={5} //linke에 표시되는 개미 숫자(높을수록 빨리 움직이는것 처럼 보임.)
            linkDirectionalParticleWidth={(link) =>
              link === highlightLink ? 4 : 0
            } //링크위에 표시되는 이동 마커의 크기
            linkDirectionalParticleSpeed={0.005} //default 0.01
            linkDirectionalParticleColor={darkMode ? "#000000" : "#ffffff"}
            linkCanvasObject={(link, ctx) => {
              //{ id, x, y, source, target, v } => link
              ctx.beginPath();
              ctx.moveTo(link.source.x, link.source.y);
              //ctx.quadraticCurveTo(60, 10, 90, 90);
              // ctx.bezierCurveTo(10, 10, 90, 10, 50, 90);
              // ctx.arc(50, 50, 40, 0, 7);
              ctx.lineTo(Math.round(link.target.x), Math.round(link.target.y));
              ctx.lineWidth =
                link.v *
                (linkLineWidth * linkLineWidth) *
                (link === highlightLink ? 5 : 1); //line

              let ctxStrokeStyle = darkMode ? "#ffffff" : "#000000";
              if (link === highlightLink) {
                ctxStrokeStyle = "red";
              }
              ctx.strokeStyle = ctxStrokeStyle;
              ctx.stroke();
            }}
            // linkDirectionalArrowLength={10}
            // linkDirectionalArrowRelPos={10}
            // linkWidth={link => (link === highlightLink ? 5 : 1)}
            // linkCurvature={0.13}
          />
          <ReactResizeDetector
            handleWidth
            handleHeight
            onResize={graphWrapResizeHandler}
          />
        </>
      )}
    </>
  );
};

export default SingleDimensionalGraph;
