import { useQuery } from '@tanstack/react-query'

interface DiffResult {
    text: string
    time: number
}

interface UseDiffOptions {
    searchText: string
    enabled: boolean
    onSuccess?: (data: DiffResult) => void
}

const useDiff = ({ searchText, enabled }: UseDiffOptions) => {
    const requestTime = Date.now()

    const { data, isLoading, isError, error } = useQuery<
        DiffResult,       // queryFn이 반환하는 타입
        Error,            // error 타입
        DiffResult,       // 최종 데이터 타입 (select 안 쓰니까 동일)
        [string, string]  // queryKey 타입
    >({
        queryKey: ['diff', searchText],
        queryFn: async (): Promise<DiffResult> => {
            const res = await fetch(`/api/diff?url=${encodeURIComponent(searchText)}`)
            const text = await res.text()
            return { text, time: requestTime }
        },
        enabled,
    })

    return {
        text: data?.text ?? '',
        time: data?.time ?? 0,
        isLoading,
        isError,
        error,
    }
}

export default useDiff
