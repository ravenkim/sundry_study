import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FIELD_TYPE } from "Constants";
import { Modal, Tooltip } from "antd";
import { isUserLogin } from "utils/commonUtils";

import SociogramLight from "features/sna/SociogramLight";
import { snaAction } from "features/sna/snaReducer";
import WordcloudChart from "features/chart/components/WordcloudChart";
import SunburstChart from "features/chart/components/SunburstChart";
import LineCurveChart from "features/chart/components/LineCurveChart";
import { getCurveStackbarlegendColor } from "features/chart/utils/chartUtils";
import BarChart from "features/chart/components/BarChart";
import BubbleChart from "features/chart/components/BubbleChart";

let cw = 200 - 14 * 2;
let ch = 200 - 14 * 2;

/**
 * MAIN PAGE CONTENTS COMPONENT
 * @param history
 * @returns {JSX.Element}
 * @constructor
 */
const MainIndex = ({ history }) => {
  const dispatch = useDispatch();

  const { issueList, wordSearch, wordcountSearch } = useSelector(
    ({ snaReducer }) => ({
      issueList: snaReducer.issueList.data,
      wordSearch: snaReducer.wordSearch.data,
      wordcountSearch: snaReducer.wordcountSearch.data,
    })
  );
  /**********************************************************************
   * Common Action
   **********************************************************************/
  const [searchKeyword, setSearchKeyword] = useState({});

  /**
   * 최초 Component Rendering시 실행 USE EFFECT
   */
  useEffect(() => {
    dispatch(snaAction.getIssueList());

    if (tab1TabRef) {
      tab1TabRef.current.click();
    }
  }, []);

  /**
   * 검색어 변경시 Data 호출 USE EFFECT
   */
  useEffect(() => {
    if (searchKeyword.word && searchKeyword.auto_selected) {
      dispatch(
        snaAction.getWordSearch({
          auto_selected: searchKeyword.auto_selected,
          word: searchKeyword.word,
          sort: "patent,thesis,n_subject",
          node_size: 100,
          section: "t_word,t",
          isMainPlayer: "True",
        })
      );
      dispatch(
        snaAction.getWordCountSearch({
          word: searchKeyword.word,
          sort: "patent,thesis,n_subject",
        })
      );
    } else if (searchKeyword.word && !searchKeyword.auto_selected) {
      dispatch(
        snaAction.getWordSearch({
          word: searchKeyword.word,
          sort: "patent,thesis,n_subject",
          node_size: 100,
          section: "t_word,t",
          isMainPlayer: "True",
        })
      );
      dispatch(
        snaAction.getWordCountSearch({
          word: searchKeyword.word,
          sort: "patent,thesis,n_subject",
        })
      );
    }
    return () => {
      if (searchKeyword.auto_selected) {
        setSearchKeyword((prev) => ({
          word: prev.word,
        }));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword.word]);

  /**********************************************************************
   * Issue List Action
   **********************************************************************/

  /**
   * 이슈 목록이 가져와 지면 첫번째 인덱스 이슈를 검색 키워드로 지정
   */
  useEffect(() => {
    if (issueList) {
      if (issueList.length > 0) {
        setSearchKeyword({ word: issueList[0], auto_selected: "Y" });
      }
    }
  }, [issueList]);

  /**
   * 이슈 키워드 클릭 Handler
   * @param value
   */
  const issueOnClick = (value) => {
    popupCloseHandler();
    setSearchKeyword({ word: value });
  };

  /**********************************************************************
   * Sociogram Action
   **********************************************************************/

  const sociogramPatentRef = useRef();
  const sociogramThesisRef = useRef();
  const sociogramSubjectRef = useRef();
  const sociogramEtcRef = useRef();

  const [playerSocio, setPlayerSocio] = useState();

  // 특허 소시오그램 data state
  const [patentSocioData, setPatentSocioData] = useState({
    totalCount: 0,
    socioData: null,
  });

  // 논문 소시오그램 data state
  const [thesisSocioData, setThesisSocioData] = useState({
    totalCount: 0,
    socioData: null,
  });

  // 과제 소시오그램 data state
  const [subjectNtisSocioData, setSubjectNtisSocioData] = useState({
    totalCount: 0,
    socioData: null,
  });

  const [playerFieldType, setPlayerFieldType] = useState(FIELD_TYPE.PATENT);
  /**
   * Sociogram Data binding USE EFFECT
   */
  useEffect(() => {
    if (wordSearch) {
      setPatentSocioData((prev) => ({
        totalCount: wordSearch.patentRankPaperTotalCount,
        socioData: wordSearch.patentTWord,
      }));

      setThesisSocioData((prev) => ({
        totalCount: wordSearch.thesisRankPaperTotalCount,
        socioData: wordSearch.thesisTWord,
      }));

      setSubjectNtisSocioData((prev) => ({
        totalCount: wordSearch.nSubjectRankPaperTotalCount,
        socioData: wordSearch.nSubjectTWord,
      }));

      playerSortClickHandler(FIELD_TYPE.PATENT);
    } else {
      initSocioDataHandler();
    }
  }, [wordSearch]);

  /**
   * 소시오그램 데이터 초기화
   */
  const initSocioDataHandler = () => {
    setPatentSocioData((prev) => ({
      totalCount: 0,
      socioData: null,
    }));

    setThesisSocioData((prev) => ({
      totalCount: 0,
      socioData: null,
    }));

    setSubjectNtisSocioData((prev) => ({
      totalCount: 0,
      socioData: null,
    }));

    setPlayerSocio(null);
  };

  /**
   * 플레이어 데이터 세팅
   * @param playerSort
   */
  const playerSortClickHandler = (playerSort) => {
    // 플레이어 SORT 버튼 ACTIVE 세팅
    setPlayerFieldType(playerSort);
    switch (playerSort) {
      case FIELD_TYPE.PATENT:
        setPlayerSocio(
          wordSearch.playerSocio.patent ? wordSearch.playerSocio.patent : null
        );
        break;
      case FIELD_TYPE.THESIS_NDSL:
        setPlayerSocio(
          wordSearch.playerSocio.patent ? wordSearch.playerSocio.patent : null
        );
        break;
      case FIELD_TYPE.SUBJECT_NTIS:
        setPlayerSocio(
          wordSearch.playerSocio.patent ? wordSearch.playerSocio.patent : null
        );
        break;
      default:
        setPlayerSocio(null);
        break;
    }
  };

  /**
   * 소시오그램 Node Click Handler (Field type별 상세정보 조회)
   * @param node
   * @param type
   */
  const nodeClickHandler = (node, type) => {
    switch (type) {
      case FIELD_TYPE.PATENT:
        // dispatch(getDetailPatentAsync({ n: node.n }));
        break;
      case FIELD_TYPE.THESIS_NDSL:
        // dispatch(getDetailThesisNdslAsync({ n: node.n }));
        break;
      case FIELD_TYPE.SUBJECT_NTIS:
        // dispatch(getDetailSubjectNtisAsync({ n: node.n }));
        break;
      case FIELD_TYPE.PLAYER:
        if (playerFieldType === FIELD_TYPE.PATENT) {
          // dispatch(getDetailPatentAsync({ n: node.n }));
        } else if (playerFieldType === FIELD_TYPE.THESIS_NDSL) {
          // dispatch(getDetailThesisNdslAsync({ n: node.n }));
        } else if (playerFieldType === FIELD_TYPE.SUBJECT_NTIS) {
          // dispatch(getDetailSubjectNtisAsync({ n: node.n }));
        }
        break;
      default:
        break;
    }
  };

  /**********************************************************************
   * Chart Action
   **********************************************************************/

  // 특허 chart data state
  const [patentChartData, setPatentChartData] = useState({
    sunburst: null,
    wordcloud: null,
    bubble: null,
  });

  // 논문 chart data state
  const [thesisChartData, setThesisChartData] = useState({
    sunburst: null,
    wordcloud: null,
    bubble: null,
  });

  // 과제 chart data state
  const [subjectNtisChartData, setSubjectNtisChartData] = useState({
    sunburst: null,
    wordcloud: null,
    bubble: null,
  });

  // Curve chart data state
  const [wordCurve, setWordCurve] = useState();

  // bar chart data state
  const [wordCumu, setWordCumu] = useState();

  /**
   * chart data 초기화 Handler
   */
  const initChartDataHandler = () => {
    setPatentChartData({
      sunburst: null,
      wordcloud: null,
      bubble: null,
    });

    setThesisChartData({
      sunburst: null,
      wordcloud: null,
      bubble: null,
    });

    setSubjectNtisChartData({
      sunburst: null,
      wordcloud: null,
      bubble: null,
    });

    setWordCurve();
    setWordCumu();
  };

  /**
   * CHART DATA BINDING USE EFFECT
   */
  useEffect(() => {
    // chart data 초기화
    initChartDataHandler();
    // chart data binding
    if (wordcountSearch) {
      // 특허 chart data setting
      if (wordcountSearch.patent) {
        setPatentChartData((prev) => ({
          sunburst: wordcountSearch.patent.sunburstChart,
          wordcloud:
            wordcountSearch.patent.cloudChart.length > 0
              ? [wordcountSearch.patent.cloudChart[0].slice(0, 10)]
              : [],
          bubble: wordcountSearch.patent.bubbleChartWordGroup,
        }));
      }

      // 논문 chart data setting
      if (wordcountSearch.thesis) {
        setThesisChartData((prev) => ({
          sunburst: wordcountSearch.thesis.sunburstChart,
          wordcloud:
            wordcountSearch.thesis.cloudChart.length > 0
              ? [wordcountSearch.thesis.cloudChart[0].slice(0, 10)]
              : [],
          bubble: wordcountSearch.thesis.bubbleChartWordGroup,
        }));
      }

      // 과제 chart data setting
      if (wordcountSearch.nSubject) {
        setSubjectNtisChartData((prev) => ({
          sunburst: wordcountSearch.nSubject.sunburstChart,
          wordcloud:
            wordcountSearch.nSubject.cloudChart.length > 0
              ? [wordcountSearch.nSubject.cloudChart[0].slice(0, 10)]
              : [],
          bubble: wordcountSearch.nSubject.bubbleChartWordGroup,
        }));
      }

      // bar chart data setting
      if (wordcountSearch.wordCumu) {
        setWordCumu(wordcountSearch.wordCumu);
      }

      // curve chart data setting
      if (wordcountSearch.wordCurve) {
        setWordCurve(wordcountSearch.wordCurve);
      }
    }
  }, [wordcountSearch]);

  /**
   * 특허 wordcloud 단어 click Handler
   * @param clickWord
   * @param nodeList
   */
  const patentWordClickEvent = (clickWord, nodeList) => {

    if (sociogramPatentRef && sociogramPatentRef.current) {
      sociogramPatentRef.current.setNewNodeList(nodeList);
    }
  };

  /**
   * 논문 wordcloud 단어 click Handler
   * @param clickWord
   * @param nodeList
   */
  const thesisWordClickEvent = (clickWord, nodeList) => {
    if (sociogramThesisRef && sociogramThesisRef.current) {
      sociogramThesisRef.current.setNewNodeList(nodeList);
    }
  };

  /**
   * 과제 wordcloud 단어 click Handler
   * @param clickWord
   * @param nodeList
   */
  const subjectWordClickEvent = (clickWord, nodeList) => {
    if (sociogramSubjectRef && sociogramSubjectRef.current) {
      sociogramSubjectRef.current.setNewNodeList(nodeList);
    }
  };

  /**********************************************************************
   * Popup Action
   **********************************************************************/
  // 팝업 Tab1 Ref
  const tab1TabRef = useRef();

  const sociogramModalRef = useRef();

  const [activeTabKey, setActiveTabKey] = useState(null);
  const [popupData, setPopupData] = useState({
    socioData: null,
    wordcloud: null,
    bubble: null,
  });

  /**
   * 팝업에서 활성화된 Tab이 바뀔때 실행 USE EFFECT
   */
  useEffect(() => {
    if (sociogramModalRef && sociogramModalRef.current) {
      sociogramModalRef.current.closeDetailDrawer();
    }
  }, [activeTabKey]);

  /**
   * 팝업 Tab Change Handler
   */
  const popupTabChangeHandler = (e, tabKey) => {
    let i, square_tabcontent, tablinks;
    square_tabcontent = document.getElementsByClassName("square_tabcontent");
    for (i = 0; i < square_tabcontent.length; i++) {
      square_tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabKey).style.display = "block";
    e.currentTarget.className += " active";
    setActiveTabKey(tabKey);
  };

  /**
   * 팝업 Close handler
   */
  const popupCloseHandler = () => {
    modalDialogRef.current.style.display = "none";
  };

  /**
   * 팝업 Open Handler
   * @param type
   * @returns {boolean}
   */
  const popupOpenHandler = (type) => {
    switch (type) {
      case FIELD_TYPE.PATENT:
        setPopupData((prev) => ({
          socioData: {
            data: patentSocioData.socioData,
            type: type,
            type_txt: FIELD_TYPE.properties[type].name,
          },
          wordcloud: wordcountSearch.patent.cloudChart,
          bubble: wordcountSearch.patent.bubbleChartWordGroup,
        }));
        break;
      case FIELD_TYPE.THESIS_NDSL:
        setPopupData((prev) => ({
          socioData: {
            data: thesisSocioData.socioData,
            type: type,
            type_txt: FIELD_TYPE.properties[type].name,
          },
          wordcloud: wordcountSearch.thesis.cloudChart,
          bubble: wordcountSearch.thesis.bubbleChartWordGroup,
        }));
        break;
      case FIELD_TYPE.SUBJECT_NTIS:
        setPopupData((prev) => ({
          socioData: {
            data: subjectNtisSocioData.socioData,
            type: type,
            type_txt: FIELD_TYPE.properties[type].name,
          },
          wordcloud: wordcountSearch.nSubject.cloudChart,
          bubble: wordcountSearch.nSubject.bubbleChartWordGroup,
        }));
        break;
      case FIELD_TYPE.PLAYER:
        setPopupData((prev) => ({
          socioData: {
            data: playerSocio,
            type: type,
            type_txt: FIELD_TYPE.properties[type].name,
          },
          wordcloud: null,
          bubble: null,
        }));
        break;

      default:
        setPopupData((prev) => ({
          socioData: null,
          wordcloud: null,
          bubble: null,
        }));
        break;
    }

    modalDialogRef.current.style.display = "block";
    return false;
  };

  /**********************************************************************
   * AutoComplete Action
   **********************************************************************/

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const loginToSearchPage = (message, word) => {
    history.push({
      pathname: "/account/login",
      state: { redirectUrl: "/main?word=" + word, message: message },
    });
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
            socioWordList.filter((word) => word === userInputWord).length === 0)
        ) {
          const isLogin = isUserLogin();

          if (!isLogin) {
            loginToSearchModal(userInputWord.replace(" ", ","));
          } else {
            // history.push("/search?word=" + userInputWord);
            // setSearchKeyword({ word: userInputWord, auto_selected: "Y" });
            setTooltipVisible(true);
            const handler = setTimeout(() => setTooltipVisible(false), 7000);
          }

          // dispatch(searchCountCheck({ word: userInputWord.trim() }));
          // loginToSearchModal(userInputWord.replace(" ", ","));
        }
      }
    } else {
      return false;
    }
  };

  const onChangeWordSelectBox = (pWord) => {
    const isLogin = isUserLogin();

    if (pWord && pWord.length > 0) {
      if (!isLogin) {
        loginToSearchModal(pWord.replace(" ", ","));
      } else {
        // history.push("/search?word=" + pWord);
        setSearchKeyword({ word: pWord, auto_selected: "Y" });
      }
    }
    // loginToSearchModal(pWord.replace(" ", ","));
    // loginToSearchPage("네트워크 데이터를 활용한 상세 검색 결과는 LIME 회원만 사용가능합니다.", pWord);
    // history.push("/search?word=" + pWord);
  };

  const loginToSearchModal = (paramWord) => {
    // const isLogin = isUserLogin();
    const isLogin = false;
    if (!isLogin) {
      Modal.confirm({
        title: `검색을 위해 로그인이 필요합니다.`,
        okText: "닫기",
        okButtonProps: {
          type: "default",
        },
        onOk() {},
        cancelText: "로그인",
        cancelButtonProps: {
          type: "primary",
        },
        onCancel() {
          loginToSearchPage("", paramWord);
        },
        centered: true,
      });
    } else {
      history.push("/search?word=" + paramWord);
    }
  };
  /////////////////////// 끝

  ////////////////////// 워드클라우드 customOnClickEvent
  const customOnClickEvent = (clickWord, nodeList) => {
    const isLogin = isUserLogin();
    const paramWord =
      (clickWord &&
        clickWord.length > 0 &&
        searchKeyword &&
        searchKeyword.word &&
        searchKeyword.word.length > 0 &&
        searchKeyword.word + "," + clickWord) ||
      null;

    if (paramWord) {
      if (!isLogin) {
        loginToSearchModal(paramWord);
      } else {
        history.push({
          pathname: "/search",
          search: `?word=${paramWord}`,
        });
      }
    }
    // tmp(clickWord);
  };

  const getSelectedEvent = (obj) => {
    alert(JSON.stringify(obj));
  };

  const modalDialogRef = useRef();

  // sociogram ref --- wordcloud 추가 요청 사항----------------------------- start

  return (
    <>
      <div ref={modalDialogRef} className="modalDialog" id="openModal1">
        <div className="square_detail">
          <h3 className="skip">자세히보기</h3>

          <>
            {popupData.socioData &&
            popupData.socioData.type === FIELD_TYPE.PLAYER ? (
              <div className="square_tab">
                <button
                  className="tablinks"
                  onClick={(event) => popupTabChangeHandler(event, "tab1")}
                  ref={tab1TabRef}
                  title="소시오그램"
                >
                  소시오그램
                </button>
              </div>
            ) : (
              <div className="square_tab">
                <button
                  className="tablinks"
                  onClick={(event) => popupTabChangeHandler(event, "tab1")}
                  ref={tab1TabRef}
                  title="소시오그램"
                >
                  소시오그램
                </button>
                <button
                  className="tablinks"
                  onClick={(event) => popupTabChangeHandler(event, "tab2")}
                  title="워드클라우드"
                >
                  워드클라우드
                </button>
                <button
                  className="tablinks"
                  onClick={(event) => popupTabChangeHandler(event, "tab3")}
                  title="버블차트"
                >
                  버블차트
                </button>
              </div>
            )}
          </>

          <article id="tab1" className="square_tabcontent">
            <div>
              <h4>{searchKeyword.word && searchKeyword.word}</h4>
              {popupData.socioData && (
                <SociogramLight
                  ref={sociogramModalRef}
                  category={
                    popupData.socioData.type === FIELD_TYPE.PLAYER
                      ? playerFieldType
                      : popupData.socioData.type
                  } // thesis, subject, report
                  socioGramId={"popupSocio"}
                  loading={false}
                  sociogramWidth={1030}
                  sociogramHeight={775}
                  dataSource={popupData.socioData.data}
                  drawerVisible={true}
                  toolbarVisible={false}
                  toolbarAlign={"left"}
                  downloadFileName={`${popupData.socioData.type_txt}소시오그램`}
                  clickHandler={nodeClickHandler}
                />
              )}
            </div>
          </article>
          {/* <!-- 소시오그램 --> */}
          <article id="tab2" className="square_tabcontent">
            <h4>{searchKeyword.word && searchKeyword.word}</h4>
            {/* Drawer를 포함한 워드클라우드차트 */}
            {popupData.wordcloud && (
              <div
                style={{
                  width: 1030,
                  height: 775,
                  border: "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <WordcloudChart
                  // ref={wordColudModalRef}
                  cloudId={`main_popup_wordCloud_${FIELD_TYPE.PATENT}`}
                  customTopLeft={{ top: -35, left: -45 }}
                  options={{
                    backgroundColor: "rgba(255,0,0,0)",
                    shrinkToFit: true,
                    rotateRatio: 0,
                    gridSize: 30,
                  }}
                  style={{ width: 1030, height: 750 }}
                  dataSource={popupData.wordcloud}
                  useExcludes={true}
                  type={popupData.socioData.type}
                />
              </div>
            )}
          </article>
          {/* <!-- 썬차트 --> */}
          <article id="tab3" className="square_tabcontent">
            <h4>{searchKeyword.word && searchKeyword.word}</h4>
            <div>
              {popupData.bubble && (
                <BubbleChart
                  autoStart={true}
                  divId={`main-tab-race-chart-${searchKeyword.word}`}
                  config={{
                    displayModeBar: true,
                    displaylogo: false,
                    scrollZoom: true,
                  }}
                  data={popupData.bubble[0]}
                  xrange={popupData.bubble[1]}
                  yrange={popupData.bubble[2]}
                  // chartTitle=""
                  style={{ height: 775, width: 1030 }}
                  layoutProps={{
                    showlegend: true,
                    legend: {
                      bgcolor: "rgba(0,0,0,0)",
                      xanchor: "right",
                      yanchor: "top",
                      // x: 0,
                      // y: 0.7,
                    },
                  }}
                />
              )}
            </div>
          </article>
          {/* <!-- 버블차트 --> */}
          <div className="close">
            <a title="닫기" onClick={popupCloseHandler}>
              닫기
            </a>
          </div>
          <div className="more">
            <a
              title="더보기"
              onClick={() => loginToSearchModal(searchKeyword.word)}
            >
              더보기
            </a>
          </div>
        </div>
      </div>
      <div id="contents">
        {/*<NotiPopupContainer />*/}
        <div>
          {/*<div className="msearch fadeInUp">*/}
          {/*  <h2 className="skip">검색</h2>*/}
          {/*  <fieldset>*/}
          {/*    <legend>Total Search</legend>*/}
          {/*    <label className="skip">search</label>*/}
          {/*    <div className="text">*/}
          {/*      <Tooltip*/}
          {/*        key={`wordSelectBoxKey_${wordSelectBoxKey}`}*/}
          {/*        visible={tooltipVisible}*/}
          {/*        color="orange"*/}
          {/*        placement="left"*/}
          {/*        title={`자동 완성된 목록에서 선택하세요.*/}
          {/*      목록에 조회 되지 않는 검색어는 "네트워크검색" 메뉴에서 추가 분석 서비스를 이용해 주세요.`}*/}
          {/*      >*/}
          {/*        <SocioGramDemoWordSelectBox*/}
          {/*          placeholder="검색어를 입력하세요."*/}
          {/*          title="검색어를 입력하세요."*/}
          {/*          onChangeWordSelectBox={onChangeWordSelectBox}*/}
          {/*          useEnterEvent={true}*/}
          {/*          getEnterEvent={getEnterEvent}*/}
          {/*        />*/}
          {/*         <div style={{width:"0px"}}>{wordSelectBoxKey}</div> */}
          {/*      </Tooltip>*/}
          {/*       <LimeWordAutocomplete placeholder="검색어를 입력하세요." title="검색어를 입력하세요." getSelectedEvent={getSelectedEvent} /> */}
          {/*    </div>*/}
          {/*     <input type="button" id="Search" value="search" className="search_btn" onClick={searchOnClick} /> */}
          {/*  </fieldset>*/}
          {/*</div>*/}
          <div className="msearch_word fadeInUp" style={{ marginTop: "100px" }}>
            <h2>이슈 키워드</h2>
            <ul>
              {issueList &&
                issueList.map((value, index) => (
                  <li key={"li_" + index}>
                    <a
                      key={"li_a_" + index}
                      className={value === searchKeyword.word ? "active" : null}
                      onClick={() => {
                        issueOnClick(value);
                        return false;
                      }}
                    >
                      {value}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div className="sociogram">
            {/* <NotiPopupContainer /> */}
            <h2 className="skip">소시오그램</h2>
            <div className="fadeInUp fade1">
              <div className="square square1">
                <a
                  className="squaremore"
                  href="#openModal1"
                  onClick={() => popupOpenHandler(FIELD_TYPE.PATENT)}
                >
                  <div className="triangle1">
                    <div className="triangle topleft">
                      <h3>특허</h3>
                      <strong>{patentSocioData.totalCount}</strong>
                    </div>
                  </div>
                </a>
                <div className="square_in">
                  {patentSocioData.socioData && (
                    <SociogramLight
                      ref={sociogramPatentRef}
                      title={"특허 네트워크"}
                      category={FIELD_TYPE.PATENT} // thesis, subject, report
                      socioGramId={"mainTopLeft"}
                      loading={false}
                      sociogramWidth={365}
                      sociogramHeight={410}
                      dataSource={patentSocioData.socioData}
                      drawerVisible={true}
                      toolbarVisible={false}
                      toolbarAlign={"left"}
                      downloadFileName={"특허소시오그램"}
                      clickHandler={nodeClickHandler}
                    />
                  )}
                </div>
                <div className="chart">
                  <div>
                    <SunburstChart
                      title={"특허 IPC 분류"}
                      width={cw}
                      height={ch}
                      dataSource={patentChartData.sunburst}
                    />
                  </div>
                  <div>
                    <WordcloudChart
                      cloudId={`wordCloud_${FIELD_TYPE.PATENT}`}
                      customTopLeft={{ top: 200, left: -25 }}
                      options={{
                        backgroundColor: "rgba(255,0,0,0)",
                        shrinkToFit: true,
                        rotateRatio: 0,
                      }}
                      style={{ width: cw, height: ch }}
                      dataSource={patentChartData.wordcloud}
                      wordClickHandler={patentWordClickEvent}
                      useExcludes={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="fadeInUp fade2">
              <div className="square square2">
                <a
                  className="squaremore"
                  href="#openModal1"
                  onClick={() => popupOpenHandler(FIELD_TYPE.THESIS_NDSL)}
                >
                  <div className="triangle2">
                    <div className="triangle topright">
                      <h3>논문</h3>
                      <strong>{thesisSocioData.totalCount}</strong>
                    </div>
                  </div>
                </a>
                <div className="square_in">
                  {thesisSocioData.socioData && (
                    <SociogramLight
                      ref={sociogramThesisRef}
                      title={"논문 네트워크"}
                      category={FIELD_TYPE.THESIS_NDSL} // thesis, subject, report
                      socioGramId={"mainTopRight"}
                      loading={false}
                      sociogramWidth={365}
                      sociogramHeight={410}
                      dataSource={thesisSocioData.socioData}
                      drawerVisible={true}
                      toolbarVisible={false}
                      toolbarAlign={"left"}
                      downloadFileName={"논문소시오그램"}
                      clickHandler={nodeClickHandler}
                    />
                  )}
                </div>
                <div className="chart">
                  <div>
                    <SunburstChart
                      title={"논문 DDC 분류"}
                      width={cw}
                      height={ch}
                      dataSource={thesisChartData.sunburst}
                    />
                  </div>
                  <div>
                    <WordcloudChart
                      cloudId={`wordCloud_${FIELD_TYPE.THESIS_NDSL}`}
                      customTopLeft={{ top: 200, left: -25 }}
                      options={{
                        backgroundColor: "rgba(255,0,0,0)",
                        shrinkToFit: true,
                        rotateRatio: 0,
                      }}
                      style={{ width: cw, height: ch }}
                      dataSource={thesisChartData.wordcloud}
                      wordClickHandler={thesisWordClickEvent}
                      useExcludes={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="fadeInUp fade3">
              <div className="square square3">
                <a
                  className="squaremore"
                  href="#openModal1"
                  onClick={() => popupOpenHandler(FIELD_TYPE.SUBJECT_NTIS)}
                >
                  <div className="triangle3">
                    <div className="triangle bottomleft">
                      <strong>{subjectNtisSocioData.totalCount}</strong>
                      <h3>
                        국가R&amp;D
                        <br />
                        과제
                      </h3>
                    </div>
                  </div>
                </a>
                <div className="square_in">
                  {subjectNtisSocioData.socioData && (
                    <SociogramLight
                      ref={sociogramSubjectRef}
                      title={"국가R&D 네트워크"}
                      category={FIELD_TYPE.SUBJECT_NTIS} // thesis, subject, report
                      socioGramId={"mainBottomLeft"}
                      loading={false}
                      sociogramWidth={365}
                      sociogramHeight={410}
                      dataSource={subjectNtisSocioData.socioData}
                      drawerVisible={true}
                      toolbarVisible={false}
                      toolbarAlign={"left"}
                      downloadFileName={"국가R&D 소시오그램"}
                      clickHandler={nodeClickHandler}
                    />
                  )}
                </div>
                <div className="chart">
                  <div>
                    <SunburstChart
                      title={"R&D 지원 부처"}
                      width={cw}
                      height={ch}
                      dataSource={subjectNtisChartData.sunburst}
                    />
                  </div>
                  <div>
                    <WordcloudChart
                      cloudId={`wordCloud_${FIELD_TYPE.SUBJECT_NTIS}`}
                      customTopLeft={{ top: 200, left: -25 }}
                      options={{
                        backgroundColor: "rgba(255,0,0,0)",
                        shrinkToFit: true,
                        rotateRatio: 0,
                      }}
                      style={{ width: cw, height: ch }}
                      dataSource={subjectNtisChartData.wordcloud}
                      wordClickHandler={subjectWordClickEvent}
                      useExcludes={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="fadeInUp fade4">
              <div className="square square4">
                <a
                  className="squaremore"
                  href="#openModal1"
                  onClick={() => popupOpenHandler(FIELD_TYPE.PLAYER)}
                >
                  <div className="triangle4">
                    <div className="triangle bottomright">
                      <strong>&nbsp;</strong>
                      <h3>플레이</h3>
                    </div>
                  </div>
                </a>
                <div className="square_in">
                  <div className="title">
                    <ul>
                      <li key="main_player_patent_key">
                        <button
                          key={"main_player_patent"}
                          onClick={() => {
                            playerSortClickHandler(FIELD_TYPE.PATENT);
                          }}
                          className={
                            playerFieldType === FIELD_TYPE.PATENT
                              ? "active"
                              : ""
                          }
                        >
                          특허
                        </button>
                      </li>
                      <li key="main_player_thesis_key">
                        <button
                          key={"main_player_thesis"}
                          onClick={() => {
                            playerSortClickHandler(FIELD_TYPE.THESIS_NDSL);
                          }}
                          className={
                            playerFieldType === FIELD_TYPE.THESIS_NDSL
                              ? "active"
                              : ""
                          }
                        >
                          논문
                        </button>
                      </li>
                      <li key="main_player_ntis_key">
                        <button
                          key={"main_player_ntis"}
                          onClick={() => {
                            playerSortClickHandler(FIELD_TYPE.SUBJECT_NTIS);
                          }}
                          className={
                            playerFieldType === FIELD_TYPE.SUBJECT_NTIS
                              ? "active"
                              : ""
                          }
                        >
                          국가R&D과제
                        </button>
                      </li>
                    </ul>
                  </div>
                  {playerSocio && (
                    <SociogramLight
                      ref={sociogramEtcRef}
                      // title={"네트워크 분석"}
                      category={playerFieldType} // thesis, subject, report
                      socioGramId={"mainBottomRight"}
                      loading={false}
                      sociogramWidth={575}
                      sociogramHeight={410}
                      dataSource={playerSocio}
                      drawerVisible={true}
                      toolbarVisible={false}
                      toolbarAlign={"right"}
                      downloadFileName={"플레이어소시오그램"}
                      clickHandler={nodeClickHandler}
                    />
                  )}
                </div>
                <div className="chart"></div>
              </div>
            </div>
          </div>

          <div className="fadeInUp fade5">
            <div className="main_bottom_curve">
              <h4>연도별 현황</h4>
              <div
                style={{
                  float: "left",
                  padding: "14 0 14 14",
                  boxSizing: "border-box",
                  borderRadius: "5px",
                  margin: "0 auto",
                  background: "#fff",
                  textAlign: "center",
                }}
              >
                <LineCurveChart
                  curveChartId="mainCurve"
                  downloadFileName={searchKeyword.word}
                  width={330}
                  height={245}
                  marginLeft={0}
                  marginRight={0}
                  data={wordCurve}
                />
              </div>
              <div
                style={{
                  float: "left",
                  width: 775,
                  height: 265,
                  padding: 14,
                  boxSizing: "border-box",
                  borderRadius: "5px",
                  marginLeft: 10,
                  background: "#fff",
                  textAlign: "center",
                }}
              >
                <BarChart
                  dataType={"group"}
                  layout={{
                    showlegend: false,
                    legend: {
                      orientation: "h",
                      xanchor: "left",
                      yanchor: "bottom",
                      y: -0.3,
                    },
                    barmode: "stack",
                    autosize: true,
                    margin: {
                      l: 0,
                      r: 0,
                      b: 25,
                      t: 10,
                    },
                    xaxis: {
                      autotick: false,
                      dtick: 2,
                      tick0: 2002,
                    },
                  }}
                  config={{
                    displayModeBar: true,
                    displaylogo: false,
                    scrollZoom: true,
                  }}
                  dataSource={wordCumu}
                />
              </div>

              <div
                style={{
                  clear: "both",
                  textAlign: "center",
                  width: "250px",
                  margin: "0 auto",
                }}
              >
                <table>
                  <colgroup>
                    <col style={{ width: "15px" }}></col>
                    <col></col>
                    <col style={{ width: "15px" }}></col>
                    <col></col>
                    <col style={{ width: "15px" }}></col>
                    <col></col>
                  </colgroup>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          backgroundColor: getCurveStackbarlegendColor("특허"),
                        }}
                      ></td>
                      <td style={{ textAlign: "left", paddingLeft: "5px" }}>
                        특허
                      </td>
                      <td
                        style={{
                          backgroundColor: getCurveStackbarlegendColor("논문"),
                        }}
                      ></td>
                      <td style={{ textAlign: "left", paddingLeft: "5px" }}>
                        논문
                      </td>
                      <td
                        style={{
                          backgroundColor:
                            getCurveStackbarlegendColor("NTIS 과제"),
                        }}
                      ></td>
                      <td style={{ textAlign: "left", paddingLeft: "5px" }}>
                        NTIS 과제
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainIndex;
