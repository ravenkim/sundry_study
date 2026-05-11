import { reduxMaker } from 'src/common/utils/reduxUtils.jsx'

const prefix = 'router'

const asyncRequest = {}

const localState = {
    location: {
        state: {},
        route: '',
    },
}

const localReducers = {
    locationChange: (state, action) => {
        state.location = action.payload
    },
}

export const { routerSlice, routerSaga, routerAction } = reduxMaker(
    prefix,
    asyncRequest,
    localState,
    localReducers,
)
