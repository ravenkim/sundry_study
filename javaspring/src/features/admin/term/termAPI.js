import client from "api/client";
import { HTTP_ERROR_MSG } from "Constants";
import { notification } from "antd";

const openNotification = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc,
    placement: "bottomRight"
  })
};

export const getTerm = (param) => {
    if (!param.typeKey) param.typeKey = "compound";
    if (!param.page) param.page = "1"

    let url;

    // 임시 url
    param.keyword ? url = `/anal/get_term?type=${param.typeKey}&page=${param.page}&target_terms=${param.keyword}&format=json`
        : url = `/anal/get_term?type=${param.typeKey}&page=${param.page}&format=json`
    return client.get(url);
};

export const insertTerm = (formData) => {
    return client.post(`/anal/create_term`, formData)
      .then(function (response) {
        openNotification('success', '추가되었습니다.');
      })
      .catch(function (error) {
        error.response.status === 409 ? openNotification("error", "이미 추가한 용어입니다.") : openNotification('error','검증에 실패하였습니다.');
      })
};

export const deleteTerm = (param) => {
    let url=`/anal/delete_term?type=${param.typeKey}&id=${param.termKey}`
    return client.delete(url)
      .then(function (response) {
        openNotification('success','삭제되었습니다.');
      })
      .catch(function (error) {
        openNotification('error', '검증에 실패하였습니다.');
      })
};

export const multiDeleteTerm = (param) => {
    return client.delete(`/anal/delete_term?type=${param.typeKey}&checkList=${param.checkList}`)
      .then(function (response) {
        openNotification('success','삭제되었습니다.');
      })
      .catch(function (error) {
        openNotification('error','검증에 실패하였습니다.');
      })
}
