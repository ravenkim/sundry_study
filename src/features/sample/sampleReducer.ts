import { AsyncRequest, reduxMaker } from '@/global/redux/reduxMaker'
import { PayloadAction } from '@reduxjs/toolkit'

const prefix = 'sample'

interface PokemonResult {
    name: string // 포켓몬 이름
    url: string // 포켓몬 상세 URL
}

interface PokemonsResponse {
    count: number // 총 포켓몬 수
    next: string | null // 다음 페이지 URL (pagination)
    previous: string | null // 이전 페이지 URL (pagination)
    results: PokemonResult[] // 포켓몬 데이터 리스트
}

const asyncRequests = [
    {
        action: 'getPokemons',
        state: 'pokemons',
        initialState: {
            count: 0,
            next: null,
            previous: null,
            results: [],
        },
        api: () => fetch('https://pokeapi.co/api/v2/pokemon'),
    } as const satisfies AsyncRequest<PokemonsResponse, void>,
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

const sampleModule = reduxMaker(
    prefix,
    asyncRequests,
    localState,
    localReducers,
)

export const {
    slice: sampleSlice,
    actions: sampleActions,
    saga: sampleSaga,
} = sampleModule
