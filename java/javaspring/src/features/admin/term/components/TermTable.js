import React, { useEffect, useState } from "react";
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons'

const TermTable = (
  {
    initialValues,

    termType,
    title,

    pageHandler,
    selectedPage,
    totalPages,

    totalCount,

    selectedRow,
    selectAllHandler,
    selectChangeHandler,
    selectCancelHandler,

    termDeleteHandler,
    termMultiDeleteHandler,
  }) => {

  const [termData, setTermData] = useState([]);

  const [firstData, setFirstData] = useState("");
  const [secondData, setSecondData] = useState("");
  const [secRequired, setSecRequired] = useState(false);

  const [columnName, setColumnName] = useState(["용어", ""]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [checked, setChecked] = useState(false);
  const [currentPageKeys, setCurrentPageKeys] = useState([]);
  useEffect(() => {
    if (selectedRow) {
      const rowKeys = selectedRow.map((row) => row.id);
      setSelectedRowKeys(rowKeys);
    }
  },[selectedRow])

  useEffect(() => {
    if (selectedRowKeys && currentPageKeys) {
      const currentPageChecked = currentPageKeys.map((row) => {
        if (selectedRowKeys.includes(row)) {
          return true
        } else {
          return false
        }
      })
      currentPageChecked.filter(t => t !== false).length === 30 ? setChecked(true) : setChecked(false);
    }
  },[selectedRowKeys, currentPageKeys]);

  useEffect(() => {
    if (initialValues && initialValues.results) {
      const termDataCopy = initialValues.results
      setCurrentPageKeys(initialValues.results.map((data) => data.id));
      try {
        const termDataCopied = termDataCopy.map(t => ({...t}));
        termDataCopied.map(t2 => t2.type = termType);


        if (termDataCopied.length > 0) {
          setFirstData(Object.keys(termDataCopied[0])[1]);

          if (termType === "compound") {
            setSecondData(Object.keys(termDataCopied[0])[2]);
          } else if(termType === "synonym" || termType === "representative") {
            setSecondData(Object.keys(termDataCopied[0])[2]);
          }
        }        
        switch (termType) {
            default:
                setColumnName(["용어",""]);
                setSecRequired(false);
                break;
            case "compound":
                setColumnName(["복합어","복합어의 구성 용어"]);
                setSecRequired(true);
                break;
            case "synonym":
                setColumnName(["용어","용어의 동의어"]);
              setSecRequired(true);
                break;
            case "representative":
                setColumnName(["대표어","변환대상용어"]);
                setSecRequired(true);
                break;
        }
        setTermData(termDataCopied);
      } catch(e) {
        console.error(e);
      }
    }
  }, [initialValues, selectedPage]);

  const [pageList, setPageList] = useState([1,2,3,4,5]);
  useEffect(() => {
    if (totalPages) {
      if (totalPages >= 5) {
        if (selectedPage <= 3) {
          setPageList([1,2,3,4,5]);
        } else if(selectedPage > 3 && selectedPage <=totalPages-2) {
          setPageList([selectedPage-2, selectedPage-1, selectedPage, selectedPage+1, selectedPage+2]);
        } else if (selectedPage >= totalPages -2 && selectedPage <=totalPages -1) {
          setPageList([selectedPage-2, selectedPage-1, selectedPage, selectedPage+1])
        } else {
          setPageList([selectedPage-2, selectedPage-1, selectedPage])
        }
      } else {
        const pageArray = [...Array(totalPages + 1)].map((v,i) => i);
        const pages = pageArray.filter((page) => page > 0);
        setPageList(pages);
      }
    }

  },[selectedPage, totalPages]);

  return (
    <>
      <hr className="mtb-24"/>
      {/*타이틀 2*/}
      <div className="flex-row items-center">
        <h4>{title} 검색 결과</h4>
        {/*<button type="button" className="btn-size-32">*/}
        {/*  <span className="mdi mdi-refresh text-icon-20"></span>*/}
        {/*</button>*/}
        <div className="pagenation ml-auto">
          <button
            type={'button'}
            className={'btn-size-32'}
            onClick={() => pageHandler(1)}
          ><DoubleLeftOutlined /></button>
          <button
            type="button"
            className="btn-size-32 btn-pre"
            onClick={() => pageHandler(selectedPage -1)}
          />
          {pageList.map((page) => (
            <button
              type="button"
              className={`btn-size-32 dynamic-page ${page === selectedPage ? 'active' : ''}`}
              onClick={() => pageHandler(page)}
              key={page}
            >{page}
            </button>
          ))
          }
          <button
            type="button"
            className="btn-size-32 btn-next"
            onClick={() => pageHandler(selectedPage + 1)}
          />
          <button
            type={'button'}
            className={'btn-size-32'}
            onClick={() => pageHandler(totalPages)}
          ><DoubleRightOutlined /></button>
        </div>
      </div>

      {/*테이블 인디케이터*/}
      <div className="table-indicator pt-16 pb-8">
        <span><b>{totalCount}</b>개의 용어 중 <strong>{selectedRow.length}</strong>개 선택</span>
        <button type="button" className="delete" onClick={termMultiDeleteHandler}>선택삭제</button>
        <button type="button" className="cancel" onClick={selectCancelHandler}>선택취소</button>
      </div>
      {/*테이블*/}
      <div className="table-wrap" style={{height: "calc(100vh - 331px)"}}>
        <table className="striped">
          <thead>
            <tr>
              <th className="table-check">
                <input
                  type="checkbox"
                  onChange={() => selectAllHandler(termData)}
                  checked={checked}
                />
              </th>
              <th>용어 타입</th>
              <th>{columnName[0]}</th>
              {secRequired &&
                <th>{columnName[1]}</th>
              }
              <th></th>
            </tr>
          </thead>
          <tbody id="tbody-for">
          {termData && termData.map((data) => (
            <tr key={data.id}>
              <td className="table-check">
                <input
                  type="checkbox"
                  checked={!!selectedRowKeys.includes(data.id)}
                  onChange={() => selectChangeHandler(data)}
                />
              </td>
              <td name={"용어 타입"}>{title}</td>
              <td name={columnName[0]}>{data[firstData]}</td>
              {secRequired &&
              <td name={columnName[1]}>{data[secondData]}</td>
              }
              <td className="overflow-visible text-right ptb-4">
                <span className="flex-row-cont">
                  <button
                    type="button"
                    className="btn-system-red-32 plr-16"
                    onClick={() => termDeleteHandler(data.id)}
                  >삭제
                  </button>
                </span>
              </td>
            </tr>
          ))
          }
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TermTable;
