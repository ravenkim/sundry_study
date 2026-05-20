import axios from 'axios'

const client = axios.create({
    baseURL: import.meta.env.VITE_API_HOST ?? '',
    headers: {
        'Content-Type': 'application/json',
    },
})

export const stream = axios.create({
    baseURL: import.meta.env.VITE_API_HOST ?? '',
    responseType: 'stream',
})

export default client
