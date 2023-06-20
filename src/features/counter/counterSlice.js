import { createSlice } from '@reduxjs/toolkit'

const reducers = {
  increment: (state, action) => {
    state.value += action.payload
  },
  decrement: (state) => {
    state.value -= 1
  },
}


export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 3,
  },

  reducers: reducers,
})

// Action creators are generated for each case reducer function
export const { increment, decrement } = counterSlice.actions

export default counterSlice.reducer