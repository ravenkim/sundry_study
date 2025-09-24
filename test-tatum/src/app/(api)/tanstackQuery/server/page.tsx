import TqServerClientComponet from '@/app/(api)/tanstackQuery/server/TqServerClientComponet'
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import { fetchPokemonList } from '@/app/(api)/tanstackQuery/server/fetch'

const AsdPage = async () => {
    // 값을 미라 담아두는 경우
    const queryClient = new QueryClient({
        defaultOptions: {},
    })

    await queryClient.prefetchQuery({
        queryKey: ['pokemonList'],
        queryFn: fetchPokemonList,
    })

    const dehydratedState = dehydrate(queryClient)
    console.log(queryClient)

    return (
        <div>
            <HydrationBoundary state={dehydratedState}>
                <TqServerClientComponet />
            </HydrationBoundary>
        </div>
    )
}

export default AsdPage
