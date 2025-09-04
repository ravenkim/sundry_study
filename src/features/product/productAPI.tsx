import { client } from 'src/app/api/client.tsx'


export const getProduct = (id: number) => {
    return client.get(`products/${id}`)
}


export const getProducts = ({limit, skip}: { limit: number, skip: number }) => {
    return client.get(`/products?limit=${limit}&skip=${skip}`)
}