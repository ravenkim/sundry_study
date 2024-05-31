



const prefix = 'router'


const asyncRequest = {

}

const localState = {
    location: null,

}

const localReducers = {
    locationChange: (state, action) => {
        state.location = action.payload
    },
}



export const {routerSlice, routerSaga, routerAction} = reduxMaker(prefix, asyncRequest, localState, localReducers);