/**
 * 시간 : 2021-12-22
 * 작성자 : 김명훈
 **/

import React, {
  useCallback,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import ForceGraph2D from "react-force-graph-2d";
import { getColor, getSnaColor, stringToSubstring } from "utils/commonUtils";
import { Drawer, Popover, Radio, Slider, Spin, Tooltip } from "antd";
import { SNA_TYPE } from "Constants";
import {
  InfoCircleOutlined,
  InfoCircleTwoTone,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import SociogramDefaultFilter from "features/chart/components/filters/SociogramDefaultFilter";
import SociogramLeftFilter from "features/chart/components/filters/SociogramLeftFilter";
import ReactResizeDetector from "react-resize-detector";

const SociogramChart = (
  {
    category,
    socioGramId,
    loading,

    // sociogram style
    backgroundColor = "white",
    border = "none",
    sociogramWidth = 600,
    sociogramHeight = 500,

    // data
    dataSource,

    //action
    onNodeClickHandler,

    //range
    isUseToggle,
    isUseVRange,
    isUseYearRange,

    snaType,
    chartTypeChangeHandler,

    useNodeRandomColor = false,
    defaultNodeColor = "#121A4C",
    hoverNodeColor = "#8831F6",
    //유사과제 check 색상
    highlightNodeColor = "#2F80ED",
    //선택과제 색상
    selectedNodeColor = "#EF4B81",

    customHoverNodeId,
    customHightlightNodeIds,
    customSelectedNodeIds,

    filterPosition = "default",
    additionFilterTool,
    chartWrapResizeHandler,
    filterResizeHandler,

    useNodeInfoDrawer = false,
    drawerContents,
    drawerVisible,
    setDrawerVisible,
    drawerTitle,
  },
  ref
) => {
  const [data, setData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [yearRange, setYearRange] = useState({ min: 0, max: 0, value: [0, 0] });
  const [vRange, setVRange] = useState(
    snaType === SNA_TYPE.WORD ? [0.5, 1] : [0, 1]
  );
  const [tRange, setTRange] = useState([10, 20]);

  const [minMaxSize, setMinMaxSize] = useState([0, 0]);
  /**********************************************************************
   * Initialize Action
   **********************************************************************/

  useEffect(() => {
    if (dataSource) {
      setData(JSON.parse(JSON.stringify(dataSource)));

      let sizeList = dataSource.nodes.map((item) => item.s);

      let minSize = Math.min(...sizeList);
      let maxSize = Math.max(...sizeList);

      setMinMaxSize([minSize, maxSize]);
    }
  }, [dataSource]);

  useEffect(() => {
    if (data) {
      if (yearRange.min === 0 && yearRange.max === 0) {
        const value = yearList(dataSource);
        setYearRange({ min: value[0], max: value[1], value: value });
        setGraphData(datafilter(dataType, data, value, vRange, tRange));
      } else {
        setGraphData(
          datafilter(dataType, data, yearRange.value, vRange, tRange)
        );
      }
    }
  }, [data, yearRange, vRange, tRange]);

  useEffect(() => {
    if (customHoverNodeId) {
      let nodeIndex = dataSource.nodes.findIndex(
        (item) => item.docId === customHoverNodeId
      );
      if (nodeIndex > 0) {
        nodeHoverHandler(dataSource.nodes[nodeIndex]);
      }
    } else {
      setHoverNode(null);
    }
  }, [customHoverNodeId]);

  /**********************************************************************
   * Force Graph Action
   **********************************************************************/

  const graphRef = useRef();

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);

  /**
   * Node Custom
   */
  const drawCustomNode = useCallback(
    (node, ctx) => {
      ctx.beginPath();
      if (snaType === SNA_TYPE.PAPER) {
        if (hoverNode && hoverNode.docId === node.docId) {
          // node hover일때 draw
          //
          ctx.arc(node.x, node.y, node.s ? node.s : 5, 0, 2 * Math.PI, false);
          ctx.fillStyle = hoverNodeColor;
          // ctx.fillStyle = "#2F80ED";
        } else {
          //node hover가 아닐때
          if (highlightNodes.has(node)) {
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
            ctx.fillStyle = highlightNodeColor;
          } else {
            //일반적인 node draw
            let isSelected = false;
            if (useNodeRandomColor) {
              ctx.arc(
                node.x,
                node.y,
                node.s ? node.s : 5,
                0,
                2 * Math.PI,
                false
              );
              ctx.fillStyle = getColor(parseInt(node.id));
            } else {
              ctx.arc(
                node.x,
                node.y,
                node.s ? node.s : 5,
                0,
                2 * Math.PI,
                false
              );
              ctx.fillStyle = defaultNodeColor;
              if (
                customHightlightNodeIds &&
                customHightlightNodeIds.length > 0
              ) {
                if (customHightlightNodeIds.includes(node.docId)) {
                  ctx.fillStyle = highlightNodeColor;
                }
              }

              if (customSelectedNodeIds && customSelectedNodeIds.length > 0) {
                if (customSelectedNodeIds.includes(node.docId)) {
                  ctx.fillStyle = selectedNodeColor;
                }
              }
            }
          }
        }
      } else {
        if (hoverNode === node) {
          ctx.arc(node.x, node.y, node.s ? node.s : 5, 0, 2 * Math.PI, false);
          ctx.fillStyle = hoverNodeColor;
        } else {
          //node hover가 아닐때
          if (highlightNodes.has(node)) {
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
            ctx.fillStyle = highlightNodeColor;
          } else {
            ctx.arc(node.x, node.y, node.s ? node.s : 5, 0, 2 * Math.PI, false);
            if (snaType === SNA_TYPE.PLAYER) {
              if (node.section) {
                ctx.fillStyle = getColor(parseInt(node.id));
                // ctx.fillStyle = g
              } else {
                ctx.fillStyle = defaultNodeColor;
              }
            } else {
              //일반적인 node draw

              // ctx.fillStyle = getColor(parseInt(node.id));
              ctx.fillStyle = getSnaColor(node.s);
            }
          }
        }
      }

      if (node.titleVisible) {
        if (tRange[0] <= node.s && node.s <= tRange[1]) {
          ctx.globalAlpha = 1;
          ctx.font = `${node.s * 1.5}px Sans-Serif`;
          ctx.fontWeight = "600";
          ctx.fillText("   " + node.t, Math.round(node.x), Math.round(node.y));
        }
      }
      ctx.fill();
      // // node에 text 주입

      // ctx.globalAlpha = 1;
      // ctx.font = `${node.s * 1 * 3}px Sans-Serif`;
      // ctx.fillText(" " + node.t, Math.round(node.x), Math.round(node.y));
    },
    [hoverNode, graphData]
  );

  /**
   * Link Custom
   */
  const drawCustomLink = useCallback((link, ctx) => {
    ctx.beginPath();
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(Math.round(link.target.x), Math.round(link.target.y));
    if (highlightLinks.has(link)) {
      ctx.strokeStyle = "red";
      // ctx.lineWidth = link.v * 0.2;
    } else {
      ctx.strokeStyle = "#8c8c8c";
      ctx.lineWidth = 0.5;
      if (dataType === SNA_TYPE.WORD) {
        ctx.lineWidth = 0.1;
      } else if (dataType === SNA_TYPE.PLAYER) {
        ctx.lineWidth = 0.2;
      }
    }
    ctx.stroke();
  });

  /**
   * Node highlight handler
   */
  const updateHighlightHandler = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  /**
   * Node hover handler
   */
  const nodeHoverHandler = (node) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      // node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
      // node.links.forEach(link => highlightLinks.add(link));
    }

    setHoverNode(node || null);
    updateHighlightHandler();
  };

  /**
   * Node Click handler
   */
  const nodeClickHandler = (node) => {
    if (useNodeInfoDrawer) {
      setDetailDrawerVisible(true);
    }
    if (typeof onNodeClickHandler === "function") {
      onNodeClickHandler(node.t, node);
    }
  };

  /**********************************************************************
   * Filter Action
   **********************************************************************/
  const yearList = (data) => {
    const range_arr = [];
    if (data) {
      if (data.nodes) {
        //년도 필터 범위 최소값
        data.nodes.forEach((node) => {
          if (node.pyear && typeof node.pyear === "object")
            range_arr.push(...node.pyear.map((y) => parseInt(y)));
          if (
            node.pyear &&
            typeof node.pyear === "string" &&
            node.pyear.length > 0
          )
            range_arr.push(parseInt(node.pyear));
        });
      }
    }
    return range_arr.length === 0
      ? [0, 0]
      : [Math.min(...range_arr), Math.max(...range_arr)];
  };

  const datafilter = (type, data, yearRange, vRange, tRange) => {
    if (data) {
      if (type !== SNA_TYPE.WORD && type !== SNA_TYPE.PAPER) {
        vRange = [0, 1];
      }

      let f_nodes = data.nodes.filter((n) => {
        return n.pyear.find(
          (y) => yearRange[0] <= parseInt(y) && yearRange[1] >= parseInt(y)
        );
      });
      let f_ids = Array.from(f_nodes, (v) => v.id);
      let f_links = data.links
        .filter(
          (l) =>
            (f_ids.includes(l.source) || f_ids.includes(l.source.id)) &&
            (f_ids.includes(l.target) || f_ids.includes(l.target.id))
        )
        .filter(
          (l) => l.force === "T" || (l.v >= vRange[0] && l.v <= vRange[1])
        );
      f_ids = f_ids.filter((id) =>
        f_links.find(
          (l) =>
            l.source === id ||
            l.source.id === id ||
            l.target === id ||
            l.target.id === id
        )
      );
      f_nodes = f_nodes.filter((n) => f_ids.includes(n.id));

      // title range 값 적용
      f_nodes.map((n) => {
        if (n.s) {
          if (tRange[0] <= n.s && n.s <= tRange[1]) {
            n.titleVisible = true;
          } else {
            n.titleVisible = false;
          }
        }
      });

      return { ...data, nodes: f_nodes, links: f_links };
    }
    return { nodes: [], links: [] };
  };

  // sociogram reset 여부
  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (reset) {
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    if (snaType) {
      setDataType(snaType);
    }
  }, [snaType]);

  const [dataType, setDataType] = useState(SNA_TYPE.PAPER);

  const toggleChangeHandler = (e) => {
    const { value } = e.target;
    setDataType(value);
    setTRange([10, 20]);
    setVRange(value === SNA_TYPE.WORD ? [0.5, 1] : [0, 1]);
    if (
      chartTypeChangeHandler &&
      typeof chartTypeChangeHandler === "function"
    ) {
      chartTypeChangeHandler(value);
    }
  };

  useEffect(() => {
    if (drawerVisible) {
      setDetailDrawerVisible(true);
    }
  }, [drawerVisible]);

  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);

  const detailDrawerCloseHandler = () => {
    setDetailDrawerVisible(false);

    if (setDrawerVisible) {
      setDrawerVisible(false);
    }
  };

  return (
    <>
      {filterPosition === "default" && (
        <>
          <div
            id={socioGramId}
            style={{
              width: sociogramWidth,
              height: sociogramHeight,
              border: border,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {!loading && graphData && (
              <ForceGraph2D
                width={sociogramWidth}
                height={sociogramHeight}
                backgroundColor={backgroundColor}
                graphData={graphData}
                nodeLabel="t"
                nodeVal={(node) => 5}
                // // nodeAutoColorBy="g"
                onNodeClick={(node) => nodeClickHandler(node)}
                // // linkLabel={({ id, x, y, source, target, v }) => {
                // //   return `<div style="text-align:center; font-size: 13px; line-height: 15px;">${source.t}  → ${target.t}</div>`;
                // // }}
                // // linkWidth={(link) => (highlightLinks.has(link) ? 5 : 1)}
                linkDirectionalParticles={0}
                // // linkDirectionalParticleWidth={(link) => (highlightLinks.has(link) ? 4 : 0)}
                linkCanvasObject={drawCustomLink}
                nodeCanvasObjectMode={(node) =>
                  highlightNodes.has(node) ? "replace" : "replace"
                }
                nodeCanvasObject={drawCustomNode}
                onNodeHover={nodeHoverHandler}
                // // onLinkHover={handleLinkHover}
              />
            )}
          </div>
          <ReactResizeDetector handleHeight onResize={filterResizeHandler}>
            <div>
              <SociogramDefaultFilter
                snaType={snaType}
                graphData={graphData}
                isUseToggle={isUseToggle}
                toggleChangeHandler={toggleChangeHandler}
                dataType={dataType}
                tRange={tRange}
                setTRange={setTRange}
                minMaxSize={minMaxSize}
                isUseVRange={isUseVRange}
                vRange={vRange}
                setVRange={setVRange}
                isUseYearRange={isUseYearRange}
                yearRange={yearRange}
                setYearRange={setYearRange}
                additionFilterTool={additionFilterTool}
              />
            </div>
          </ReactResizeDetector>
        </>
      )}

      {filterPosition === "left" && (
        <ul className={"visual-cont"}>
          <li className="socio-controller">
            <SociogramLeftFilter
              snaType={snaType}
              graphData={graphData}
              isUseToggle={isUseToggle}
              toggleChangeHandler={toggleChangeHandler}
              dataType={dataType}
              tRange={tRange}
              setTRange={setTRange}
              minMaxSize={minMaxSize}
              isUseVRange={isUseVRange}
              vRange={vRange}
              setVRange={setVRange}
              isUseYearRange={isUseYearRange}
              yearRange={yearRange}
              setYearRange={setYearRange}
            />
          </li>
          <ReactResizeDetector
            handleWidth
            handleHeight
            onResize={chartWrapResizeHandler}
          >
            <li className="socio-graph">
              {!loading && graphData && (
                <ForceGraph2D
                  width={sociogramWidth}
                  height={sociogramHeight}
                  backgroundColor={backgroundColor}
                  graphData={graphData}
                  nodeLabel="t"
                  nodeVal={(node) => 5}
                  // // nodeAutoColorBy="g"
                  onNodeClick={(node) => nodeClickHandler(node)}
                  // // linkLabel={({ id, x, y, source, target, v }) => {
                  // //   return `<div style="text-align:center; font-size: 13px; line-height: 15px;">${source.t}  → ${target.t}</div>`;
                  // // }}
                  // // linkWidth={(link) => (highlightLinks.has(link) ? 5 : 1)}
                  linkDirectionalParticles={0}
                  // // linkDirectionalParticleWidth={(link) => (highlightLinks.has(link) ? 4 : 0)}
                  linkCanvasObject={drawCustomLink}
                  nodeCanvasObjectMode={(node) =>
                    highlightNodes.has(node) ? "replace" : "replace"
                  }
                  nodeCanvasObject={drawCustomNode}
                  onNodeHover={nodeHoverHandler}
                  // // onLinkHover={handleLinkHover}
                />
              )}
              {useNodeInfoDrawer && (
                <Drawer
                  title={drawerTitle ? drawerTitle : "제목없음"}
                  placement={"right"}
                  closable={true}
                  onClose={detailDrawerCloseHandler}
                  visible={detailDrawerVisible}
                  getContainer={false}
                  style={{ position: "absolute", overflow: "hidden" }}
                >
                  {drawerContents}
                </Drawer>
              )}
            </li>
          </ReactResizeDetector>
        </ul>
      )}
    </>
  );
};

export default React.memo(forwardRef(SociogramChart));
