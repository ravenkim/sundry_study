'use client'

import { useQuery } from '@tanstack/react-query'

export const usePokemon = () => {
    return useQuery({
        queryKey: ['pokemon'],
        queryFn: async () => {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon')
            if (!response.ok) {
                throw new Error('포켓몬 정보를 가져오는데 실패했어요.')
            }
            return response.json()
        },
    })
}

const TqClientComponent = () => {
    const { data, error, isLoading } = usePokemon()

    if (isLoading) {
        return <div>로딩 중...</div>
    }

    if (error instanceof Error) {
        return <div>오류: {error.message}</div>
    }

    return (
        <div>
            <h2>포켓몬 목록</h2>
            <ul>
                {data.results.map(
                    (pokemon: { name: string }, index: number) => (
                        <li key={index}>{pokemon.name}</li>
                    ),
                )}
            </ul>
        </div>
    )
}

export default TqClientComponent
