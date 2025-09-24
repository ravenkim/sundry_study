export const fetchPokemonList = async () => {
    // const res = await fetch('https://pokeapi.co/api/v2/pokemon')
    const res = await fetch('http://127.0.0.1:1855/ttest')

    if (!res.ok) throw new Error('포켓몬 데이터를 가져오는데 실패했어요')
    return res.json()
}
