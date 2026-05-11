import { reducerUtils, reduxMaker } from 'src/common/utils/reduxUtils.jsx'

const prefix = 'guide'

const asyncRequest = {
    // getCode: [{ commonCode: reducerUtils.init([]) }, getCommonCode],
}

const localState = {}

const localReducers = {}

export const { guideSlice, guideSaga, guideAction } = reduxMaker(
    prefix,
    asyncRequest,
    localState,
    localReducers,
)
