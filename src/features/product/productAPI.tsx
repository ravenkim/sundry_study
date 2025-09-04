import { client } from 'src/app/api/client.tsx'


export const login = (id: number) => {
    return client.get(`products/${id}`)
}

