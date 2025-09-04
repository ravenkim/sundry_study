import axios from 'axios'
import { AsyncRequest, reduxMaker } from 'src/app/store/redux/reduxUtils.ts'
import { PayloadAction } from '@reduxjs/toolkit'

const prefix = 'sample'

const asyncRequests = [
    {
        action: 'getPokemon',
        state: 'pokemon',
        initialState: {
            name: 'pokemon',
            id: 1,
        },
        api: () => axios.get('https://pokeapi.co/api/v2/pokemon/ditto'),
    } as const satisfies AsyncRequest<{ name: string; id: number }, void>,

    {
        action: 'getTest',
        state: 'test',
        initialState: [{ success: true, message: 'asd' }],
        api: (
            param = {
                param1: 'string',
                param2: 111,
            },
        ) => axios.post('https://test.com', param),
    } as const satisfies AsyncRequest<
        { success: boolean; message: string }[],
        { param1: string; param2: number }
    >,
] as const

const localState = {
    value: 0,
}

const localReducers = {
    decrement: (state: typeof localState) => {
        state.value -= 1
    },
    setValue: (state: typeof localState, action: PayloadAction<number>) => {
        state.value = action.payload
    },
}

const module = reduxMaker(prefix, asyncRequests, localState, localReducers)
export const {
    slice: sampleSlice,
    actions: sampleAction,
    saga: sampleSaga,
} = module
