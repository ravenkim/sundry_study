import {createSlice} from '@reduxjs/toolkit';


export const TOKEN_TIME_OUT = 600*1000;


export const userSlice = createSlice({
	name: 'authToken',
	initialState: {
		authToken: {
			authenticated: false,
			accessToken: null,
			expireTime: null
		}

	},
	reducers: {
		SET_TOKEN: (state, action) => {
			state.authToken.authenticated = true;
			state.authToken.accessToken = action.payload;
			state.authToken.expireTime = new Date().getTime() + TOKEN_TIME_OUT;
		},
		DELETE_TOKEN: (state) => {
			state.authToken.authenticated = false;
			state.authToken.accessToken = null;
			state.authToken.expireTime = null
		},
	}
})

export const userAction = userSlice.actions
