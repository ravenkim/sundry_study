import WhLayout from 'src/shared/layout/WhLayout.tsx'
import ProductDetail from 'src/features/product/components/ProductDetail.tsx'
import { useAppDispatch, useAppSelector } from 'src/app/store/redux/reduxHooks.tsx'
import { shallowEqual } from 'react-redux'
import { useEffect, useState } from 'react'
import { productAction } from 'src/features/product/productReducer.ts'

const ProductDetailPage = () => {

    const {pathname, product} = useAppSelector(
        ({routerReducer, productReducer}) => ({
            pathname: routerReducer.location.path,
            product: productReducer.product.data,
        }),
        shallowEqual,
    )

    const dispatch = useAppDispatch()


    useEffect(() => {
        const id = pathname.split("/").pop();
        dispatch(productAction.getProduct(id))
    }, [dispatch, pathname])


    useEffect(() => {
        if(product)
        console.log(product)
    }, [product])



    return (
        <WhLayout
            title={product?.title}
        >
            <ProductDetail
                product={product}
            />

        </WhLayout>
    )
}

export default ProductDetailPage