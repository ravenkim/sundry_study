import ServerClientComponent from '@/app/(api)/serverFetch/ServerClientComponent'

const Page = async () => {
    // 첫 요청은 오래 걸릴수 있음

    const res = await fetch('https://pokeapi.co/api/v2/pokemon', {
        next: { revalidate: 3600 },
    })
    const data = await res.json()

    return (
        <div>
            <ServerClientComponent data={data} />
        </div>
    )
}

export default Page
