import axios from 'axios'
import { AsyncRequest, reduxMaker } from 'src/app/store/redux/reduxUtils.ts'
import { login } from 'src/features/product/productAPI.tsx'

const prefix = 'product'

const asyncRequests = [
    {
        action: 'getCategories',
        state: 'categories',
        initialState: [
            {
                "slug": "",
                "name": "",
                "url": ""
            },
        ],
        api: () => axios.get('https://dummyjson.com/products/categories'),
    } as const satisfies AsyncRequest<  [{
        "slug": string,
        "name": string,
        "url": string
    }], void>,

    {
        action: 'getProduct',
        state: 'product',
        initialState: null,
        api: login,
    } ,

] as const

const localState = {

}

const localReducers = {

}

const module = reduxMaker(prefix, asyncRequests, localState, localReducers)
export const {
    slice: productSlice,
    actions: productAction,
    saga: productSaga,
} = module
