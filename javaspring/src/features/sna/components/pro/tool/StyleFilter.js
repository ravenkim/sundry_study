import React, { useState } from "react";
import {
  Button,
  Col,
  InputNumber,
  Popover,
  Radio,
  Row,
  Slider,
  Tooltip,
} from "antd";
import { CloseOutlined, HighlightOutlined } from "@ant-design/icons";
import { GRAPH_TITLE_MODE } from "Constants";

const StyleFilter = ({
  titleMode,
  titleModeChangeHandler,
  titleLength,
  titleLengthChangeHandler,
  nodeSize,
  nodeSizeChangeHandler,
  linkLineWidth,
  linkLineWidthChangeHandler,
}) => {
  const [visible, setVisible] = useState(false);

  const visibleChangeHandler = (value) => {
    setVisible(value);
  };

  const titleRender = (title) => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: "16px" }}>{title}</span>
      <span>
        <a
          style={{ display: "block", textAlign: "center" }}
          onClick={(e) => visibleChangeHandler(false)}
        >
          <CloseOutlined />
        </a>
      </span>
    </div>
  );

  const filterContent = () => {
    return (
      <>
        <div>
          <div>
            <label>제목표기방법</label>
          </div>
          <Radio.Group
            onChange={titleModeChangeHandler}
            value={titleMode}
            buttonStyle={"solid"}
          >
            <Radio.Button value={GRAPH_TITLE_MODE.CLUSTERING}>
              <Tooltip placement="right" title="주요 노드만 표시">
                주요키워드
              </Tooltip>
            </Radio.Button>
            <Radio.Button value={GRAPH_TITLE_MODE.AUTO_SCALE}>
              <Tooltip placement="right" title="노드와 동일한 크기로 표시">
                자동
              </Tooltip>
            </Radio.Button>
            <Radio.Button value={GRAPH_TITLE_MODE.FIX}>
              <Tooltip placement="right" title="항상 지정된 크기로 표시">
                고정
              </Tooltip>
            </Radio.Button>
          </Radio.Group>
        </div>
        <div>
          <div>
            <label>제목길이</label>
          </div>

          <Row>
            <Col span={16}>
              <Slider
                min={0}
                max={50}
                step={1}
                value={titleLength}
                onChange={titleLengthChangeHandler}
              />
            </Col>
            <Col span={8}>
              <InputNumber
                min={0}
                max={50}
                style={{ margin: "0 16px" }}
                value={titleLength}
                onChange={titleLengthChangeHandler}
              />
            </Col>
          </Row>
        </div>
        <div>
          <div>
            <label>노드 크기</label>
          </div>

          <Row>
            <Col span={16}>
              <Slider
                min={0.1}
                max={5}
                step={0.1}
                value={nodeSize}
                onChange={nodeSizeChangeHandler}
              />
            </Col>
            <Col span={8}>
              <InputNumber
                min={0.1}
                max={5}
                style={{ margin: "0 16px" }}
                value={nodeSize}
                onChange={nodeSizeChangeHandler}
              />
            </Col>
          </Row>
        </div>
        <div>
          <div>
            <label>연결선 두께</label>
          </div>

          <Row>
            <Col span={16}>
              <Slider
                min={0.01}
                max={0.5}
                step={0.01}
                value={linkLineWidth}
                onChange={linkLineWidthChangeHandler}
              />
            </Col>
            <Col span={8}>
              <InputNumber
                min={0.01}
                max={0.5}
                style={{ margin: "0 16px" }}
                value={linkLineWidth}
                onChange={linkLineWidthChangeHandler}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  };

  return (
    <Popover
      title={titleRender("스타일 도구")}
      placement={"bottomRight"}
      trigger={"click"}
      visible={visible}
      content={filterContent}
      onVisibleChange={visibleChangeHandler}
      overlayStyle={{ width: "330px", height: "671px" }}
    >
      <Button
        icon={<HighlightOutlined />}
        style={{ position: "absolute", top: "5px", left: "5px", zIndex: 5 }}
      />
    </Popover>
  );
};

export default StyleFilter;
