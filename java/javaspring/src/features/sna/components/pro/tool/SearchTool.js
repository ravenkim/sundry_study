import React, { useEffect, useRef, useState } from "react";
import { Col, Input, Row, Tag, Tooltip } from "antd";
import AutoCompleteSelect from "features/sna/components/pro/tool/AutoCompleteSelect";
import { MinusOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { TweenOneGroup } from "rc-tween-one";
import { getColor } from "utils/commonUtils";
import { FIELD_TYPE } from "Constants";
import SearchFilter from "features/sna/components/pro/tool/SearchFilter";

const SearchTool = ({
  category,
  section,
  searchWord,
  dataTableList,
  searchHandler,
  includeKeywords,
  setIncludeKeywords,
  excludeKeywords,
  setExcludeKeywords,
  availableClassList,
  availableClassCheckedList,
  clickClassHandler,
}) => {
  /*******************************************************************************
   * 포함어,제외어 Action
   *******************************************************************************/
  const inputIncludeRef = useRef(null);
  const inputExcludeRef = useRef(null);

  const [incluedInputVisible, setIncludeInputVisible] = useState(false);
  const [excluedInputVisible, setExcludeInputVisible] = useState(false);

  /**
   * 포함어 추가 Click handler
   */
  const includeButtonClickHandler = () => {
    setIncludeInputVisible(true);
  };

  /**
   * 포함어 추가 Click시 Input에 focus
   */
  useEffect(() => {
    if (incluedInputVisible) {
      if (inputIncludeRef.current) {
        inputIncludeRef.current.focus();
      }
    }
  }, [incluedInputVisible]);

  /**
   * 제외어 추가 Click handler
   */
  const excludeButtonClickHandler = () => {
    setExcludeInputVisible(true);
  };

  /**
   * 제외어 추가 Click시 Input에 focus
   */
  useEffect(() => {
    if (excluedInputVisible) {
      if (inputExcludeRef.current) {
        inputExcludeRef.current.focus();
      }
    }
  }, [excluedInputVisible]);

  /**
   * 포함어 추가 Handler
   */
  const includeCompleteHandler = (e) => {
    const { value } = e.target;

    if (value && includeKeywords.indexOf(value) === -1) {
      setIncludeKeywords([...includeKeywords, value]);
    }

    setIncludeInputVisible(false);
    e.target.value = null;
  };

  /**
   * 제외어 추가 Handler
   */
  const excludeCompleteHandler = (e) => {
    const { value } = e.target;

    if (value && excludeKeywords.indexOf(value) === -1) {
      setExcludeKeywords([...excludeKeywords, value]);
    }

    setExcludeInputVisible(false);
    e.target.value = null;
  };

  /**
   * 제외어, 포함어 close 버튼 클릭시 제거 handler
   * @param closeTag
   */
  const closeTageHandler = (closeTag) => {
    setIncludeKeywords(includeKeywords.filter((tag) => tag !== closeTag));
  };

  let chartValues = [
    ["Element", searchWord, { role: "style" }, { role: "annotation" }],
  ];

  /**
   * 조회된 데이터의 클래스 render handler
   */
  const renderClassListHandler = (targetList) => {
    if (targetList && targetList.length > 0) {
      return availableClassList.map((categoryClass) => {
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
          sectionClassName = section + (clsCd > 9 ? clsCd : "0" + clsCd);
          if (dataTableList) {
            clsCount =
              dataTableList &&
              dataTableList.filter((nd) => Number(nd.g) === clsCd).length;
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
            onClick={() => clickClassHandler(categoryClass.value)}
            className="ipcClassButtonHover"
          >
            <Col span="22" className="ipcClassButtonHover">
              {/* {sectionClassName.toUpperCase()} */}
              {category === FIELD_TYPE.PATENT && `${categoryClass.value} `}
              {categoryClass.title}{" "}
              <b>{clsCount > 0 ? ` [${clsCount}]` : ""}</b>
            </Col>
            <Col span="2" style={{ margin: "auto", textAlign: "center" }}>
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
      });
    }
  };

  return (
    <div className="network_left">
      <div key="wordLayerdBox">
        <div className="left_search">
          <fieldset>
            <legend>Total Search</legend>
            <label>SEARCH</label>
            <div className="text">
              <Tooltip
                visible={false}
                color="orange"
                placement="bottom"
                title="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;검색 결과가 없습니다.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
              >
                <AutoCompleteSelect
                  id="searchKeyword"
                  name="searchKeyword"
                  changeAutocompleteHandler={searchHandler}
                  category={category}
                />
              </Tooltip>
            </div>
          </fieldset>
        </div>
        <div className="network_word">
          {searchWord ? (
            searchWord
          ) : (
            <span style={{ color: "#9e9e9e" }}>검색어 없음</span>
          )}
        </div>
      </div>

      <div key="includeExcludeBox" className="clude">
        <div>
          {/*    {inputIncludeVisible && (*/}

          {incluedInputVisible ? (
            <Input
              className="in"
              ref={inputIncludeRef}
              type="text"
              size="small"
              onBlur={includeCompleteHandler}
              onPressEnter={includeCompleteHandler}
            />
          ) : (
            <Tag className="site-tag-plus" onClick={includeButtonClickHandler}>
              <label>
                <PlusOutlined /> 포함어 추가
              </label>
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
            {includeKeywords.map((tag) => (
              <span key={tag} style={{ display: "inline-block" }}>
                <Tag
                  style={{ marginBottom: "2px" }}
                  closable
                  onClose={(e) => closeTageHandler(tag)}
                >
                  {tag}
                </Tag>
              </span>
            ))}
          </TweenOneGroup>
        </div>

        <div>
          {excluedInputVisible ? (
            <Input
              className="in"
              ref={inputExcludeRef}
              type="text"
              size="small"
              onBlur={excludeCompleteHandler}
              onPressEnter={excludeCompleteHandler}
            />
          ) : (
            <Tag onClick={excludeButtonClickHandler} className="site-tag-plus">
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
            {excludeKeywords.map((tag) => (
              <span key={tag} style={{ display: "inline-block" }}>
                <Tag
                  style={{ marginBottom: "2px" }}
                  closable
                  onClose={(e) => closeTageHandler(tag)}
                >
                  {tag}
                </Tag>
              </span>
            ))}
          </TweenOneGroup>
        </div>
      </div>

      <div key="classListBox">{renderClassListHandler(availableClassList)}</div>

      <SearchFilter
        category={category}
        section={section}
        dataTableList={dataTableList}
        includeKeywords={includeKeywords}
        setIncludeKeywords={setIncludeKeywords}
        excludeKeywords={excludeKeywords}
        setExcludeKeywords={setExcludeKeywords}
        availableClassList={availableClassList}
        availableClassCheckedList={availableClassCheckedList}
        clickClassHandler={clickClassHandler}
      />
    </div>
  );
};

export default SearchTool;
