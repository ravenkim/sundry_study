

import axios from 'axios';

import {reducerUtils, reduxMaker} from "../../common/utils/redux/asyncUtils.jsx";


const prefix = 'user'

const asyncRequest = {
    login: [
        {user: reducerUtils.init()},
        () => axios.get('https://jsonplaceholder.typicode.com/posts')
    ],

}


const localState= {}
const localReducers = {
    loginSuccess: (state, action) => {
        console.log(action.payload.data)
    },
}

export const {userSlice, userSaga, userAction} = reduxMaker(prefix, asyncRequest,localState, localReducers);















// import {createSlice} from '@reduxjs/toolkit';
//
//
// export const TOKEN_TIME_OUT = 600*1000;
//
//
// export const userSlice = createSlice({
// 	name: 'authToken',
// 	initialState: {
// 		authToken: {
// 			authenticated: false,
// 			accessToken: null,
// 			expireTime: null
// 		}
//
// 	},
// 	reducers: {
// 		SET_TOKEN: (state, action) => {
// 			state.authToken.authenticated = true;
// 			state.authToken.accessToken = action.payload;
// 			state.authToken.expireTime = new Date().getTime() + TOKEN_TIME_OUT;
// 		},
// 		DELETE_TOKEN: (state) => {
// 			state.authToken.authenticated = false;
// 			state.authToken.accessToken = null;
// 			state.authToken.expireTime = null
// 		},
// 	}
// })
//
// export const userAction = userSlice.actions
