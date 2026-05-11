import React, { useState, useRef, useCallback, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";
import {
  Button,
  Dropdown,
  Menu,
  Layout,
  Table,
  Select,
  Slider,
  Row,
  Col,
  Radio,
} from "antd";
// import { produce } from "immer";
import { setDetailVisibleState } from "modules/search/search";
import ReactResizeDetector from "react-resize-detector";
import useDebounce from "utils/hooks/useDebounce";
import DetailViewDrawer from "components/common/drawer/DetailViewDrawer";
// import { Motion, spring } from "react-motion";
import { stringToSubstring } from "utils/commonUtils";
import { useDispatch } from "react-redux";
import {
  DownloadOutlined,
  SearchOutlined,
  SelectOutlined,
  PlusOutlined,
  MinusOutlined,
  PauseOutlined,
  CaretRightOutlined,
  ReloadOutlined,
  // ZoomInOutlined, ZoomOutOutlined
} from "@ant-design/icons";

const img = new Image();
// img.src = "/images/node-icon/ipc_icons.png";

const { Sider, Content } = Layout;
const { Option } = Select;

const SocioGramReactforceGraph = ({
  socioGramId,
  socioData,
  socioGraphHeight,
  nodeListVisible = false,
  dagLevelDistance, //그래프의 연결강도 (중심으로 모이는 강도)
  nodeSizeRate, //노드의 크기 비율
  onSelectSortSection,
  sort,
  onChangeSort,
  section,
  onChangeSection,
}) => {
  /*******************************************************************************************************************
   * useState
   *******************************************************************************************************************/
  const graphRef = useRef();
  const siderRef = useRef(null);
  const [socioGraphWidth, setSocioGraphWidth] = useState(1200);
  const [linkDirectionalParticleWidth, setLinkDirectionalParticleWidth] =
    useState(0);
  const [socioGramKey, setSocioGramKey] = useState(0);
  const [data, setData] = useState(socioData);
  const [newNodeCount, setNewNodeCount] = useState(0);
  const [isFirstTouch, setIsFirstTouch] = useState(false);
  const [drawerVisibleState, setDrawerVisibleState] = useState(false);
  const [dropDownVisibleState, setDropDownVisibleState] = useState(false);
  const [socioClickedNodeObject, setSocioClickedNodeObject] = useState("");
  const [zoom, setZoom] = useState(1.8);
  let zoomMin = 0.1;
  let zoomMax = 10;
  let zoomStep = 0.1;
  const [dataListVisible, setDataListVisible] = useState(nodeListVisible);
  const [dagMode, setDagMode] = useState("zout");

  let backgroundColor = "#e6e6e3";

  /*******************************************************************************************************************
   * Event Handler
   *******************************************************************************************************************/
  const dispatch = useDispatch();
  const onLinkClick = useCallback((node) => {}, [graphRef]);

  const restartSocioGram = () => {
    //최초 로드 시 그래프 랜더링 이후 width change에 의해 무조건 한번더 실행되는 상황을 방지하기 위해 최초 접근 구분
    //최초 로드시에는 restartSocioGram 실행 방지 !
    if (isFirstTouch) {
      graphRef.current.d3ReheatSimulation();
      setSocioGramKey((prevCount) => prevCount + 1);
    }
    setIsFirstTouch(true);
  };

  useDebounce(restartSocioGram, 1000, [socioGraphWidth]);

  const socioGramWrapDivOnResize = (
    ReactResizeDetectorWidth,
    ReactResizeDetectorHeight
  ) => {
    setSocioGraphWidth(ReactResizeDetectorWidth);
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
      restartSocioGram();
    } else if (e.key === "4") {
      //선택 노드 확장

      addNode(socioClickedNodeObject.id);
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
        group: 2,
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
  const onNodeClick = (node) => {
    graphRef.current.centerAt(node.x, node.y, 1000);
    graphRef.current.zoom(zoom + 3, 1000);
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

  const onDataListClickNode = function (nodeId) {
    let filterNode = data.nodes.filter((node) => node.id === nodeId);
    if (filterNode && filterNode.length > 0) {
      setSocioClickedNodeObject((prev) => filterNode[0]);
    }
    setDrawerVisibleState((prev) => true);
  };

  const setZoomHandler = (z) => {
    //모든 곳에서의 zoom은 여기서
    if (z < zoomMin) z = zoomMin;
    else if (z > zoomMax) z = zoomMax;

    setZoom((prev) => z);
  };

  const onZoomChangeSlider = (value) => {
    //graphRef.current.centerAt(window.screen.width, window.screen.height, 1000);
    graphRef.current.zoom(value);
    setZoomHandler(value);
  };

  const onZoomOutClick = () => {
    //더 작게 보기(축소)
    if (zoom > zoomMin) {
      setZoomHandler(zoom - zoomStep);
    }
  };
  const onZoomInClick = () => {
    //더 크게 보기(확대)
    if (zoom < zoomMax) {
      setZoomHandler(zoom + zoomStep);
    }
  };

  const onZoom = ({ k, x, y }, e) => {
    // console.log(k);
    // if (k < 0.1) {
    //   setZoomHandler(0.1);
    // } else if (k > 10) {
    //   setZoomHandler(10);
    // } else {
    //   setZoomHandler(k);
    // }
  };
  const onZoomEnd = ({ k, x, y }) => {
    setZoomHandler(k);
  };
  const dagModeChange = (changeValue) => {
    setDagMode(changeValue);
  };

  /*******************************************************************************************************************
   * Function
   *******************************************************************************************************************/
  const getColor = (n) =>
    "#" + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, "0");

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
      <Menu.Item key="2">
        <DownloadOutlined />
        원문보기
      </Menu.Item>
      <Menu.Item key="3">
        <DownloadOutlined />
        <b>"{stringToSubstring(socioClickedNodeObject.title, 20)}"</b> 로 재검색
      </Menu.Item>
      <Menu.Item key="4">
        <SearchOutlined />
        <b>"{stringToSubstring(socioClickedNodeObject.title, 20)}"</b> 확장
      </Menu.Item>
    </Menu>
  );

  /*******************************************************************************************************************
   * HOOK
   *******************************************************************************************************************/

  useEffect(() => {
    graphRef.current.zoom(zoom);
  }, [zoom]);

  /*******************************************************************************************************************
   * Return Components
   *******************************************************************************************************************/
  return (
    <div>
      <Row>
        <Col span={1} style={{ textAlign: "right" }}>
          <Button
            shape="circle"
            size="small"
            onClick={onZoomOutClick}
            icon={<MinusOutlined />}
          />
        </Col>
        <Col span={2}>
          <Slider
            min={zoomMin}
            max={zoomMax}
            step={zoomStep}
            onChange={onZoomChangeSlider}
            value={zoom}
            style={{ width: "90%", padding: "0px" }}
          />
        </Col>
        <Col span={1}>
          <Button
            shape="circle"
            size="small"
            onClick={onZoomInClick}
            icon={<PlusOutlined />}
          />
        </Col>
        <Col span={4}>
          <Radio.Group size="small" onChange={onChangeSort} value={sort}>
            <Radio.Button value="word">용어</Radio.Button>
            <Radio.Button value="patent">특허</Radio.Button>
          </Radio.Group>
          &nbsp;
          <Select
            defaultValue="a"
            size="small"
            style={{ width: 200 }}
            onChange={onChangeSection}
            // value={section}
          >
            <Option value="a">생활필수품</Option>
            <Option value="b">처리조작;운수</Option>
            <Option value="c">화학;야금</Option>
            <Option value="d">섬유,지류</Option>
            <Option value="e">고정구조물</Option>
            <Option value="f">기계공학;조명;가열;무기;폭파</Option>
            <Option value="g">물리학</Option>
            <Option value="h">전기</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Select
            defaultValue="zout"
            style={{ width: 160 }}
            onChange={dagModeChange}
            size="small"
          >
            <Option value="td">top-down</Option>
            <Option value="bu">bottom-up</Option>
            <Option value="lr">left-to-right</Option>
            <Option value="rl">right-to-left</Option>
            <Option value="zout">near-to-far</Option>
            <Option value="zin">far-to-near</Option>
            <Option value="radialout">outwards-radially</Option>
            <Option value="ratialin">inwards-radially</Option>
          </Select>
          <Button
            onClick={() => graphRef.current.pauseAnimation()}
            size="small"
            icon={<PauseOutlined />}
          ></Button>
          &nbsp;
          <Button
            onClick={() => graphRef.current.resumeAnimation()}
            size="small"
            icon={<CaretRightOutlined />}
          ></Button>
          &nbsp;
          <Button
            onClick={() => {
              restartSocioGram();
            }}
            size="small"
            icon={<ReloadOutlined />}
          ></Button>
          &nbsp;
          <Button
            onClick={() => {
              setLinkDirectionalParticleWidth((prev) => (prev === 3 ? 0 : 3));
            }}
            size="small"
          >
            {/* <Button onClick={() => graphRef.current.pauseAnimation()} >⏸️</Button> */}
            {/* <Button onClick={() => graphRef.current.resumeAnimation()}>▶️</Button> */}
            {linkDirectionalParticleWidth === 3
              ? "Dataflow OFF"
              : "Dataflow ON"}
          </Button>
          &nbsp;
          <Button
            onClick={() => {
              setDataListVisible(!dataListVisible);
            }}
            size="small"
          >
            {/* <Button onClick={() => graphRef.current.pauseAnimation()} >⏸️</Button> */}
            {/* <Button onClick={() => graphRef.current.resumeAnimation()}>▶️</Button> */}
            {dataListVisible ? "Data List OFF" : "Data List ON"}
          </Button>
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
              margin: "0px",
              // minHeight: `${socioGraphHeight}px`,
              backgroundColor: backgroundColor,
              overflowY: "hidden",
              overflowX: "hidden",
            }}
          >
            <ReactResizeDetector
              handleWidth
              handleHeight
              onResize={socioGramWrapDivOnResize}
            />
            <ForceGraph2D
              /*
                Graph Properties
              */
              key={socioGramKey}
              ref={graphRef}
              id={socioGramId} // id is mandatory, if no id is defined rd3g will throw an error
              nodeId="id"
              graphData={data}
              backgroundColor={backgroundColor}
              nodeRelSize={2} //노드 마우스 오버 영역 크기
              nodeLabel={"title"}
              width={socioGraphWidth}
              height={socioGraphHeight}
              linkSource="source"
              linkTarget="target"
              zoom={zoom}
              /*
                Force Engine Properties
                */
              d3AlphaDecay={0.0228} //시뮬레이션 강도 감소 파라미터를 설정 default = 0.0228
              d3VelocityDecay={0.6} //중간 저항을 시뮬레이션하는 노드의 속도 감소 default = 0.4
              dagMode={dagMode} //노드의 배치 형태 td (top-down), bu (bottom-up), lr (left-to-right), rl (right-to-left), zout (near-to-far), zin (far-to-near), radialout (outwards-radially) or radialin (inwards-radially)
              // dagLevelDistance={1} //노드간 거리
              cooldownTime={15000}
              // d3Force={d3Force}
              /*
                Interaction Properties
                */
              onLinkClick={onLinkClick}
              onNodeClick={onNodeClick}
              onNodeRightClick={onNodeRightClick}
              onBackgroundRightClick={(event) =>
                alert(
                  "background Click[x,y]=[" + event.x + ", " + event.y + "]"
                )
              }
              onZoom={onZoom}
              onZoomEnd={onZoomEnd}
              screen2GraphCoords={(10, 20)}
              /*
                Node Styling
                */

              nodeCanvasObject={({ id, title, x, y, group, size }, ctx) => {
                ctx.alpha = false;
                ctx.fillStyle = getColor(group);
                ctx.cursor = "pointer";
                ctx.font = `${size * nodeSizeRate}px Sans-Serif`;
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                ctx.fillText(stringToSubstring(title, 30), x + size + 1, y);
                [
                  () => {
                    ctx.fillRect(
                      x - size * (nodeSizeRate + 1),
                      y - size * nodeSizeRate,
                      size * nodeSizeRate * 2,
                      size * nodeSizeRate * 2
                    );
                  }, //rectangle
                  () => {
                    ctx.beginPath();
                    ctx.moveTo(x, y - size * nodeSizeRate);
                    ctx.lineTo(
                      x - size * nodeSizeRate,
                      y + size * nodeSizeRate
                    );
                    ctx.lineTo(
                      x + size * nodeSizeRate,
                      y + size * nodeSizeRate
                    );
                    ctx.fill();
                  }, //triangle
                  () => {
                    ctx.beginPath();
                    ctx.moveTo(x, y - size * nodeSizeRate);
                    let spikes = 5;
                    let outerRadius = size * nodeSizeRate;
                    let innerRadius =
                      size * nodeSizeRate - (size * nodeSizeRate) / 2;
                    let rot = (Math.PI / 2) * 3;
                    let step = Math.PI / spikes;
                    let xx = x;
                    let yy = y;
                    let i = 0;
                    for (i = 0; i < spikes; i++) {
                      xx = x + Math.cos(rot) * outerRadius;
                      yy = y + Math.sin(rot) * outerRadius;
                      ctx.lineTo(xx, yy);
                      rot += step;
                      xx = x + Math.cos(rot) * innerRadius;
                      yy = y + Math.sin(rot) * innerRadius;
                      ctx.lineTo(xx, yy);
                      rot += step;
                    }
                    ctx.lineTo(x, y - size * nodeSizeRate);
                    ctx.closePath();
                    ctx.fill();
                  }, //star
                  () => {
                    ctx.beginPath();
                    ctx.arc(x, y, size * nodeSizeRate, 0, 2 * Math.PI, false);
                    ctx.fill();
                  }, //circle
                  () => {
                    // const img = new Image();
                    // img.src = `/images/node-icon/${group > 8 ? 8 : group}.png`;

                    ctx.drawImage(
                      img,
                      29 + 120 * group,
                      29 + 120 * group,
                      120,
                      120,
                      x - Math.round((size * nodeSizeRate) / 2),
                      y - Math.round((size * nodeSizeRate) / 2),
                      Math.round(size * nodeSizeRate),
                      Math.round(size * nodeSizeRate)
                    );

                    ctx.fill();
                  }, //image
                  // ][Math.floor(group % 4)]();
                  // ][Math.floor(group % 4)]();
                ][4]();
              }}
              /*
                Link Styling
                */
              // linkLabel="value"
              // linkWidth={1}
              // linkDirectionalArrowLength={1.5}
              // linkDirectionalArrowRelPos={5}
              linkDirectionalParticles={1} //linke에 표시되는 개미 숫자(높을수록 빨리 움직이는것 처럼 보임.)
              linkDirectionalParticleWidth={linkDirectionalParticleWidth} //링크위에 표시되는 이동 마커의 크기
              linkCanvasObject={({ id, x, y, source, target, value }, ctx) => {
                ctx.beginPath();
                ctx.moveTo(source.x, source.y);
                //ctx.quadraticCurveTo(60, 10, 90, 90);
                // ctx.bezierCurveTo(10, 10, 90, 10, 50, 90);
                // ctx.arc(50, 50, 40, 0, 7);
                ctx.lineTo(target.x, target.y);
                ctx.lineWidth = (value * value) / 100; //line
                ctx.stroke();
              }}
              // linkCurvature={0.13}
            />
          </Content>
        </Dropdown>

        <Sider
          style={{
            display: dataListVisible ? "block" : "none",
            padding: "32px 10px 10px 10px",
            borderRight: "0px",
            border: "1px solid #eeeeee",
          }}
          width="25%"
          ref={siderRef}
        >
          <h3>Data List</h3>
          {/* <button
            onClick={() => (siderRef.current.props.style.display = "none")}
          >
            X
          </button> */}
          <Table
            bordered={false}
            showHeader={false}
            dataSource={data.nodes}
            size="small"
            columns={[
              {
                dataIndex: "title",
                key: "id",
                render: (text, rowMap) => (
                  <a
                    onClick={() => onDataListClickNode(rowMap.id)}
                    style={{ color: "rgba(0, 0, 0, 0.85)" }}
                  >
                    {text}
                    {JSON.stringify(rowMap)}
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
      <DetailViewDrawer
        title={socioClickedNodeObject.title}
        onClose={onDrawerClose}
        visible={drawerVisibleState}
      />
    </div>
  );
};

export default SocioGramReactforceGraph;
