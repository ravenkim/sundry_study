import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Input,
  Popover,
  Row,
  Switch,
  Tag,
} from "antd";
import {
  CloseOutlined,
  FilterOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { getColor } from "utils/commonUtils";
import { FIELD_TYPE } from "Constants";

const SearchFilter = ({
  category,
  section,
  dataTableList,
  includeKeywords,
  setIncludeKeywords,
  excludeKeywords,
  setExcludeKeywords,
  availableClassList,
  availableClassCheckedList,
  clickClassHandler,
}) => {
  /*******************************************************************************
   * POP OVER Action
   *******************************************************************************/
  const [visible, setVisible] = useState(false);

  /**
   * Popover title renderer
   */
  const titleRender = (title) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        boxShadow: "inset 0px -1px 0px #F0F0F0",
      }}
    >
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

  /**
   * popover visible change handler
   */
  const visibleChangeHandler = (value) => {
    setVisible(value);
  };

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
   * 제외어 추가 Click handler
   */
  const excludeButtonClickHandler = () => {
    setExcludeInputVisible(true);
  };

  /**
   * 제외어 추가 Click 시 Input 에 focus
   */
  useEffect(() => {
    if (excluedInputVisible) {
      if (inputExcludeRef.current) {
        inputExcludeRef.current.focus();
      }
    }
  }, [excluedInputVisible]);

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
   * 포함어 제외어 태그 close handler
   * @param closeTag
   * @param type (in , ex)
   */
  const closeTageHandler = (closeTag, type) => {
    if (type === "in") {
      setIncludeKeywords(includeKeywords.filter((tag) => tag !== closeTag));
    } else {
      setExcludeKeywords(excludeKeywords.filter((tag) => tag !== closeTag));
    }
  };

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
            // chartValues.push([
            //   categoryClass.title,
            //   clsCount,
            //   getColor(clsCd.charCodeAt(0)),
            //   clsCount,
            //   sectionClassName.toUpperCase(),
            // ]);
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
            // chartValues.push([
            //   categoryClass.title,
            //   clsCount,
            //   getColor(clsCd),
            //   clsCount,
            //   sectionClassName.toUpperCase(),
            // ]);
          }
        }

        return (
          <Row
            key={`category_${categoryClass.cateKey}`}
            align={"middle"}
            // style={{
            //   padding: "3px",
            // }}
            // onClick={() => clickClassHandler(categoryClass.value)}
          >
            <Col
              span="2"
              style={{
                margin: "auto",
                textAlign: "center",
              }}
            >
              <Avatar
                style={{
                  backgroundColor: clsColor,
                  width: 13,
                  height: 13,
                  top: "-1px",
                }}
              />
            </Col>
            <Col span="19">
              {/* {sectionClassName.toUpperCase()} */}

              <span>
                {category === FIELD_TYPE.PATENT && `${categoryClass.value} `}
                {categoryClass.title}{" "}
              </span>
              <b>{clsCount > 0 ? ` [${clsCount}]` : ""}</b>
            </Col>
            <Col span="3" style={{ margin: "auto", textAlign: "center" }}>
              <Switch
                key={`switch_${categoryClass.cateKey}`}
                onChange={() => clickClassHandler(categoryClass.value)}
                checked={
                  availableClassCheckedList.findIndex(
                    (x) => x === categoryClass.value
                  ) > -1
                }
              />
            </Col>
          </Row>
        );
      });
    }
  };

  const filterContent = () => {
    return (
      <>
        <div>
          <div>
            <label>포함어</label>
          </div>
          <div>
            <div>
              {includeKeywords && includeKeywords.length > 0 ? (
                includeKeywords.map((tag) => (
                  <Tag
                    key={tag}
                    style={{ marginBottom: "2px" }}
                    closable
                    onClose={(e) => closeTageHandler(tag, "in")}
                  >
                    {tag}
                  </Tag>
                ))
              ) : (
                <span style={{ fontSize: "12px", color: "#ddd" }}>
                  추가된 포함어가 없습니다.
                </span>
              )}
            </div>
            {incluedInputVisible ? (
              <Input
                className="in"
                ref={inputIncludeRef}
                type="text"
                size="small"
                onBlur={includeCompleteHandler}
                onPressEnter={includeCompleteHandler}
                placeholder={"포함어를 입력해주세요"}
              />
            ) : (
              <Tag onClick={includeButtonClickHandler}>
                <label>
                  <PlusOutlined /> 포함어 추가
                </label>
              </Tag>
            )}
          </div>
        </div>
        <div>
          <div>
            <label>제외어</label>
          </div>
          <div>
            <div>
              {excludeKeywords && excludeKeywords.length > 0 ? (
                excludeKeywords.map((tag) => (
                  <Tag
                    key={tag}
                    style={{ marginBottom: "2px" }}
                    closable
                    onClose={(e) => closeTageHandler(tag, "ex")}
                  >
                    {tag}
                  </Tag>
                ))
              ) : (
                <span style={{ fontSize: "12px", color: "#ddd" }}>
                  추가된 제외어가 없습니다.
                </span>
              )}
            </div>
            {excluedInputVisible ? (
              <Input
                className="ex"
                ref={inputExcludeRef}
                type="text"
                size="small"
                onBlur={excludeCompleteHandler}
                onPressEnter={excludeCompleteHandler}
                placeholder={"제외어를 입력해주세요"}
              />
            ) : (
              <Tag onClick={excludeButtonClickHandler}>
                <label>
                  <PlusOutlined /> 제외어 추가
                </label>
              </Tag>
            )}
          </div>
        </div>
        <Divider />
        <div>
          <div>
            <label>분 류</label>
          </div>
          <div key="classListBox">
            {availableClassList && availableClassList.length > 0 ? (
              renderClassListHandler(availableClassList)
            ) : (
              <span style={{ fontSize: "12px", color: "#ddd" }}>
                분류 목록이 존재하지 않습니다.
              </span>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <Popover
      title={titleRender("검색 필터")}
      placement={"bottomRight"}
      trigger={"click"}
      visible={visible}
      content={filterContent}
      onVisibleChange={visibleChangeHandler}
      overlayInnerStyle={{ width: "400px" }}
    >
      <Button icon={<FilterOutlined />} />
    </Popover>
  );
};

export default SearchFilter;
