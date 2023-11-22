import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import LimeModal from "features/common/modal/LimeModal";
import LimeButton from "features/common/button/components/LimeButton";

const { Column } = Table;

/**
 * 2021.11.30
 * 작성자: 김동현
 * 검색결과 테이블
 * @param docData: [result.data.doc_data.source]
 */

const LimeExpandableTable = ({ docData }) => {
  const [data, setData] = useState();
  useEffect(() => {
    if (docData.data) {
      setData(docData.data.source);
    }
  }, [docData.data]);

  const [visible, setVisible] = useState(false);

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const expandStyle = {
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 5,
    WebkitBoxOrient: "vertical",
    height: "160px",
    whiteSpace: "auto",
  };

  const [goalVisible, setGoalVisible] = useState(true);
  const [abstVisible, setAbstVisible] = useState(true);
  const [exptVisible, setExptVisible] = useState(true);

  const expandButtonHandler = (item) => {
    item === "goal"
      ? setGoalVisible(false)
      : item === "abst"
      ? setAbstVisible(false)
      : setExptVisible(false);
  };

  const ExpandedRowRender = (record, index, indent, expanded) => {

    return (
      <>
        <div className="table-view">
          <div className="table-box content-detail" style={{ height: "auto" }}>
            <table>
              <tbody>
                <tr className="table-col">
                  <td colSpan="5">
                    <div className="table-content modal-button">
                      <div className="content-button">
                        <LimeButton
                          title={"상세보기"}
                          size={"sm"}
                          classType={"sm-blue"}
                          onClick={openModal}
                        />
                      </div>
                    </div>
                    <div className="table-content">
                      <h6>연구목표</h6>
                      <table>
                        <caption>연구목표 설명</caption>
                        <colgroup>
                          <col style={{ width: "100%" }} />
                        </colgroup>
                        <tbody>
                          <tr className={"active"}>
                            <td style={goalVisible ? expandStyle : null}>
                              {record.rschGoalAbstract}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="content-button">
                        {goalVisible && (
                          <LimeButton
                            title={"+ 더보기"}
                            classType={"tertiary"}
                            size={"sm"}
                            onClick={() => expandButtonHandler("goal")}
                          />
                        )}
                      </div>
                    </div>
                    <div className="table-content">
                      <h6>연구내용</h6>
                      <table>
                        <caption>연구내용 설명</caption>
                        <colgroup>
                          <col style={{ width: "100%" }} />
                        </colgroup>
                        <tbody>
                          <tr className={"active"}>
                            <td
                              style={abstVisible ? expandStyle : null}
                            >
                              {record.rschAbstract}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="content-button">
                        {abstVisible && (
                          <LimeButton
                            title={"+ 더보기"}
                            classType={"tertiary"}
                            size={"sm"}
                            onClick={() => expandButtonHandler("abst")}
                          />
                        )}
                      </div>
                    </div>
                    <div className="table-content">
                      <h6>기대효과</h6>
                      <table>
                        <caption>기대효과 설명</caption>
                        <colgroup>
                          <col style={{ width: "100%" }} />
                        </colgroup>
                        <tbody>
                          <tr className={"active"}>
                            <td style={exptVisible ? expandStyle : null}>
                              {record.expEfctAbstract}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="content-button">
                        {exptVisible && (
                          <LimeButton
                            title={"+ 더보기"}
                            classType={"tertiary"}
                            size={"sm"}
                            onClick={() => expandButtonHandler("expt")}
                          />
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        { expanded &&
          <LimeModal
          title={<h4>상세보기</h4>}
          cancelHandler={closeModal}
          visible={visible}
          width={"1200px"}
          children={
            <div className={"con-box"}>
              <div className={"table-view"} style={{border: "0"}}>
                <div className={"table-box content-detail"}>
                  <table>
                    <caption>
                      과제명, 수행기관, 과제기관에 대한 정보를 보여 주는 표
                    </caption>
                    <colgroup>
                      <col style={{width: "10%"}}/>
                      <col style={{width: "10%"}}/>
                      <col style={{width: "30%"}}/>
                      <col style={{width: "20%"}}/>
                      <col style={{width: "30%"}}/>
                    </colgroup>
                    <thead>
                    <tr>
                      <th colSpan="2">과제수행기관</th>
                      <td colSpan="4">{record.pjtPrfrmOrgNm}</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <th rowSpan="2">과제명</th>
                      <th className="table-detail">국문</th>
                      <td colSpan="4">{record.korPjtNm}</td>
                    </tr>
                    <tr>
                      <th className="table-detail">영문</th>
                      <td td="" colSpan="4">
                        {record.engPjtNm}
                      </td>
                    </tr>
                    <tr>
                      <th colSpan="2">연구개발단계</th>
                      <td>{record.rndPhase}</td>
                      <th>과제관리(전문)기관</th>
                      <td>{record.spcltyOrgNm}</td>
                    </tr>
                    <tr>
                      <th colSpan="2">연구개발과제성격</th>
                      <td>{record.dtlPjtClas}</td>
                      <th>실용화대상여부</th>
                      <td>{record.prctuseNm}</td>
                    </tr>
                    <tr>
                      <th colSpan="2">기술수명주기</th>
                      <td>{record.techLifecycNm}</td>
                      <th>연구수행주체</th>
                      <td>{record.rschExecSuj}</td>
                    </tr>
                    <tr>
                      <th colSpan="2">과제고유번호</th>
                      <td>{record.pjtId}</td>
                      <th>지역</th>
                      <td>{record.regnNm}</td>
                    </tr>
                    <tr>
                      <th colSpan="2">총연구기간</th>
                      <td>
                        {record.totRschStartDt} ~ {record.totRschEndDt}
                      </td>
                      <th>(기관)세부과제번호</th>
                      <td>{record.pjtNo}</td>
                    </tr>
                    <tr>
                      <th colSpan="2">연구비</th>
                      <td>{record.rndcoTotAmt}</td>
                      <th>당해 연도 연구기간</th>
                      <td>
                        {record.tsyrRschStartDt} ~ {record.tsyrRschEndDt}
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }
        />}
      </>
    );
  };

  const [rowKeys, setRowKeys] = useState();
  const onTableRowExpand = (expanded, record) => {
    let keys = [];
    if (expanded) {
      keys.push(record.docId);
    }
    setRowKeys(keys);
    setGoalVisible(true);
    setAbstVisible(true);
    setExptVisible(true);
  };

  return (
    <>
      <Table
        rowKey={"docId"}
        expandedRowKeys={rowKeys}
        onExpand={onTableRowExpand}
        rowClassName={(expanded) => (expanded ? "active" : null)}
        expandable={{
          expandedRowRender: (record, index, indent, expanded) => ExpandedRowRender(record, index, indent, expanded),
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <UpOutlined
                  onClick={(e) => onExpand(record, e)}
                  style={{ fontSize: "8px" }}
                />
              ) : (
                <DownOutlined
                  onClick={(e) => onExpand(record, e)}
                  style={{ fontSize: "8px" }}
                />
              ),
          expandIconColumnIndex: 5,
          expandRowByClick: true,
          columnWidth: "2px",
        }}
        dataSource={data}
        loading={docData.loading}
        pagination={false}
        sticky={true}
        locale={{
          emptyText: (
            <div className="search-result-bg">
              <p>검색결과가 없습니다.</p>
            </div>
          ),
        }}
      >
        <Column
          title={"과제명"}
          dataIndex={"korPjtNm"}
          align={"left"}
          ellipsis={true}
          width={"55%"}
          render={(text, item) => {
            return (
              <span>
              {text} {item.yrCnt && "(" + item.yrCnt + "년차)"}
              </span>
            )
          }}
        />
        <Column
          title={"수행기관"}
          dataIndex={"pjtPrfrmOrgNm"}
          align={"center"}
          width={"20%"}
        />
        <Column title={"과제기관"} dataIndex={"spcltyOrgNm"} align={"center"} width={"20%"} />
        {/*<Column title={"규모"} dataIndex={"rndcoTotAmt"} align={"center"} />*/}
        {/*<Column title={"주관기관"} dataIndex={"progMstrNm"} align={"center"}/>*/}
      </Table>
    </>
  );
};

export default LimeExpandableTable;
