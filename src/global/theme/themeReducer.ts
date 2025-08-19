import { createSlice } from '@reduxjs/toolkit'



const Slice = createSlice({
    name: 'theme',
    initialState: {
        value: 0
    },
    reducers: {
        increment: state => {
            state.value += 1
        },
        decrement: state => {
            state.value -= 1
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload
        }
    }
})

export const counterAction = Slice.actions
export const counterReducer = Slice.reducer

