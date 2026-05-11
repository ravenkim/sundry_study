import React, { useState, useEffect } from "react";

/**
 * 라임테이블
 *
 * 사용 예시 : features/admin/member/CommMember.js line 137-148, 188-204 참조
 *
 *  @param dataSoruce: 데이터 (json array)
 *  @param keyColName: 데이터(dataSource) 중 key로 쓸 컬럼명
 *  @param useCheckbox: 체크박스 사용유무 (boolean)
 *  @param useExpand: 확장 사용유무(boolean)
 *  @param colName: 컬럼명 (array)
 *  @param dataIndex: 데이터(dataSource) 중 보여줄 컬럼명 (array)
 *  @param checkedItems: 체크된 row key 값 (useState)
 *  @param onSelectAll: 전체 선택(features/admin/member/CommMember.js line 138-141 onSelectAll 참조)
 *  @param onCheckboxChange: 체크박스 함수(features/admin/member/CommMember.js line 142-144 onCheckboxChange 참조)
 *  @param onSelectCancel: 선택 취소 함수
 *  @param onSelectDelete: 선택 삭제 함수
 *  @param onExpand: 확장 함수, keyColName을 props로 사용
 *
 *    const [checkedItems, setCheckedItems] = useState([]);
       const onSelectAll = (keys) => {
          console.log("keys: ",keys);
          checkedItems.length === keys.length ? setCheckedItems([]) : setCheckedItems(keys);
        };
       const onCheckboxChange = (key) => {
          setCheckedItems(checkedItems.includes(key) ? checkedItems.filter(item => item !== key) : [...checkedItems, key]);
        };
       const onSelectCancel = () => {
          setCheckedItems([]);
        };
 *
 * */

const LimeTable = (
  {
    dataSource=[],
    keyColName="id",
    useCheckbox=false,
    useExpand=false,
    colName=[],
    dataIndex=[],
    checkedItems=[],
    onSelectAll,
    onCheckboxChange,
    onSelectCancel,
    onSelectDelete,
    onExpand
  }) => {

  const [allChecked, setAllChecked] = useState(false);
  const keys = dataSource.map(data => data[keyColName]);
  useEffect(() => {
    if (checkedItems.length === keys.length) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  },[checkedItems]);

  return (
    <table>
      {useCheckbox &&
      <caption className="table-indicator" style={{captionSide:"top"}}>
        <span><strong>{dataSource.length}</strong>명의 평가위원 중<strong>{checkedItems.length}</strong>명 선택</span>
        <button type="button" className="delete" onClick={onSelectDelete}>선택삭제</button>
        <button type="button" className="cancel" onClick={onSelectCancel}>선택취소</button>
      </caption>
      }
      <thead>
        <tr>
          {useCheckbox &&
            <th className="table-check">
              <input
                type="checkbox"
                onChange={() => onSelectAll(keys)}
                checked={allChecked}
              />
            </th>
          }
          {colName.map((col) =>
            <th>{col}</th>
          )}
        </tr>
      </thead>
      <tbody>
      {dataSource.map((data) =>
        <tr>
          {useCheckbox &&
          <td className="table-check">
            <input
              type="checkbox"
              checked={checkedItems.includes(data[keyColName]) ? true : false}
              onChange={() => onCheckboxChange(data[keyColName])}
            />
          </td>
          }
          {dataIndex.map((index) =>
          <td>{data[index]}</td>
          )}
          {useExpand &&
          <td className={`table-arrow-down`} onClick={() => onExpand(data[keyColName])}></td>
          }
        </tr>
      )}
      </tbody>
    </table>
  )
};

export default LimeTable;