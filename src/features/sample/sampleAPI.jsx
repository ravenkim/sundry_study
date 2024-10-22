import client from 'src/api/client.jsx'

export const getCommonCode = () =>
    client.get(`admin/common-code/get-common-codes`)
