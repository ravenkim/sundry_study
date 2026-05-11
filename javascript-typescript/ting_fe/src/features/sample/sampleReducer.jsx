import { reducerUtils, reduxMaker } from 'src/common/utils/reduxUtils.jsx'
import { getCommonCode } from 'src/features/sample/sampleAPI.jsx'

const prefix = 'sample'

const asyncRequest = {
    getCode: [{ commonCode: reducerUtils.init([]) }, getCommonCode],
}

const localState = {}

const localReducers = {}

export const { sampleSlice, sampleSaga, sampleAction } = reduxMaker(
    prefix,
    asyncRequest,
    localState,
    localReducers,
)
