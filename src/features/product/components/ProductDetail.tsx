import { Product } from 'src/features/product/productType.ts'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from 'src/shared/lib/shadcn/components/ui/card'
import { Star } from 'lucide-react'
import { Button } from 'src/stories/Button.tsx'
import { Badge } from 'src/shared/lib/shadcn/components/ui/badge'
import { Separator } from 'src/shared/lib/shadcn/components/ui/separator'

const ProductDetail = ({ product }: { product: Product }) => {
    if (product === null) {
        return (
            <div className="mx-auto flex max-w-6xl items-center justify-center py-10">
                <Card className="p-6 text-center">
                    <CardTitle className="mb-2">
                        상품 정보를 찾을 수 없습니다
                    </CardTitle>
                    <CardDescription>
                        해당 상품이 존재하지 않거나 삭제되었을 수 있습니다.
                    </CardDescription>
                </Card>
            </div>
        )
    }

    return (
        <div className="mx-auto grid max-w-6xl gap-10 py-10 md:grid-cols-2">
            <div className="flex flex-col items-center space-y-4">
                <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full rounded-lg object-cover shadow-md"
                />
                <div className="flex flex-col items-center">
                    <span className="mb-2 font-medium">Scan QR Code</span>
                    <img
                        src={product.meta.qrCode}
                        alt="QR Code"
                        className="h-32 w-32 object-contain"
                    />
                </div>
                <div className="mt-2 flex space-x-2">
                    {product.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                    ))}
                </div>
            </div>

            <Card className="bg-card text-card-foreground flex flex-col justify-between p-6">
                <CardHeader className="flex items-center justify-between space-x-4">
                    <CardTitle className="text-2xl font-bold">
                        {product.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                        {product.brand} • {product.category}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* 가격 */}
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">
                            ${product.price.toFixed(2)}
                        </span>
                        {product.discountPercentage > 0 && (
                            <Badge variant="destructive">
                                {product.discountPercentage.toFixed(0)}% OFF
                            </Badge>
                        )}
                    </div>

                    {/* 재고 상태 */}
                    <div>
                        <span className="font-medium">
                            {product.availabilityStatus}
                        </span>
                        <span className="text-muted-foreground ml-2">
                            ({product.stock} in stock)
                        </span>
                    </div>

                    {/* 평점 */}
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={18}
                                className={
                                    i < Math.round(product.rating)
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                }
                            />
                        ))}
                        <span className="text-muted-foreground ml-2">
                            {product.rating.toFixed(2)}
                        </span>
                    </div>

                    <Separator />

                    {/* 설명 */}
                    <p className="text-muted-foreground">
                        {product.description}
                    </p>

                    <Separator />

                    {/* 메타데이터 */}
                    <div className="text-muted-foreground grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="font-medium">SKU:</span>{' '}
                            {product.sku}
                        </div>
                        <div>
                            <span className="font-medium">Weight:</span>{' '}
                            {product.weight}g
                        </div>
                        <div>
                            <span className="font-medium">Dimensions:</span>{' '}
                            {product.dimensions.width} x{' '}
                            {product.dimensions.height} x{' '}
                            {product.dimensions.depth} cm
                        </div>
                        <div>
                            <span className="font-medium">Min Order:</span>{' '}
                            {product.minimumOrderQuantity}
                        </div>
                        <div>
                            <span className="font-medium">Shipping:</span>{' '}
                            {product.shippingInformation}
                        </div>
                        <div>
                            <span className="font-medium">Return Policy:</span>{' '}
                            {product.returnPolicy}
                        </div>
                        <div>
                            <span className="font-medium">Warranty:</span>{' '}
                            {product.warrantyInformation}
                        </div>
                    </div>

                    <Button label={'Add to Cart'}></Button>

                    <Separator />

                    {/* 리뷰 */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Reviews</h3>
                        {product.reviews.map((review, index) => (
                            <Card
                                key={index}
                                className="bg-muted text-muted-foreground p-4"
                            >
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="text-foreground font-medium">
                                        {review.reviewerName}
                                    </span>
                                    <span className="text-xs">
                                        {new Date(
                                            review.date,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="mb-2 flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={
                                                i < review.rating
                                                    ? 'text-primary'
                                                    : 'text-muted-foreground'
                                            }
                                        />
                                    ))}
                                </div>
                                <p className="text-foreground">
                                    {review.comment}
                                </p>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProductDetail
