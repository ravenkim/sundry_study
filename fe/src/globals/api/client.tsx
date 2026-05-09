import axios from 'axios'

const client = axios.create({
    baseURL: '',

    // import.meta.env.VITE_API_HOST,
    // xsrfCookieName: 'csrftoken',
    // xsrfHeaderName: 'X-CSRFToken',
})

export const stream = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    responseType: 'stream',
})
