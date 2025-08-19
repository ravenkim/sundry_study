'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchPokemonList } from '@/app/(api)/tanstackQuery/server/fetch'

const SecondQueryComponent = () => {
    const { data, isFetching } = useQuery({
        queryKey: ['pokemonList'],
        queryFn: fetchPokemonList,
        staleTime: 0, // 항상 stale로 간주
        cacheTime: 0, // 캐시 저장 안 함
        refetchOnMount: true, // 마운트될 때 무조건 다시 요청
        refetchOnWindowFocus: false, // 탭 포커싱시 재요청 방지 (원하면 true로)
    })

    return (
        <div style={{ marginTop: '20px' }}>
            <strong>[Second] 같은 쿼리 사용한 결과:</strong>
            <div>isFetching: {String(isFetching)}</div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

const TqServerClientComponet = () => {
    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['pokemonList', 'main'],
        queryFn: fetchPokemonList,
    })

    if (isLoading) return <p>로딩 중...</p>
    if (error) return <p>에러 발생!</p>

    return (
        <div>
            <button
                onClick={() => refetch()}
                disabled={isFetching}
                style={{ marginBottom: '8px', padding: '6px 12px' }}
            >
                {isFetching ? 'refetch 중...' : 'React Query로 refetch()'}
            </button>

            <div style={{ marginTop: '20px' }}>
                <strong>[Main] 첫 쿼리 결과:</strong>
                <div>isFetching: {String(isFetching)}</div>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>

            {/* 동일한 쿼리Key로 재사용한 컴포넌트 */}
            <SecondQueryComponent />
        </div>
    )
}

export default TqServerClientComponet
