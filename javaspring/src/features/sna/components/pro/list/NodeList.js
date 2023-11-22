import React, { useEffect } from "react";
import { FIELD_TYPE, GRAPH_KEYWORD_TYPE, GRAPH_TYPE } from "Constants";
import { Table } from "antd";

const NodeList = ({
  category,
  graphType,
  keywordType,
  dataSource,
  playerMode,
}) => {
  useEffect(() => {
    if (dataSource) {
      console.log("dataSource : ", dataSource);
    }
  }, [dataSource]);

  const getSortNm = (pSort) => {
    if (pSort === FIELD_TYPE.PATENT) return "특허";
    else if (pSort === FIELD_TYPE.THESIS_NDSL) return "논문";
    else if (pSort === FIELD_TYPE.SUBJECT_NTIS) return "국가R&D과제";
    else if (pSort === "n_subject") return "국가R&D기관";
    else if (pSort === FIELD_TYPE.ORGN_NTIS) return "국가R&D기관";
    else if (pSort === "subject") return "KEIT과제";
    else if (pSort === FIELD_TYPE.MBR) return "KEIT연구자";
    else if (pSort === FIELD_TYPE.ORGN_KEIT) return "KEIT기관";
    else if (pSort === FIELD_TYPE.PLAYER) {
      if (playerMode === "patent") {
        return "특허";
      } else if (playerMode === "thesis") {
        return "논문";
      } else {
        return "국가R&D과제";
      }
    }
  };

  const columns = [
    {
      dataIndex: "id",
      key: "id",
      render: (text, rowMap, key) => (
        <a
          key={key}
          onClick={() => {
            if (category === FIELD_TYPE.MBR) {
              if (rowMap.openYn === "N") {
                return false;
              }
            }

            if (keywordType === GRAPH_KEYWORD_TYPE.WORD) {
              // ntis 기과닝ㄹ 경우에 다르게
              if (category === FIELD_TYPE.ORGN_NTIS) {
                let nodes = rowMap.n.split(",");
                let nodeList = [];
                if (nodes) {
                  nodes.map((node, idx) => {
                    let listObj = {
                      key: node,
                      title: node,
                      action: false,
                    };
                    nodeList.push(listObj);
                  });
                }
                // setDetailWordDataList(nodeList);
                // setDetailWordVisible(true);
              } else if (category === FIELD_TYPE.ORGN_KEIT) {
                let nodes = rowMap.n.split(",");
                let nodeList = [];
                if (nodes) {
                  nodes.forEach((node, idx) => {
                    let nodeTitle = "";
                    if (node && node.length > 0) {
                      const nodeSplit = node.split(":::");
                      if (nodeSplit && nodeSplit.length === 2) {
                        nodeTitle = nodeSplit[1];
                      } else {
                        nodeTitle = "상세정보가 없습니다.";
                      }
                    } else {
                      nodeTitle = "상세정보가 없습니다.";
                    }
                    let listObj = {
                      key: node,
                      title: nodeTitle,
                      action: false,
                    };
                    nodeList.push(listObj);
                  });
                }
                // setDetailWordDataList(nodeList);
                // setDetailWordVisible(true);
              } else {
                if (graphType === GRAPH_TYPE.MULTI_DIMENSIONAL) {
                  // detailWordViewClickHandler(rowMap.indexKey);
                } else {
                  // detailWordViewClickHandler(rowMap.n);
                }
              }
            } else {
              if (category === FIELD_TYPE.ORGN_NTIS) {
                // detailWordViewClickHandler(rowMap.n);
              } else if (category === FIELD_TYPE.ORGN_KEIT) {
                // detailWordViewClickHandler(rowMap.n);
              } else {
                // detailViewClickHandler(rowMap.n);
              }
            }
          }}
          style={{ color: "rgba(0, 0, 0, 0.85)" }}
        >
          {graphType === GRAPH_TYPE.MULTI_DIMENSIONAL ? rowMap.name : rowMap.t}
        </a>
      ),
      ellipsis: true,
    },
    // ,
    // {
    //   width: "50px",
    //   render: () => <Tag color="#2db7f5">보기</Tag>
    // }
  ];

  return (
    <>
      <h3>
        <b>
          {graphType === GRAPH_TYPE.SINGLE_DIMENSIONAL
            ? getSortNm(category)
            : "문서"}
        </b>{" "}
        목록 ({dataSource && dataSource.length}건)
      </h3>
      <Table
        key="siderTable"
        bordered={false}
        showHeader={false}
        rowKey={"id"}
        dataSource={dataSource}
        pagination={{
          pageSize: 20,
          showSizeChanger: false,
          position: "bottom center",
        }}
        onRow={(record, rowIndex) => {
          return {
            // onClick: event => {}, // click row
            // onDoubleClick: event => {}, // double click row
            onContextMenu: (event) => {}, // right button click row
            // onMouseEnter: (event) => {
            //   handleNodeHover(record);
            //   if (DEBUG) console.log("record", record);
            //   let bojungRate =
            //     Math.round((record.s / bojung) * (10 - zoom)) * 1.5;
            //   // let thatNodePos = graphRef.current.graph2ScreenCoords(Math.round(record.x + bojungRate * 1.3), Math.round(record.y + bojungRate * 1.2));
            //   // let thatNodePos = graphRef.current.graph2ScreenCoords(Math.round(record.x + bojungRate), Math.round(record.y + bojungRate));
            //   let thatNodePos = graphRef.current.graph2ScreenCoords(
            //     record.x,
            //     record.y
            //   );
            //
            //   setPopoverTop(thatNodePos.y);
            //   setPopoverLeft(thatNodePos.x);
            //   // setPopoverTitle(record.n);
            //   setPopoverContent(record.t);
            //   setPopoverVisible("block");
            // }, // mouse enter row
            // onMouseLeave: (event) => {
            //   handleNodeHover(null);
            //   setPopoverVisible("none");
            // }, // mouse leave row
          };
        }}
        columns={columns}
        className="socioDataListWrapper"
      />
    </>
  );
};

export default NodeList;
