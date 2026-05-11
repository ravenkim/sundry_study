import React from "react";

const MemberTable = (
  {
    memberData,
    memberSelectHandler,
    resetHandler,
    selectedMemberKey
  }) => {
  return (
    <>
    <hr className="mtb-24"/>
    {/*타이틀2*/}
    <div className="flex-row items-center mb-8">
      <h4>검색 결과</h4>
      <button type="button" className="btn-size-32" onClick={resetHandler}>
        <span className="mdi mdi-refresh text-icon-20"/>
      </button>
    </div>

    {/*테이블*/}
    <div className="table-wrap" style={{height: "calc(100vh - 301px)"}}>
      <table className="striped">
        <colgroup>
          <col width="20%"/>
          <col width="30%"/>
          <col width="13%"/>
          <col width="25%"/>
          <col width="12%"/>
        </colgroup>
        <thead>
        <tr>
          <th>ID</th>
          <th>이메일</th>
          <th>성명</th>
          <th>소속기관</th>
          <th className="text-center">권한</th>
        </tr>
        </thead>
        <tbody id="tbody-for2" className={'tbody'}>
        {memberData &&
        memberData.map((data) =>
          <tr
            className={selectedMemberKey === data.id ? 'bg-light-blue' : ''}
            key={data.id}
            onClick={() => memberSelectHandler(data.id)}
            style={{cursor: 'pointer'}}
          >
            <td title="ID">{data.username}</td>
            <td title="email">{data.email}</td>
            <td title="name">{data.name}</td>
            <td title="blngOrgnNm">{data.blngOrgnNm ? data.blngOrgnNm : "없음"}</td>
            <td className="text-center"><span className={`badge-${data.isAdmin ? "orange" : "green"}`}>{data.isAdmin ? "관리자" : "사용자"}</span></td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default MemberTable;
