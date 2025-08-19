'use client'

import { useAppDispatch, useAppSelector } from '@/global/redux/hooks'
import { sampleActions } from '@/features/sample/sampleReducer'
import { useEffect } from 'react'
import { shallowEqual } from 'react-redux'
import { RootState } from '@/global/redux/reduxStore'

const ReduxClientComponet = () => {
    const dispatch = useAppDispatch()

    const { pokemon, value } = useAppSelector(
        (state: RootState) => ({
            pokemon: state.sampleReducer.pokemons.data,
            value:state.sampleReducer.value,
        }),
        shallowEqual,
    )

    useEffect(() => {
        dispatch(sampleActions.getPokemons({}))
    }, [dispatch])





    return (
        <div>
            <h2>포켓몬 목록</h2>
            <ul>
                {pokemon?.results?.map(
                    (pokemon: { name: string }, index: number) => (
                        <li key={index}>{pokemon.name}</li>
                    ),
                )}
            </ul>

            {value}


            <button
                onClick={() => {
                    dispatch(sampleActions.setValue( 123))
                }}
            >
                asd
            </button>
        </div>
    )
}

export default ReduxClientComponet
