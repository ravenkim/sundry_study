import WhLayout from 'src/shared/layout/WhLayout.tsx'
import ProductDetail from 'src/features/product/components/ProductDetail.tsx'
import { useAppDispatch, useAppSelector } from 'src/app/store/redux/reduxHooks.tsx'
import { shallowEqual } from 'react-redux'
import { useEffect, useState } from 'react'
import { productAction } from 'src/features/product/productReducer.ts'

const ProductDetailPage = () => {

    const {pathname} = useAppSelector(
        ({routerReducer}) => ({
            pathname: routerReducer.location.path,

        }),
        shallowEqual,
    )

    const dispatch = useAppDispatch()


    useEffect(() => {
        const id = pathname.split("/").pop();

        dispatch(productAction.getProduct(id))
    }, [dispatch, pathname])




    const [productId, setProductId] = useState()
    const [productName, setProductName] = useState('')



    return (
        <WhLayout
            title={productName}
        >
            <ProductDetail/>
        </WhLayout>
    )
}

export default ProductDetailPage