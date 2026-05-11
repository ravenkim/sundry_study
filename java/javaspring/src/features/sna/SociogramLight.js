import React, {
  useCallback,
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Spin } from "antd";
// import * as d3 from "d3";
import {
  // isNumeric,
  getColor,
  imageDownload,
  fileDownload,
} from "utils/commonUtils";
import { useDispatch, useSelector } from "react-redux";
import { FIELD_TYPE } from "Constants";
import Toolbar from "features/sna/components/light/tool/Toolbar";
import DetailDrawer from "features/sna/components/common/drawer/DetailDrawer";
import { snaAction } from "features/sna/snaReducer";
// import {ExcelDownload} from "./components/light/toolbar/ExcelDownload";

const range = (list, start, stop) => {
  let result = [];
  for (let i = start; i < stop; i += 1) {
    result.push(list[i]);
  }
  return result;
};

const SociogramLight = (
  {
    title,
    category,
    socioGramId,
    loading,

    // sociogram style
    backgroundColor = "white",
    border = "none",
    sociogramWidth = 800,
    sociogramHeight = 400,

    // data
    dataSource,

    // detail drawer
    drawerVisible = true,

    //toolbar option
    toolbarVisible = true,
    toolbarAlign = "right",
    downloadFileName,

    //action
    clickHandler,
  },
  ref
) => {
  const dispatch = useDispatch();

  const { nodeData } = useSelector(({ snaReducer }) => ({
    nodeData: snaReducer[`socioNode/${socioGramId}`],
  }));

  /**********************************************************************
   * Wrapper Action
   **********************************************************************/

  /**
   * wrapper에서 mouse over 시 toolbar 투명도 조절
   */
  const mouseOverHandler = (e) => {
    setOpacity(0.6);
  };

  /**
   * wrapper에서 mouse leave 시 toolbar 투명도 조절
   */
  const mouseLeaveHandler = (e) => {
    setOpacity(0.2);
  };

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
      if (hoverNode === node) {
        // node hover일때 draw
        ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = node === hoverNode ? "red" : "orange";
      } else {
        //node hover가 아닐때
        if (highlightNodes.has(node)) {
          // hover된 link의 node들 draw
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
          ctx.fillStyle = "orange";
        } else {
          //일반적인 node draw
          ctx.arc(node.x, node.y, node.s, 0, 2 * Math.PI, false);
          ctx.fillStyle =
            node.g === "00" ? "#000000" : getColor(node.g.charCodeAt(0));
        }
      }

      ctx.fill();

      // node에 text 주입
      if (node.cq === "E,C") {
        ctx.globalAlpha = 1;
        ctx.font = `${node.s * 1 * 3}px Sans-Serif`;
        ctx.fillText(" " + node.t, Math.round(node.x), Math.round(node.y));
      }
    },
    [hoverNode]
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
      ctx.lineWidth = 0.2;
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

  // node click Handler
  const nodeClickHandler = (node) => {
    setDrawerDataList([]);

    if (drawerVisible) {
      let keyArray = node.n.split(",");
      setNodeKeyList(keyArray);

      let startVal = (drawerPageNum - 1) * 10;
      let stopVal = startVal + pageSize;
      if (stopVal > keyArray.length) {
        stopVal = keyArray.length;
      }
      let firstList = range(keyArray, startVal, stopVal);

      if (firstList.length < pageSize) {
        setMoreVisible(false);
      }

      let _nodeKeys = firstList.join(",");
      setNodeKeys(_nodeKeys);

      if (_nodeKeys) {
        dispatch(
          snaAction.getDetailData({
            target: `socioNode/${socioGramId}`,
            type: category,
            keys: _nodeKeys,
          })
        );
      }

      setDetailVisible(true);
      // nodeClickHandler(node, type);
    } else {
      if (clickHandler) {
        clickHandler(node);
      }
    }
  };

  /**
   * Component 내부 Drawer list setting
   */
  useImperativeHandle(ref, () => ({
    setNewNodeList: (nodeList) => {
      setDrawerDataList([]);

      if (drawerVisible) {
        setNodeKeyList(nodeList);

        let startVal = (drawerPageNum - 1) * 10;
        let stopVal = startVal + pageSize;
        if (stopVal > nodeList.length) {
          stopVal = nodeList.length;
        }
        let firstList = range(nodeList, startVal, stopVal);

        if (firstList.length < pageSize) {
          setMoreVisible(false);
        }

        let _nodeKeys = firstList.join(",");
        setNodeKeys(_nodeKeys);

        if (_nodeKeys) {
          dispatch(
            snaAction.getDetailData({
              target: `socioNode/${socioGramId}`,
              type: category,
              keys: _nodeKeys,
            })
          );
        }
        setDetailVisible(true);
      }
    },
    closeDetailDrawer: () => drawerCloseHandler(),
  }));

  /**********************************************************************
   * Toolbar Action
   **********************************************************************/

  // toolbar 투명도값
  const [opacity, setOpacity] = useState(0.2);
  // sociogram reset 여부
  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (reset) {
      setReset(false);
    }
  }, [reset]);

  /**
   *  소시오그램 새로고침 Handler
   */
  const resetHandler = () => {
    setReset(true);
  };

  /**
   *  소시오그램 이미지 Download Handler
   */
  const downloadImageHandler = () => {
    imageDownload(socioGramId, downloadFileName);
  };

  const [excelData, setExcelData] = useState(dataSource.nodes);

  useEffect(() => {
    setExcelData((excelData) => [...dataSource.nodes]);
  }, [dataSource.nodes]);

  const downloadExcelHandler = () => {
    fileDownload(excelData, `${title}_${downloadFileName}`, "xlsx");
  };

  const [graphData, setGraphData] = useState();

  /**********************************************************************
   * Drawer Action
   **********************************************************************/
  const [nodeKeyList, setNodeKeyList] = useState();
  const [nodeKeys, setNodeKeys] = useState();
  const [drawerDataList, setDrawerDataList] = useState();
  const [detailVisible, setDetailVisible] = useState(false);
  const [drawerPageNum, setDrawerPageNum] = useState(1);
  const [moreVisible, setMoreVisible] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    setDetailVisible(false);

    if (dataSource && dataSource.nodes) {
      setGraphData(JSON.parse(JSON.stringify(dataSource)));
    }
  }, [dataSource]);

  /**
   * Drawer close 시 초기화
   */
  useEffect(() => {
    if (!detailVisible) {
      setNodeKeyList();
      setDrawerPageNum(1);
    }
  }, [detailVisible]);

  /**
   *  Drawer Close Handler
   */
  const drawerCloseHandler = () => {
    setDetailVisible(false);
  };

  /**
   *  Drawer Item 클릭 Handler
   */
  const itemClickHandler = () => {
    console.log("list 클릭 ");
  };

  useEffect(() => {
    if (drawerPageNum && drawerPageNum > 1) {
      let startVal = (drawerPageNum - 1) * 10;
      let stopVal = startVal + pageSize;
      if (stopVal > nodeKeyList.length) {
        stopVal = nodeKeyList.length;
      }
      let pagingKeys = range(nodeKeyList, startVal, stopVal);

      if (pagingKeys.length < pageSize) {
        setMoreVisible(false);
      }
      let nodeKeys = pagingKeys.join(",");
      if (nodeKeys) {
        setNodeKeys(nodeKeys);
        dispatch(
          snaAction.getDetailData({
            stateKey: `socioNode/${category}`,
            type: category,
            keys: nodeKeys,
          })
        );
        console.log(nodeKeys);
      }
    }
  }, [drawerPageNum]);

  useEffect(() => {
    if (nodeData && nodeData.data) {
      console.log("nodeData : ", nodeData.data);
      if (nodeKeys) {
        let nodeList = [];
        nodeKeys.split(",").map((key) => {
          if (nodeData.data && nodeData.data.hasOwnProperty(key)) {
            let listObj = {
              key: null,
              title: "제목없음",
            };
            switch (category) {
              case FIELD_TYPE.PATENT:
                listObj["key"] = key;
                if (nodeData.data[key].title) {
                  listObj["title"] = nodeData.data[key].title;
                }
                break;
              case FIELD_TYPE.THESIS_NDSL:
                listObj["key"] = key;
                if (nodeData.data[key].titleH) {
                  listObj["title"] = nodeData.data[key].titleH;
                }
                break;
              case FIELD_TYPE.SUBJECT_NTIS:
                listObj["key"] = key;
                if (nodeData.data[key].sbjtNm) {
                  listObj["title"] = nodeData.data[key].sbjtNm;
                }
                break;
              case FIELD_TYPE.MBR:
                listObj["key"] = key;
                listObj["title"] = "연구자이름";
                break;
              default:
                listObj["key"] = null;
                listObj["title"] = null;
                break;
            }
            nodeList.push(listObj);
          } else {
            nodeList.push({ key: "", title: "상세정보가 없습니다." });
          }
          // }
          if (drawerPageNum === 1) {
            setDrawerDataList(nodeList);
          } else {
            setDrawerDataList([...drawerDataList, ...nodeList]);
          }
        });
      }
    }
    // if (nodeData) {

    // if (nodeKeys) {
    //   nodeKeys.split(",").map((key) => {
    //     if (nodeData && nodeData.hasOwnProperty(key)) {
    //       let listObj = {
    //         key: null,
    //         title: "제목없음",
    //       };
    //       switch (category) {
    //         case FIELD_TYPE.PATENT:
    //           listObj["key"] = key;
    //           if (nodeData[key].title) {
    //             listObj["title"] = nodeData[key].title;
    //           }
    //           break;
    //         case FIELD_TYPE.THESIS_NDSL:
    //           listObj["key"] = key;
    //           if (nodeData[key].titleH) {
    //             listObj["title"] = nodeData[key].titleH;
    //           }
    //           break;
    //         case FIELD_TYPE.SUBJECT_NTIS:
    //           listObj["key"] = key;
    //           if (nodeData[key].sbjtNm) {
    //             listObj["title"] = nodeData[key].sbjtNm;
    //           }
    //           break;
    //         case FIELD_TYPE.MBR:
    //           listObj["key"] = key;
    //           listObj["title"] = "연구자이름";
    //           break;
    //         default:
    //           listObj["key"] = null;
    //           listObj["title"] = null;
    //           break;
    //       }
    //       nodeList.push(listObj);
    //     } else {
    //       nodeList.push({ key: "", title: "상세정보가 없습니다." });
    //     }
    //     // }
    //     if (drawerPageNum === 1) {
    //       setDrawerDataList(nodeList);
    //     } else {
    //       setDrawerDataList([...drawerDataList, ...nodeList]);
    //     }
    //   });
    // }
  }, [nodeData]);

  return (
    <div
      id={socioGramId}
      style={{
        width: sociogramWidth,
        height: sociogramHeight,
        border: border,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseLeave={mouseLeaveHandler}
      onMouseOver={mouseOverHandler}
    >
      {title && <h4>{title}</h4>}
      <Spin
        spinning={loading}
        style={{
          top: sociogramHeight / 2 - 25,
          left: sociogramWidth / 2,
          position: "relative",
          zIndex: 100,
        }}
      >
        {!loading && graphData && !reset && (
          <ForceGraph2D
            id={socioGramId} // id is mandatory, if no id is defined rd3g will throw an error
            width={sociogramWidth}
            height={sociogramHeight}
            backgroundColor={backgroundColor}
            graphData={graphData}
            nodeLabel="t"
            // // nodeAutoColorBy="g"
            onNodeClick={(node) => nodeClickHandler(node)}
            ref={graphRef}
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
      </Spin>
      {/* {toolbarVisible && (
        Toolbar (excel, image, reset) */}
      <Toolbar
        id={socioGramId}
        wrapperWidth={sociogramWidth}
        wrapperHeight={sociogramHeight}
        data={dataSource && dataSource.nodes}
        align={toolbarAlign}
        downloadImageHandler={downloadImageHandler}
        downloadExcelHandler={downloadExcelHandler}
        bottom={title ? 50 : 30}
        opacity={opacity}
        resetHandler={resetHandler}
        downloadFileName={
          downloadFileName ? downloadFileName : `${category}_sociogram`
        }
      />
      ){/* } */}
      {drawerVisible && nodeData && (
        <DetailDrawer
          visible={detailVisible}
          placement={toolbarAlign}
          dataSource={drawerDataList}
          loading={nodeData.loading}
          category={category}
          itemClickHandler={itemClickHandler}
          closeHandler={drawerCloseHandler}
        />
      )}
    </div>
  );
};

export default React.memo(forwardRef(SociogramLight));
