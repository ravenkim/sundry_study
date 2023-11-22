import React, { useEffect, useState } from "react";
import { Button, Col, Radio, Row, Select, Slider, Tooltip } from "antd";
import {
  FIELD_TYPE,
  GRAPH_KEYWORD_TYPE,
  GRAPH_TITLE_MODE,
  GRAPH_TYPE,
} from "Constants";
import Tutorial from "features/sna/components/common/modal/Tutorial";
import UtilTools from "features/sna/components/pro/tool/UtilTools";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import SearchFilter from "features/sna/components/pro/tool/SearchFilter";
import StyleFilter from "features/sna/components/pro/tool/StyleFilter";

const { Option } = Select;

const Toolbar = ({
  dataTableList,

  titleMode,
  titleModeChangeHandler,

  titleLength,
  titleLengthChangeHandler,

  nodeSize,
  nodeSizeChangeHandler,

  linkLineWidth,
  linkLineWidthChangeHandler,

  graphType,
  graphTypeChangeHandler,

  keywordType,
  keywordTypeChangeHandler,

  category,
  categoryChangeHandler,

  nodeExpand,
  nodeExpandChangeHandler,

  yearRange,
  yearRangeChangeHandler,

  section,
  sectionIndex,
  sectionChangeHandler,

  //초기화
  initializeHandler,
}) => {
  let toolbarStyle = {
    fontSize: "12px",
    color: "#444",
    margin: "15px 10px",
  };

  let toolbarTitleStyle = {
    //borderBottom: `1px solid ${backgroundColorFont} `,
    //width: "50%",
    textAlign: "left",
    margin: "0px 0px 5px 0px",
    lineHeight: "20px",
  };

  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [rowStyle, setRowStyle] = useState({
    backgroundColor: "#f0f3f5",
    color: "#444",
    borderBottom: "1px solid #ddd",
  });

  useEffect(() => {
    setRowStyle(
      toolbarVisible
        ? {
            backgroundColor: "#f0f3f5",
            color: "#444",
            borderBottom: "1px solid #ddd",
            display: "",
          }
        : {
            backgroundColor: "#f0f3f5",
            color: "#444",
            borderBottom: "1px solid #ddd",
            display: "none",
          }
    );
  }, [toolbarVisible]);

  return (
    <>
      <Row style={rowStyle} align={"middle"}>
        <Col style={{ ...toolbarStyle }}>
          <StyleFilter
            titleMode={titleMode}
            titleModeChangeHandler={titleModeChangeHandler}
            linkLineWidth={linkLineWidth}
            linkLineWidthChangeHandler={linkLineWidthChangeHandler}
            nodeSize={nodeSize}
            nodeSizeChangeHandler={nodeSizeChangeHandler}
            titleLength={titleLength}
            titleLengthChangeHandler={titleLengthChangeHandler}
          />
        </Col>
        <Col style={{ ...toolbarStyle }}>
          <div style={toolbarTitleStyle}>
            <label>
              제목표기방법
              <Tooltip
                placement="right"
                title="노드의 제목 표기 방법 설정 "
                style={{ cursor: "pointer" }}
              >
                <i className="xi-help size"></i>
              </Tooltip>
            </label>
          </div>
          <Radio.Group
            size="small"
            onChange={titleModeChangeHandler}
            value={titleMode}
          >
            <Radio.Button
              value={GRAPH_TITLE_MODE.CLUSTERING}
              className="network_radio_btn"
            >
              <Tooltip placement="right" title="주요 노드만 표시">
                주요키워드
              </Tooltip>
            </Radio.Button>
            <Radio.Button
              value={GRAPH_TITLE_MODE.AUTO_SCALE}
              className="network_radio_btn"
            >
              <Tooltip placement="right" title="노드와 동일한 크기로 표시">
                자동
              </Tooltip>
            </Radio.Button>
            <Radio.Button
              value={GRAPH_TITLE_MODE.FIX}
              className="network_radio_btn"
            >
              <Tooltip placement="right" title="항상 지정된 크기로 표시">
                고정
              </Tooltip>
            </Radio.Button>
          </Radio.Group>
        </Col>
        <Col style={{ ...toolbarStyle }}>
          <div style={toolbarTitleStyle}>
            <label>
              제목길이
              <Tooltip
                placement="right"
                title="노드의 제목 길이 설정(기본10글자)"
                style={{ cursor: "pointer" }}
              >
                <i className="xi-help size"></i>
              </Tooltip>
            </label>
          </div>
          <Slider
            className="network_slider"
            min={0}
            max={50}
            step={1}
            onChange={titleLengthChangeHandler}
            value={titleLength}
          />
        </Col>

        <Col style={{ ...toolbarStyle }}>
          <div style={toolbarTitleStyle}>
            <label>노드 크기</label>
          </div>
          <Slider
            className="network_slider"
            min={0.1}
            max={5}
            step={0.1}
            onChange={nodeSizeChangeHandler}
            value={nodeSize}
          />
        </Col>
        <Col style={{ ...toolbarStyle }}>
          <div style={toolbarTitleStyle}>
            <label>연결선두께</label>
          </div>
          <Slider
            className="network_slider"
            min={0.01}
            max={0.5}
            step={0.01}
            onChange={linkLineWidthChangeHandler}
            value={linkLineWidth}
          />
        </Col>
        <Col style={{ ...toolbarStyle }}>
          <div style={toolbarTitleStyle}>
            {" "}
            <label>소시오그램</label>
          </div>
          {/*<Checkbox size="small" className="network_select" checked={isMultiSectionChart} onChange={onChangeMultiChart} />*/}
          <Radio.Group
            size="small"
            onChange={graphTypeChangeHandler}
            value={graphType}
          >
            <Radio.Button
              value={GRAPH_TYPE.SINGLE_DIMENSIONAL}
              className="network_radio_btn"
            >
              일반
            </Radio.Button>
            <Radio.Button
              value={GRAPH_TYPE.MULTI_DIMENSIONAL}
              className="network_radio_btn"
            >
              다차원
            </Radio.Button>
          </Radio.Group>
        </Col>
        {graphType === GRAPH_TYPE.SINGLE_DIMENSIONAL && (
          <>
            <Col style={{ ...toolbarStyle }}>
              <div style={toolbarTitleStyle}>
                <label>검색 구분</label>
              </div>
              <Select
                size="small"
                onChange={categoryChangeHandler}
                value={category}
                className="network_select"
              >
                <Option value={FIELD_TYPE.PATENT}>특허</Option>
                <Option value={FIELD_TYPE.THESIS_NDSL}>논문</Option>
                <Option value={"n_subject"}>국가R&D과제</Option>
                <Option value={FIELD_TYPE.ORGN_NTIS}>국가R&D기관</Option>
                <Option value={"subject"}>KEIT과제</Option>
                <Option value={FIELD_TYPE.MBR}>KEIT연구자</Option>
                <Option value={FIELD_TYPE.ORGN_KEIT}>KEIT기관</Option>
                <Option value={FIELD_TYPE.PLAYER}>플레이어</Option>
                <Option value={FIELD_TYPE.BOOK}>
                  {FIELD_TYPE.properties["book"].name}
                </Option>
              </Select>
            </Col>

            <Col style={{ ...toolbarStyle }}>
              <div style={toolbarTitleStyle}>
                <label>
                  키워드
                  <Tooltip
                    placement="right"
                    title="검색결과를 용어/문서 단위로 표시"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="xi-help size"></i>
                  </Tooltip>
                </label>
              </div>
              <Radio.Group
                size="small"
                onChange={keywordTypeChangeHandler}
                value={keywordType}
              >
                <Radio.Button
                  value={GRAPH_KEYWORD_TYPE.WORD}
                  className="network_radio_btn"
                >
                  <Tooltip placement="right" title="용어 단위로 표시">
                    용어
                  </Tooltip>
                </Radio.Button>
                <Radio.Button
                  value={GRAPH_KEYWORD_TYPE.DOCUMENT}
                  className="network_radio_btn"
                >
                  <Tooltip placement="right" title="문서 단위로 표시">
                    문서
                  </Tooltip>
                </Radio.Button>
              </Radio.Group>
            </Col>

            <Col style={{ ...toolbarStyle }}>
              <div style={toolbarTitleStyle}>
                <label>분류</label>
              </div>
              <Select
                defaultValue="a"
                size="small"
                onChange={sectionChangeHandler}
                value={section}
                className="network_select"
              >
                <Option value="t" key="network_select">
                  - 전체 -
                </Option>

                {/*{categoryCD &&*/}
                {/*  categoryCD.map((ct) => {*/}
                {/*    return (*/}
                {/*      <Option key={ct.value} value={ct.value.toLowerCase()}>*/}
                {/*        {ct.title}*/}
                {/*      </Option>*/}
                {/*    );*/}
                {/*  })}*/}
              </Select>
            </Col>
          </>
        )}

        {graphType === GRAPH_TYPE.MULTI_DIMENSIONAL && (
          // 다차원 네트워크일때
          <>
            <Col style={{ ...toolbarStyle, width: "200px" }}>
              <div style={toolbarTitleStyle}>
                <label>년도</label>
              </div>
              <Slider
                range
                // max={defaultFilterRange[1]}
                // min={defaultFilterRange[0]}
                value={yearRange}
                onChange={yearRangeChangeHandler}
              />
            </Col>
            <Col style={{ ...toolbarStyle }}>
              <div style={toolbarTitleStyle}>
                <label>노드 펼침 단계</label>
              </div>
              <Select
                size="small"
                onChange={nodeExpandChangeHandler}
                value={nodeExpand}
                className="network_select"
                defaultValue={"펼치지 않음"}
              >
                {/*{nodeList()}*/}
              </Select>
            </Col>
            <Col style={{ ...toolbarStyle }}>
              <div style={toolbarTitleStyle}>
                <label>분류</label>
              </div>
              <Select
                mode="multiple"
                maxTagCount={2}
                size="small"
                onChange={sectionChangeHandler}
                value={sectionIndex}
                style={{ width: "250px" }}
                bordered={true}
              >
                {/*{sectionList()}*/}
              </Select>
            </Col>
          </>
        )}

        <Col style={{ ...toolbarStyle }}>
          <div style={toolbarTitleStyle}>
            <label>다운로드</label>
          </div>
          <UtilTools dataSource={dataTableList && dataTableList} />
        </Col>

        <Col style={{ ...toolbarStyle }}>
          <div style={toolbarTitleStyle}>&nbsp;</div>
          <Button
            onClick={() => {
              initializeHandler();
            }}
            size="small"
            className="network_btn"
          >
            초기화
          </Button>
        </Col>
        <Col style={{ ...toolbarStyle }}>
          <div style={toolbarTitleStyle}>
            <label>도움말</label>
          </div>
          <Tooltip
            placement="right"
            title="도움말"
            style={{ cursor: "pointer" }}
          >
            <Tutorial />
          </Tooltip>
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
      </Row>
      <span
        onClick={() =>
          toolbarVisible ? setToolbarVisible(false) : setToolbarVisible(true)
        }
        style={{
          position: "absolute",
          left: "50%",
          background: "#f0f3f5",
          borderBottom: "1px solid #ddd",
          borderLeft: "1px solid #ddd",
          borderRight: "1px solid #ddd",
          cursor: "pointer",
          zIndex: 1,
        }}
      >
        {toolbarVisible ? (
          <Tooltip placement="right" title="Toolbar 접기">
            <CaretUpOutlined style={{ width: "50px" }} />
          </Tooltip>
        ) : (
          <Tooltip placement="right" title="Toolbar 펼치기">
            <CaretDownOutlined style={{ width: "50px" }} />
          </Tooltip>
        )}
      </span>
    </>
  );
};

export default Toolbar;
