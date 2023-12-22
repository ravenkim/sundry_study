import client from "../../api/client.jsx";
import imgClient from "../../api/imgClient.jsx";

export const test = (param) =>
  imgClient.get('profile/user/img')


export const getUsers = () =>
  client.get('admin/users')

export const getAuthList = () =>
  client.get('admin/auth-list')



export const addUser = (param) =>
  client.post('admin/users/add', param)
