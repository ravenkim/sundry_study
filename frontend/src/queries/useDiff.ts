import { useQuery } from '@tanstack/react-query'

interface UseDiffOptions {
    searchText: string
    enabled: boolean
    onSuccess: () => void
}

const useDiff = ({ searchText, enabled, onSuccess }: UseDiffOptions) => {
    return useQuery<string>({
        queryKey: ['diff', searchText],
        queryFn: async () => {
            const res = await fetch(
                `/api/diff?url=${encodeURIComponent(searchText)}`,
            )
            const text = await res.text()
            return text
        },
        enabled,
    })
}

export default useDiff
