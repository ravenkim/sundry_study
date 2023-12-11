import axios from 'axios'
import {getCookie} from "../common/utils/cookie/Cookie.jsx";


const client = axios.create({
	 // baseURL:
	headers: {
		accessToken: getCookie('accessToken'),
	},
})
