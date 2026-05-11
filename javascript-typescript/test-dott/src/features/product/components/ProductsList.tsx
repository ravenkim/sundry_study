import { useEffect, useState, useRef, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store/redux/reduxHooks.tsx'
import { productAction } from 'src/features/product/productReducer.ts'
import { shallowEqual } from 'react-redux'
import SSspin from 'src/shared/components/loading/SSspin.tsx'
import { Product } from 'src/features/product/productType.ts'
import { useNavigate } from 'react-router'

const ProductsList = () => {
    const [page, setPage] = useState(1)
    const limit = 20
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { products, productsLoading } = useAppSelector(
        ({ productReducer }) => ({
            products: productReducer.products.data,
            productsLoading: productReducer.products.loading,
        }),
        shallowEqual,
    )

    const [items, setItems] = useState<Product[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const observerRef = useRef<HTMLDivElement | null>(null)

    // 데이터 요청
    useEffect(() => {
        const skip = (page - 1) * limit
        dispatch(productAction.getProducts({ limit, skip }))
    }, [page, dispatch])

    // products 업데이트 시 items 누적
    useEffect(() => {
        if (products?.products) {
            setItems((prev) =>
                page === 1 ? products.products : [...prev, ...products.products],
            )
            setTotalPages(Math.ceil(products?.total / limit))
        }
    }, [products, page])

    // IntersectionObserver
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0]
            if (target.isIntersecting && !productsLoading && page < totalPages) {
                setPage((prev) => prev + 1)
            }
        },
        [productsLoading, page, totalPages],
    )

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        }
        const observer = new IntersectionObserver(handleObserver, option)
        if (observerRef.current) observer.observe(observerRef.current)

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current)
        }
    }, [handleObserver])

    return (
        <div className="max-h-[600px] w-400 space-y-4 overflow-auto rounded-lg border p-2">
            {items.length > 0 ? (
                <div className="space-y-3">
                    {items.map((p: Product) => (
                        <div
                            key={p.id}
                            className="flex flex-col rounded-lg border p-4 hover:shadow-md cursor-pointer transition"
                            onClick={() => navigate(`/product/${p.id}`)}
                        >
                            <h3 className="text-lg font-semibold text-primary hover:underline">
                                {p.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">{p.category}</p>
                            <div className="mt-2 flex justify-between text-sm font-medium">
                                <span>Price: ${p.price}</span>
                                <span>Stock: {p.stock}</span>
                                <span>ID: {p.id}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : !productsLoading ? (
                <div className="py-6 text-center text-muted-foreground">
                    데이터가 없습니다.
                </div>
            ) : null}

            {/* 감시용 div */}
            <div
                ref={observerRef}
                className="flex h-10 items-center justify-center"
            >
                {productsLoading && <SSspin loading={true} />}
            </div>
        </div>
    )
}

export default ProductsList
