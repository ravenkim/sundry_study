import client from "src/api/client.jsx";


//회원관리
export const getUsers = () =>
  client.get('admin/users')

export const getUsersDetail = (param) =>
  client.post('admin/user-detail',param)



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

export const setBoardPriorities = (param) =>
  client.post('admin/boards/priorities', param)






//연체가 관리
export const getOverdues = () =>
  client.get('admin/overdues')





//연체 상태 관리
export const rentalUpdate = () =>
  client.put('rentals/update')



