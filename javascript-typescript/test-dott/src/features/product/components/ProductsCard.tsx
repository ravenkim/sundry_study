import { useEffect, useState, useRef, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store/redux/reduxHooks.tsx'
import { productAction } from 'src/features/product/productReducer.ts'
import { shallowEqual } from 'react-redux'
import SSspin from 'src/shared/components/loading/SSspin.tsx'
import { Product } from 'src/features/product/productType.ts'
import { useNavigate } from 'react-router'

const ProductsCard = () => {
    const [page, setPage] = useState(1)
    const limit = 20
    const dispatch = useAppDispatch()

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
            setItems(prev =>
                page === 1 ? products.products : [...prev, ...products.products]
            )
            setTotalPages(Math.ceil(products?.total / limit))
        }
    }, [products, page])

    // IntersectionObserver 콜백
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0]
            if (target.isIntersecting && !productsLoading && page < totalPages) {
                setPage(prev => prev + 1)
            }
        },
        [productsLoading, page, totalPages],
    )

    useEffect(() => {
        const option = { root: null, rootMargin: '0px', threshold: 0.5 }
        const observer = new IntersectionObserver(handleObserver, option)
        if (observerRef.current) observer.observe(observerRef.current)
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current)
        }
    }, [handleObserver])

    const navigate = useNavigate()

    return (
        <div className="max-h-[600px] overflow-auto p-4 space-y-4 rounded-lg border">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.length > 0 ? (
                    items.map((p: Product) => (
                        <div
                            key={p.id}
                            className="cursor-pointer rounded-lg border p-4 shadow hover:shadow-md transition"
                            onClick={() => navigate(`/product/${p.id}`)}
                        >
                            <img
                                src={p.thumbnail || p.images[0]}
                                alt={p.title}
                                className="h-40 w-full object-cover rounded-md mb-2"
                            />
                            <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{p.category}</p>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-primary">${p.price}</span>
                                <span className="text-sm text-muted-foreground">Stock: {p.stock}</span>
                            </div>
                        </div>
                    ))
                ) : !productsLoading ? (
                    <div className="col-span-full text-center text-muted-foreground py-6">
                        데이터가 없습니다.
                    </div>
                ) : null}
            </div>

            {/* 감시용 div */}
            <div ref={observerRef} className="flex h-10 items-center justify-center">
                {productsLoading && <SSspin loading={true} />}
            </div>
        </div>
    )
}

export default ProductsCard
