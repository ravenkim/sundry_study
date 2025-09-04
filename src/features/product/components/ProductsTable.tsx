import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store/redux/reduxHooks.tsx'
import { productAction } from 'src/features/product/productReducer.ts'
import {
    Pagination,
    PaginationContent,
    PaginationItem, PaginationLink, PaginationNext,
    PaginationPrevious,
} from 'src/shared/lib/shadcn/components/ui/pagination'
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

const ProductsTable = () => {


    const [page, setPage] = useState(1)
    const limit = 20

    const dispatch = useAppDispatch()


    const { products, productsLoading} = useAppSelector(
        ({ productReducer}) => ({
            products: productReducer.products.data,
            productsLoading: productReducer.products.loading,

        }),
        shallowEqual,
    )



    useEffect(() => {
        const skip = (page - 1) * limit
        dispatch(productAction.getProducts({ limit, skip }))
    }, [page, dispatch])


    const [totalPages, setTotalPages] = useState(0)


    useEffect(() => {
        setTotalPages(Math.ceil(products?.total / limit))
    }, [products])




    const navigate = useNavigate()


    return (
        <SSspin
            loading={productsLoading}
            className={'flex flex-col'}
        >

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
                        {products?.products && products.products.length > 0 ? (
                            products.products.map((p: Product) => (
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
                                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                        데이터가 없습니다.
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>

                {/* 페이지네이션 */}
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    isActive={p === page}
                                    onClick={() => setPage(p)}
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>

        </SSspin>
    )
}

export default ProductsTable