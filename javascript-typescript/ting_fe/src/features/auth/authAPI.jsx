import client from 'src/api/client.jsx'

export const login = (param) =>
    client.post('/auth/login', param, { withCredentials: true })
