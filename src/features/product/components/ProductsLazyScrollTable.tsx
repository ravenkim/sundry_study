import { useEffect, useState, useRef, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store/redux/reduxHooks.tsx'
import { productAction } from 'src/features/product/productReducer.ts'
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
} from 'src/shared/lib/shadcn/components/ui/table'
import { shallowEqual } from 'react-redux'
import SSspin from 'src/shared/components/loading/SSspin.tsx'
import { Product } from 'src/features/product/productType.ts'
import { useNavigate } from 'react-router'

const ProductsLazyScrollTable = () => {
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

    // 누적 데이터 저장
    const [items, setItems] = useState<Product[]>([])
    const [totalPages, setTotalPages] = useState(0)

    // 감시 대상 ref
    const observerRef = useRef<HTMLDivElement | null>(null)

    // 데이터 요청
    useEffect(() => {
        const skip = (page - 1) * limit
        dispatch(productAction.getProducts({ limit, skip }))
    }, [page, dispatch])

    // products 업데이트 시 items에 누적
    useEffect(() => {
        if (products?.products) {
            setItems((prev) =>
                page === 1 ? products.products : [...prev, ...products.products],
            )
            setTotalPages(Math.ceil(products?.total / limit))
        }
    }, [products, page])

    // IntersectionObserver 콜백
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

    const navigate = useNavigate()

    return (
        <div className="space-y-4 w-400 max-h-[600px] overflow-auto border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length > 0 ? (
                        items.map((p: Product) => (
                            <TableRow key={p.id}>
                                <TableCell>{p.id}</TableCell>
                                <TableCell
                                    onClick={() => {navigate(`/product/${p.id}`)}}
                                    className={'text-primary cursor-pointer hover:underline'}
                                >{p.title}</TableCell>
                                <TableCell>{p.category}</TableCell>
                                <TableCell>${p.price}</TableCell>
                                <TableCell>{p.stock}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        !productsLoading && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-6 text-muted-foreground"
                                >
                                    데이터가 없습니다.
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>

            {/* 감시용 div */}
            <div ref={observerRef} className="h-10 flex justify-center items-center">
                {productsLoading && <SSspin loading={true} />}
            </div>
        </div>
    )
}

export default ProductsLazyScrollTable