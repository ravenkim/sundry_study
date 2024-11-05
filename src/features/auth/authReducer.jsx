import { reducerUtils, reduxMaker } from 'src/common/utils/reduxUtils.jsx'
import { login } from 'src/features/auth/authAPI.jsx'

const prefix = 'auth'

const asyncRequest = {
    login: [{ isLoggedIn: reducerUtils.init(false) }, login],
    // getCode: [
    //     {commonCode: reducerUtils.init([])},
    //     getCommonCode
    // ],


}

const localState = {
    ac: null,
}

const localReducers = {}

export const { authSlice, authSaga, authAction } = reduxMaker(
    prefix,
    asyncRequest,
    localState,
    localReducers,
)
