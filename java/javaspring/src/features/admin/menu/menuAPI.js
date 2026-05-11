import client from "api/client";
import {notification} from "antd";

const openNotification = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc,
    placement: "bottomRight"
  })
}

export const getMenuList = () => {
    return client.get("manage/menu/");
};
  
export const getMenu = (param) => {
    return client.get(`manage/menu/${param.menuKey}`);
};

export const insertMenu = (formData) => client.post("manage/menu/", formData);

export const updateMenu = (formData) => client.put(`manage/menu/${formData.menuId}`, formData);

export const deleteMenu = (menuKey) => {
    return client.delete(`manage/menu/${menuKey}`)
        .then(function (response) {
          openNotification('success', '삭제되었습니다.');
        })
        .catch(function (error) {
          openNotification('error', '검증에 실패하였습니다.');
        })
};

export const insertMenuAuth = (dataSource) => client.post('manage/auth',dataSource);

