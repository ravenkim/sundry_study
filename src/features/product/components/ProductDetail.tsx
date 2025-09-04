import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store/redux/reduxHooks.tsx'
import { shallowEqual } from 'react-redux'

const ProductDetail = () => {

    const dispatch = useAppDispatch()

    const {pathname} = useAppSelector(
        ({routerReducer}) => ({
            pathname: routerReducer.location.path,

        }),
        shallowEqual,
    )






    return (
        <div>
            
        </div>
    )
}

export default ProductDetail