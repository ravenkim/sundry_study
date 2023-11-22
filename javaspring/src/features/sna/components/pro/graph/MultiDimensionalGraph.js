import React, { useState, useCallback, useEffect, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import * as d3 from "d3";
import {
  default as ts,
  findAncestorsLinks,
  findAncestorsNodes,
  visableDatas,
} from "features/sna/utils/utils";

const MultiDimensionalGraph = ({
  zoom,
  zoomChangeHandler,
  width,
  height,
  dataSource,
  fgRef,
  sections,
  expand,
  range,
  nodeSize,
  nodeDistance = 200,
  forceOpt,
}) => {
  const [hoverNode, setHoverNode] = useState([]);
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [highlightNodes, setHighlightNodes] = useState(new Set());

  const [clusterNodes, setClusterNodes] = useState([]);
  const [selectClusterNode, setSelectClusterNode] = useState(null);

  const [prunedTree, setPrunedTree] = useState();
  const [outerLink, setOuterLink] = useState(null);

  const [graphZoom, setGraphZoom] = useState(zoom);

  /**
   * 차트 그래프 옵션 Setting useEffect
   */
  useEffect(() => {
    if (fgRef && fgRef.current) {
      const fg = fgRef.current;
      // fg.d3Force('collision', d3.forceCollide((node)=>{
      //     console.log(node.depth,10 - parseInt(node.depth.substring(0,1)))
      //     return parseInt(node.depth.substring(0,1))*10
      // }));
      //옵션 조절해봐야함.
      fg.d3Force("center", null); //d3.forceCenter(0, 0)
      fg.d3Force(
        "collide",
        d3.forceCollide((d) => getNodeSize(d.depth))
      );

      fg.d3Force("charge").strength(-200).distanceMax(nodeDistance).theta(-1);
      fg.d3Force(
        "link",
        d3
          .forceLink()
          .id(function (d) {
            return d.id;
          })
          .strength(function (link) {
            if (link.target.depth === link.source.depth) {
              return 0;
            }
            if (link.target.depth === 2) {
              return 0.2;
            }
            if (link.target.depth === 3) {
              return 0.3;
            }
            if (link.target.depth === 4) {
              return 0.4;
            }
            return 0.3;
          })
          .distance((link) => {
            if (link.target.depth === link.source.depth) {
              return 20;
            }
            if (link.target.depth === 2) {
              return 200;
            }
            if (link.target.depth === 3) {
              return 20;
            }
            if (link.target.depth === 4) {
              return 20;
            }
            return 100;
          })
      );
    }
  }, [fgRef, forceOpt, nodeDistance]);

  useEffect(() => {
    console.log("sections : ", sections);
    if (expand || sections || range) {
      console.log("useEffect getPrunedTree : ", dataSource);

      setPrunedTree(getPrunedTree());
    }
  }, [dataSource, expand, sections, range]);

  const getd3Color = (node) => {
    if (node.isCluster) return "#69b3a2";
    return d3.schemeCategory10[node.depth];
  };
  const getNodeSize = (node) => {
    if (node.isCluster) return node.clustersize * 4;
    return (5 - (node.depth % 5)) * nodeSize;
  };

  const filtering = (dataSource) => {
    //필터링 걸리는 부분
    if (!dataSource) return dataSource;
    if (!expand) expand = "";

    let sort = expand;

    if (sort === "-1") sort = "2";
    if (sort === "") sort = 2;
    dataSource.nodes.forEach((node) => {
      //필터링 들어가기전 상위부터 하위노드까지 닫혀있는 노드들 오픈

      if (node._children && !node.children) {
        node.children = node._children;
        node._children = null;
      }
    });

    //모든 노드배열
    dataSource.nodes.forEach((node) => {
      if (node.depth + 1 > sort && node.type !== "cluster") {
        const fnodes = findAncestorsNodes(node, dataSource);
        //섹션 필터링 작업. 섹션에 포함되어있으면 닫기

        if (
          !fnodes.find((n) => sections.includes(n.name)) ||
          sections.length === 0
        )
          if (node.children) {
            node._children = node.children;
            node.children = null;
          }
      }
    });
    return dataSource;
  };

  const nodesByfilter = useMemo(() => {
    if (dataSource) {
      setOuterLink(dataSource.outerlinks ? dataSource.outerlinks : []);
      return filtering(ts()(dataSource));
    }
  }, [dataSource, range, expand, sections]);

  const getPrunedTree = useCallback(() => {
    const visibleNodes = [];
    const visibleLinks = [];
    if (nodesByfilter) {
      const datas = visableDatas(
        nodesByfilter,
        (v_nodes) => {
          if (range) {
            return v_nodes.filter(
              (n) =>
                (range[0] <= parseInt(n.year) &&
                  range[1] >= parseInt(n.year)) ||
                !n.year ||
                n.year === ""
            );
          }
          return v_nodes;
        },
        (v_nodes) => {
          const clusters = [];
          const rm_clusters = [];
          v_nodes.forEach((n) => {
            if (n.type === "cluster") {
              if (n.clustering) rm_clusters.push(...n.clusterchild);
              else {
                clusters.push(n);
              }
            }
          });
          rm_clusters.forEach((n) => {
            const index = v_nodes.indexOf(n);
            if (index > -1) {
              v_nodes.splice(index, 1);
            }
          });

          clusters.forEach((n) => {
            const index = v_nodes.indexOf(n);
            if (index > -1) {
              v_nodes.splice(index, 1);
            }
          });
          return v_nodes;
        }
      );

      visibleNodes.push(...datas.nodes);
      visibleLinks.push(...datas.links);
      Object.assign([], datas.outerlinks).forEach((item) => {
        if (
          visibleNodes.find(
            (node) => node.id === item.source || node.id === item.source.id
          ) === undefined
        )
          return;
        if (
          visibleNodes.find(
            (node) => node.id === item.target || node.id === item.target.id
          ) === undefined
        )
          return;
        visibleLinks.push({ ...item });
      });
    }
    return { nodes: visibleNodes, links: visibleLinks };
  }, [nodesByfilter]);

  /**********************************************************************
   * Force Graph Action
   **********************************************************************/

  /**
   * SNA 노드 클릭 HANDLER
   * @type {(function(*): void)|*}
   */
  const nodeClickHandler = useCallback((node) => {
    // showTable(node);
    if (sections.find((s) => node.name === s)) {
      alert("필터에 등록된 분류 노드입니다. 해지 후 눌러주세요");
      return;
    }

    if (node.depth < expand && node.type !== "cluster") {
      alert("펼침 필터에 적용된 노드입니다. 해지 후 눌러주세요");
      return;
    }

    if (node.type === "cluster") {
      node.clustering = false;
      setPrunedTree(getPrunedTree());
      return;
    }

    if (node.children) {
      node._children = node.children;
      node.children = null;
    } else {
      node.children = node._children;
      node._children = null;
    }

    setPrunedTree(getPrunedTree());
    fgRef.current.centerAt(node.x, node.y, 200);
  }, []);

  const searchPaperLink = useCallback((datas, node) => {
    const filterData = dataSource.links.filter((link) => {
      if (typeof link.source === "object") {
        return link.source.id === node.id;
      } else return link.source === node.id;
    });
    if (node.depth !== 3) {
      filterData.map((l) => {
        if (typeof l.source === "object") {
          datas.push(...searchPaperLink([], l.target));
        } else {
          datas.push(
            ...searchPaperLink(
              [],
              dataSource.nodes.find((n) => n.id === l.target)
            )
          );
        }
      });
    } else datas.push(node.index_key);

    return datas;
  });

  /**
   * Node 우클릭 Handler
   * @type {(function(*=): void)|*}
   */
  const nodeRightClickHandler = useCallback(
    (node) => {
      const DocList = [];

      switch (node.depth) {
        case 0: // 최상위 항목 모든 문서 데이터 출력
        case 1: // 특서, 논문 과제 항목 부분 -> 해당하는 항목의 문서들만 출력
        case 2: // 섹션, 섹션 하위 문서 노드만 출력
        case 3: // 문서, 클릭한 노드의 항목만 출력
          DocList.push(...searchPaperLink([], node));
          break;
        case 4: // 용어, 용어와 연결된 문서 노드 항목 출력
          dataSource.links.forEach((link) => {
            if (typeof link.source === "object") {
              if (link.target.id === node.id) {
                DocList.push(link.source.index_key);
              }
            } else if (link.target === node.id) {
              DocList.push(
                dataSource.nodes.find((n) => n.id === link.source).index_key
              );
            }
          });

          break;
        default:
          console.log("Depth 지정 안됨");
      }
      console.log("선택한 노드의 문서 리스트 출력", DocList);

      const item = [];
      DocList.forEach((data) => {
        if (data !== undefined) item.push(data.concat("\n"));
      });
      // setNDL(item);
    },
    [dataSource, searchPaperLink]
  );

  /**
   * SNA 노드 HOVER HANDLER
   * @param node
   */
  const nodeHoverHandler = (node) => {
    highlightLinks.clear();
    highlightNodes.clear();
    if (node) {
      if (node.depth === 4) {
        //연결된 노드 탐색.
        //마지막 단말 노드일때
        const node_path = findAncestorsLinks(node, dataSource);
        const links = node_path.filter((link) =>
          prunedTree.links.includes(link)
        );
        links.forEach((link) => highlightLinks.add(link));
        const nodes_ = findAncestorsNodes(node, dataSource);
        const nodes = nodes_.filter((link) => prunedTree.nodes.includes(link));
        nodes.forEach((node) => highlightNodes.add(node));
      } else if (node.depth === 3) {
        //연결된 노드 탐색.
        //같은 뎁스의 노드 연결 고리 탐색
        const links = prunedTree.links.filter(
          (link) =>
            link.target.depth === 3 &&
            link.source.depth === 3 &&
            (link.target === node.id ||
              link.target.id === node.id ||
              link.source === node.id ||
              link.source.id === node.id)
        );

        links.forEach((link) => highlightLinks.add(link));
      }
    }
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightNodes);
  };

  /**
   * Node Custom
   */
  const drawCustomNode = useCallback(
    (node, ctx, scale) => {
      if (node.depth !== 4) {
        ctx.beginPath();
        ctx.fillStyle = "black";

        ctx.arc(node.x, node.y, 10, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
      }

      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.stroke();
      ctx.arc(node.x, node.y, getNodeSize(node), 2 * Math.PI, false);
      // if(node.id ===root){
      //     node.fx = node.x
      //     node.fy = node.x
      // }

      if (highlightNodes.has(node)) {
        ctx.fillStyle = "blue";
      } else ctx.fillStyle = getd3Color(node);

      if (
        hoverNode.length > 0 &&
        hoverNode.find((n) => {
          if (n !== null && node != null)
            return n.index_key === node.index_key && n.name === node.name;
          return false;
        }) !== undefined
      ) {
        ctx.fillStyle = "blue";
      }
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.fillStyle = "black";
      ctx.font = `${node.s * 1 * 3}px Sans-Serif`;
      ctx.fillText(
        node.depth <= 2 ? node.name : "",
        Math.round(node.x),
        Math.round(node.y)
      );
    },
    [hoverNode]
  );

  /**
   * Link Custom
   */
  const drawCustomLink = useCallback(
    (link, ctx) => {
      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(Math.round(link.target.x), Math.round(link.target.y));

      if (link.target.depth === link.source.depth) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.5;

        ctx.setLineDash([2, 1]);
      } else {
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 1;
      }

      if (highlightLinks.has(link)) {
        ctx.strokeStyle = "blue";
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
      } else if (
        outerLink &&
        outerLink.find((l) => {
          return (
            l === link ||
            (l.target === link.target.id && l.source === link.source.id)
          );
        }) !== undefined
      )
        ctx.globalAlpha = 0;

      ctx.stroke();
    },
    [highlightLinks]
  );

  /**
   * SNA ZOOM END HANDLER
   */
  const zoomEndHandler = ({ k, x, y }) => {
    setGraphZoom(k);
  };

  useEffect(() => {
    zoomChangeHandler(graphZoom);
  }, [graphZoom]);

  /**********************************************************************
   * 분석중
   **********************************************************************/
  const handleClusterClick = useCallback(
    (e) => {
      if (clusterNodes.length > 0) {
        const point = fgRef.current.screen2GraphCoords(e.layerX, e.layerY);
        const polygonNode = clusterNodes.find((nodes) =>
          d3.polygonContains(nodes.points, [point.x, point.y])
        );
        if (polygonNode) {
          console.log("Inner Polygon Click Event", polygonNode);
          if (polygonNode.clusternode) {
            polygonNode.clusternode.clustering = true; // 이부분이 안먹히는데 왜 안먹히는지 모르겟음
            polygonNode.clusternode.parent.children.forEach((pcn) => {
              if (pcn.id === polygonNode.clusternode.id) {
                pcn.clustering = true;
              }
            });
            setPrunedTree(getPrunedTree());
          }
        }
      }
    },
    [clusterNodes]
  );
  //클러스터링 노드 범위 표현
  const handleCluster = useCallback(
    (ctx, scale) => {
      const key_obj = {};
      const nodes = [];
      if (prunedTree) {
        prunedTree.nodes.forEach((node) => {
          if (node.depth === 3 && node.type !== "cluster") {
            if (!key_obj[node.clusterid]) {
              key_obj[node.clusterid] = [];
              key_obj[node.clusterid].push(node);
            } else key_obj[node.clusterid].push(node);
          }
        });

        Object.keys(key_obj).forEach((key) => {
          if (key_obj[key].length < 2) return;
          const xys = Array.from(key_obj[key], (n) => {
            return { x: n.x, y: n.y };
          });
          const xyfilter = [];
          xys.forEach((n) => {
            xyfilter.push(
              [n.x - 20, n.y - 20],
              [n.x - 20, n.y + 20],
              [n.x + 20, n.y + 20],
              [n.x + 20, n.y - 20]
            );
          });
          const clusternode = nodesByfilter.nodes.find(
            (n) => key_obj[key][0].clusterid === n.id
          );
          const hull = d3.polygonHull(xyfilter);
          nodes.push({
            key: key,
            points: hull,
            nodes: key_obj[key],
            clusternode: clusternode,
          });
          const line = d3.line().context(ctx).curve(d3.curveCardinalClosed);
          ctx.beginPath();
          ctx.fillStyle = "#69b3a299";
          if (hull.length > 0) {
            line(hull);
          }
          ctx.fill();
          ctx.closePath();
        });
        setClusterNodes(nodes);
      }
    },
    [prunedTree]
  );

  // const [table, setTable] = useState([]);
  // const [nodeDocList, setNDL] = useState([]);

  //각종 설정값이 들어가면 될듯.
  // const searchIndexNode = (result, node, index) => {
  //   if (node === undefined) return [false];
  //   if (node.depth === 0) return [true];
  //
  //   const filterData = dataSource.links.filter((link) => {
  //     if (typeof link.source === "object") {
  //       return link.source.id === node.id;
  //     } else return link.source === node.id;
  //   });
  //   if (node.depth < 3) {
  //     // 상위 노드 0,1,2 depth 정보
  //     filterData.map((l) => {
  //       if (typeof l.source === "object") {
  //         if (l.source.id === node.id) {
  //           result.push(...searchIndexNode([], l.target, index));
  //         }
  //       } else if (l.source === node.id) {
  //         result.push(
  //                 ...searchIndexNode(
  //                         [],
  //                         dataSource.nodes.find((n) => n.id === l.target),
  //                         index
  //                 )
  //         );
  //       }
  //     });
  //   } else result.push(node.index_key === index);
  //
  //   return result;
  // };

  // const showTable = (node) => {
  //   if (!node.children && !node._children && node.depth === 4) {
  //     const tmp_Table_Data = { index: 0, data: [] };
  //     const isKey = new Set();
  //     dataSource.nodes.forEach((n) => {
  //       const LinkedList = [];
  //       const isSectionKey = new Set();
  //       if (n.name === node.name) {
  //         const tableData = [];
  //         LinkedList.push({
  //           end: n.id,
  //           name: n.name,
  //           start: n.id,
  //           depth: n.depth,
  //           node: n,
  //         });
  //         LinkedList.push(...searchLinkedNode(n));
  //
  //         depthDefault.forEach((depth) => {
  //           const depth_list = new Set();
  //           LinkedList.forEach((data) => {
  //             if (
  //               data.depth === depth &&
  //               !depth_list.has(data.node.index_key + " " + data.name)
  //             ) {
  //               depth_list.add(data.node.index_key + " " + data.name);
  //             }
  //           });
  //           tableData.push(depth_list);
  //         });
  //         const tmp = setTableData(
  //           tmp_Table_Data.index,
  //           LinkedList,
  //           isKey,
  //           isSectionKey
  //         );
  //         tmp_Table_Data.index = tmp.index;
  //
  //         tmp_Table_Data.data.push(...tmp.tabledata);
  //       }
  //     });
  //     setTable([...tmp_Table_Data.data]);
  //   }
  // };

  // const mouseTableNodeHoverClick = (index, name) => {
  //   const nodes = [];
  //
  // convertGraphData.descendants().forEach((node) => {
  //   if (index === node.index_key && name === node.name) {
  //     nodes.push(node);
  //   }
  // });
  // if (nodes[0].x !== undefined && nodes[0].y !== undefined) {
  //   fgRef.current.centerAt(nodes[0].x, nodes[0].y, 200);
  // }
  // };
  // const mouseTableNodeHover = (index, name) => {
  //   const nodes = [];
  //
  //   dataSource.nodes.forEach((node) => {
  //     if (index === node.index_key && name === node.name) {
  //       nodes.push(node);
  //     }
  //   });
  //   if (nodes[0].x !== undefined && nodes[0].y !== undefined) {
  //     setHoverNode(nodes);
  //   }
  // }

  // const setTableData = (index, data, keys, isSectionKey) => {
  //   let items = [];
  //   const tableTR = [];
  //   if (data === undefined) return;
  //   const lastnode = [...data][0];
  //   let test = false;
  //   data.map((data) => {
  //     if (data.depth === 3) {
  //       if (!keys.has(lastnode.name)) {
  //         items.push(<td>{lastnode.name}</td>);
  //         keys.add(lastnode.name);
  //       } else items.push(<td>-</td>);
  //
  //       items.push(
  //         <td
  //           style={{ background: hoverNode.length > 0 ? "#fff" : "" }}
  //           // onClick={() =>
  //           //   mouseTableNodeHoverClick(data.node.index_key, data.name)
  //           // }
  //           // onMouseEnter={() =>
  //           //   mouseTableNodeHover(data.node.index_key, data.name)
  //           // }
  //         >
  //           {data.name}({data.node.index_key})
  //         </td>
  //       );
  //       index++;
  //     } else if (data.depth === 2) {
  //       if (!isSectionKey.has(data.name)) {
  //         items.push(<td>{data.name}</td>);
  //         isSectionKey.add(data.name);
  //       } else {
  //         items.push(<td>-</td>);
  //       }
  //     } else if (data.depth !== 4) {
  //       if (!keys.has(data.name)) {
  //         items.push(<td>{data.name}</td>);
  //         keys.add(data.name);
  //       } else {
  //         items.push(<td>-</td>);
  //       }
  //     }
  //     if (items !== [] && data.depth === 0) {
  //       items.push(<td>{index}</td>);
  //       items.reverse();
  //       tableTR.push(
  //         <tr
  //           style={{
  //             border: "1px solid #ccc",
  //             borderCollapse: "collapse",
  //             textAlign: "center",
  //           }}
  //         >
  //           {[...items]}
  //         </tr>
  //       );
  //
  //       test = true;
  //       items = [];
  //     }
  //   });
  //
  //   return { index: index, tabledata: [...tableTR] };
  // };
  // const searchLinkedNode = (node) => {
  //   const datas = [];
  //   const filterData = dataSource.links.filter((link) => {
  //     if (typeof link.target === "object") {
  //       return link.target.id === node.id;
  //     }
  //     return link.target === node.id;
  //   });
  //
  //   if (node.depth !== 0) {
  //     filterData.forEach((l) => {
  //       if (typeof l.target === "object") {
  //         datas.push({
  //           end: l.source.id,
  //           name: l.source.name,
  //           start: l.target.id,
  //           depth: l.source.depth,
  //           node: l.source,
  //         });
  //         datas.push(...searchLinkedNode(l.source));
  //       } else {
  //         const nextNode = dataSource.nodes.find((n) => n.id === l.source);
  //         if (nextNode !== undefined) {
  //           datas.push({
  //             end: nextNode.id,
  //             name: nextNode.name,
  //             start: nextNode.id,
  //             depth: nextNode.depth,
  //             node: nextNode,
  //           });
  //           datas.push(...searchLinkedNode(nextNode));
  //         }
  //       }
  //     });
  //   }
  //   return datas;
  // };

  // const searchLink = (links, id) => {
  //   const filterData = dataSource.links.filter((link) => {
  //     if (typeof link.target === "object") {
  //       return link.target.id === id;
  //     } else return link.target === id;
  //   });
  //   filterData.forEach((link) => {
  //     if (typeof link.target === "object") {
  //       if (!link.target.collapsed || link.target.childLinks.length === 0) {
  //         links.push(link);
  //       }
  //       links.push(...searchLink([], link.source.id));
  //     } else {
  //       const nextNode = dataSource.nodes.find((n) => n.id === link.source);
  //       if (!nextNode.collapsed || nextNode.childLinks.length === 0) {
  //         links.push(link);
  //       }
  //       links.push(...searchLink([], nextNode.id));
  //     }
  //   });
  //
  //   return links;
  // };

  // const outerLinks = (dataSource) => {
  //   if (dataSource && dataSource.outer_links !== undefined)
  //     return dataSource.outer_links;
  //   if (dataSource && dataSource.outerlinks !== undefined)
  //     return dataSource.outerlinks;
  //   return [];
  // };

  return (
    <>
      <ForceGraph2D
        ref={fgRef}
        width={width}
        height={height}
        nodeVal={(d) => getNodeSize(d)}
        // cooldownTicks={100}
        // dagLevelDistance={30}
        graphData={prunedTree}
        onZoomEnd={zoomEndHandler}
        // cameraPosition = {([nodesById[root].x,nodesByfilter[root].y,0])}
        // onNodeDragEnd={(node) => {
        //     node.fx = node.x;
        //     node.fy = node.y;
        // }}
        onNodeRightClick={nodeRightClickHandler}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={(link) =>
          highlightLinks.has(link) && link.target.depth !== link.source.depth
            ? 4
            : 0
        }
        linkDirectionalParticleColor={() => "red"}
        d3VelocityDecay={0.44}
        d3AlphaDecay={0.023}
        warmupTicks={1}
        cooldownTicks={1000}
        linkCanvasObject={drawCustomLink}
        nodeCanvasObject={drawCustomNode}
        nodeLabel={(n) => n.name}
        onNodeClick={nodeClickHandler}
        onNodeHover={nodeHoverHandler}
        onRenderFramePost={handleCluster}
        onBackgroundClick={handleClusterClick}
      />
    </>
  );
};

export default MultiDimensionalGraph;
