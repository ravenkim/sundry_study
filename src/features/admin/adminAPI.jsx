import client from "../../api/client.jsx";

export const test = (param) =>
  console.log(param)


export const getUsers = () =>
  client.get('admin/users')

export const getAuthList = () =>
  client.get('admin/auth-list')

