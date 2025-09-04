import { reduxMaker } from 'src/app/store/redux/reduxUtils.ts'
import { PayloadAction } from '@reduxjs/toolkit'

const prefix = 'router'

const asyncRequests = [] as const

const localState = {
    location: {
        path: window.location.pathname || null,
        state: window.history.state?.usr || null,
    },
}

const localReducers = {
    locationChange: (
        state: typeof localState,
        action: PayloadAction<{
            path: string
            state: unknown
        }>,
    ) => {
        return {
            ...state,
            location: action.payload,
        }
    },
}

const module = reduxMaker(prefix, asyncRequests, localState, localReducers)
export const {
    slice: routerSlice,
    actions: routerAction,
    saga: routerSaga,
} = module
