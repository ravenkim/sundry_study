import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactResizeDetector from "react-resize-detector";
import { snaAction } from "features/sna/snaReducer";
import { Spin, Modal, Tooltip, Input, Tag, Layout, Button } from "antd";
import jwt_decode from "jwt-decode";
import {
  FIELD_TYPE,
  GRAPH_KEYWORD_TYPE,
  GRAPH_TITLE_MODE,
  GRAPH_TYPE,
} from "Constants";
import Toolbar from "features/sna/components/pro/tool/Toolbar";
import useDebounce from "utils/hooks/useDebounce";
import SearchTool from "features/sna/components/pro/tool/SearchTool";
import SingleDimensionalGraph from "features/sna/components/pro/graph/SingleDimensionalGraph";

const SocioGramPro = () => {
  const dispatch = useDispatch();

  const {
    limeWord,
    storeCategoryIPC,
    storeCategoryDDC,
    storeCategoryITC,
    storeCategoryBOOK,
    storeWordSearch,
  } = useSelector(({ snaReducer, indexReducer }) => ({
    //sociodata

    storeCategoryIPC: indexReducer.cacheData.data
      ? indexReducer.cacheData.data.categoryIPC
      : null,
    storeCategoryDDC: indexReducer.cacheData.data
      ? indexReducer.cacheData.data.categoryDDC
      : null,
    storeCategoryITC: indexReducer.cacheData.data
      ? indexReducer.cacheData.data.categoryITC
      : null,
    storeCategoryBOOK: indexReducer.cacheData.data
      ? indexReducer.cacheData.data.categoryBOOK
      : null,
    wordSearch: snaReducer.wordSearch.data,
    limeWord: snaReducer.limeWord.data,
  }));

  /*******************************************************************************
   * API
   *******************************************************************************/

  /*******************************************************************************
   * ITECH USER
   *******************************************************************************/

  window.addEventListener(
    "storage",
    (ev) => {
      const userData = window.localStorage.getItem("user");
      const isItech =
        window.localStorage.getItem("user") &&
        jwt_decode(JSON.parse(localStorage.getItem("user"))).is_itech === true;

      if (!userData || !isItech) {
        Modal.confirm({
          title: "네트워크 분석은 ITECH 연동 회원만 사용 가능합니다.",
          okText: "닫기",
          okButtonProps: {
            type: "default",
          },
          // icon: <CloseCircleOutlined/>,
          onOk() {
            closeWindowAndNewLogin();
          },
          cancelText: "로그인",
          cancelButtonProps: {
            type: "primary",
          },
          onCancel() {
            closeWindowAndNewLogin(true);
          },
          centered: true,
        });
      }
    },
    true
  );

  const closeWindowAndNewLogin = (isOk) => {
    if (isOk) {
      openLoginWindow("/account/login");
      window.close();
    } else {
      window.close();
    }
  };
  const openLoginWindow = (openUrl) => {
    // const openUrl = user ? "/account/myinfo" : "/account/login";
    const windowParams = {
      popupId: "lime",
      url:
        window.location.protocol +
        "//" +
        window.location.hostname +
        ":" +
        window.location.port +
        openUrl,
      width: window.screen.width,
      height: window.screen.height,
      otherOptions:
        ",directories=yes,titlebar=yes,toolbar=yes,location=yes,status=yes,menubar=yes,scrollbars=yes",
    };
  };

  /*******************************************************************************
   * Common Action
   *******************************************************************************/
  const graphRef = useRef();

  const [searchWord, setSearchWord] = useState("");
  const [zoom, setZoom] = useState(1.0);
  const [socioData, setSocioData] = useState();
  const [rootNode, setRootNode] = useState([]);

  // Canvas 화면에 rendering 되어있는 dataList
  const [dataTableList, setDataTableList] = useState(null);

  useEffect(() => {
    if (limeWord) {
      setSocioData({
        nodes: JSON.parse(JSON.stringify(limeWord[0].nodes)),
        links: JSON.parse(JSON.stringify(limeWord[0].links)),
      });
      setRootNode(
        limeWord === undefined || limeWord === null
          ? []
          : limeWord.outerlinks === undefined || limeWord.outerlinks === null
          ? []
          : limeWord.nodes[0].id
      );
    }
  }, [limeWord]);

  const setDataListInCanvasNode = () => {
    socioData &&
      graphRef.current &&
      setDataTableList(
        graphType === GRAPH_TYPE.SINGLE_DIMENSIONAL
          ? socioData.nodes.filter((node) => {
              let thisNodePos = graphRef.current.graph2ScreenCoords(
                node.x,
                node.y
              );
              return (
                thisNodePos.x >= 0 &&
                thisNodePos.y >= 0 &&
                thisNodePos.x <= graphWidth &&
                thisNodePos.y <= graphHeight
              );
            })
          : socioData.nodes.filter((node) => {
              if (!node.collapsed || node.id === rootNode) {
                let thisNodePos = graphRef.current.graph2ScreenCoords(
                  node.x,
                  node.y
                );
                return (
                  thisNodePos.x >= 0 &&
                  thisNodePos.y >= 0 &&
                  thisNodePos.x <= graphWidth &&
                  thisNodePos.y <= graphHeight
                );
              }
            })
      );
  };

  useEffect(() => {
    if (graphRef.current != null) {
      graphRef.current.zoom(zoom);
    }

    setDataListInCanvasNode();
  }, [zoom]);

  /*******************************************************************************
   * SearchTool Action
   *******************************************************************************/
  const [availableClassList, setAvailableClassList] = useState([]); //해당 섹션내 클래스중 검색된 노드가 0 이상인 클래스

  const [availableClassCheckedList, setAvailableClassCheckedList] = useState(
    []
  );
  // 포함어
  const [includeKeywords, setIncludeKeywords] = useState([]);
  // 제외어
  const [excludeKeywords, setExcludeKeywords] = useState([]);

  useEffect(() => {
    graphNodeDataFilterHandler();
  }, [includeKeywords]);

  /**
   * 검색어 입력 후 검색 handler
   * @param pWord 검색어
   */
  const searchHandler = (sWord) => {
    //word와 target에 해당하는 sociodata를 가져온다.
    console.log("Sociogram Pro : searchHandler", sWord);
    setSearchWord(sWord);
    getSocioDataEventHandler(
      sWord,
      category === "player" ? playerMode : category,
      section,
      keywordType,
      category === "player" ? true : false,
      graphType
    );
  };

  /**
   * Class 목록 Click handler
   */
  const clickClassHandler = (classCode) => {
    if (availableClassCheckedList.findIndex((x) => x === classCode) > -1) {
      setAvailableClassCheckedList((prev) =>
        availableClassCheckedList.filter(
          (filterPrev) => filterPrev !== classCode
        )
      );
    } else {
      setAvailableClassCheckedList((prev) => [...prev, classCode]);
    }
  };

  /**
   * node filter handler
   * 클래스리스트, 포함어, 제외어 추가시 node 필터링
   */
  const graphNodeDataFilterHandler = () => {
    if (socioData && categoryCD) {
      // CLASS filtering
      // if (storeSocioData.length > 0 && categoryCD.length > 0) {
      //   const { info, nodes, links } = storeSocioData[0];
      //   if (isMultiSectionChart) {
      //     console.log("isMultiSectionChart ",storeSocioData)
      //     setGraphNodeData({
      //       nodes: storeSocioData[0].nodes,
      //       links: storeSocioData[0].links,
      //       outerlinks: storeSocioData[0].outerLinks,
      //     });
      //   } else {
      //     if (sort === "player") {
      //       setGraphNodeData({
      //         info: info,
      //         nodes: nodes,
      //         links: links,
      //       });
      //     } else {
      //       let newNodes,
      //               newLinks = null;
      //       if (
      //               word
      //               //  && sort === "patent"
      //       ) {
      //         //Class filter
      //         if (section === "t") {
      //           newNodes = nodes.filter(
      //                   (prev) => availableClassCheckedList.indexOf(prev.g) > -1
      //           );
      //         } else {
      //           newNodes = nodes.filter(
      //                   (prev) =>
      //                           availableClassCheckedList.indexOf(
      //                                   section.toUpperCase() + prev.g
      //                           ) > -1
      //           );
      //         }
      //         //Include filter
      //         if (tagsInclude.length > 0) {
      //           newNodes = newNodes.filter((node) => {
      //             let equalsCount = 0;
      //             tagsInclude.map((tag) => {
      //               if (node.t.indexOf(tag) > -1) equalsCount++;
      //             });
      //             return tagsInclude.length === equalsCount;
      //           });
      //         }
      //
      //         //Exclude filter
      //         if (tagsExclude.length > 0) {
      //           newNodes = newNodes.filter((node) => {
      //             let is = true;
      //             tagsExclude.map((tag) => {
      //               if (node.t.indexOf(tag) > -1) is = false;
      //             });
      //             return is;
      //           });
      //         }
      //
      //         //Duplicate Filter
      //         newNodes = newNodes.filter((prev) => {
      //           return allowDuplicate ? true : prev.d === "Y";
      //         });
      //
      //         //제거된 노드와 연결된 link 삭제
      //         if (links.length > 0) {
      //           //최초 데이터 로드 시에는 links의 link는 형태가 {"v":3, "source":"B134", "target":"B136"} 과 같은 형태로 할당함
      //           //그래프에 데이터가 바인드 되면 {"v":3, "source":{id:"B134",...}, "target":{id:"B136",...}} 처럼 source와 target이 Object형태가 됨
      //           //따라서 최초 데이터가 바인드 되기 전에는 filter를 거치지 않고 이후에  source.id, target.id로 찾아 필터 처리함
      //           //mhkang 2020.03.30
      //           if (links[0].source.id) {
      //             newLinks = links.filter((link) => {
      //               return (
      //                       newNodes.some((node) => node.id === link.source.id) &&
      //                       newNodes.some((node) => node.id === link.target.id)
      //               );
      //               // newNodes.some(node => node.id === link.source.id) && newNodes.some(node => node.id === link.target.id);
      //             });
      //           } else {
      //             newLinks = links;
      //           }
      //         } else {
      //           newLinks = links;
      //         }
      //       } else {
      //         newNodes = nodes;
      //         newLinks = links;
      //       }
      //
      //       //Threshold Filter
      //       let thresholdLinks = newLinks.filter(
      //               (link) => link.vr >= linkThresold
      //       );
      //
      //       //Threshold filter에 의해 링크가 제거된 후 연결된 링크가 전혀 없어진 노드만 단독으로 존재하는 노드는 삭제
      //       if (thresholdLinks.length > 0) {
      //         if (thresholdLinks[0].source.id) {
      //           newNodes = newNodes.filter((node) => {
      //             return (
      //                     thresholdLinks.some((link) => node.id === link.source.id) ||
      //                     thresholdLinks.some((link) => node.id === link.target.id)
      //             );
      //           });
      //         }
      //       }
      //       setGraphNodeData({
      //         info: info,
      //         nodes: newNodes,
      //         links: thresholdLinks,
      //       });
      //     }
      //   }
      // } else {
      //   console.log(storeSocioData,"not data",categoryCD)
      //   if (storeSocioData&&isMultiSectionChart) {
      //     setGraphNodeData({
      //       nodes: storeSocioData[0].nodes,
      //       links: storeSocioData[0].links,
      //       outerlinks: storeSocioData[0].outerLinks,
      //     });
      //   }
      //   else
      //     setGraphNodeData(JSON.parse('{"info":null,"nodes":[], "links":[]}'));
      // }
    }
  };

  /*******************************************************************************
   * Toolbar Action
   *******************************************************************************/
  // const [sort, setSort] = useState("patent");

  const [category, setCategory] = useState(FIELD_TYPE.PATENT);
  const [titleMode, setTitleMode] = useState(GRAPH_TITLE_MODE.CLUSTERING);
  const [titleLength, setTitleLength] = useState(10);
  const [linkLineWidth, setLinkLineWidth] = useState(0.3);
  const [nodeSize, setNodeSize] = useState(1);
  const [keywordType, setKeywordType] = useState(GRAPH_KEYWORD_TYPE.WORD);

  const [graphType, setGraphType] = useState(GRAPH_TYPE.SINGLE_DIMENSIONAL);
  const [nodeExpand, setNodeExpand] = useState("-1");
  const [section, setSection] = useState("t");
  const [sectionIndex, setSectionIndex] = useState([]);
  const [yearRange, setYearRange] = useState([0, 0]);

  /**
   * Toolbar 초기화 Handler
   */
  const initializeHandler = () => {
    zoomChangeHandler(1.0);
    setGraphNodeKey((prev) => prev + 1);
  };

  /**
   * 소시오그램 ZOOM CHANGE HANDLER
   * @param z
   */
  const zoomChangeHandler = (z) => {
    if (z < 0.1) z = 0.1;
    else if (z > 10) z = 10;
    setZoom((prev) => z);
  };

  /**
   * 카테고리 CHANGE HANDLER
   */
  const categoryChangeHandler = (value) => {
    setCategory(value); //radio
    setAllClassList([]);

    if (
      value === "patent" ||
      value === "orgn" ||
      value === "n_subject" ||
      value === "n_orgn"
    ) {
      setCategoryCD(storeCategoryIPC);
    } else if (value === "thesis") {
      setCategoryCD(storeCategoryDDC);
    } else if (value.startsWith("mbr") || value.startsWith("subject")) {
      setCategoryCD(storeCategoryITC);
    } else if (value.startsWith("book")) {
      setCategoryCD(storeCategoryBOOK);
    } else if (value === "player") {
      if (playerMode === "patent" || playerMode === "n_subject") {
        setCategoryCD(storeCategoryIPC);
      } else if (playerMode === "thesis") {
        setCategoryCD(storeCategoryDDC);
      }
      searchWord &&
        getSocioDataEventHandler(
          searchWord,
          playerMode,
          section,
          keywordType,
          true,
          graphType
        );
      return;
    }
    searchWord &&
      getSocioDataEventHandler(
        searchWord,
        value,
        section,
        keywordType,
        false,
        graphType
      );
  };

  /**
   *  제목표기방법 CHANGE HANDLER
   */
  const titleModeChangeHandler = (e) => {
    setTitleMode(e.target.value);
  };

  /**
   *  제목길이 CHANGE HANDLER
   */
  const titleLengthChangeHandler = (value) => {
    setTitleLength(value);
  };

  /**
   * 연결선 두께 CHANGE HANDLER
   */
  const linkLineWidthChangeHandler = (value) => {
    setLinkLineWidth(value);
  };

  /**
   * Node 크기 CHANGE HANDLER
   */
  const nodeSizeChangeHandler = (value) => {
    setNodeSize(value);
  };

  /**
   * 키워드타입 (용어 문서 구분) CHANGE HANDLER
   * 용어(WORD) , 문서(DOCUMENT)
   */
  const keywordTypeChangeHandler = (e) => {
    setKeywordType(e.target.value);
    getSocioDataEventHandler(
      searchWord,
      category === "player" ? playerMode : category,
      section,
      e.target.value,
      category === "player" ? true : false,
      graphType
    );
  };

  /**
   * 소시오그램 종류 CHANGE HANDLER
   * 일반(SINGLE_DIMENSIONAL), 다차원(MULTI_DIMENSIONAL)
   * @param e
   */
  const graphTypeChangeHandler = (e) => {
    //다차원
    setGraphNodeData(null);
    setGraphType(e.target.value);
    searchWord &&
      getSocioDataEventHandler(
        searchWord,
        category === "player" ? playerMode : category,
        section,
        e.target.value,
        category === "player" ? true : false,
        e.target.value
      );
  };

  /**
   * 노드 펼침단계 CHANGE HANDLER (다차원)
   */
  const nodeExpandChangeHandler = (e) => {
    setNodeExpand(e);
  };

  /**
   * 연도 필터 CHANGE HANDLER (다차원)
   */
  const yearRangeChangeHandler = (e) => {
    setYearRange(e);
  };

  /**
   * 분류 CHANGE HANDLER
   */
  const sectionChangeHandler = (value) => {
    if (graphType === GRAPH_TYPE.MULTI_DIMENSIONAL) {
      setSectionIndex(value);
    } else {
      // console.log(allClassList, value);
      if (
        !allClassList.find((n) => n.value.toLowerCase() === value) &&
        value !== "t"
      ) {
        alert("해당 섹션에 데이터가 존재하지 않습니다.");
        return;
      }
      setSection(value); //select
      getSocioDataEventHandler(
        searchWord,
        category === "player" ? playerMode : category,
        value,
        keywordType,
        category === "player" ? true : false,
        graphType
      );
    }
  };

  /*******************************************************************************
   * SNA Action
   *******************************************************************************/

  const [graphWidth, setGraphWidth] = useState(1200);
  const [graphHeight, setGraphHeight] = useState(1200);

  /**
   * SNA WRAPPER 크기 변환시 사이즈 조절 HANDLER
   */
  const graphWrapResizeHandler = (w) => {
    console.log("resizeHandler : ", w);
    setGraphWidth(
      window.innerWidth - (nodeListVisible ? siderWidth + 20 : 0) + 320
    );
    setGraphHeight(window.innerHeight - wordListHeight - 36);
  };

  /*******************************************************************************
   *******************************************************************************/

  const [graphNodeKey, setGraphNodeKey] = useState(0);

  const [nodeListVisible, setNodeListVisible] = useState(true);
  // const [word, setWord] = useState("");
  const [viewMode, setViewMode] = useState("2D");

  const [dagMode, setDagMode] = useState("zout"); //노드의 배치 형태 td (top-down), bu (bottom-up), lr (left-to-right), rl (right-to-left), zout (near-to-far), zin (far-to-near), radialout (outwards-radially) or radialin (inwards-radially)
  const [backgroundColorMode, setBackgroundColorMode] = useState(false);

  const [d3AlphaDecay, setD3AlphaDecay] = useState(0.0128); //시뮬레이션 강도 감소 파라미터를 설정 default = 0.0228
  const [d3VelocityDecay, setD3VelocityDecay] = useState(0.4); //중간 저항을 시뮬레이션하는 노드의 속도 감소 default = 0.4
  const [dagLevelDistance, setDagLevelDistance] = useState(30); //노드간 거리

  const [playerMode, setPlayerMode] = useState("patent"); //CLUSTERING, AUTOSCALE, FIX

  const [graphNodeData, setGraphNodeData] = useState();

  // const wordListRef = React.createRef();

  const [wordListHeight, setWordListHeight] = useState(40);

  const [categoryCD, setCategoryCD] = useState([]);
  const [allClassList, setAllClassList] = useState([]); //해당 검색어의 초기 전체 섹션 클래스 리스트

  const [spinning, setSpinning] = useState(false);

  const [linkThresholdMin, setLinkThresholdMin] = useState(0);
  const [linkThresholdMax, setLinkThresholdMax] = useState(0);

  const [linkThresold, setLinkThresold] = useState(0);

  const [allowDuplicate, setAllowDuplicate] = useState(true);

  const [tagsInclude, setTagsInclude] = useState([]);
  const [tagsExclude, setTagsExclude] = useState([]);

  const [polygon, setPolygon] = useState(false);

  const [mainPlayerPatent, setMainPlayerPatent] = useState(false);
  const [mainPlayerThesis, setMainPlayerThesis] = useState(false);
  const [mainPlayerNtis, setMainPlayerNtis] = useState(true);

  const [playerSocio, setPlayerSocio] = useState({});
  const [fieldTypePublisher, setFieldTypePublisher] = useState(
    FIELD_TYPE.SUBJECT_NTIS
  );

  let siderWidth = 400;

  /*******************************************************************************
   * Event Handler
   *******************************************************************************/

  const onChangePlayerSort = (e) => {
    setPlayerMode(e.target.value);
    //플레이어 sort
    if (e.target.value === "patent" || e.target.value === "n_subject") {
      setCategoryCD(storeCategoryIPC);
    } else if (e.target.value === "thesis") {
      setCategoryCD(storeCategoryDDC);
    } else if (e.target.value === "book") {
      setCategoryCD(storeCategoryBOOK);
    }
    searchWord &&
      getSocioDataEventHandler(
        searchWord,
        e.target.value,
        section,
        keywordType,
        true,
        graphType
      );
  };

  const onChangeViewMode = (e) => {
    setViewMode(e.target.value); //radio

    onChangeBackgroundColorMode({
      target: { value: e.target.value === "3D" ? true : false },
    });
  };

  const onChangeDagMode = (changeValue) => {
    setDagMode(changeValue);
  };
  const onChangeBackgroundColorMode = (e) => {
    setBackgroundColorMode(e.target.value); //switch = true, false
  };

  const onChangeD3AlphaDecay = (value) => {
    setD3AlphaDecay(value);
  };

  const onChangeAllowDuplicate = (value) => {
    setAllowDuplicate((prev) => value);
  };
  const onChangePolygon = (value) => {
    setPolygon((prev) => value);
  };

  const getLimeAnalysisWord = (pWord) => {
    console.log("getLimeAnalysisWord", pWord);
    getSocioDataEventHandler(
      pWord,
      category === "player" ? playerMode : category,
      section,
      keywordType,
      category === "player" ? true : false,
      graphType
    );
  };
  const getSocioDataEventHandler = (
    pWord,
    pSort,
    pSection,
    pIsWord,
    pisPlayer,
    isMultiSectionChart = false
  ) => {
    if (pWord !== null && pWord !== "") {
      setSpinning((prev) => true);
      let playerSection = pSection;
      if (pIsWord) {
        pSection = pSection + "_word";
      }
      if (pisPlayer) {
        pSection = playerSection + "," + playerSection + "_word";
      }
      dispatch(
        snaAction.getLimeWord({
          word: pWord,
          sort: pSort,
          section: pSection,
          isplayer: pisPlayer,
          isMainPlayer: pisPlayer,
          node_size: 100,
          isMultiSectionChart,
        })
      );
    }
  };

  const fn_setGraphNodeDataFilter = () => {
    if (socioData && categoryCD) {
      if (socioData.length > 0 && categoryCD.length > 0) {
        const { info, nodes, links } = socioData;
        if (graphType === GRAPH_TYPE.MULTI_DIMENSIONAL) {
          setGraphNodeData({
            nodes: socioData.nodes,
            links: socioData.links,
            outerlinks: socioData.outerLinks,
          });
        } else {
          if (category === "player") {
            setGraphNodeData({
              info: info,
              nodes: nodes,
              links: links,
            });
          } else {
            let newNodes,
              newLinks = null;
            if (
              searchWord
              //  && sort === "patent"
            ) {
              //Class filter
              if (section === "t") {
                newNodes = nodes.filter(
                  (prev) => availableClassCheckedList.indexOf(prev.g) > -1
                );
              } else {
                newNodes = nodes.filter(
                  (prev) =>
                    availableClassCheckedList.indexOf(
                      section.toUpperCase() + prev.g
                    ) > -1
                );
              }
              //Include filter
              if (tagsInclude.length > 0) {
                newNodes = newNodes.filter((node) => {
                  let equalsCount = 0;
                  tagsInclude.map((tag) => {
                    if (node.t.indexOf(tag) > -1) equalsCount++;
                  });
                  return tagsInclude.length === equalsCount;
                });
              }

              //Exclude filter
              if (tagsExclude.length > 0) {
                newNodes = newNodes.filter((node) => {
                  let is = true;
                  tagsExclude.map((tag) => {
                    if (node.t.indexOf(tag) > -1) is = false;
                  });
                  return is;
                });
              }

              //Duplicate Filter
              newNodes = newNodes.filter((prev) => {
                return allowDuplicate ? true : prev.d === "Y";
              });

              //제거된 노드와 연결된 link 삭제
              if (links.length > 0) {
                //최초 데이터 로드 시에는 links의 link는 형태가 {"v":3, "source":"B134", "target":"B136"} 과 같은 형태로 할당함
                //그래프에 데이터가 바인드 되면 {"v":3, "source":{id:"B134",...}, "target":{id:"B136",...}} 처럼 source와 target이 Object형태가 됨
                //따라서 최초 데이터가 바인드 되기 전에는 filter를 거치지 않고 이후에  source.id, target.id로 찾아 필터 처리함
                //mhkang 2020.03.30
                if (links[0].source.id) {
                  newLinks = links.filter((link) => {
                    return (
                      newNodes.some((node) => node.id === link.source.id) &&
                      newNodes.some((node) => node.id === link.target.id)
                    );
                    // newNodes.some(node => node.id === link.source.id) && newNodes.some(node => node.id === link.target.id);
                  });
                } else {
                  newLinks = links;
                }
              } else {
                newLinks = links;
              }
            } else {
              newNodes = nodes;
              newLinks = links;
            }

            //Threshold Filter
            let thresholdLinks = newLinks.filter(
              (link) => link.vr >= linkThresold
            );

            //Threshold filter에 의해 링크가 제거된 후 연결된 링크가 전혀 없어진 노드만 단독으로 존재하는 노드는 삭제
            if (thresholdLinks.length > 0) {
              if (thresholdLinks[0].source.id) {
                newNodes = newNodes.filter((node) => {
                  return (
                    thresholdLinks.some((link) => node.id === link.source.id) ||
                    thresholdLinks.some((link) => node.id === link.target.id)
                  );
                });
              }
            }
            setGraphNodeData({
              info: info,
              nodes: newNodes,
              links: thresholdLinks,
            });
          }
        }
      } else {
        setGraphNodeData(JSON.parse('{"info":null,"nodes":[], "links":[]}'));
      }
    }
  };
  const onChangeLinkThresold = (value) => {
    setLinkThresold(value);
  };
  const onAfterChangeLinkThresold = (pThresold) => {
    setLinkThresold(pThresold);
  };

  /*******************************************************************************
   * Hooks
   *******************************************************************************/

  useEffect(() => {
    if (storeWordSearch) {
      console.log("storeWordSearch : ", storeWordSearch);

      if (storeWordSearch.playerSocio) {
        setPlayerSocio(storeWordSearch.playerSocio.patent);
      } else {
        setPlayerSocio({});
      }

      fn_setGraphNodeDataFilter();
    }
  }, [storeWordSearch]);

  useEffect(() => {
    if (socioData && socioData !== "none") {
      setZoom(1.0);
      let socioDataJson = socioData;
      const allClassListTmp = [];
      if (socioDataJson === null) {
        setGraphNodeData(JSON.parse('{"info":null,"nodes":[], "links":[]}'));
      } else {
        setAvailableClassList((prev) => []);
        setAvailableClassCheckedList((prev) => []);
        searchWord &&
          categoryCD &&
          // sort === "patent" &&
          section !== "t" &&
          categoryCD
            .filter((sec) => sec.value === section.toUpperCase())
            .map((categorySection, sectionKey) => {
              return (
                categorySection.children &&
                categorySection.children.map((categoryClass, classKey) => {
                  // console.log("categoryClass.value.substring(1) : ", categoryClass.value.substring(1));
                  if (
                    socioDataJson &&
                    socioDataJson.nodes &&
                    socioDataJson.nodes.filter(
                      (nd) =>
                        Number(nd.g) ===
                        Number(categoryClass.value.substring(1))
                    ).length > 0
                  ) {
                    setAvailableClassList((prev) => [...prev, categoryClass]);
                    allClassListTmp.push(categoryClass);
                    setAvailableClassCheckedList((prev) => [
                      ...prev,
                      categoryClass.value,
                    ]);
                  }
                })
              );
            });

        searchWord &&
          categoryCD &&
          // sort === "patent" &&
          section === "t" &&
          categoryCD.map((section, sectionKey) => {
            if (
              socioDataJson &&
              socioDataJson.nodes &&
              socioDataJson.nodes.filter((nd) => nd.g === section.value)
                .length > 0
            ) {
              allClassListTmp.push(section);
              setAvailableClassList((prev) => [...prev, section]);
              setAvailableClassCheckedList((prev) => [...prev, section.value]);
            }
          });

        let lMin =
          socioDataJson && socioDataJson.info ? socioDataJson.info.linkMin : 0;
        let lMax =
          socioDataJson && socioDataJson.info ? socioDataJson.info.linkMax : 0;
        setLinkThresholdMin(lMin);
        setLinkThresholdMax(lMax);
        if (allClassList.length === 0) setAllClassList(allClassListTmp);
        setLinkThresold(lMin);
      }
    }
    setSpinning(false);
  }, [socioData]);

  useEffect(() => {
    if (storeCategoryIPC) {
      if (
        category.startsWith("patent") ||
        category.startsWith("orgn") ||
        category.startsWith("n_subject") ||
        category.startsWith(
          "n_orgn" ||
            (category.startsWith("player") &&
              (playerMode.startsWith("patent") ||
                playerMode.startsWith("n_subject")))
        )
      ) {
        setCategoryCD(storeCategoryIPC);
      }
    }
  }, [storeCategoryIPC]);
  useEffect(() => {
    if (storeCategoryDDC) {
      if (
        category.startsWith("thesis") ||
        (category.startsWith("player") && playerMode.startsWith("thesis"))
      ) {
        setCategoryCD(storeCategoryDDC);
      }
    }
  }, [storeCategoryDDC]);
  useEffect(() => {
    if (storeCategoryITC) {
      if (category.startsWith("mbr") || category.startsWith("subject")) {
        setCategoryCD(storeCategoryITC);
      }
    }
  }, [storeCategoryITC]);

  useEffect(() => {
    console.log("availableClassCheckedList : ", availableClassCheckedList);
    if (availableClassCheckedList) {
      graphNodeDataFilterHandler();
    }
  }, [
    availableClassCheckedList,
    linkThresold,
    allowDuplicate,
    tagsInclude,
    tagsExclude,
  ]);

  useEffect(() => {
    //   word && sort && section && getSocioDataEventHandler(word, sort, section);
  }, []); //감시 값이 없으면 최초 로드 시 한번만 실행

  useDebounce(() => setGraphNodeKey((prev) => prev + 1), 500, [
    d3AlphaDecay,
    graphNodeData,
  ]);

  return (
    <>
      {/*<Toolbar*/}
      {/*  category={category}*/}
      {/*  categoryChangeHandler={categoryChangeHandler}*/}
      {/*  titleMode={titleMode}*/}
      {/*  titleModeChangeHandler={titleModeChangeHandler}*/}
      {/*  nodeSize={nodeSize}*/}
      {/*  nodeSizeChangeHandler={nodeSizeChangeHandler}*/}
      {/*  linkLineWidth={linkLineWidth}*/}
      {/*  linkLineWidthChangeHandler={linkLineWidthChangeHandler}*/}
      {/*  titleLength={titleLength}*/}
      {/*  titleLengthChangeHandler={titleLengthChangeHandler}*/}
      {/*  keywordType={keywordType}*/}
      {/*  keywordTypeChangeHandler={keywordTypeChangeHandler}*/}
      {/*  graphType={graphType}*/}
      {/*  graphTypeChangeHandler={graphTypeChangeHandler}*/}
      {/*  nodeExpand={nodeExpand}*/}
      {/*  nodeExpandChangeHandler={nodeExpandChangeHandler}*/}
      {/*  yearRange={yearRange}*/}
      {/*  yearRangeChangeHandler={yearRangeChangeHandler}*/}
      {/*  section={section}*/}
      {/*  sectionIndex={sectionIndex}*/}
      {/*  sectionChangeHandler={sectionChangeHandler}*/}
      {/*  initializeHandler={initializeHandler}*/}
      {/*/>*/}
      {/*<SearchTool*/}
      {/*  category={category}*/}
      {/*  section={section}*/}
      {/*  searchWord={searchWord}*/}
      {/*  dataTableList={dataTableList}*/}
      {/*  searchHandler={searchHandler}*/}
      {/*  includeKeywords={includeKeywords}*/}
      {/*  excludeKeywords={excludeKeywords}*/}
      {/*  setIncludeKeywords={setIncludeKeywords}*/}
      {/*  setExcludeKeywords={setExcludeKeywords}*/}
      {/*  availableClassList={availableClassList}*/}
      {/*  availableClassCheckedList={availableClassCheckedList}*/}
      {/*  clickClassHandler={clickClassHandler}*/}
      {/*/>*/}
      {/*<div>*/}
      {/*  {graphType === GRAPH_TYPE.SINGLE_DIMENSIONAL && (*/}
      {/*    <SingleDimensionalGraph*/}
      snaKey={"1"}
      snaId={"1"}
      width={graphWidth}
      height={graphHeight}
      graphRef={graphRef}
      titleMode={titleMode}
      titleLength={titleLength}
      nodeSize={nodeSize}
      linkLineWidth={linkLineWidth}
      dataSource={socioData}
      zoom={zoom}
      zoomChangeHandler={zoomChangeHandler}
      {/*    />*/}
      {/*  )}*/}
      {/*  <ReactResizeDetector*/}
      {/*    handleWidth*/}
      {/*    handleHeight*/}
      {/*    onResize={graphWrapResizeHandler}*/}
      {/*  />*/}
      {/*</div>*/}
    </>
  );
};

export default SocioGramPro;
