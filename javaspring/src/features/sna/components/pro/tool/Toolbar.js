import React, { useEffect, useState } from "react";
import { Button, Col, Radio, Row, Select, Slider, Tooltip } from "antd";
import {
  FIELD_TYPE,
  GRAPH_KEYWORD_TYPE,
  GRAPH_TITLE_MODE,
  GRAPH_TYPE,
} from "Constants";
import SearchFilter from "features/sna/components/pro/tool/SearchFilter";
import AutoCompleteSelect from "features/sna/components/pro/tool/AutoCompleteSelect";

const { Option } = Select;

const Toolbar = ({
  sectionList,
  nodeExpandList,
  dataTableList,

  graphType,

  keywordType,
  keywordTypeChangeHandler,

  category,
  categoryChangeHandler,

  nodeExpand,
  nodeExpandChangeHandler,

  defaultYearRange,
  yearRange,
  yearRangeChangeHandler,

  section,
  sectionIndex,
  sectionChangeHandler,

  categoryCD,

  includeKeywords,
  setIncludeKeywords,
  excludeKeywords,
  setExcludeKeywords,
  availableClassList,
  availableClassCheckedList,
  clickClassHandler,
  //초기화
  initializeHandler,

  searchHandler,
}) => {
  let toolbarStyle = {
    fontSize: "12px",
    color: "#444",
    marginRight: "10px",
  };

  const rel = ["키워드", "섹션", "분류", "문서", "용어"];

  return (
    <>
      {/*<Col style={{ ...toolbarStyle }}>*/}
      {/*  <StyleFilter*/}
      {/*    titleMode={titleMode}*/}
      {/*    titleModeChangeHandler={titleModeChangeHandler}*/}
      {/*    linkLineWidth={linkLineWidth}*/}
      {/*    linkLineWidthChangeHandler={linkLineWidthChangeHandler}*/}
      {/*    nodeSize={nodeSize}*/}
      {/*    nodeSizeChangeHandler={nodeSizeChangeHandler}*/}
      {/*    titleLength={titleLength}*/}
      {/*    titleLengthChangeHandler={titleLengthChangeHandler}*/}
      {/*  />*/}
      {/*</Col>*/}
      <Col style={{ ...toolbarStyle }} span={9}>
        <AutoCompleteSelect
          id="searchKeyword"
          name="searchKeyword"
          changeAutocompleteHandler={searchHandler}
          category={category}
        />
      </Col>
      <Col style={{ ...toolbarStyle }}>
        <SearchFilter
          category={category}
          section={section}
          dataTableList={dataTableList}
          availableClassList={availableClassList}
          availableClassCheckedList={availableClassCheckedList}
          clickClassHandler={clickClassHandler}
          includeKeywords={includeKeywords}
          setIncludeKeywords={setIncludeKeywords}
          excludeKeywords={excludeKeywords}
          setExcludeKeywords={setExcludeKeywords}
        />
      </Col>
      {graphType === GRAPH_TYPE.SINGLE_DIMENSIONAL && (
        <>
          <Col style={{ ...toolbarStyle }}>
            <div>
              <label>검색 구분</label>
            </div>
            <Select
              onChange={categoryChangeHandler}
              value={category}
              style={{ width: "200px" }}
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
            <div>
              <label>키워드</label>
            </div>
            <Radio.Group
              onChange={keywordTypeChangeHandler}
              value={keywordType}
            >
              <Radio.Button value={GRAPH_KEYWORD_TYPE.WORD}>
                <Tooltip placement="right" title="용어 단위로 표시">
                  용어
                </Tooltip>
              </Radio.Button>
              <Radio.Button value={GRAPH_KEYWORD_TYPE.DOCUMENT}>
                <Tooltip placement="right" title="문서 단위로 표시">
                  문서
                </Tooltip>
              </Radio.Button>
            </Radio.Group>
          </Col>

          <Col style={{ ...toolbarStyle }}>
            <div>
              <label>분류</label>
            </div>
            <Select
              defaultValue="a"
              onChange={sectionChangeHandler}
              value={section}
              style={{ width: "200px" }}
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
        </>
      )}

      {graphType === GRAPH_TYPE.MULTI_DIMENSIONAL && (
        // 다차원 네트워크일때
        <>
          <Col style={{ ...toolbarStyle }}>
            <div>
              <label>년도</label>
            </div>
            <Slider
              range
              // max={defaultFilterRange[1]}
              // min={defaultFilterRange[0]}
              style={{ width: "200px" }}
              value={yearRange}
              onChange={yearRangeChangeHandler}
            />
          </Col>
          <Col style={{ ...toolbarStyle }}>
            <div>
              <label>노드 펼침 단계</label>
            </div>
            <Select
              onChange={nodeExpandChangeHandler}
              value={nodeExpand}
              defaultValue={"펼치지 않음"}
              style={{ width: "200px" }}
            >
              {nodeExpandList}
            </Select>
          </Col>
          <Col style={{ ...toolbarStyle }}>
            <div>
              <label>분류</label>
            </div>
            <Select
              mode="multiple"
              maxTagCount={2}
              onChange={sectionChangeHandler}
              value={sectionIndex}
              style={{ width: "200px" }}
              bordered={true}
            >
              {sectionList}
            </Select>
          </Col>
        </>
      )}
    </>
  );
};

export default Toolbar;
