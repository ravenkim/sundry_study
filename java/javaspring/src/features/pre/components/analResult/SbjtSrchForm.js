import React, {useEffect, useState} from 'react';
import locale from "antd/es/date-picker/locale/ko_KR";
import {Alert, DatePicker, message, Modal, Select, Spin, Tooltip} from "antd";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {preEvalAction} from "../../preEvalReducer";

const {RangePicker} = DatePicker;

const SbjtSrchForm = ({setEvalResult, setIsPreEvalClicked}) => {
  const dispatch = useDispatch();

  const {
    getEvalAncmList,
    getAncmCmitList,
    evalSbjt,
    evalSbjtLoading
  } = useSelector(({preEvalReducer}) => ({
    getEvalAncmList: preEvalReducer.getEvalAncmList.data,
    getAncmCmitList: preEvalReducer.getAncmCmitList.data,
    evalSbjt: preEvalReducer.evalSbjt.data,
    evalSbjtLoading: preEvalReducer.evalSbjt.loading,
  }));

  const [searchForm, setSearchForm] = useState({
    searchStrDt: moment().startOf('year').format("YYYYMMDD"),
    searchEndDt: moment().endOf('year').format("YYYYMMDD"),
    ancmYy: moment().format("YYYY"),
    ancmId: null,
    cmitId: null,
  });


  useEffect(() => {
    dispatch(preEvalAction.getEvalAncmList({ancmYy: moment().format("YYYY")}));
    return () => {
      dispatch(preEvalAction.initializeAll());
    }
  }, [])

  const [selectedRowId, setSelectedRowId] = useState('');
  const [rowItem, setRowItem] = useState();

  /**
   * 검색기간 Change handler
   * @param range
   */
  const dateChangeHandler = (range) => {

    if (range) {
      setSearchForm((prev) => ({
        ...prev,
        searchStrDt: moment(range[0]).format("YYYYMMDD"),
        searchEndDt: moment(range[1]).format("YYYYMMDD"),
      }))
    } else {
      setSearchForm((prev) => ({
        ...prev,
        searchStrDt: null,
        searchEndDt: null,
      }))
    }
  }

  /**
   * 사업연도 Change handler
   * @param value
   */
  const getAncmYyChangeHandler = (value) => {

    let yearValue = value ? moment(value).format("YYYY") : null;
    //if (isDiff(value, searchForm.getEvalAncmList)) {

    yearValue && dispatch(preEvalAction.getEvalAncmList({ancmYy: yearValue}));

    dispatch(preEvalAction.initialize("getAncmCmitList"));

    setSearchForm((prev) => ({
      ...prev,
      searchStrDt: yearValue ? moment([yearValue]).startOf('year').format("YYYYMMDD") : null,
      searchEndDt: yearValue ? moment([yearValue]).endOf('year').format("YYYYMMDD") : null,
      ancmYy: yearValue,
      ancmId: null,
      cmitId: null,
    }));

    //}

  }

  /**
   * 사업공고 Change handler
   * @param value
   */
  const getEvalAncmChangeHandler = (value) => {

    if (isDiff(value, searchForm.getEvalAncmList)) {

      value && dispatch(preEvalAction.getAncmCmitList({ancmId: value}));

      dispatch(preEvalAction.initialize("getAncmCmitList"));

      setSearchForm((prev) => ({
        ...prev,
        ancmId: value,
        cmitId: null,
      }));

    }

  }

  /**
   * 분과선택 Change handler
   * @param value
   */
  const getAncmCmitChangeHandler = (value) => {

    setSearchForm((prev) => ({
      ...prev,
      cmitId: value
    }));

    setSelectedRowId('');
    setEvalResult({ancmId: searchForm.ancmId});
    setIsPreEvalClicked(true);
    searchEvalSbjtListHandler(value);
  }

  /**
   * 평가과제 조회 handler
   */
  const searchEvalSbjtListHandler = (value) => {
    if (validateSearchConditionHandler()) {
      Modal.error({title: "검색기간 혹은 사업을 선택해주세요.", okText: "확인"})
      return;
    }

    dispatch(preEvalAction.initialize("orgnList"));
    dispatch(preEvalAction.initialize("getSbjtPreEvalList"));
    dispatch(preEvalAction.getEvalSbjt({...searchForm, cmitId: value}));
  }

  /***************************************************************************
   * 평가과제
   ***************************************************************************/


  const sbjtRowClickHandler = (item) => {

    const rowId = item?.rowId;

    if (rowId !== selectedRowId) {
      setSelectedRowId(rowId);
      setRowItem(item);
    }
    setIsPreEvalClicked(true);
  }

  // const selectPreEval = () => {
  //   dispatch(preEvalAction.getOrgnList({orgnId: evalSbjt[0].orgnId, sbjtId: evalSbjt[0].sbjtId}));
  //
  //   sbjtRowClickHandler(evalSbjt[0]);
  //   setIsPreEvalClicked(true);
  // }

  useEffect(() => {
    dispatch(preEvalAction.initialize("orgnList"));
    if (selectedRowId) {
      setEvalResult({
        ancmId: searchForm.ancmId,
        cmitId: searchForm.cmitId,
        orgnId: rowItem.orgnId,
        sbjtId: rowItem.sbjtId
      });
    }
  }, [selectedRowId])

  /***************************************************************************
   * util handler
   ***************************************************************************/

  const validateSearchConditionHandler = () => {
    return !(searchForm.ancmYy && searchForm.searchStrDt && searchForm.searchEndDt && (searchForm.ancmId || searchForm.cmitId));
  }

  const isDiff = (target, diffTarget) => {
    return target !== diffTarget;
  }

  return (
    <div className="grid-col-5 mt-8 mb-16">
      <div className="grid-left col-span-2 rounded-tr-0 rounded-br-0 ptb-40 plr-16">
        <div className="grid-col-5">
          <div className="form-label-text">사업연도</div>
          {/*// <!-- 안트디 select 적용 시, className="col-span-5" 추가해야함 -->*/}
            <div className="ant-datepicker col-span-4" style={{border: "1px solid #E5E7EB", borderRadius: "7px"}}>
              <DatePicker locale={locale} onChange={getAncmYyChangeHandler} picker="year" value={searchForm.ancmYy ? moment(searchForm.ancmYy) : null} />
            </div>
        </div>
        <div className="grid-col-5 mtb-8">
          <div className="form-label-text">사업기간</div>
          {/*// <!-- 날짜 (class="ant-datepicker col-span-4" 안쪽에 있는 div들은 삭제. 안트디 적용시, col-span-4 추가해야함) -->*/}
          <div className="ant-datepicker col-span-4" style={{border: "1px solid #E5E7EB", borderRadius: "7px"}}>
            <RangePicker locale={locale} onChange={dateChangeHandler}
                         value={[searchForm.searchStrDt ? moment(searchForm.searchStrDt) : null, searchForm.searchEndDt ? moment(searchForm.searchEndDt) : null]}/>
          </div>
        </div>
        <div className="grid-col-5 mtb-8">
          <div className="form-label-text">사업공고</div>
          {/*// <!-- 안트디 select 적용 시, className="col-span-5" 추가해야함 -->*/}

          <Select className={"col-span-4"} onChange={getEvalAncmChangeHandler}
                  value={searchForm.ancmId} placeholder={"선택해주세요"}>
            {
              getEvalAncmList && getEvalAncmList.map((item, idx) =>
                (
                  <Select.Option key={idx} value={item.ancmId}>
                    {item.ancmTlNm}
                  </Select.Option>
                )
              )
            }
          </Select>

        </div>
        <div className="grid-col-5">
          <div className="form-label-text">분과선택</div>
          {/*// <!-- 안트디 select 적용 시, className="col-span-5" 추가해야함 -->*/}

          <Select className={"col-span-4"} onChange={getAncmCmitChangeHandler}
                  value={searchForm.cmitId} placeholder={"선택해주세요"}>
            {
              getAncmCmitList && getAncmCmitList.map((item, idx) =>
                (
                  <Select.Option key={idx} value={item.cmitId}>
                    {item.cmitNm}
                  </Select.Option>
                )
              )
            }
          </Select>

        </div>
      </div>
      {/*// <!-- grid-left(레이아웃 왼쪽) End -->*/}

      <div className="grid-right col-span-3 rounded-tl-0 rounded-bl-0 ptb-0 border-box" style={{height: "280px"}}>
        <Spin spinning={evalSbjtLoading}>
          {
            evalSbjt ?
              <>
                {
                  evalSbjt.length > 0 ?
                    <>
                      <div className="table-indicator pt-8 pb-4">
                        <span><strong>{evalSbjt.length}</strong>개의 <b>평가과제</b>가 존재합니다.</span>
                      </div>
                      <hr className="w-full mtb-0"/>
                      <div className="table-wrap" style={{height: "237px"}}>
                        <table className="striped">
                          <colgroup>
                            <col width="30%"/>
                            <col width="20%"/>
                            <col width="20%"/>
                            <col width="15%"/>
                            <col width="15%"/>
                          </colgroup>
                          <thead>
                          <tr>
                            <th className="text-center">과제명</th>
                            <th className="text-center">신청기관</th>
                            <th className="text-center">기술분류</th>
                            <th className="text-center">사업시작기간</th>
                            <th className="text-center">사업종료기간</th>
                          </tr>
                          </thead>
                          <tbody id="tbody">
                          {evalSbjt.map((item, idx) =>
                            <tr className={selectedRowId === item.rowId ? "bg-light-blue" : ""}
                                key={idx} onClick={() => sbjtRowClickHandler(item)}
                                style={{cursor: "pointer"}}>
                              <td>{item.sbjtNm}</td>
                              <td>{item.orgnNm}</td>
                              <td>{item.teclNm}</td>
                              <td>{moment(item.totDvlpSrtYmd).format('YYYY-MM-DD')}</td>
                              <td>{moment(item.totDvlpEndtYmd).format('YYYY-MM-DD')}</td>
                            </tr>
                          )}
                          </tbody>
                        </table>
                      </div>
                    </>
                    :
                    <div className="frame-cont bg-white" style={{height: "278px"}}>
                      <div className="flex-col items-center">
                        <span className="mdi mdi-playlist-check text-primary mb-24" style={{fontSize: "60px"}}/>
                        <p className="text-14-m text-gray-400">평가과제가 존재하지 않습니다.</p>
                      </div>
                    </div>
                }
              </>
              :
              <div className="frame-cont bg-white" style={{height: "278px"}}>
                <div className="flex-col items-center">
                  <span className="mdi mdi-playlist-check text-primary mb-24" style={{fontSize: "60px"}}/>
                  <p className="text-14-m text-gray-400">평가과제를 선택하면 과제리스트를 확인할 수 있습니다.</p>
                </div>
              </div>
          }
        </Spin>


        {/* <hr className="w-full mtb-0"/> */}
        {/* <button type="button" className="btn-secondary-40 w-full mt-16" onClick={() => selectPreEval()} disabled={evalSbjt && evalSbjt.length > 0 ? false : true}>예비평가 조회하기</button> */}
      </div>
      {/*// <!-- grid-right(레이아웃 오른쪽) End -->*/}
    </div>
  )
};

export default SbjtSrchForm;