import {createSlice} from '@reduxjs/toolkit';
import {PURGE} from "redux-persist";
import {reducerUtils} from "../../common/utils/redux/asyncUtils.jsx";
import {jwtDecode} from "jwt-decode";


export const TOKEN_TIME_OUT = 600 * 1000;

const initialState = {
    user: reducerUtils.init(),
    logout: reducerUtils.init(),
}

const jwtDecodeHandler = (data) => {
    let result = null;
    if (data) {
        const token = jwtDecode(data.access);
        result = {
            ...data,
            userId: token.userId,
            email: token.email,
            isActive: token.isActive,
            authority: token.authority,
            name: token.name,
        };
    }

    return result;
};


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
        //로그인 요청 saga
        login: (state, action) => {
        },


        loginSuccess: (state, action) => {
            state["user"].data = jwtDecodeHandler(action.payload.data);

        },
        loginError: (state, action) => {
            console.log("로그인 실패");
        },


    },
    extraReducers: builder => {
        builder.addCase(PURGE, () => initialState);
    },
})

export const userAction = userSlice.actions
