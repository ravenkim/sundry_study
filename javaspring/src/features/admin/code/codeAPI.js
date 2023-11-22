import client from "api/client";
import { HTTP_ERROR_MSG } from "Constants";
import { notification } from "antd";

const openNotification = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc,
    placement: "bottomRight"
  })
}

export const getCodeList = () => {
  return client.get("manage/code/");
};

export const getCode = (param) => {
  return client.get(`manage/code/${param.codeKey}`);
};

export const insertCode = (formData) => {
  return client.post("manage/code/",formData)
    .then(function (response) {
      openNotification('success', "추가되었습니다.");
    })
    .catch(function (error) {
      openNotification('error', '검증에 실패하였습니다.');
      })
};

export const updateCode = (formData) => {
  return client.put(`manage/code/${formData.commCd}`, formData)
    .then(function (response) {
      openNotification('success', "수정되었습니다.");
    })
    .catch(function (error) {
      openNotification('error', "검증에 실패하였습니다.");
    })
};

export const deleteCode = (codeKey) => {
  return client.delete(`manage/code/${codeKey}`)
    .then(function (response) {
      openNotification('success', '삭제되었습니다.');
    })
    .catch(function (error) {
      openNotification('error', '검증에 실패하였습니다.');
    })
};