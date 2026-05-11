import React from "react";
import { Popover, Radio, Slider } from "antd";
import { SNA_TYPE } from "Constants";
import { QuestionCircleOutlined } from "@ant-design/icons";

const SociogramDefaultFilter = ({
  snaType,
  graphData,
  isUseToggle,
  toggleChangeHandler,
  dataType,
  tRange,
  setTRange,
  minMaxSize,
  isUseVRange,
  vRange,
  setVRange,
  isUseYearRange,
  yearRange,
  setYearRange,
  additionFilterTool,
}) => {
  return (
    <>
      {isUseToggle && (
        <div className="filter-controller">
          <span>
            검색 방식
            <Popover
              content={
                <>
                  <QuestionCircleOutlined
                    style={{ cursor: "pointer", color: "#F2994A" }}
                  />
                  &nbsp;네트워크 종류를 결정합니다.
                </>
              }
              trigger={"hover"}
            >
              &nbsp;&nbsp;
              <QuestionCircleOutlined
                style={{ cursor: "pointer", color: "#F2994A" }}
              />
            </Popover>
          </span>
          <ul>
            <li></li>
            <li>
              <Radio.Group
                onChange={toggleChangeHandler}
                value={dataType}
                buttonStyle={"solid"}
              >
                <Radio.Button
                  style={{
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                  }}
                  value={SNA_TYPE.PAPER}
                >
                  과제 네트워크
                </Radio.Button>
                <Radio.Button
                  style={{
                    borderTopRightRadius: "8px",
                    borderBottomRightRadius: "8px",
                  }}
                  value={SNA_TYPE.WORD}
                >
                  용어 네트워크
                </Radio.Button>
              </Radio.Group>
            </li>
          </ul>
        </div>
      )}

      {tRange && (
        <div className="filter-controller">
          <span>
            제목보기
            <Popover
              content={
                <>
                  <QuestionCircleOutlined
                    style={{ cursor: "pointer", color: "#F2994A" }}
                  />
                  &nbsp;제목 보기 수준을 결정합니다.
                </>
              }
              trigger={"hover"}
            >
              &nbsp;&nbsp;
              <QuestionCircleOutlined
                style={{ cursor: "pointer", color: "#F2994A" }}
              />
            </Popover>
          </span>
          <ul>
            <li>{graphData !== null && `${tRange[0]} - ${tRange[1]}`}</li>
            <li>
              <Slider
                disabled={minMaxSize[0] === 0 && minMaxSize[1] === 0}
                range
                max={20}
                min={0}
                step={1}
                defaultValue={[10, 20]}
                onChange={setTRange}
              />
            </li>
          </ul>
        </div>
      )}

      {isUseVRange && (
        <div className="filter-controller">
          <span>
            네트워크 지표 설정
            <Popover
              content={
                <>
                  <QuestionCircleOutlined
                    style={{ cursor: "pointer", color: "#F2994A" }}
                  />
                  &nbsp;용어 네트워크의 경우에 활성화됩니다.
                </>
              }
              trigger={"hover"}
            >
              &nbsp;&nbsp;
              <QuestionCircleOutlined
                style={{ cursor: "pointer", color: "#F2994A" }}
              />
            </Popover>
          </span>
          <ul>
            <li>{graphData !== null && `${vRange[0]} - ${vRange[1]}`}</li>
            <li>
              <Slider
                // disabled={dataType !== SNA_TYPE.WORD}
                range
                max={1}
                min={0}
                step={0.01}
                value={vRange}
                defaultValue={snaType === SNA_TYPE.PAPER ? [0.5, 1] : [0, 1]}
                onChange={(value) => setVRange([value[0], 1])}
              />
            </li>
          </ul>
        </div>
      )}
      {isUseYearRange && (
        <div className="filter-controller">
          <span>
            날짜 설정
            <Popover
              content={
                <>
                  <QuestionCircleOutlined
                    style={{ cursor: "pointer", color: "#F2994A" }}
                  />
                  &nbsp;과제 네트워크의 경우에 활성화됩니다.
                </>
              }
              trigger={"hover"}
            >
              &nbsp;&nbsp;
              <QuestionCircleOutlined
                style={{ cursor: "pointer", color: "#F2994A" }}
              />
            </Popover>
          </span>
          <ul>
            <li>
              {graphData !== null &&
                `${yearRange.value[0]} - ${yearRange.value[1]}`}
            </li>
            <li>
              <Slider
                disabled={dataType !== SNA_TYPE.PAPER}
                range
                max={yearRange.max}
                min={yearRange.min}
                value={yearRange.value}
                onChange={(v) =>
                  setYearRange((old) => ({
                    ...old,
                    value: v,
                  }))
                }
              />
            </li>
          </ul>
        </div>
      )}

      {additionFilterTool && <>{additionFilterTool}</>}
    </>
  );
};

export default SociogramDefaultFilter;
