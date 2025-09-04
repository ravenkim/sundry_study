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
            <div className="max-w-6xl mx-auto py-10 flex justify-center items-center">
                <Card className="p-6 text-center">
                    <CardTitle className="mb-2">상품 정보를 찾을 수 없습니다</CardTitle>
                    <CardDescription>
                        해당 상품이 존재하지 않거나 삭제되었을 수 있습니다.
                    </CardDescription>
                </Card>
            </div>
        )
    }


    return (
                <div className="max-w-6xl mx-auto py-10 grid md:grid-cols-2 gap-10">
                    <div className="flex flex-col items-center space-y-4">
                        <img
                            src={product.images[0]}
                            alt={product.title}
                            className="rounded-lg shadow-md w-full object-cover"
                        />
                        <div className="flex flex-col items-center">
                            <span className="font-medium mb-2">Scan QR Code</span>
                            <img
                                src={product.meta.qrCode}
                                alt="QR Code"
                                className="w-32 h-32 object-contain"
                            />
                        </div>
                        <div className="flex space-x-2 mt-2">
                            {product.tags.map((tag) => (
                                <Badge key={tag}>{tag}</Badge>
                            ))}
                        </div>
                    </div>

                    <Card className="p-6 flex flex-col justify-between bg-card text-card-foreground">
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
                                <span className="ml-2 text-muted-foreground">
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
                                <span className="ml-2 text-muted-foreground">
                                    {product.rating.toFixed(2)}
                                </span>
                            </div>

                            <Separator />

                            {/* 설명 */}
                            <p className="text-muted-foreground">{product.description}</p>

                            <Separator />

                            {/* 메타데이터 */}
                            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <div>
                                    <span className="font-medium">SKU:</span> {product.sku}
                                </div>
                                <div>
                                    <span className="font-medium">Weight:</span>{' '}
                                    {product.weight}g
                                </div>
                                <div>
                                    <span className="font-medium">Dimensions:</span>{' '}
                                    {product.dimensions.width} x {product.dimensions.height} x{' '}
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

                            <Button
                                label={'Add to Cart'}
                            ></Button>

                            <Separator />

                            {/* 리뷰 */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Reviews</h3>
                                {product.reviews.map((review, index) => (
                                    <Card
                                        key={index}
                                        className="p-4 bg-muted text-muted-foreground"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-foreground">
                                                {review.reviewerName}
                                            </span>
                                            <span className="text-xs">
                                                {new Date(review.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1 mb-2">
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
                                        <p className="text-foreground">{review.comment}</p>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
    )
}

export default ProductDetail
