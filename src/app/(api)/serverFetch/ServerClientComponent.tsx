'use client'

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

const ServerClientComponent = ({ data }: PokemonsResponse) => {
    console.log(data)

    return (
        <div>
            <h2>포켓몬 목록</h2>
            <ul>
                {data?.results?.map(
                    (pokemon: { name: string }, index: number) => (
                        <li key={index}>{pokemon.name}</li>
                    ),
                )}
            </ul>
        </div>
    )
}

export default ServerClientComponent
