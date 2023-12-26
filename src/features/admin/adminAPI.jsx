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

export const resetProfile = (param) =>
  client.post('admin/users/delete-profile', param)





//보드관리

export const getBoardList = () =>
  client.get('admin/boards')


//연체가 관리
export const getOverdues = () =>
  client.get('')


