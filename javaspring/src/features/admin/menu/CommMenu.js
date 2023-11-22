import React, { useEffect, useState } from "react";
import {Modal, notification} from "antd";
import { useDispatch, useSelector } from "react-redux";

import MenuTreeList from "./components/MenuTreeList";
import MenuForm from "./components/MenuForm";
import { menuAction } from "features/admin/menu/menuReducer";
import { deleteMenu, insertMenu } from "./menuAPI";


const CommMenu = () => {
  const dispatch = useDispatch();

  const { menuList, menuListError, menuDetail, menuDetailError, insertMenuAuthState, insertMenuState, updateMenuState } = useSelector(
    ({ menuReducer }) => ({
      menuList: menuReducer.menuList.data,
      menuDetail: menuReducer.menuDetail.data,
      insertMenuAuthState: menuReducer.insertMenuAuthState.data,
      updateMenuState: menuReducer.updateMenuState.data,
      insertMenuState: menuReducer.insertMenuState.data,
    })
  );

  useEffect(() => {
    dispatch(menuAction.getMenuList({ target: "menuList" }));
  }, []);

  const [selectedKeys, setSelectedKeys] = useState();
  const menuSelectHandler = (keys) => {
    setSelectedKeys(keys);
    if (keys && keys.length > 0) {
      dispatch(menuAction.getMenu({ target: "menuDetail", menuKey: keys[0] }));
    }
  };
  const openNotification = (type, msg, desc) => {
    notification[type]({
      message: msg,
      description: desc,
      placement: "bottomRight"
    })
  };
  const [inserted, setInserted] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (insertMenuState) {
      if (insertMenuState.state) {
        const menuId = insertMenuState.menuId;
        dispatch(menuAction.insertMenuAuth({menuId: menuId, data: menuAuthData}));
        setInserted(true);
      } else {
        openNotification('error', '검증에 실패하였습니다.');
      }
    }
  },[insertMenuState]);

  useEffect(() => {
    if (updateMenuState) {
      if (updateMenuState.state) {
        setUpdated(true);
      } else {
        openNotification('error', '검증에 실패하였습니다.');
      }
    }
  },[updateMenuState]);

  useEffect(() => {
    if (insertMenuAuthState) {
      if (insertMenuAuthState.state) {
        const menuId = insertMenuAuthState.menuId;
        dispatch(menuAction.getMenuList({ target: "menuList" }));
        dispatch(menuAction.getMenu({ target: "menuDetail", menuKey: menuId }));
        if (inserted) {
          openNotification('success', '추가되었습니다.');
          setInserted(false);
        } else if (updated) {
          openNotification('success', '수정되었습니다.');
          setUpdated(false);
        }
      } else {
        openNotification('error', '검증에 실패하였습니다.');
      }
      setInserted(false);
    }
  },[insertMenuAuthState, inserted, updated]);



  useEffect(() => {
    if (menuDetail) {
      if (menuDetail.data) {
        setInitialValues(menuDetail.data);
      }
    }
  },[menuDetail]);

  const [menuAuthData, setMenuAuthData] = useState([]);

  const menuSubmitHandler = (formData, menuAuthData) => {
    Modal.confirm({
      title: "메뉴 추가",
      content: "해당 메뉴를 추가하시겠습니까?",
      okText: "확인",
      cancelText: "취소",
      onOk: () => {
        try {
          menuAuthData ? setMenuAuthData(menuAuthData) : setMenuAuthData([]);
          dispatch(menuAction.insertMenu(formData));

        } catch(e) {
          console.error(e);
        }
      },
    });
  };

  const menuDeleteHandler = (menuKey) => {
    Modal.confirm({
      title: "메뉴 삭제",
      content:
        "해당 메뉴를 삭제하시겠습니까? (하위 메뉴가 있으면 함께 삭제됩니다.)",
      okText: "확인",
      cancelText: "취소",
      onOk: () => {
        try {
          deleteMenu(menuKey).then(() => {
            dispatch(menuAction.getMenuList({ target: "menuList" }));
            setInitialValues();
            setButtonDisabled(true);
          });
        } catch(e) {
          console.error(e);
        }
      },
    });
  };

  const menuUpdateHandler = (formData, menuAuthData) => {
    Modal.confirm({
      title: "메뉴 수정",
      content: "해당 메뉴를 수정하시겠습니까? (상위 메뉴 권한 추가 시, 하위 메뉴 권한도 추가됩니다.)",
      onText: "확인",
      cancelText: "취소",
      onOk: () => {
        try {
          dispatch(menuAction.insertMenuAuth({menuId: formData.menuId, data: menuAuthData}));
          dispatch(menuAction.updateMenu(formData));
        } catch(e) {
          console.error(e);
        }
      },
    });
  };
  const [dataSource, setDataSource] = useState([]);
  const [group, setGroup] = useState([]);
  useEffect(() => {
    if (menuList) {
      if (menuList.data) {
        setDataSource(menuList.data);
        setGroup(menuList.group);
      }
      if (menuList.error) {
        Modal.error({
          title: "오류 발생",
          content: menuList.errorMessage,
          okText: "확인",
        });
        // alert(menuList.errorMessage);
      }
    }
  }, [menuList]);
  const [initialValues, setInitialValues] = useState();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (initialValues) {
      initialValues.menuId ? setButtonDisabled(false) : setButtonDisabled(true);
      }
  },[initialValues])

  const formResetHandler = () => {
    if (initialValues) {
      const keys = Object.keys(initialValues);
      keys.map((key) => {
        setInitialValues((prevState) => ({
          ...prevState,
          [key]: null
        }))
      });
    }
  };

  const addMenuGroupHandler = () => {
    setButtonDisabled(true);
    formResetHandler();
    setInitialValues((prevState) => ({
      ...prevState,
      hirkMenuId: null,
      useYn: "Y",
      delYn: "N",
    }));
  };

  const addMenuHandler = () => {
    const menuId = initialValues.menuId;
    formResetHandler();
    setInitialValues((prevState) => ({
      ...prevState,
      hirkMenuId: menuId,
      useYn: "Y",
      delYn: "N",
    }));
  };

  return (
    <main className="grid-col-full">
      <div className="grid-col-5 gap-16 main-height-large relative">
        <div className="grid-left col-span-2 p-16">
          <div className="flex-row gap-16 mb-16 items-center">
            <h4>메뉴 목록</h4>
            <button
              type="button"
              className="btn-secondary-32 ml-auto"
              onClick={() => addMenuGroupHandler()}
            >메뉴 그룹 추가</button>
            <button
              type="button"
              className="btn-tertiary-32"
              onClick={() => addMenuHandler()}
              disabled={buttonDisabled}
            >하위 메뉴 추가</button>
          </div>
          <MenuTreeList
            dataSource={dataSource}
            selectedKeys={selectedKeys}
            menuSelectHandler={menuSelectHandler}
          />
        </div>
        <div className="grid-right col-span-3 p-16">
          <MenuForm
            initialValues={initialValues}
            submitHandler={menuSubmitHandler}
            deleteHandler={menuDeleteHandler}
            updateHandler={menuUpdateHandler}
            group={group}
          />

        </div>
      </div>
    </main>
  );
};

export default CommMenu;
