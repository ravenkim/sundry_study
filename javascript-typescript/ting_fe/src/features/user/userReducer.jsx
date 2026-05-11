import { reduxMaker } from 'src/common/utils/reduxUtils.jsx'

const prefix = 'user'

const asyncRequest = {
    // getCode: [
    //     {commonCode: reducerUtils.init([])},
    //     getCommonCode
    // ],
}

const localState = {}

const localReducers = {}

export const { userSlice, userSaga, userAction } = reduxMaker(
    prefix,
    asyncRequest,
    localState,
    localReducers,
)
