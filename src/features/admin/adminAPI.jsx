import client from "src/api/client.jsx";




//회원관리
export const getUsers = () =>
  client.get('admin/users')

export const getAuthList = () =>
  client.get('admin/auth-list')



export const addUser = (param) =>
  client.post('admin/users/add', param)


export const resetPassword = (param) =>
  client.post('admin/users/reset-pw', param)









export const getBoardList = () =>
  client.get('admin/boards')
