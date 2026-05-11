import React, { useState, useEffect } from 'react';
import {notification} from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const MemberForm = ({

  initialValues,
  memberInsertHandler,
  memberDeleteHandler,
  memberUpdateHandler,
  formDataFrame,
  insertVisible,
}) => {

  const [formData, setFormData] = useState(formDataFrame);
  const [groups, setGroups] = useState([]);
  const [auth, setAuth] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [checked, setChecked] = useState();
  const [ipTableVisible, setIpTableVisible] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
      setGroups(initialValues.groups);
      const groupId = initialValues.groups.map((group) => group.id);
      groupId.includes(1) ? setIpTableVisible(true) : setIpTableVisible(false);
      if (initialValues.allGroups) {
        setAllGroups(
          initialValues.allGroups.map((group) => {
            return {
              id: group.id,
              name: group.desc,
              checked: false
            }
          })
        );
      }
      setDisabled(false);
      setChecked(initialValues.useYn === "Y")
    } else {
      setDisabled(true);
      setFormData(formDataFrame);
      setAuth();
    }
  },[initialValues]);

  useEffect(() => {
    if (groups) {
      const groupId = groups.map((group) => group.id)
      setAuth(groups.map((group, index) => {
        return {
          no: index+1,
          key: group.id,
          name: initialValues.allGroups[group.id-1].desc,
          grtAuthDt: group.grtAuthDt
        }
      }));
      setAllGroups(allGroups.filter((group) => !groupId.includes(group.id)));
      setFormData((prevState) => ({
        ...prevState,
        groups: groups,
        isAdmin: groupId.includes(1)
      }))
    }
  },[groups])

  const deleteMemberAuthHandler = (key) => {
    setGroups(groups.filter(group => group.id !== key));
    setAllGroups(
      initialValues.allGroups.map((group) => {
        return {
          id: group.id,
          name: group.desc,
          checked: false
        }
      })
    );
  };

  const [authModalVisible, setAuthModalVisible] = useState(false);
  const addMemberAuthHandler = () => {
    setAuthModalVisible(true);
  };
  const authModalCancelHandler = () => {
    setAuthModalVisible(false);
  };
  const [checkboxKey, setCheckboxKey] = useState([]);
  const checkboxChangeHandler = (group) => {
    !group.checked && !checkboxKey.includes(group.id) ? setCheckboxKey([...checkboxKey, group.id]) : setCheckboxKey(checkboxKey.filter((key) => key !== group.id));
    setAllGroups(allGroups.map((g) => {
      return {
        id: g.id,
        name: g.name,
        checked: g.id === group.id ? !g.checked : g.checked
      }
    }));
  };
  const checkAllHandler = () => {
    if (checkboxKey.length === allGroups.length) {
      setCheckboxKey([]);
      setAllGroups(
        allGroups.map((group) => {
          return {
            id: group.id,
            name: group.name,
            checked: false
          }
        })
      );
    } else {
      const groupKey = allGroups.map((group) => group.id);
      setCheckboxKey(groupKey);
      setAllGroups(
        allGroups.map((group) => {
          return {
            id: group.id,
            name: group.name,
            checked: true
          }
        })
      );
    }
  };
  const addAuthHandler = () => {
    const newGroup = checkboxKey.map((key) => {
      return {
        id: key,
        grtAuthDt: null
      }
    })
    setGroups([...groups, ...newGroup]);
    setAuthModalVisible(false);
    setCheckboxKey([]);
  };


  const wordChangeHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const radioCheckHandler = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      useYn: value
    }))
    setChecked(value === "Y")
  };

  const openNotification = (type, msg, desc) => {
    notification[type]({
      message: msg,
      description: desc,
      placement: "bottomRight"
    })
  };

  const [ipModalVisible, setIpModalVisible] = useState(false);
  const addMemberIPHandler = () => {
    setIpModalVisible(true);
  };
  const ipModalCancelHandler = () => {
    setIpModalVisible(false);
    setIpAddr();
  };

  const [ipAddr, setIpAddr] = useState();
  const ipChangeHandler = (value) => {
    setIpAddr(value);
  };

  const deleteIpHandler = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      ip: formData.ip.filter((data) => data.ipAddr !== value)
    }))
  }

  const addIpHandler = () => {
    let ipFormat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipFormat.test(ipAddr)) {
      return openNotification('error', '유효한 IP 주소를 입력하십시오.');
    }
    const data = {
      ipAddr: ipAddr
    };
    const crntIp = formData.ip.map((data) => data.ipAddr);
    crntIp.includes(ipAddr) ?
      openNotification('warning', '중복된 IP입니다.')
    :
    setFormData((prevState) => ({
      ...prevState,
      ip: [...prevState.ip, data]
    }));
    setIpModalVisible(false);
    setIpAddr();
  };

  const [confirm, setConfirm] = useState(false);
  useEffect(() => {
    formData.ed && formData.nd && formData.ud && formData.pd ? setConfirm(true) : setConfirm(false);
  },[formData]);

  const pressEnterHandler = (e) => {
    if (e.key === 'Enter') {
      addIpHandler();
    }
  };
  const [viewPwd, setViewPwd] = useState(false);
  const viewPassword = () => {
    setViewPwd(!viewPwd);
  };


    return (
        <form onSubmit={() => memberUpdateHandler(formData)}>
        <div className="flex-row gap-16 mb-16 items-center">
          <h4>{`회원 ${insertVisible ? '추가하기' : '상세정보'}`}</h4>
          <button
            type="button"
            className="btn-system-red-32 ml-auto plr-40"
            onClick={() => {memberDeleteHandler(formData.id);}}
            disabled={!!insertVisible || disabled}
          >삭제하기
          </button>
          {insertVisible ?
            <button
              type="button"
              className="btn-primary-32 plr-40"
              onClick={() => {
                confirm ? memberInsertHandler(formData) : openNotification("error", "필수 항목을 입력해주세요.")
              }}
              disabled={disabled}
            >추가하기
            </button>
            :
            <button
              type="button"
              className="btn-primary-32 plr-40"
              onClick={() => {
                confirm ? memberUpdateHandler(formData) : openNotification("error", "필수 항목을 입력해주세요.")
              }}
              disabled={disabled}
            >저장하기
            </button>
          }
        </div>

        <div className="grid-col-2 gap-16">
          <div>
            <div className="form-label-text">성명<p className="text-red">필수</p></div>
              <input
                type="text"
                className="mtb-8"
                value={formData.nd}
                name={"nd"}
                onChange={(e) => wordChangeHandler(e)}
                disabled={disabled}
                required
                maxLength={30}
                placeholder={'성명을 입력하세요.'}
              />
          </div>
          <div>
            <div className="form-label-text">이메일<p className="text-red">필수</p></div>
              <input
                type="text"
                className="mtb-8"
                value={formData.ed}
                name={"ed"}
                onChange={(e) => wordChangeHandler(e)}
                disabled={disabled}
                required
                maxLength={50}
                placeholder={'이메일을 입력하세요.'}
              />
          </div>
            <>
              <div>
                <div className="form-label-text">ID<p className="text-red">필수</p></div>
                <input
                  type="text"
                  className="mtb-8"
                  value={formData.ud}
                  name={"ud"}
                  onChange={(e) => wordChangeHandler(e)}
                  disabled={disabled}
                  required
                  maxLength={30}
                  placeholder={'ID를 입력하세요.'}
                />
              </div>
              {insertVisible &&
              <div>
                <div className="form-label-text">비밀번호
                  <p className="text-red">필수</p>
                  {viewPwd ?
                    <EyeOutlined onClick={viewPassword}/>
                    :
                    <EyeInvisibleOutlined onClick={viewPassword} />
                  }

                </div>
                <input
                  type={viewPwd ? 'text' : 'password'}
                  autoComplete={'new-password'}
                  className="mtb-8"
                  value={formData.pd}
                  name={"pd"}
                  onChange={(e) => wordChangeHandler(e)}
                  disabled={!insertVisible}
                  required
                  maxLength={30}
                  placeholder={'비밀번호를 입력하세요.'}
                />
              </div>
              }
            </>
          <div>
            <div className="form-label-text">소속기관</div>
            <input
              type="text"
              className="mt-8"
              value={formData.blngOrgnNm}
              name={"blngOrgnNm"}
              disabled={disabled}
              onChange={(e) => wordChangeHandler(e)}
              maxLength={50}
              placeholder={'소속기관을 입력하세요.'}
            />
          </div>
          <div>
            <div className="form-label-text">전화번호</div>
            <input
              type="text"
              className="mt-8"
              value={formData.memberTelNo}
              name={"memberTelNo"}
              disabled={disabled}
              onChange={(e) => wordChangeHandler(e)}
              maxLength={13}
              placeholder={'전화번호를 입력하세요.'}
            />
          </div>
        </div>

        <div className="grid-col-3 mt-24 items-center">
          <div className="col-span-1">
            <div className="form-label-text">사용여부</div>
          </div>
          <div className="col-span-2">
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
          <button type="button" className="btn-secondary-32 ml-auto" onClick={addMemberAuthHandler} disabled={disabled}>권한 추가</button>
          {authModalVisible &&
          <div className="modal-pop show" id="modal-pop" style={{top: "36px"}}>
            <div className="title">
              <h3>부여할 권한 선택</h3>
              <button type="button" className="close" onClick={authModalCancelHandler}/>
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
                      checked={checkboxKey.length === allGroups.length}
                    />
                  </th>
                  <th>권한명</th>
                </tr>
                </thead>
                <tbody>
                {allGroups.length > 0 ?
                  allGroups.map((group) =>
                    <tr key={group.id}>
                      <td className="table-check"><input type="checkbox" onChange={() => checkboxChangeHandler(group)} value={group.id} checked={group.checked} /></td>
                      <td>{group.name}</td>
                    </tr>
                  )
                  :
                  <td colSpan="2">추가 부여할 권한이 없습니다.</td>
                }
                </tbody>
              </table>
            </div>
            <button type="button" className="btn-primary-40 w-full" onClick={addAuthHandler}>선택완료</button>
          </div>
          }
        </div>

        <div className="table-wrap" style={{height: "250px"}}>
          <table className="striped">
            <colgroup>
              <col width="10%"/>
              <col width="38%"/>
              <col width="38%"/>
              <col width="14%" />
            </colgroup>
            <thead>
            <tr>
              <th>NO</th>
              <th>권한</th>
              <th>권한부여일자</th>
              <th></th>
            </tr>
            </thead>
            <tbody id="tbody-for">
            {auth &&
              auth.map((data) =>
                <tr key={data.key}>
                  <td title="no">{data.no}</td>
                  <td title="name">{data.name}</td>
                  <td title="date">{data.grtAuthDt}</td>
                  <td className="table-btn">
                    <button type="button" className="btn-system-red-32 plr-16" onClick={() => deleteMemberAuthHandler(data.key)}>삭제</button>
                  </td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
          {(ipTableVisible || formData.isAdmin) &&
            <>
              <hr className="mt-24 mb-16"/>
              <div className="flex-row gap-16 mb-16 relative">
                <h4>IP 관리</h4>
                <button type="button" className="btn-secondary-32 ml-auto" onClick={addMemberIPHandler} disabled={disabled}>IP 추가</button>
                {ipModalVisible &&
                <div className="modal-pop show" id="modal-pop" style={{top: "-162px"}}>
                  <div className="title">
                    <h3>IP 추가</h3>
                    <button type="button" className="close" onClick={ipModalCancelHandler}/>
                  </div>
                  <div>
                    <input
                      type={'text'}
                      value={ipAddr}
                      placeholder={'IP를 입력해주세요.'}
                      onChange={(e) => ipChangeHandler(e.target.value)}
                      onKeyPress={pressEnterHandler}
                    />
                    <button
                      type="button"
                      className="btn-primary-40 w-full"
                      onClick={addIpHandler}
                    >추가하기</button>
                  </div>
                </div>
                }
              </div>

              <div className="table-wrap" style={{height: "250px"}}>
                <table className="striped">
                  <colgroup>
                    <col width="10%"/>
                    <col width="38%"/>
                    <col width="38%"/>
                    <col width="14%" />
                  </colgroup>
                  <thead>
                  <tr>
                    <th>NO</th>
                    <th>IP</th>
                    <th>IP부여일자</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody id="tbody-for">
                  {formData.ip &&
                  formData.ip.map((data, index) =>
                    <tr key={index}>
                      <td title="no">{index+1}</td>
                      <td title="ip">{data.ipAddr}</td>
                      <td title={'date'}>{data.frstRegDt}</td>
                      <td className="table-btn">
                        <button type="button" className="btn-system-red-32 plr-16" onClick={() => deleteIpHandler(data.ipAddr)}>삭제</button>
                      </td>
                    </tr>
                  )
                  }
                  </tbody>
                </table>
              </div>
            </>
          }
        </form>
    );
}

export default MemberForm;