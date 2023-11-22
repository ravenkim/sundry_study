import React, { useEffect, useState } from "react";
import { notification } from "antd";

const MenuForm = ({
  initialValues,
  submitHandler,
  deleteHandler,
  updateHandler,
  group
}) => {
  const formDataFrame = {
    menuId: null,
    menuNm: null,
    menuPath: null,
    iconNm: null,
    indctYn: null,
    useYn: null,
    delYn: null,
    lastModfMemberId: null,
    frstRegMemberId: null,
    hirkMenuId: null,
    groups: []
  }
  const [formData, setFormData] = useState(formDataFrame);
  const [disabled, setDisabled] = useState(true);
  const [allGroups, setAllGroups] = useState([]);
  const [menuAuthData, setMenuAuthData] = useState([]);

  useEffect(() => {
    if (initialValues) {
      setChecked(initialValues.useYn === "Y");
      setFormData(initialValues);
      setDisabled(false);
      setMenuAuthData(initialValues.groups);
      if (initialValues.groups) {
        const crntGroup = initialValues.groups.map((group) => group.authGroupId);
        setAllGroups(initialValues.allGroups.filter((group) => !crntGroup.includes(group.id)));
      } else {
        setAllGroups(group);
      }
    } else {
      setDisabled(true);
      setFormData(formDataFrame);
      setMenuAuthData([]);
    }
  }, [initialValues]);

  const [checked, setChecked] = useState();

  const radioCheckHandler = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      useYn: value
    }))
    setChecked(value === "Y")
  };

  const wordChangeHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name] : e.target.value
    }));
  };

  const openNotification = (type, msg, desc) => {
    notification[type]({
      message: msg,
      description: desc,
      placement: "bottomRight"
    })
  };

  const [modalVisible, setModalVisible] = useState(false);
  const addMenuAuthHandler = () => {
    setModalVisible(true);
  };
  const modalCancelHandler = () => {
    setModalVisible(false);
  };
  const [checkboxData, setCheckboxData] = useState([]);
  const checkboxChangeHandler = (group) => {
    checkboxData.includes(group) ? setCheckboxData(checkboxData.filter((data) => data.id !== group.id)) : setCheckboxData([...checkboxData, group]);
  };
  const checkAllHandler = () => {
    checkboxData.length < allGroups.length ? setCheckboxData(allGroups) : setCheckboxData([]);
  };

  const addAuthHandler = () => {
    const data = checkboxData.map((data) => {
      return {
        authGroupId: data.id,
        name: data.desc,
        frstRegDt: null
      }
    })
    menuAuthData ?
      setMenuAuthData([...menuAuthData, ...data])
      :
      setMenuAuthData([...data])
    setModalVisible(false);
    setAllGroups(allGroups.filter((group) => !checkboxData.includes(group)));
    setCheckboxData([]);
  };

  const deleteAuthHandler = (id) => {
    setMenuAuthData(menuAuthData.filter((data) => data.authGroupId !== id));
    const excludeId = menuAuthData.map((group) => group.authGroupId).filter((groupId) => groupId !== id );
    setAllGroups(initialValues.allGroups.filter((group) => !excludeId.includes(group.id)));
  };

  return (
    <form id={"menuForm"}>
      <div className="flex-row gap-16 mb-16 items-center">
        <h4>메뉴 그룹 추가</h4>
        <button
          type="button"
          className="btn-system-red-32 ml-auto plr-40"
          onClick={() => deleteHandler(formData.menuId)}
          disabled={!formData.menuId}
        >삭제하기</button>
        {formData.menuId ?
          <button
            type="button"
            className="btn-primary-32 plr-40"
            onClick={() => {
              formData.menuNm && formData.menuPath ? updateHandler(formData, menuAuthData) : openNotification("error", "필수 항목을 입력해주세요.");
            }}
          >수정하기</button>
          :
          <button
            type="button"
            className="btn-primary-32 plr-40"
            disabled={disabled}
            onClick={() => {
              formData.menuNm && formData.menuPath ? submitHandler(formData, menuAuthData) : openNotification("error", "필수 항목을 입력해주세요.");
            }}
          >저장하기</button>
        }
      </div>

      <div className="grid-col-2 gap-16">
        <div>
          <div className="form-label-text">상위공통메뉴</div>
          <input
            type="text"
            className="mtb-8"
            value={formData.hirkMenuId ? formData.hirkMenuId : ""}
            disabled
          />
        </div>
        <div>
          <div className="form-label-text">공통메뉴</div>
          <input
            type="text"
            className="mtb-8"
            value={formData.menuId === null ? "" : formData.menuId}
            disabled
          />
        </div>
        <div>
          <div className="form-label-text">메뉴명<p className="text-red">필수</p></div>
          <input
            type="text"
            className="mt-8"
            placeholder={"메뉴명을 입력하세요."}
            value={formData.menuNm === null ? "" : formData.menuNm}
            name={"menuNm"}
            onChange={(e) => wordChangeHandler(e)}
            required
            maxLength={50}
            disabled={disabled}
          />
        </div>
        <div>
          <div className="form-label-text">경로<p className="text-red">필수</p></div>
          <input
            type="text"
            className="mt-8"
            placeholder={""}
            value={formData.menuPath === null ? "" : formData.menuPath}
            name={"menuPath"}
            onChange={(e) => wordChangeHandler(e)}
            maxLength={100}
            required
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid-col-2 mt-24">
        <div className="flex-row">
          <div className="form-label-text">사용여부</div>
          <div className="radio-box-type ml-auto flex-row gap-16">
            <input
              type="radio"
              name="group"
              value={"Y"}
              id="radio-box-type-1"
              checked={checked}
              disabled={disabled}
              onChange={() => radioCheckHandler("Y")}
            />
            <label htmlFor="radio-box-type-1">사용</label>
            <input
              type="radio"
              name="group"
              value={"N"}
              id="radio-box-type-2"
              checked={!checked}
              disabled={disabled}
              onChange={() => radioCheckHandler("N")}
            />
            <label htmlFor="radio-box-type-2">미사용</label>
          </div>
        </div>
      </div>
      <hr className="mt-24 mb-16"/>
        <div className="flex-row gap-16 mb-16 relative">
          <h4>권한 관리</h4>
          <button
            type="button"
            className="btn-secondary-32 ml-auto"
            onClick={addMenuAuthHandler}
            disabled={disabled}
          >권한 추가</button>
          {modalVisible &&
          <div className="modal-pop show" id="modal-pop" style={{top: "36px"}}>
            <div className="title">
              <h3>부여할 권한 선택</h3>
              <button type="button" className="close" onClick={modalCancelHandler}/>
            </div>
            <div className="table-wrap mb-8 auth-pop-only">
              <table>
                <thead>
                <tr key={"auth"}>
                  <th className="table-check">
                    <input
                      type="checkbox"
                      onChange={checkAllHandler}
                      value={"setAll"}
                      checked={checkboxData.length === allGroups.length}
                    />
                  </th>
                  <th>권한명</th>
                </tr>
                </thead>
                <tbody>
                {allGroups.length > 0 ?
                  allGroups.map((group) =>
                    <tr key={group.id}>
                      <td className="table-check"><input type="checkbox" onChange={() => checkboxChangeHandler(group)} value={group.id} checked={checkboxData.includes(group)} /></td>
                      <td>{group.desc}</td>
                    </tr>
                  )
                  :
                  <td colSpan="2">추가 부여할 권한이 없습니다.</td>
                }
                </tbody>
              </table>
            </div>
            {/*선택 전과 선택 후 button 상태 disabled*/}
            <button type="button" className="btn-primary-40 w-full" onClick={addAuthHandler}>선택완료</button>
          </div>
          }
        </div>

        <div className="table-wrap" style={{height: "calc(100vh - 481px)"}}>
          <table className="striped">
            <colgroup>
              <col width="10%"/>
              <col width="40%"/>
              <col width="40%"/>
              <col width="" />
            </colgroup>
            <thead>
            <tr>
              <th>NO</th>
              <th>권한</th>
              <th>권한부여일자</th>
              <th/>
            </tr>
            </thead>
            <tbody id="tbody-for">
            {menuAuthData && menuAuthData.map((group, index) => {
              return (
                <tr key={index}>
                  <td title="NO">{index+1}</td>
                  <td title="권한">{group.name}</td>
                  <td title="권한부여일자">{group.frstRegDt}</td>
                  <td className="table-btn">
                    <button
                      type="button"
                      className="btn-system-red-32 plr-16"
                      onClick={() => deleteAuthHandler(group.authGroupId)}
                    >삭제</button>
                  </td>
                </tr>
              )
            })
            }
            </tbody>
          </table>
        </div>
    </form>
  );
};

export default MenuForm;
