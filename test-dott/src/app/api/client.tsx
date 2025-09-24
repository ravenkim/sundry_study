import axios from 'axios'

export const client = axios.create({
    baseURL: 'https://dummyjson.com',

    // import.meta.env.VITE_API_HOST,
    // xsrfCookieName: 'csrftoken',
    // xsrfHeaderName: 'X-CSRFToken',
})

export const stream = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    responseType: 'stream',
})
