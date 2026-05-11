/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import ForceGraph2D from "react-force-graph-2d";
import {
  Button,
  Dropdown,
  Menu,
  Checkbox,
  Layout,
  Select,
  Slider,
  Row,
  Col,
  Radio,
  Carousel,
  Table,
  Tooltip,
  Modal,
  Tag,
  Input,
  Drawer,
} from "antd";
// import { Image } from "antd";
import {
  setDetailVisibleState,
  setSearchData,
} from "../../../modules/search/search";
import ReactResizeDetector from "react-resize-detector";
import useDebounce from "utils/hooks/useDebounce";
// import BarChart from "components/common/chart/BarChart";
import NodeList from "components/search/list/NodeList";
import {
  SelectOutlined,
  RightOutlined,
  PlusOutlined,
  MinusOutlined,
  QuestionCircleOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { stringToSubstring, isNumeric, getColor } from "utils/commonUtils";
import * as d3 from "d3";
import SocioGramDemoDownload from "components/common/main/SocioGramDemoDownload";
import SocioGramDemoTutorial from "components/common/main/SocioGramDemoTutorial";
import { TweenOneGroup } from "rc-tween-one";
import "pages/style/demo/SocioGramDemo.scss";
import PlotlyBarChart from "components/plotly/PlotlyBarChart";
import SocioGramDemoWordSelectBox from "components/common/main/SocioGramDemoWordSelectBox";
import SearchDetailContainer from "containers/search/SearchDetailContainer";
import { getMultiDetailData } from "modules/search/search_es";
import { FIELD_TYPE, DEBUG } from "Constants";
import { TweenMax } from "gsap";
import CustomNetworkGraph from "../../test/CustomNetworkGraph";
import HierarchyiNetworkGraph from "../../test/HierarchyiNetworkGraph";

// const img = new Image();
// img.src = "/images/node-icon/ipc_icons.png";
const { Sider, Content } = Layout;
const { Option } = Select;
const wordListRef = React.createRef();
const SocioGramDemo = ({
  socioGramId,
  socioData,
  word,
  socioGraphWidth,
  socioGraphHeight,
  setWindowResizeEvent,
  nodeListVisible,
  setNodeListVisible,
  dagLevelDistance, //그래프의 연결강도 (중심으로 모이는 강도)
  nodeSizeRate, //노드의 크기 비율
  onSelectSortSection,
  viewMode,
  onChangeViewMode,
  sort,
  onChangeSort,
  section,
  onChangeSection,
  filterRange,
  onChangeFilterRange,
  dagMode,
  onChangeDagMode,
  backgroundColorMode,
  onChangeBackgroundColorMode,
  zoom,
  setZoomHandler,
  titleMode,
  titleLength,
  onChangeTitleLengthSlider,
  onChangeTitleMode,
  linkLineWidthRate,
  onChangeNodeSizeRate,
  onChangeLinkLineWidthRate,
  d3AlphaDecay,
  d3VelocityDecay,
  onChangeD3AlphaDecay,
  getDataEvent,
  categoryCD,
  availableClassList,
  availableClassCheckedList,
  onAfterChangeLinkThresold,
  onChangeLinkThresold,
  linkThresold,
  linkThresholdMin,
  linkThresholdMax,
  onClickClass,
  allowDuplicate,
  onChangeAllowDuplicate,
  tagsInclude,
  setTagsInclude,
  tagsExclude,
  setTagsExclude,
  siderWidth,
  onChangePolygon,
  polygon,
  onChangeWordSelectBox,
  isWord,
  onChangeIsWord,
  setGraphNodeKey,
  onChangePlayerSort,
  playerMode,
  onChangeMultiChart,
  isMultiSectionChart,
  sectionIndex,
  expand,
  onChangeNodeDepth,
  getLimeAnalysisWord,
}) => {
  /*******************************************************************************************************************
   * useSelector
   *******************************************************************************************************************/

  const {
    storeSearchEsReducer,
    // isDetailLoading
  } = useSelector(({ searchEsReducer, loading }) => ({
    storeSearchEsReducer: searchEsReducer[`socioGramDemo/${sort}`],
    // isDetailLoading: loading[`search_ES/GET_MULTI_DETAIL_DATA`],
  }));
  /*******************************************************************************************************************
   * useState
   *******************************************************************************************************************/
  const graphRef = useRef();
  const siderRef = useRef(null);
  const popoverRef = useRef();
  const saveInputIncludeRef = useRef(null);
  const saveInputExcludeRef = useRef(null);
  const sortRef = useRef(null);

  const [linkDirectionalParticleWidth, setLinkDirectionalParticleWidth] =
    useState(0);
  const [socioGramKey, setSocioGramKey] = useState(0);
  const [data, setData] = useState(socioData);
  const [isSetChart, setChart] = useState(null);
  const [dataTableList, setDataTableList] = useState(null);
  const [newNodeCount, setNewNodeCount] = useState(0);
  const [isFirstTouch, setIsFirstTouch] = useState(false);
  const [drawerVisibleState, setDrawerVisibleState] = useState(false);
  const [dropDownVisibleState, setDropDownVisibleState] = useState(false);
  const [socioClickedNodeObject, setSocioClickedNodeObject] = useState("");

  const [barChartVisible, setBarChartVisible] = useState(false);

  const [zoomToFixTypeSpace, setZoomToFixTypeSpace] = useState([]);

  /****************************************
   * multisection
   *
   *
   ****************************************/
  const circle = { radius: 0 };
  const tween = TweenMax.to(circle, 0.2, {
    radius: 3,
  });
  const rel = ["키워드", "섹션", "분류", "문서", "용어"];
  const [graphopt, setGraphOpt] = useState({ tn: 0.3, tdistance: 0, ns: 5 });
  const [root, setRoot] = useState([]);

  const MakeList = (data, key) => {
    const depth = new Set();
    for (let value in data) {
      if (key === "indexKey") {
        if (!depth.has(data[value].name) && data[value][key] === "section") {
          depth.add(data[value].name);
        }
      } else {
        if (!depth.has(data[value][key])) {
          depth.add(data[value][key]);
        }
      }
    }
    return depth;
  };
  const sectionList = () => {
    const item = [];
    if (socioData) {
      if (socioData.nodes) {
        const depth = MakeList(socioData.nodes, "indexKey");
        depth.forEach((data) => {
          item.push(
            <Option key={data.toString()} value={data}>
              {data}
            </Option>
          );
        });
      }
    }
    return item;
  };
  const yearList = () => {
    const range_arr = [];
    if (socioData) {
      if (socioData.nodes) {
        //년도 필터 범위 최소값
        socioData.nodes.forEach((node) => {
          if (node.year && node.year !== "")
            range_arr.push(parseInt(node.year));
        });
      }
    }
    return range_arr.length === 0
      ? [0, 0]
      : [Math.min(...range_arr), Math.max(...range_arr)];
  };
  const nodeList = () => {
    const item = [];
    let i = 0;
    item.push(<Option key={-1}>펼치지 않음</Option>);
    if (socioData) {
      if (socioData.outerlinks) {
        const depth = MakeList(socioData.nodes, "depth");
        depth.forEach((data) => {
          item.push(
            <Option key={data.toString()} value={data}>
              {rel[i]}
            </Option>
          );
          i += 1;
        });
      }
    }
    return item;
  };
  /****************************************/
  useEffect(() => {
    if (data) {
      setRoot(
        socioData === undefined || socioData === null
          ? []
          : socioData.outerlinks === undefined || socioData.outerlinks === null
          ? []
          : socioData.nodes[0].id
      );
      setChart(isMultiSectionChart);
      if (isMultiSectionChart) {
        setDefaultFilterRange(yearList());
        onChangeFilterRange(yearList());
      }
    }
  }, [data]);

  useEffect(() => {
    let space = "";
    let arr = [];
    for (let i = 0; i < 100; i++) {
      space = space + " ";
      arr.push(space);
    }
    setZoomToFixTypeSpace(arr);
  }, []);

  let backgroundColorBody = backgroundColorMode ? "#ffffff" : "#000000";

  let backgroundColorFont = backgroundColorMode ? "#000000" : "#ffffff";

  let searchBoxStyle = {
    fontSize: "12px",
    color: "#444",
    margin: "15px 10px",
  };
  let searchBoxTitleStyle = {
    //borderBottom: `1px solid ${backgroundColorFont} `,
    //width: "50%",
    textAlign: "left",
    margin: "0px 0px 5px 0px",
    lineHeight: "20px",
  };

  const [highlightNodes, setHighlightNodes] = useState([]);
  const [highlightLink, setHighlightLink] = useState(null);
  const [defaultFilterRange, setDefaultFilterRange] = useState([0, 0]);

  const [chartWidth, setChartWidth] = useState(300);
  const [relationPatentPopupState, setRelationPatentPopupState] =
    useState(false);
  // const [clickNodeId, setClickNodeId] = useState("");

  const [relationNodes, setRelationNodes] = useState([]);

  const [popoverVisible, setPopoverVisible] = useState("none");
  const [popoverTitle, setPopoverTitle] = useState("");
  const [popoverContent, setPopoverContent] = useState("");

  const [popoverTop, setPopoverTop] = useState(0);
  const [popoverLeft, setPopoverLeft] = useState(0);
  const [inputIncludeVisible, setInputIncludeVisible] = useState(false);
  const [inputExcludeVisible, setInputExcludeVisible] = useState(false);
  const [inputInclude, setInputInclude] = useState("");
  const [inputExclude, setInputExclude] = useState("");

  const [detailWordVisible, setDetailWordVisible] = useState(false);
  const [detailWordDataList, setDetailWordDataList] = useState([]);
  // Modal Close Handler
  const onDetailWordClose = () => {
    setDetailWordVisible(false);
  };

  const [bojung, setBojung] = useState(2);

  const [wordListHeight, setWordListHeight] = useState(100);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  /*******************************************************************************************************************
   * Event Handler
   *******************************************************************************************************************/
  const dispatch = useDispatch();
  const onLinkClick = useCallback((node) => {}, [graphRef]);

  const restartSocioGram = () => {
    //최초 로드 시 그래프 랜더링 이후 width change에 의해 무조건 한번더 실행되는 상황을 방지하기 위해 최초 접근 구분
    //최초 로드시에는 restartSocioGram 실행 방지 !
    if (isFirstTouch) {
      // setSocioGraphHeight(prev => prev - 100);
      //graphRef.current.d3ReheatSimulation();
      setSocioGramKey((prevCount) => prevCount + 1);
    }
    setIsFirstTouch(true);
  };

  useDebounce(restartSocioGram, 1000, [socioGraphWidth, socioGraphHeight]);

  //TODO : 없애도 되는건지 더 봐야함. 일단은 주석처리함
  const socioGramWrapDivOnResize = (
    ReactResizeDetectorWidth,
    ReactResizeDetectorHeight
  ) => {
    const handler = setTimeout(setWindowResizeEvent, 1000);
    return () => clearTimeout(handler);
  };
  const onDrawerClose = function () {
    setDrawerVisibleState(false); //drawer 활성화
  };
  const contextMenuOnclick = (e) => {
    setDropDownVisibleState(false); //우클릭 Context Menu 닫기
    if (e.key === "1") {
      //상세조회
      dispatch(setDetailVisibleState(true));
      //setDrawerVisibleState(prev => (prev = true));
    } else if (e.key === "2") {
      //원문바로가기
      window.open(
        "http://www.riss.kr/link?id=T14859885&outLink=K", //socioClickedNodeObject.outerLink
        "nodeClick",
        "width=1000,height=1000"
      );
    } else if (e.key === "3") {
      //선택 노드로 재검색(Sociogram)
      // restartSocioGram();
      // onChangeWordSelectBox(socioClickedNodeObject.t);
    } else if (e.key === "4") {
      //선택 노드 확장
      // addNode(socioClickedNodeObject.id);
    } else if (e.key === "5") {
      setRelationNodes(socioClickedNodeObject.n.split(","));
      setRelationPatentPopupState(true);
    }
  };

  const onClickRelationPatentPopupState = () => {
    setRelationPatentPopupState(false);
  };

  const getEnterEvent = (event, socioWordList) => {
    if (event.keyCode === 13) {
      let userInputWord =
        (event.target.value &&
          event.target.value.length > 1 &&
          event.target.value) ||
        null;
      if (userInputWord) {
        if (
          !socioWordList ||
          (socioWordList &&
            socioWordList.filter(
              (word) => word === userInputWord || word.includes(userInputWord)
            ).length === 0)
        ) {
          // 리스트에 없는 단어 선택 시 이벤트
          console.log(socioWordList);
          getLimeAnalysisWord(userInputWord);
          // setTooltipVisible(true);
          // const handler = setTimeout(() => setTooltipVisible(false), 2000);
        }
      }
    } else {
      return false;
    }
  };

  const addNode = (parentId) => {
    // const { nodes, links } = data;

    let aaa = 0;
    for (aaa = 0; aaa < 4; aaa++) {
      setNewNodeCount((prev) => prev + 1);

      const newNode = {
        id: `mhkang${newNodeCount}_${aaa}`,
        size: 5,
        g: 2,
      };
      const newLink = {
        source: parentId,
        target: `mhkang${newNodeCount}_${aaa}`,
        value: 4,
      };

      setData(({ nodes, links }) => {
        return {
          nodes: [...nodes, newNode],
          links: [...links, newLink],
        };
      });
    }
  };

  // const popRelationPatent = (clickNodeId) => {};

  const onNodeClick = (node) => {
    // graphRef.current.centerAt(node.x, node.y, 1000);
    // graphRef.current.zoom(zoom + 2, 1000);
    console.log("click node : ", node, sort);
    if (sort === FIELD_TYPE.MBR) {
      if (node.openYn === "N") {
        return false;
      }
    }

    if (isWord) {
      // ntis 기과닝ㄹ 경우에 다르게
      if (sort === FIELD_TYPE.ORGN_NTIS) {
        let nodes = node.n.split(",");
        let nodeList = [];
        if (nodes) {
          nodes.map((node, idx) => {
            let listObj = { key: node, title: node, action: false };
            nodeList.push(listObj);
          });
        }
        setDetailWordDataList(nodeList);
        setDetailWordVisible(true);
      } else if (sort === FIELD_TYPE.ORGN_KEIT) {
        let nodes = node.n.split(",");
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
            let listObj = { key: node, title: nodeTitle, action: false };
            nodeList.push(listObj);
          });
        }
        setDetailWordDataList(nodeList);
        setDetailWordVisible(true);

        // let nodes = node.n.split(",");
        // let nodeList = [];
        // if (nodes) {
        //   nodes.map((node, idx) => {
        //     let listObj = { key: node, title: node, action: false };
        //     nodeList.push(listObj);
        //   });
        // }
        // setDetailWordDataList(nodeList);
        // setDetailWordVisible(true);
      } else {
        detailWordViewClickHandler(node.n);
      }
    } else {
      if (sort === FIELD_TYPE.ORGN_NTIS) {
        detailWordViewClickHandler(node.n);
      } else if (sort === FIELD_TYPE.ORGN_KEIT) {
        detailWordViewClickHandler(node.n);
      } else {
        detailViewClickHandler(node.n);
      }
    }

    // onDataListClickNode(node.id);
  };

  const onNodeRightClick = (clickNode) => {
    setDropDownVisibleState((prev) => true); //노드 우클릭 시 만 context menu 활성
    let filterNode = data.nodes.filter(
      (filterNode) => filterNode.id === clickNode.id
    );
    if (filterNode && filterNode.length > 0) {
      setSocioClickedNodeObject((prev) => filterNode[0]);
    }
  };
  // const onDataListClickNode = function (nodeId) {
  //   let filterNode = data.nodes.filter((node) => node.id === nodeId);
  //   if (filterNode && filterNode.length > 0) {
  //     setSocioClickedNodeObject((prev) => filterNode[0]);
  //   }
  //   setDrawerVisibleState((prev) => true);
  // };

  // const onZoomChangeSlider = (value) => {
  //   //graphRef.current.centerAt(window.screen.width, window.screen.height, 1000);
  //   graphRef.current.zoom(value);
  //   setZoomHandler(value);
  // };

  // const onZoomOutClick = () => {
  //   //더 작게 보기(축소)
  //   if (zoom > zoomMin) {
  //     setZoomHandler(zoom - zoomStep);
  //   }
  // };
  // const onZoomInClick = () => {
  //   //더 크게 보기(확대)
  //   if (zoom < zoomMax) {
  //     setZoomHandler(zoom + zoomStep);
  //   }
  // };

  const onZoom = ({ k, x, y }, e) => {
    //
  };
  const onZoomEnd = ({ k, x, y }) => {
    setZoomHandler(k);
  };

  const handleNodeHover = useCallback(
    (node) => {
      setHighlightNodes(node ? [node] : []);
    },
    [setHighlightNodes]
  );
  const handleLinkHover = useCallback(
    (link) => {
      setHighlightLink(link);
      setHighlightNodes(link ? [link.source, link.target] : []);
    },
    [setHighlightLink, setHighlightNodes]
  );

  // const NODE_R = 3;
  // const paintRing = useCallback((node, ctx) => {
  //   // add ring just for highlighted nodes
  //   ctx.beginPath();
  //   ctx.arc(Math.round(node.x), Math.round(node.y), NODE_R * 1.4 * Math.round(node.s * nodeSizeRate), 0, 2 * Math.PI, false);
  //   ctx.fillStyle = "red";
  //   ctx.fill();
  // }, []);

  const canvasImageDownload = () => {
    // console.log("graphRef. : ", graphRef.current.);
    var dataURL = document
      .getElementsByTagName("canvas")[0]
      .toDataURL("image/png", 1);
    dataURL = dataURL.replace(
      /^data:image\/[^;]*/,
      "data:application/octet-stream"
    );
    dataURL = dataURL.replace(
      /^data:application\/octet-stream/,
      "data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png"
    );
    var aTag = document.createElement("a");
    aTag.download = "from_sociogram.png";
    aTag.href = dataURL;
    aTag.click();
  };

  const setDataListInCanvasNode = () => {
    data &&
      graphRef.current &&
      setDataTableList(
        !isMultiSectionChart
          ? data.nodes.filter((node) => {
              let thisNodePos = graphRef.current.graph2ScreenCoords(
                node.x,
                node.y
              );
              return (
                thisNodePos.x >= 0 &&
                thisNodePos.y >= 0 &&
                thisNodePos.x <= socioGraphWidth &&
                thisNodePos.y <= socioGraphHeight
              );
            })
          : data.nodes.filter((node) => {
              if (!node.collapsed || node.id === root) {
                let thisNodePos = graphRef.current.graph2ScreenCoords(
                  node.x,
                  node.y
                );
                return (
                  thisNodePos.x >= 0 &&
                  thisNodePos.y >= 0 &&
                  thisNodePos.x <= socioGraphWidth &&
                  thisNodePos.y <= socioGraphHeight
                );
              }
            })
      );
  };

  // 목록의 title 클릭시 상세 정보 검색 및 상세 drawer open
  const detailViewClickHandler = (targetKey) => {
    let _type = null;

    if (sort === FIELD_TYPE.PATENT) _type = FIELD_TYPE.PATENT;
    else if (sort === FIELD_TYPE.THESIS_NDSL) _type = FIELD_TYPE.THESIS_NDSL;
    else if (sort === FIELD_TYPE.SUBJECT_NTIS) _type = FIELD_TYPE.SUBJECT_NTIS;
    else if (sort === "n_subject") _type = FIELD_TYPE.SUBJECT_NTIS;
    else if (sort === FIELD_TYPE.ORGN_NTIS) _type = FIELD_TYPE.ORGN_NTIS;
    else if (sort === "subject") _type = FIELD_TYPE.SUBJECT_KEIT;
    else if (sort === FIELD_TYPE.MBR) _type = FIELD_TYPE.MBR;
    else if (sort === FIELD_TYPE.ORGN_KEIT) _type = FIELD_TYPE.ORGN_KEIT;
    else if (sort === FIELD_TYPE.Player) {
      if (playerMode === "patent") {
        _type = FIELD_TYPE.PATENT;
      } else if (playerMode === "thesis") {
        _type = FIELD_TYPE.THESIS_NDSL;
      } else {
        _type = FIELD_TYPE.SUBJECT_NTIS;
      }
    }

    dispatch(
      setSearchData({
        type: _type,
        // keys: data.n,
        keys: targetKey,
      })
    );
    dispatch(setDetailVisibleState(true));
  };

  // 목록의 title 클릭시 상세 정보 검색 및 상세 drawer open
  const detailWordViewClickHandler = (targetKey) => {
    if (DEBUG) console.log("targetKey", targetKey, sort);
    let _type = null;
    // "thesis:과제", "patent:특허", "mbr:KEIT연구자","subject:KEIT과제","orgn:KEIT기관", "n_subject:NTIS과제", "n_orgn:NTIS기관"
    if (sort === FIELD_TYPE.PATENT) _type = FIELD_TYPE.PATENT;
    else if (sort === FIELD_TYPE.THESIS_NDSL) _type = FIELD_TYPE.THESIS_NDSL;
    else if (sort === FIELD_TYPE.SUBJECT_NTIS) _type = FIELD_TYPE.SUBJECT_NTIS;
    else if (sort === "n_subject") _type = FIELD_TYPE.SUBJECT_NTIS;
    else if (sort === FIELD_TYPE.ORGN_NTIS) _type = FIELD_TYPE.ORGN_NTIS;
    else if (sort === "subject") _type = FIELD_TYPE.SUBJECT_KEIT;
    else if (sort === FIELD_TYPE.MBR) _type = FIELD_TYPE.MBR;
    else if (sort === FIELD_TYPE.ORGN_KEIT) _type = FIELD_TYPE.ORGN_KEIT_ANAL;
    else if (sort === FIELD_TYPE.BOOK) _type = FIELD_TYPE.BOOK;
    else if (sort === FIELD_TYPE.Player) {
      if (playerMode === "patent") {
        _type = FIELD_TYPE.PATENT;
      } else if (playerMode === "thesis") {
        _type = FIELD_TYPE.THESIS_NDSL;
      } else {
        _type = FIELD_TYPE.SUBJECT_NTIS;
      }
    }
    // if (sort === "patent") {
    //   _type = "WORD_TO_PATENT";
    // } else if (sort === "thesis") {
    //   _type = "WORD_TO_THESIS_NDSL";
    // } else if (sort === "n_subject") {
    //   _type = "WORD_TO_SUBJECT_NTIS";
    // } else if (sort === "mbr") {
    //   _type = "researcher";
    // }
    // else if (sort === "subject") {
    //   _type = "subject_keit";
    // } else if (sort === "orgn") {
    //   _type = "orgn_keit";
    // } else if (sort === "n_orgn") {
    //   _type = "orgn_ntis";
    // }

    // if(targetKey.includes("/")){
    //   let tmp = ""
    //   targetKey.split(",").forEach((d)=>{
    //
    //     tmp += d.split("/")[1]+"/";
    //   })
    //   targetKey = tmp.slice(0,-1);
    // }
    // else {
    //   targetKey = targetKey.replaceAll(",","/")
    // }
    dispatch(
      getMultiDetailData({
        stateKey: `socioGramDemo/${sort}`,
        type: _type,
        keys: targetKey,
      })
    );

    setDetailWordVisible(true);
  };

  useEffect(() => {
    if (storeSearchEsReducer) {
      if (DEBUG) console.log("storeSearchEsReducer : ", storeSearchEsReducer);
      // console.log("sort : ", sort);
      let nodeList = [];
      for (let key in storeSearchEsReducer) {
        if (storeSearchEsReducer.hasOwnProperty(key)) {
          let listObj = {
            key: null,
            title: "제목없음",
          };
          switch (sort) {
            case FIELD_TYPE.PATENT:
              listObj["key"] = key;
              if (storeSearchEsReducer[key].title) {
                listObj["title"] = storeSearchEsReducer[key].title;
              }
              break;
            case FIELD_TYPE.THESIS_NDSL:
              listObj["key"] = key;
              if (storeSearchEsReducer[key].titleH) {
                listObj["title"] = storeSearchEsReducer[key].titleH;
              }
              break;
            case "n_subject":
              listObj["key"] = key;
              if (storeSearchEsReducer[key].sbjtNm) {
                listObj["title"] = storeSearchEsReducer[key].sbjtNm;
              }
              break;
            case FIELD_TYPE.MBR:
              listObj["key"] = key;
              listObj["title"] = storeSearchEsReducer[key].mbrNm;
              listObj["openYn"] = storeSearchEsReducer[key].openYn;
              break;
            case "subject":
              listObj["key"] = key;
              listObj["title"] = storeSearchEsReducer[key].hanSbjtNm;
              break;
            case FIELD_TYPE.ORGN_KEIT:
              listObj["key"] = key;
              listObj["title"] = storeSearchEsReducer[key].hanSbjtNm;
              break;
            case FIELD_TYPE.ORGN_NTIS:
              listObj["key"] = storeSearchEsReducer[key].sbjtId;
              listObj["title"] = storeSearchEsReducer[key].title;
              break;
            case FIELD_TYPE.Player:
              if (playerMode === "patent") {
                listObj["key"] = key;
                listObj["title"] = storeSearchEsReducer[key].title;
              } else if (playerMode === "thesis") {
                listObj["key"] = key;
                listObj["title"] = storeSearchEsReducer[key].titleH;
              } else {
                listObj["key"] = key;
                listObj["title"] = storeSearchEsReducer[key].hanSbjtNm;
              }
              break;
            // case "subject_keit":
            //   url = `/dt/search_es/get_detail_subject_keit`;
            //   break;
            default:
              listObj["key"] = null;
              listObj["title"] = null;
              break;
          }
          nodeList.push(listObj);
        }
      }
      // console.log("nodeList : ", nodeList);

      setDetailWordDataList(nodeList);
    }
  }, [storeSearchEsReducer]);

  /*******************************************************************************************************************
   * Function
   *******************************************************************************************************************/

  const menu = (
    <Menu
      mode="vertical"
      onMouseLeave={() => setDropDownVisibleState((prev) => false)}
      onClick={contextMenuOnclick}
    >
      <Menu.Item key="1">
        <SelectOutlined />
        상세조회
      </Menu.Item>
      {/* <Menu.Item key="2">
        <DownloadOutlined />
        원문보기
      </Menu.Item>
      <Menu.Item key="3">
        <DownloadOutlined />
        <b>"{stringToSubstring(socioClickedNodeObject.t, 20)}"</b> 로 재검색
      </Menu.Item>
      <Menu.Item key="4">
        <SearchOutlined />
        <b>"{stringToSubstring(socioClickedNodeObject.t, 20)}"</b> 확장
      </Menu.Item>
      <Menu.Item key="5">
        <SelectOutlined />
        연관특허 조회
      </Menu.Item> */}
    </Menu>
  );

  const forMap = (tag, sort) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          if (sort === "INCLUDE") {
            handleIncludeClose(tag);
          } else {
            handleExcludeClose(tag);
          }
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };

  const handleIncludeClose = (removedTag) => {
    setTagsInclude(tagsInclude.filter((tag) => tag !== removedTag));
  };
  const showInputInclude = () => {
    setInputIncludeVisible(true);
  };
  const handleInputIncludeChange = (e) => {
    setInputInclude(e.target.value);
  };
  const handleInputIncludeConfirm = () => {
    if (inputInclude !== "") {
      if (inputInclude && tagsInclude.indexOf(inputInclude) === -1) {
        setTagsInclude([...tagsInclude, inputInclude]);
      }
    }
    setInputIncludeVisible(false);
    setInputInclude("");
  };

  const handleExcludeClose = (removedTag) => {
    setTagsExclude(tagsExclude.filter((tag) => tag !== removedTag));
  };
  const showInputExclude = () => {
    setInputExcludeVisible(true);
  };
  const handleInputExcludeChange = (e) => {
    setInputExclude(e.target.value);
  };
  const handleInputExcludeConfirm = () => {
    if (inputExclude !== "") {
      if (inputExclude && tagsExclude.indexOf(inputExclude) === -1) {
        setTagsExclude([...tagsExclude, inputExclude]);
      }
    }
    setInputExcludeVisible(false);
    setInputExclude("");
  };

  const getSortNm = (pSort) => {
    if (pSort === FIELD_TYPE.PATENT) return "특허";
    else if (pSort === FIELD_TYPE.THESIS_NDSL) return "논문";
    else if (pSort === FIELD_TYPE.SUBJECT_NTIS) return "국가R&D과제";
    else if (pSort === "n_subject") return "국가R&D기관";
    else if (pSort === FIELD_TYPE.ORGN_NTIS) return "국가R&D기관";
    else if (pSort === "subject") return "KEIT과제";
    else if (pSort === FIELD_TYPE.MBR) return "KEIT연구자";
    else if (pSort === FIELD_TYPE.ORGN_KEIT) return "KEIT기관";
    else if (pSort === FIELD_TYPE.Player) {
      if (playerMode === "patent") {
        return "특허";
      } else if (playerMode === "thesis") {
        return "논문";
      } else {
        return "국가R&D과제";
      }
    }
  };
  const getCategoryClassTitle = (pSort) => {
    if (pSort === FIELD_TYPE.PATENT) return "특허 IPC 분류";
    else if (pSort === FIELD_TYPE.THESIS_NDSL) return "논문 DDC 분류";
    else if (pSort === "n_subject") return "AI 기반 특허 IPC 재분류";
    else if (pSort === FIELD_TYPE.ORGN_NTIS) return "AI 기반 특허 IPC 재분류";
    else if (pSort === "subject") return "산업기술분류";
    else if (pSort === FIELD_TYPE.SUBJECT_KEIT) return "산업기술분류";
    else if (pSort === FIELD_TYPE.MBR) return "산업기술분류";
    else if (pSort === FIELD_TYPE.ORGN_KEIT) return "AI 기반 특허 IPC 재분류";
    else if (pSort === FIELD_TYPE.BOOK) return "도서분류";
    else if (pSort === FIELD_TYPE.Player) {
      if (playerMode === "patent") {
        return "특허 IPC 분류";
      } else if (playerMode === "thesis") {
        return "논문 DDC 분류";
      } else {
        return "과제 분류";
      }
    }
    // else if (pSort === "player") return "산업기술분류";
  };

  const getWordDrawerNodeList = (pSort) => {
    if (pSort === "n_subject") {
      return (
        <NodeList
          type={FIELD_TYPE.SUBJECT_NTIS}
          dataList={detailWordDataList && detailWordDataList}
        />
      );
    } else if (pSort === "subject") {
      return (
        <NodeList
          type={FIELD_TYPE.SUBJECT_KEIT}
          dataList={detailWordDataList && detailWordDataList}
        />
      );
    } else {
      return (
        <NodeList
          type={pSort}
          dataList={detailWordDataList && detailWordDataList}
        />
      );
    }
  };

  // select nodes of the group, retrieve its positions
  // and return the convex hull of the specified points
  // (3 points as minimum, otherwise returns null)
  // const polygonGenerator = (groupId) => {
  //   // console.log("-----------------------------------> data : ", data);
  //   if (data) {
  //     let node_coords = data.nodes.filter((prev) => {
  //       return prev.g === groupId;
  //     });
  //     // console.log("-----------------------------------> node_coords : ", node_coords);

  //     let polygons = node_coords.map((d) => {
  //       console.log(d);
  //       //console.log(d.x, d.y);
  //       return [d.x, d.y];
  //     });
  //     // console.log("-----------------------------------> polygons : ", polygons);
  //     // charge link center collide
  //     // graphRef.current.d3Force("collide", d3.polygonHull(polygons));
  //     // return d3.polygonHull(polygons);
  //     // console.log("-----------------------------------> d3.polygonHull(polygons) : ", d3.polygonHull(polygons, 3));
  //     // // graphRef.current.d3Force("link", d3.polygonHull(polygons));
  //     // console.log("d3.polygonHull(polygons) : ", d3.polygonHull(polygons));
  //     // console.log("d3.polygonArea(polygons) : ", d3.polygonArea(polygons));
  //     // console.log("d3.polygonCentroid(polygons) : ", d3.polygonCentroid(polygons));

  //     // let cvs = document.getElementsByTagName("canvas")[0];
  //     // console.log("graphRef : ", d3.select(graphRef));

  //     // const ctxx = d3.select(graphRef.current).getContext("2d");
  //     // ctxx.beginPath();
  //     // ctxx.moveTo(300, 300);
  //     // ctxx.bezierCurveTo(20, 100, 200, 100, 200, 20);
  //     // ctxx.stroke();
  //   } else {
  //     //return false;
  //   }
  // };

  // const valueline = () => {
  //   d3.line()
  //     .x(function (d) {
  //       return d[0];
  //     })
  //     .y(function (d) {
  //       return d[1];
  //     })
  //     .curve(d3.curveCatmullRomClosed);
  // };
  /*******************************************************************************************************************
   * HOOK
   *******************************************************************************************************************/

  useEffect(() => {
    if (inputIncludeVisible) {
      saveInputIncludeRef.current.focus();
    }
  }, [inputIncludeVisible]);

  useEffect(() => {
    if (inputExcludeVisible) {
      saveInputExcludeRef.current.focus();
    }
  }, [inputExcludeVisible]);

  useEffect(() => {
    if (viewMode === "2D" && graphRef.current != null) {
      graphRef.current.zoom(zoom);
    }

    // console.log("socioGraphWidth : ", socioGraphWidth);
    // console.log("socioGraphHeight : ", socioGraphHeight);

    // console.log("width, height : ", graphRef.current.style.width, ",", graphRef.current.style.height);
    // console.log("screen2GraphCoords : ", graphRef.current.screen2GraphCoords(25.417694792898182, 13.673341323084085));
    // console.log("graph2ScreenCoords : ", graphRef.current.graph2ScreenCoords(25.417694792898182, 13.673341323084085));
    setDataListInCanvasNode();
  }, [zoom]);
  useEffect(() => {
    if (availableClassList && availableClassList.length > 0) {
      setChartWidth(availableClassList.length * 70);
    }
  }, [availableClassList]);
  useEffect(() => {
    // graphRef.current.d3Force(
    //   "collide",
    //   d3.forceCollide(d => 2 * d.size)
    // );
    //    graphRef.current.d3Force("charge", d3.forceManyBody(-100));
    // graphRef.current.d3Force("center", d3.forceCenter(socioGraphWidth / 2, socioGraphHeight / 2));
    // graphRef.current.d3Force("charge").strength(-1);
    //graphRef.current.d3Force("link").distance(d3ForceLinkDistance);
    // graphRef.current.d3Force("collide", d3.forceCollide(-10));
    // .strength(1)
    // .iterations(10)
    // graphRef.current.d3Force("link").distance(50); //맞는 문법
    // graphRef.current.d3Force("link").strength(0.1); //맞는 문법
    // graphRef.current.d3Force("charge").distance(10); //맞는 문법
    // graphRef.current.d3Force("charge").strength(0.1); //맞는 문법
    // graphRef.current.d3Force("collide", d3.forceCollide(-10)); //맞는 문법
    // graphRef.current.d3Force("link").distance(0); //맞는 문법
    // graphRef.current.d3Force("link").strength(0.0228); //맞는 문법
    // .force("link", d3.forceLink(links).distance(20).strength(1).iterations(10))
    //console.log("graphRef : ", graphRef);
    // console.log("data : ", data);
    // d3.select(graphRef).call(d3.drag().on("end", () => alert("dragEnd")));
    // d3.select(graphRef)
    //   .drag()
    //   .on("end", () => alert("dragEnd"));
    // console.log("graphRef.current : ", graphRef.current);
    // handleDrag(graphRef);
    // d3.select(graphRef).on("end", () => alert(4));
    // graphRef.current.d3Force("dragEnd", () => alert(3));
    // let cvs = new Selection(document.getElementsByTagName("canvas")[0]);
    // d3Force={({ charge, link }) => {
    //   console.log("d3Force link : ", link);
    //   console.log("d3Force charge : ", charge);
    //   link.distance(30);
    //   charge.strength(0.05);
    // graphRef.current.d3Force("link", d3.forceLinkforceX(socioGraphWidth / 2).strength(0));
    // graphRef.current.d3Force("link", d3.forceY(socioGraphHeight / 2).strength(0));
    //               simulation
    //  .force("forceX",d3.forceX(width/2).strength(function(d){ return hasLinks(d) ? 0 : 0.05; }) )
    //  .force("forceY",d3.forceY(height/2).strength(function(d){ return hasLinks(d) ? 0 : 0.05; }) )
    /****************************************************************************************************
     * 화면 우측 목록을 캔버스에 보여지는 노드만큼 필터 합니다.
     * 발생 시점은 "zoom"과 "drag end(노드아닌 전체그림)" 시 계산 되어야 하나
     * d3 특성 상 drag 이벤트는 core에서만 사용되도록 event를 통제 하고 있음
     * 부득이하게 drag end 대신 data가 있는 경우 2초 마다 계산 하도록 처리함.
     * 성능 이슈 시 다시 고민해야함...(예를 들면 최상위 div에 onMouseOver 이벤트...등)
     * mhkang 2020.04.02
     */
    setInterval(setDataListInCanvasNode, 2000);
    // polygonGenerator("A");
    // graphRef.current.d3Force("link").distance(dagLevelDistance);
    // graphRef.current.d3Force("charge", d3.forceManyBody(300));
    // graphRef.current.d3Force("center", d3.forceCenter(socioGraphWidth / 4, socioGraphHeight / 4));
    /*************************************************************************************************** */
  }, []);
  // useDebounce(setDataListInCanvasNode, 2000, []);
  // graphRef && console.log("graphRef.centerAt() : ", graphRef.current.centerAt());
  /*******************************************************************************************************************
   * Return Components
   *******************************************************************************************************************/

  return (
    <div style={{}}>
      <Row
        style={{
          paddingTop: "10px",
          backgroundColor: "#f0f3f5",
          color: "#444",
          borderBottom: "1px solid #f2f5f6",
        }}
      >
        {/* <Col span={1} style={{ ...searchBoxStyle, minWidth: "110px" }}>
          <div style={searchBoxTitleStyle}>Back-color</div>
          <Radio.Group onChange={onChangeBackgroundColorMode} defaultValue={backgroundColorMode} size="small">
            <Radio.Button value={false}>White</Radio.Button>
            <Radio.Button value={true} style={{ backgroundColor: "#000000", color: "#ffffff" }}>
              Dark
            </Radio.Button>
          </Radio.Group>
        </Col> */}
        {/* <Col span={1} style={{ textAlign: "right" }}>
          <Button
            shape="circle"
            size="small"
            onClick={onZoomOutClick}
            icon={<MinusOutlined />}
          />
        </Col> */}
        {/* <Col span={1} style={{ ...searchBoxStyle, minWidth: "120px" }}>
          <div style={searchBoxTitleStyle}>Zoom</div>
          <Slider
            min={zoomMin}
            max={zoomMax}
            step={zoomStep}
            onChange={onZoomChangeSlider}
            value={zoom}
            style={{
              width: "90%",
              padding: "0px",
              margin: "15px 0px 0px 0px",
            }}
          />
        </Col> */}
        {/* <Col span={1}>
          <Button
            shape="circle"
            size="small"
            onClick={onZoomInClick}
            icon={<PlusOutlined />}
          />
        </Col> */}
        <Col style={{ ...searchBoxStyle }}>
          <div style={searchBoxTitleStyle}>
            제목표기방법
            <Tooltip
              placement="right"
              title="노드의 제목 표기 방법 설정 "
              style={{ cursor: "pointer" }}
            >
              <i className="xi-help size"></i>
            </Tooltip>
          </div>
          <Radio.Group
            size="small"
            onChange={onChangeTitleMode}
            value={titleMode}
          >
            <Radio.Button value="CLUSTERING" className="network_radio_btn">
              <Tooltip placement="right" title="주요 노드만 표시">
                주요키워드
              </Tooltip>
            </Radio.Button>
            <Radio.Button value="AUTOSCALE" className="network_radio_btn">
              <Tooltip placement="right" title="노드와 동일한 크기로 표시">
                자동
              </Tooltip>
            </Radio.Button>
            <Radio.Button value="FIX" className="network_radio_btn">
              <Tooltip placement="right" title="항상 지정된 크기로 표시">
                고정
              </Tooltip>
            </Radio.Button>
          </Radio.Group>
        </Col>
        <Col style={{ ...searchBoxStyle }}>
          <div style={searchBoxTitleStyle}>
            제목길이
            <Tooltip
              placement="right"
              title="노드의 제목 길이 설정(기본10글자)"
              style={{ cursor: "pointer" }}
            >
              <i className="xi-help size"></i>
            </Tooltip>
          </div>
          <Slider
            className="network_slider"
            min={0}
            max={50}
            step={1}
            onChange={onChangeTitleLengthSlider}
            value={titleLength}
          />
        </Col>
        {/* <Col style={{ ...searchBoxStyle }}>
          <div style={searchBoxTitleStyle}>
            그룹핑
            <Tooltip placement="right" title="유형별 묶음 표시" style={{ cursor: "pointer" }}>
              <i className="xi-help size"></i>
            </Tooltip>
          </div>
          <Switch size="small" checked={polygon} className="network_switch" style={{}} onChange={onChangePolygon} />
        </Col> */}
        <Col style={{ ...searchBoxStyle }}>
          <div style={searchBoxTitleStyle}>노드 크기</div>
          <Slider
            className="network_slider"
            min={0.1}
            max={5}
            step={0.1}
            onChange={onChangeNodeSizeRate}
            value={nodeSizeRate}
          />
        </Col>
        <Col style={{ ...searchBoxStyle }}>
          <div style={searchBoxTitleStyle}>연결선두께</div>
          <Slider
            className="network_slider"
            min={0.01}
            max={0.5}
            step={0.01}
            onChange={onChangeLinkLineWidthRate}
            value={linkLineWidthRate}
          />
        </Col>
        {/* <Col style={{ ...searchBoxStyle }}>
          <div style={searchBoxTitleStyle}>연결선가중치</div>
          <Slider
            className="network_slider link"
            min={linkThresholdMin}
            max={linkThresholdMax}
            step={1}
            onChange={onChangeLinkThresold}
            onAfterChange={onAfterChangeLinkThresold}
            value={linkThresold}
          />

          <InputNumber
            size="small"
            min={linkThresholdMin}
            max={linkThresholdMax}
            value={linkThresold}
            onChange={onChangeLinkThresold}
            onAfterChange={onAfterChangeLinkThresold}
            className="network_input_number"
          />
        </Col> */}
        {/* <Col span={1} style={{ ...searchBoxStyle, minWidth: "100px" }}>
          <div style={searchBoxTitleStyle}>Duplicate</div>
          <Switch size="small" checkedChildren="allow" unCheckedChildren="deni" checked={allowDuplicate} style={{ border: `1px solid ${backgroundColorGraph}` }} onChange={onChangeAllowDuplicate} />
        </Col> */}
        {/* <Col span={1} style={{ ...searchBoxStyle, minWidth: "120px" }}>
          <div style={searchBoxTitleStyle}>d3AlphaDecay</div>
          <Slider
            min={0.001}
            max={0.1}
            step={0.001}
            onChange={onChangeD3AlphaDecay}
            value={d3AlphaDecay}
            style={{
              width: "100%",
              padding: "0px",
              margin: "15px 0px 0px 0px"
            }}
          />
        </Col> */}
        {/* <Col style={{ ...searchBoxStyle }}>
          <div style={searchBoxTitleStyle}>보기</div>
          <Radio.Group size="small" onChange={onChangeViewMode} value={viewMode}>
            <Radio.Button value="2D" className="network_radio_btn small">
              2D
            </Radio.Button>
            <Radio.Button value="3D" className="network_radio_btn small">
              3D
            </Radio.Button>
          </Radio.Group>
        </Col> */}
        <Col style={{ ...searchBoxStyle }}>
          <div style={searchBoxTitleStyle}> 소시오그램</div>
          {/*<Checkbox size="small" className="network_select" checked={isMultiSectionChart} onChange={onChangeMultiChart} />*/}
          <Radio.Group
            size="small"
            onChange={onChangeMultiChart}
            value={isMultiSectionChart}
          >
            <Radio.Button value={false} className="network_radio_btn">
              일반
            </Radio.Button>
            <Radio.Button value={true} className="network_radio_btn">
              다차원
            </Radio.Button>
          </Radio.Group>
        </Col>
        {isMultiSectionChart && (
          <Col style={{ ...searchBoxStyle, width: "200px" }}>
            <div style={searchBoxTitleStyle}>년도</div>
            <Slider
              range
              max={defaultFilterRange[1]}
              min={defaultFilterRange[0]}
              value={filterRange}
              onChange={onChangeFilterRange}
            />
          </Col>
        )}
        {isMultiSectionChart && (
          <Col style={{ ...searchBoxStyle }}>
            <div style={searchBoxTitleStyle}>노드 펼침 단계</div>
            <Select
              ref={sortRef}
              size="small"
              onChange={onChangeNodeDepth}
              value={expand}
              className="network_select"
              defaultValue={"펼치지 않음"}
            >
              {nodeList()}
            </Select>
          </Col>
        )}
        {!isMultiSectionChart && (
          <Col style={{ ...searchBoxStyle }}>
            <div style={searchBoxTitleStyle}>검색 구분</div>
            <Select
              ref={sortRef}
              size="small"
              onChange={onChangeSort}
              value={sort}
              className="network_select"
            >
              <Option value={FIELD_TYPE.PATENT}>특허</Option>
              <Option value={FIELD_TYPE.THESIS_NDSL}>논문</Option>
              <Option value={"n_subject"}>국가R&D과제</Option>
              <Option value={FIELD_TYPE.ORGN_NTIS}>국가R&D기관</Option>
              <Option value={"subject"}>KEIT과제</Option>
              <Option value={FIELD_TYPE.MBR}>KEIT연구자</Option>
              <Option value={FIELD_TYPE.ORGN_KEIT}>KEIT기관</Option>
              <Option value={FIELD_TYPE.Player}>플레이어</Option>
              <Option value={FIELD_TYPE.BOOK}>
                {FIELD_TYPE.properties["book"].name}
              </Option>
            </Select>
          </Col>
        )}
        {!isMultiSectionChart && (
          <Col style={{ ...searchBoxStyle }}>
            <div style={searchBoxTitleStyle}>
              키워드
              <Tooltip
                placement="right"
                title="검색결과를 용어/문서 단위로 표시"
                style={{ cursor: "pointer" }}
              >
                <i className="xi-help size"></i>
              </Tooltip>
            </div>
            <Radio.Group size="small" onChange={onChangeIsWord} value={isWord}>
              <Radio.Button value={true} className="network_radio_btn">
                <Tooltip placement="right" title="용어 단위로 표시">
                  용어
                </Tooltip>
              </Radio.Button>
              <Radio.Button value={false} className="network_radio_btn">
                <Tooltip placement="right" title="문서 단위로 표시">
                  문서
                </Tooltip>
              </Radio.Button>
            </Radio.Group>
          </Col>
        )}
        {!isMultiSectionChart && (
          <Col style={{ ...searchBoxStyle }}>
            <div style={searchBoxTitleStyle}>분류</div>
            <Select
              defaultValue="a"
              size="small"
              onChange={onChangeSection}
              value={section}
              className="network_select"
            >
              <Option value="t" key="network_select">
                - 전체 -
              </Option>

              {categoryCD &&
                categoryCD.map((ct) => {
                  return (
                    <Option key={ct.value} value={ct.value.toLowerCase()}>
                      {ct.title}
                    </Option>
                  );
                })}
            </Select>
          </Col>
        )}
        {isMultiSectionChart && (
          <Col style={{ ...searchBoxStyle }}>
            <div style={searchBoxTitleStyle}>분류</div>
            <Select
              mode="multiple"
              maxTagCount={2}
              size="small"
              onChange={onChangeSection}
              value={sectionIndex}
              style={{ width: "250px" }}
              bordered={true}
            >
              {sectionList()}
            </Select>
          </Col>
        )}
        {/* <Col span={1} style={{ ...searchBoxStyle, minWidth: "170px" }}>
          <div style={searchBoxTitleStyle}>Mode</div>
          <Select defaultValue="zout" style={{ width: 160 }} onChange={onChangeDagMode} size="small" value={dagMode}>
            <Option value="td">top-down</Option>
            <Option value="bu">bottom-up</Option>
            <Option value="lr">left-to-right</Option>
            <Option value="rl">right-to-left</Option>
            <Option value="zout">near-to-far</Option>
            <Option value="zin">far-to-near</Option>
            <Option value="radialout">outwards-radially</Option>
            <Option value="ratialin">inwards-radially</Option>
          </Select>
        </Col> */}
        {/* <Col span={1} style={{ ...searchBoxStyle, minWidth: "100px" }}>
          <div style={searchBoxTitleStyle}>Simulation</div>
          <Button onClick={() => graphRef.current.pauseAnimation()} size="small" icon={<PauseOutlined />}></Button>
          &nbsp;
          <Button onClick={() => graphRef.current.resumeAnimation()} size="small" icon={<CaretRightOutlined />}></Button>
          &nbsp;
          <Button
            onClick={() => {
              restartSocioGram();
            }}
            size="small"
            icon={<ReloadOutlined />}
          ></Button>
        </Col> */}
        {/* <Col span={1} style={{ ...searchBoxStyle, minWidth: "100px" }}>
          <div style={searchBoxTitleStyle}>DataFlow</div>
          <Button
            onClick={() => {
              setLinkDirectionalParticleWidth(prev => (prev === 2 ? 0 : 2));
            }}
            size="small"
          >
            {linkDirectionalParticleWidth === 2 ? "OFF" : "ON"}
          </Button>
        </Col> */}
        <Col style={{ ...searchBoxStyle }}>
          <div style={searchBoxTitleStyle}>다운로드</div>
          <Button
            onClick={canvasImageDownload}
            size="small"
            className="network_btn"
          >
            이미지
          </Button>
          &nbsp;
          <SocioGramDemoDownload
            downloadData={dataTableList && dataTableList}
          />
        </Col>
        {/* <Col style={{ ...searchBoxStyle }}>
          <div style={searchBoxTitleStyle}>DataList</div>
          <Button
            onClick={() => {
              setNodeListVisible(!nodeListVisible);
            }}
            size="small"
            className="network_btn"
          >
            {nodeListVisible ? "OFF" : "ON"}
          </Button>
        </Col> */}
        <Col style={{ ...searchBoxStyle }}>
          <div style={searchBoxTitleStyle}>&nbsp;</div>
          <Button
            onClick={() => {
              setZoomHandler(1.0);
              setGraphNodeKey((prev) => prev + 1);
            }}
            size="small"
            className="network_btn"
          >
            초기화
          </Button>
        </Col>
        {/* <Col span={1} style={{ ...searchBoxStyle, minWidth: "70px" }}>
          <div style={searchBoxTitleStyle}>bojung</div>
          <InputNumber
            size="small"
            min={0}
            max={100}
            value={bojung}
            onChange={bojungOnChange}
            style={{
              float: "left",
              width: "50px",
              padding: "0px",
              margin: "0px 0px 0px 0px",
            }}
          />
        </Col> */}
        <Col style={{ ...searchBoxStyle }}>
          <div style={searchBoxTitleStyle}>도움말</div>
          <Tooltip
            placement="right"
            title="도움말"
            style={{ cursor: "pointer" }}
          >
            <SocioGramDemoTutorial />
          </Tooltip>
        </Col>
      </Row>

      <Layout>
        <Dropdown
          overlay={menu}
          trigger={["contextMenu"]}
          visible={dropDownVisibleState}
        >
          <Content
            style={{
              padding: "0px",
              margin: "0 auto",
              // minHeight: `${socioGraphHeight}px`,
              backgroundColor: backgroundColorGraph,
              overflowY: "hidden",
              overflowX: "hidden",
              position: "relative",
            }}
            className="graphContentClass"
          >
            <div className="network_left">
              <div key="wordLayerdBox">
                <div className="left_search">
                  <fieldset>
                    <legend>Total Search</legend>
                    <label>SEARCH</label>
                    {/* <input type="text" id="searchKeyword" name="searchKeyword" className="text" placeholder="검색어를 입력하세요." title="검색어를 입력하세요." value="" /> */}
                    <div className="text">
                      <Tooltip
                        visible={tooltipVisible}
                        color="orange"
                        placement="bottom"
                        title="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;검색 결과가 없습니다.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                      >
                        <SocioGramDemoWordSelectBox
                          id="searchKeyword"
                          name="searchKeyword"
                          // ref={wordListRef}
                          onChangeWordSelectBox={onChangeWordSelectBox}
                          backgroundColorMode={backgroundColorMode}
                          useEnterEvent={true}
                          getEnterEvent={getEnterEvent}
                          setWordListHeight={setWordListHeight}
                          sort={sort}
                        />
                      </Tooltip>
                    </div>
                    {/* <input type="button" id="Search" className="search_btn" value="search" /> */}
                  </fieldset>
                </div>
                <div className="network_word">{word}</div>
              </div>
              <div key="includeExcludeBox" className="clude">
                <div>
                  {inputIncludeVisible && (
                    <Input
                      className="in"
                      ref={saveInputIncludeRef}
                      type="text"
                      size="small"
                      value={inputInclude}
                      onChange={handleInputIncludeChange}
                      onBlur={handleInputIncludeConfirm}
                      onPressEnter={handleInputIncludeConfirm}
                    />
                  )}
                  {!inputIncludeVisible && (
                    <Tag onClick={showInputInclude} className="site-tag-plus">
                      <PlusOutlined /> 포함어 추가
                    </Tag>
                  )}

                  <TweenOneGroup
                    enter={{
                      scale: 0.8,
                      opacity: 0,
                      type: "from",
                      duration: 100,
                      onComplete: (e) => {
                        e.target.style = "";
                      },
                    }}
                    leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                    appear={false}
                  >
                    {tagsInclude.map((tag) => forMap(tag, "INCLUDE"))}
                  </TweenOneGroup>
                </div>

                <div>
                  {inputExcludeVisible && (
                    <Input
                      className="in"
                      ref={saveInputExcludeRef}
                      type="text"
                      size="small"
                      value={inputExclude}
                      onChange={handleInputExcludeChange}
                      onBlur={handleInputExcludeConfirm}
                      onPressEnter={handleInputExcludeConfirm}
                    />
                  )}
                  {!inputExcludeVisible && (
                    <Tag onClick={showInputExclude} className="site-tag-plus">
                      <MinusOutlined /> 제외어 추가
                    </Tag>
                  )}

                  <TweenOneGroup
                    enter={{
                      scale: 0.8,
                      opacity: 0,
                      type: "from",
                      duration: 100,
                      onComplete: (e) => {
                        e.target.style = "";
                      },
                    }}
                    leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                    appear={false}
                  >
                    {tagsExclude.map((tag) => forMap(tag, "EXCLUDE"))}
                  </TweenOneGroup>
                </div>
              </div>
              {availableClassList && availableClassList.length > 0 && (
                <div className="left_title">{getCategoryClassTitle(sort)}</div>
              )}
              <div key="classListBox">
                {availableClassList &&
                  availableClassList.length > 0 &&
                  availableClassList.map((categoryClass) => {
                    let clsCd = null;
                    let clsCount = null;
                    let clsColor = null;
                    let sectionClassName = null;

                    if (section === "t" || section === "t_word") {
                      clsCd = categoryClass.value;
                      sectionClassName = clsCd;
                      if (dataTableList) {
                        clsCount =
                          dataTableList &&
                          dataTableList.filter((nd) => nd.g === clsCd).length;
                        clsColor =
                          availableClassCheckedList.findIndex(
                            (x) => x === categoryClass.value
                          ) > -1
                            ? getColor(clsCd.charCodeAt(0))
                            : "#dddddd"; // : ;
                        chartValues.push([
                          categoryClass.title,
                          clsCount,
                          getColor(clsCd.charCodeAt(0)),
                          clsCount,
                          sectionClassName.toUpperCase(),
                        ]);
                      }
                    } else {
                      clsCd = Number(categoryClass.value.substring(1));
                      sectionClassName =
                        section + (clsCd > 9 ? clsCd : "0" + clsCd);
                      if (dataTableList) {
                        clsCount =
                          dataTableList &&
                          dataTableList.filter((nd) => Number(nd.g) === clsCd)
                            .length;
                        clsColor =
                          availableClassCheckedList.findIndex(
                            (x) => x === categoryClass.value
                          ) > -1
                            ? getColor(clsCd)
                            : "#dddddd"; // : ;
                        chartValues.push([
                          categoryClass.title,
                          clsCount,
                          getColor(clsCd),
                          clsCount,
                          sectionClassName.toUpperCase(),
                        ]);
                      }
                    }
                    return (
                      <Row
                        key={`category_${categoryClass.cateKey}`}
                        style={{
                          border: `1px solid ${clsColor}`,
                          borderRadius: "2px",
                          backgroundColor: clsColor,
                          marginTop: "5px",
                          padding: "3px",
                          cursor: "pointer",
                        }}
                        onClick={() => onClickClass(categoryClass.value)}
                        className="ipcClassButtonHover"
                      >
                        <Col span="22" className="ipcClassButtonHover">
                          {/* {sectionClassName.toUpperCase()} */}
                          {sort === FIELD_TYPE.PATENT &&
                            `${categoryClass.value} `}
                          {categoryClass.title}{" "}
                          <b>{clsCount > 0 ? ` [${clsCount}]` : ""}</b>
                        </Col>
                        <Col
                          span="2"
                          style={{ margin: "auto", textAlign: "center" }}
                        >
                          <RightOutlined
                            style={{
                              fontSize: "14px",
                              color: "#ffffff",
                              fontWeight: "bold",
                            }}
                          />
                        </Col>
                      </Row>
                    );
                  })}
              </div>
            </div>
            {barChartVisible && chartValues.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  left: "320px",
                  zIndex: 1,
                }}
              >
                <div
                  key="socioChartBox"
                  style={{
                    float: "left",
                    borderRight: "1px solid #f0f0f0",
                    borderBottom: "1px solid #f0f0f0",
                    backgroundColor: "#fff",
                    color: backgroundColorFont,
                    width: `${chartWidth + 30}px`,
                    zIndex: "1",
                    fontSize: "14px",
                    // fontWeight: "bold",
                    textAlign: "left",
                    // display: word && sort === "patent" ? "block" : "none",

                    padding: "10px",
                    overflowY: "auto",
                  }}
                >
                  <div style={{ height: "220px" }}>
                    {chartValues && (
                      <PlotlyBarChart
                        data={chartValues}
                        width={"100%"}
                        dataType={"socio_network"}
                        onClickClass={onClickClass}
                        showlegend={false}
                        config={{ displayModeBar: false }}
                      />
                    )}
                  </div>
                  {/* <BarChart data={chartValues} title={word} xTitle={""} yTitle={""} chartAreaWidth={"100%"} width={chartWidth - 23} onClickClass={onClickClass} /> */}
                </div>
                <div
                  className="open_close2"
                  style={{ float: "left" }}
                  onClick={() => {
                    setBarChartVisible(false);
                  }}
                >
                  <i className={`xi-angle-left-min`}></i>
                </div>
              </div>
            )}
            {!barChartVisible && (
              <div
                style={{
                  position: "absolute",
                  left: "320px",
                  zIndex: 1,
                }}
                className="open_close2"
                onClick={() => {
                  setBarChartVisible(true);
                }}
              >
                <i className={`xi-angle-right-min`}></i>
              </div>
            )}
            {sort.startsWith("player") && (
              <div
                style={{ position: "relative", left: "50%", marginTop: "10px" }}
              >
                <Radio.Group
                  size="small"
                  onChange={onChangePlayerSort}
                  value={playerMode}
                >
                  <Radio.Button value="patent" className="network_radio_btn">
                    특허
                  </Radio.Button>
                  <Radio.Button value="thesis" className="network_radio_btn">
                    논문
                  </Radio.Button>
                  <Radio.Button
                    value="n_subject"
                    className="network_radio_btn"
                    style={{ width: "140px" }}
                  >
                    국가 R&D과제
                  </Radio.Button>
                  <Radio.Button value="book" className="network_radio_btn">
                    도서
                  </Radio.Button>
                </Radio.Group>
              </div>
            )}
            <div
              style={{
                position: "absolute",
                zIndex: 1,
              }}
            >
              {isSetChart !== null && !isSetChart && (
                <ForceGraph2D
                  /*
                  Graph Properties
                */
                  key={`sociogram_${socioGramKey}`}
                  ref={graphRef}
                  id={socioGramId} // id is mandatory, if no id is defined rd3g will throw an error
                  nodeId="id"
                  graphData={data}
                  backgroundColor={backgroundColorGraph}
                  // nodeRelSize={6 * nodeSizeRate} //노드 마우스 오버 영역 크기
                  nodeLabel={(d) => {
                    return `<div style="text-align:center">${d.t}</div>`;
                  }}
                  // linkLabel={({ id, x, y, source, target, v }) => {t
                  //   return `<div style="text-align:center">${source.t} <br /> ↓↓↓↓↓↓ <br /> ${target.t}</div>`;
                  // }}
                  width={socioGraphWidth}
                  height={socioGraphHeight}
                  linkSource="source"
                  linkTarget="target"
                  // zoom={zoom}
                  /*
                  Force Engine Properties
                  */
                  dagMode={dagMode} //노드의 배치 형태 td (top-down), bu (bottom-up), lr (left-to-right), rl (right-to-left), zout (near-to-far), zin (far-to-near), radialout (outwards-radially) or radialin (inwards-radially)
                  d3AlphaDecay={d3AlphaDecay} //시뮬레이션 강도 감소 파라미터를 설정 default = 0.0228
                  d3VelocityDecay={d3VelocityDecay} //중간 저항을 시뮬레이션하는 노드의 속도 감소 default = 0.4
                  dagLevelDistance={dagLevelDistance} //노드간 거리
                  // warmupTicks={50}
                  // cooldownTicks={1000}
                  cooldownTime={7000}
                  // warmupTicks={10}
                  d3Force={({ charge, link }) => {
                    link.distance(30);
                    charge.strength(0.05);
                    //               simulation
                    //  .force("forceX",d3.forceX(width/2).strength(function(d){ return hasLinks(d) ? 0 : 0.05; }) )
                    //  .force("forceY",d3.forceY(height/2).strength(function(d){ return hasLinks(d) ? 0 : 0.05; }) )
                  }}
                  // d3Force={("collide", d3.forceCollide(d => 1 * d.size))}
                  /*
                  Interaction Properties
                  */
                  onLinkClick={onLinkClick}
                  onNodeClick={onNodeClick}
                  onNodeRightClick={onNodeRightClick}
                  // onBackgroundClick={() => alert("onBackgroundClick")}
                  onBackgroundRightClick={(event) =>
                    alert(
                      "background Click[x,y]=[" + event.x + ", " + event.y + "]"
                    )
                  }
                  onZoom={onZoom}
                  onZoomEnd={onZoomEnd}
                  onNodeHover={handleNodeHover}
                  // onLinkHover={handleLinkHover}
                  // onMouseDown={() => alert("onMouseDown")}
                  // onEngineTick={() => alert("onEngineTick")} /** 그림을 그릴 준비가 되면 실행되는 이벤트 */
                  // onEngineStop={() => polygonGenerator("D")} /* 그림이 다 그려진 후 이벤트 () => polygonGenerator("47")*/
                  onNodeDragEnd={(node) => {
                    node.fx = node.x;
                    node.fy = node.y;
                  }}
                  // screen2GraphCoords={(10, 20)}
                  /*
                  Node Styling
                  */

                  nodeCanvasObject={(
                    { id, t, x, y, g, s, n, cq, cg },
                    ctx,
                    globalScale
                  ) => {
                    //##### TEXT ### START ##########################################################################
                    // const fontSize = 12 / globalScale;
                    // ctx.font = `${fontSize}px Sans-Serif`;
                    // const textWidth = ctx.measureText("●" + stringToSubstring(t, titleLength)).width;
                    // const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
                    // ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                    // ctx.fillRect(x - bckgDimensions[0] / 2, y - bckgDimensions[1] / 2, ...bckgDimensions);
                    // ctx.textAlign = "center";
                    // ctx.textBaseline = "middle";
                    // ctx.fillStyle = getColor(Number(g));
                    // ctx.fillText("º" + stringToSubstring(t, titleLength), x, y);
                    //##### TEXT ### END ##########################################################################

                    //##### SHAPE, IMAGE, CIRCLE ### START ##########################################################################
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

                    if (titleMode === "CLUSTERING") {
                      let clusterRate = 3;

                      //근접 CLOSENESS, EIGENVECTOR
                      if (cq === "C" || cq === "E" || cq === "E,C") {
                        if (polygon === true) {
                          let node_coords = [];
                          cg.split(",").map((cgSingle) => {
                            if (cgSingle !== null && cgSingle.length > 0) {
                              data.nodes
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
                          // console.log("node_coordsXY : ", node_coordsXY.length);
                          if (node_coordsXY.length >= 3) {
                            let charToInteger = 0;
                            for (let i = 0; i < cg.length; i++) {
                              charToInteger += cg.charCodeAt(i);
                            }

                            let cliqueColor = getColor(charToInteger);
                            let polygon = d3.polygonHull(node_coordsXY);
                            // let centroid = d3.polygonCentroid(polygon);

                            let polyScale = 1;
                            let valueline = polygon.map(function (point) {
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
                            if (valueline.length >= 3) {
                              firstPos = valueline[0];
                              ctx.moveTo(firstPos[0], firstPos[1]);
                              valueline.map((point) => {
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
                                  valueline[valueline.length - 1][0],
                                  valueline[valueline.length - 1][1],
                                  valueline[0][0],
                                  valueline[0][1]
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
                                  valueline[0][0],
                                  valueline[0][1]
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

                        // );

                        // ctx.beginPath();
                        // // ctx.globalAlpha = 0.1;
                        // ctx.arc(x, y, nodeSizeRate * clusterRate * 7, 0, 2 * Math.PI, false);
                        // ctx.fillStyle = getColor(group);
                        // ctx.fill();

                        ctx.globalAlpha = 1;
                        ctx.font = `${
                          s * nodeSizeRate * clusterRate
                        }px Sans-Serif`;
                        ctx.fillStyle = groupColor;
                        ctx.fillText(
                          "  " + stringToSubstring(t, titleLength),
                          Math.round(x),
                          Math.round(y)
                        );
                      }
                    } else if (titleMode === "AUTOSCALE") {
                      ctx.font = `${s * nodeSizeRate}px Sans-Serif`;
                      ctx.fillStyle = groupColor;
                      ctx.fillText(
                        "   " + stringToSubstring(t, titleLength),
                        Math.round(x + s + 1),
                        Math.round(y)
                      );
                    } else if (titleMode === "FIX") {
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
                      // () => {
                      //   ctx.fillRect(x - s * (nodeSizeRate + 1), y - s * nodeSizeRate, s * nodeSizeRate * 2, s * nodeSizeRate * 2);
                      // }, //rectangle
                      // () => {
                      //   ctx.beginPath();
                      //   ctx.moveTo(x, y - s * nodeSizeRate);
                      //   ctx.lineTo(x - s * nodeSizeRate, y + s * nodeSizeRate);
                      //   ctx.lineTo(x + s * nodeSizeRate, y + s * nodeSizeRate);
                      //   ctx.fill();
                      // }, //triangle
                      // () => {
                      //   ctx.beginPath();
                      //   ctx.moveTo(x, y - s * nodeSizeRate);
                      //   let spikes = 5;
                      //   let outerRadius = s * nodeSizeRate;
                      //   let innerRadius = s * nodeSizeRate - (s * nodeSizeRate) / 2;
                      //   let rot = (Math.PI / 2) * 3;
                      //   let step = Math.PI / spikes;
                      //   let xx = x;
                      //   let yy = y;
                      //   let i = 0;
                      //   for (i = 0; i < spikes; i++) {
                      //     xx = x + Math.cos(rot) * outerRadius;
                      //     yy = y + Math.sin(rot) * outerRadius;
                      //     ctx.lineTo(xx, yy);
                      //     rot += step;
                      //     xx = x + Math.cos(rot) * innerRadius;
                      //     yy = y + Math.sin(rot) * innerRadius;
                      //     ctx.lineTo(xx, yy);
                      //     rot += step;
                      //   }
                      //   ctx.lineTo(x, y - s * nodeSizeRate);
                      //   ctx.closePath();
                      //   ctx.fill();
                      // }, //star
                      () => {
                        ctx.beginPath();
                        ctx.fillStyle = groupColor;
                        ctx.arc(
                          Math.round(x),
                          Math.round(y),
                          Math.round(s * nodeSizeRate),
                          0,
                          Math.round(2 * Math.PI),
                          false
                        );
                        ctx.fill();
                      }, //circle
                      // () => {
                      //   // const img = new Image();
                      //   // img.src = `/images/node-icon/${g > 8 ? 8 : g}.png`;

                      //   ctx.drawImage(
                      //     img,
                      //     29 + 120 * (group % 10),
                      //     29 + 120 * (group % 10),
                      //     120,
                      //     120,
                      //     Math.round(x - (s * nodeSizeRate) / 2),
                      //     Math.round(y - (s * nodeSizeRate) / 2),
                      //     Math.round(s * nodeSizeRate),
                      //     Math.round(s * nodeSizeRate)
                      //   );
                      //   ctx.fill();
                      //   // ctx.arc(x, y, NODE_R * 1.4, 0, 2 * Math.PI, false);
                      //   // ctx.strokeStyle = "red";
                      //   // ctx.fill();
                      // }, //image
                      // ][Math.floor(g % 4)]();
                      // ][Math.floor(g % 4)]();
                    ][0]();
                    //##### SHAPE, IMAGE, CIRCLE ### END ##########################################################################
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
                    link === highlightLink ? 4 : linkDirectionalParticleWidth
                  } //링크위에 표시되는 이동 마커의 크기
                  linkDirectionalParticleSpeed={0.005} //default 0.01
                  linkDirectionalParticleColor={backgroundColorFont}
                  linkCanvasObject={(link, ctx) => {
                    //{ id, x, y, source, target, v } => link
                    ctx.beginPath();
                    ctx.moveTo(link.source.x, link.source.y);
                    //ctx.quadraticCurveTo(60, 10, 90, 90);
                    // ctx.bezierCurveTo(10, 10, 90, 10, 50, 90);
                    // ctx.arc(50, 50, 40, 0, 7);
                    ctx.lineTo(
                      Math.round(link.target.x),
                      Math.round(link.target.y)
                    );
                    ctx.lineWidth =
                      link.v *
                      (linkLineWidthRate * linkLineWidthRate) *
                      (link === highlightLink ? 5 : 1); //line

                    let ctxStrokeStyle = backgroundColorMode
                      ? "#ffffff"
                      : "#000000";
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
              )}
              {isSetChart !== null && isSetChart && (
                // <HierarchyiNetworkGraph
                //   fgRef={graphRef}
                //   data={data}
                //   width={socioGraphWidth}
                //   height={socioGraphHeight}
                //   forceOpt={graphopt}
                //   expand={expand}
                //   sections={sectionIndex}
                //   depth_default={["0-1", "1-2", "2-3", "3-4", "4-5"]}
                // />
                <CustomNetworkGraph
                  fgRef={graphRef}
                  data={data}
                  width={socioGraphWidth}
                  height={socioGraphHeight}
                  forceOpt={graphopt}
                  expand={expand}
                  sections={sectionIndex}
                  range={filterRange}
                  depth_default={["0-1", "1-2", "2-3", "3-4", "4-5"]}
                />
              )}
            </div>
            <ReactResizeDetector
              handleWidth
              handleHeight
              onResize={socioGramWrapDivOnResize}
            />
          </Content>
        </Dropdown>
        <div
          className="open_close"
          onClick={() => {
            setNodeListVisible(!nodeListVisible);
          }}
        >
          <i
            className={`xi-angle-${nodeListVisible ? "right" : "left"}-min`}
          ></i>
        </div>
        <Sider
          className="network_right"
          style={{
            display: nodeListVisible ? "block" : "none",
          }}
          width={siderWidth}
          ref={siderRef}
          key="DataList"
        >
          <h3>
            <b>{!isMultiSectionChart ? getSortNm(sort) : "문서"}</b> 목록 (
            {dataTableList && dataTableList.length}건)
          </h3>
          <Table
            key="siderTable"
            bordered={false}
            showHeader={false}
            dataSource={dataTableList}
            pagination={{ pageSize: 20, showSizeChanger: false }}
            onRow={(record, rowIndex) => {
              return {
                // onClick: event => {}, // click row
                // onDoubleClick: event => {}, // double click row
                onContextMenu: (event) => {}, // right button click row
                onMouseEnter: (event) => {
                  handleNodeHover(record);
                  if (DEBUG) console.log("record", record);
                  let bojungRate =
                    Math.round((record.s / bojung) * (10 - zoom)) * 1.5;
                  // let thatNodePos = graphRef.current.graph2ScreenCoords(Math.round(record.x + bojungRate * 1.3), Math.round(record.y + bojungRate * 1.2));
                  // let thatNodePos = graphRef.current.graph2ScreenCoords(Math.round(record.x + bojungRate), Math.round(record.y + bojungRate));
                  let thatNodePos = graphRef.current.graph2ScreenCoords(
                    record.x,
                    record.y
                  );

                  setPopoverTop(thatNodePos.y);
                  setPopoverLeft(thatNodePos.x);
                  // setPopoverTitle(record.n);
                  setPopoverContent(record.t);
                  setPopoverVisible("block");
                }, // mouse enter row
                onMouseLeave: (event) => {
                  handleNodeHover(null);
                  setPopoverVisible("none");
                }, // mouse leave row
              };
            }}
            columns={[
              {
                dataIndex: "t",
                key: "id",
                render: (text, rowMap, key) => (
                  <a
                    key={key}
                    onClick={() => {
                      if (sort === FIELD_TYPE.MBR) {
                        if (rowMap.openYn === "N") {
                          return false;
                        }
                      }

                      if (isWord) {
                        // ntis 기과닝ㄹ 경우에 다르게
                        if (sort === FIELD_TYPE.ORGN_NTIS) {
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
                          setDetailWordDataList(nodeList);
                          setDetailWordVisible(true);
                        } else if (sort === FIELD_TYPE.ORGN_KEIT) {
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
                          setDetailWordDataList(nodeList);
                          setDetailWordVisible(true);
                        } else {
                          if (isMultiSectionChart) {
                            detailWordViewClickHandler(rowMap.indexKey);
                          } else {
                            detailWordViewClickHandler(rowMap.n);
                          }
                        }
                      } else {
                        if (sort === FIELD_TYPE.ORGN_NTIS) {
                          detailWordViewClickHandler(rowMap.n);
                        } else if (sort === FIELD_TYPE.ORGN_KEIT) {
                          detailWordViewClickHandler(rowMap.n);
                        } else {
                          detailViewClickHandler(rowMap.n);
                        }
                      }
                    }}
                    style={{ color: "rgba(0, 0, 0, 0.85)" }}
                  >
                    {isMultiSectionChart ? rowMap.name : text}
                  </a>
                ),
                ellipsis: true,
              },
              // ,
              // {
              //   width: "50px",
              //   render: () => <Tag color="#2db7f5">보기</Tag>
              // }
            ]}
            className="socioDataListWrapper"
          />
        </Sider>
      </Layout>
      {/* <DetailViewDrawer title={socioClickedNodeObject.t} onClose={onDrawerClose} visible={drawerVisibleState} /> */}
      <SearchDetailContainer player_Field_Type={playerMode} />

      <Drawer
        width={"53%"}
        placement="right"
        closable={true}
        onClose={onDetailWordClose}
        title={"목록"}
        footer={
          <div>
            <Button onClick={onDetailWordClose}>닫기</Button>
          </div>
        }
        visible={detailWordVisible}
        getContainer={false}
        style={{ position: "absolute", zIndex: 99 }}
      >
        {getWordDrawerNodeList(
          sort === FIELD_TYPE.ORGN_KEIT ? FIELD_TYPE.ORGN_KEIT_ANAL : sort
        )}
      </Drawer>

      <Modal
        title="연관 특허"
        visible={relationPatentPopupState}
        onOk={onClickRelationPatentPopupState}
        onCancel={onClickRelationPatentPopupState}
        closable={true}
      >
        <div style={{ maxHeight: "500px", overflowY: "auto" }}>
          {relationNodes &&
            relationNodes.map((nodeN) => {
              return (
                <>
                  {nodeN}
                  <br />
                </>
              );
            })}
        </div>
      </Modal>
      {/* <div style={{ position: "absolute", zIndex: 10000, display: popoverVisible, top: popoverTop, left: popoverLeft }}>
        <div className="nodeBadge" style={{ border: `${zoom * 6 * 0.8}px solid red`, width: `${zoom * 10}`, height: `${zoom * 10}` }}></div>
      </div> */}
      <div
        ref={popoverRef}
        style={{
          position: "absolute",
          borderRadius: "3px",
          maxWidth: "400px",
          backgroundColor: "#1a1a1a",
          opacity: 0.6,
          zIndex: 10000,
          display: popoverVisible,
          top: popoverTop + 130,
          left: popoverLeft - (sort === "word" ? 50 : 150),
          color: "#ffffff",
          fontSize: "15px",
          fontWeight: "bold",
          padding: "3px",
        }}
      >
        {sort === "patent" && (
          <>
            <span>{popoverTitle}</span>
            <hr />
          </>
        )}
        <div>
          <p>{popoverContent}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SocioGramDemo);
