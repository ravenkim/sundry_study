import client from 'src/api/client.jsx'

export const login = (param) =>
    client.get(`admin/common-code/get-common-codes`, param)
