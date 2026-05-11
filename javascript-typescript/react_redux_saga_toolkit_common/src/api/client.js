import axios from "axios"

const client = axios.create({
    baseURL: process.env.REACT_APP_API_HOST,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
})


export default client