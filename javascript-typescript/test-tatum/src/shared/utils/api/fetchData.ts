export async function fetchData<T>(
    url: string,
    revalidateTime: number = 300,
): Promise<T> {
    try {
        const response = await fetch(url, {
            next: { revalidate: revalidateTime },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('서버에서 데이터 가져오는 중 에러 발생:', error)
        throw error
    }
}
