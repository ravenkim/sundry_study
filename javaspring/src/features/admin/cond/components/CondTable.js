import React, {useEffect, useState} from 'react';
import moment from 'moment';

const CondTable = (
  {
    dataSource=[],
    selectRowHandler,
    insertFormVisible
  }) => {

  const [rowKey, setRowKey] = useState();

  useEffect(() => {
    if (insertFormVisible) {
      setRowKey("")
    }
  },[insertFormVisible]);

  return (
    <div className="table-wrap" style={{height: "calc(100vh - 150px)"}}>
      <table className="striped">
        <colgroup>
          <col width="60%"/>
          <col width="20%"/>
          <col width="20%"/>
        </colgroup>
        <thead>
        <tr>
          <th>조건 명칭</th>
          <th className={'text-center'}>등록일</th>
          <th className="text-center">사용여부</th>
        </tr>
        </thead>
        <tbody id="tbody-for" className="tbody">
        {dataSource && dataSource.map((data) => {
          return (
            <tr className={rowKey === data.recoCondId ? "bg-light-blue" : ""}
                onClick={() => {selectRowHandler(data.recoCondId);setRowKey(data.recoCondId);}}
                key={data.recoCondId}
                style={{cursor: 'pointer'}}
            >
              <td>{data.recoCondNm}</td>
              <td className={'text-center'}>{moment(data.frstRegDt).format('YYYY-MM-DD')}</td>
              <td className="text-center">{data.useYn === 'Y' ? '사용' : '미사용'}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
  )
};

export default CondTable;