import client from "api/client";
import { notification } from "antd";

const openNotification = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc,
    placement: "bottomRight"
  })
}

export const getCondList = () => {
  return client.get("manage/cond/");
};

export const getCond = (param) => {
  return client.get(`manage/cond/${param.condKey}`);
};

export const insertCond = (formData) => client.post("manage/cond/", formData);

export const updateCond = (formData) => client.put(`manage/cond/${formData.recoCondId}`, formData);


export const deleteCond = (condKey) => {
  return client.delete(`manage/cond/${condKey}`)
    .then(function (response) {
      openNotification('success', '삭제되었습니다.');
    })
    .catch(function (error) {
      openNotification('error', '검증에 실패하였습니다.');
    })
};