export const fetchPokemonList = async () => {
    console.log('프론트 서버에서 백엔드 요청 시도 (Next.js 캐시 확인 후)') // 서버에서 이 함수가 호출될 때마다 찍힘
    const res = await fetch('http://127.0.0.1:1855/ttest', {
        // === 추가된 부분 ===
        // Next.js 서버가 이 fetch 요청의 응답을 300초(5분) 동안 캐시하도록 지시합니다.
        // 이 시간 내에 동일한 fetch 요청이 서버에서 발생하면 백엔드에 다시 요청하지 않고 캐시된 데이터를 반환합니다.
        next: { revalidate: 300 }, // 5분 (5 * 60초) 동안 서버 캐시 유지

        // ******************** 이게 백엔드로 보내는 값 캐쉬 ****************
        // ==================
    })

    if (!res.ok) throw new Error('포켓몬 데이터를 가져오는데 실패했어요')
    return res.json()
}
