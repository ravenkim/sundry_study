import WhLayout from 'src/shared/layout/WhLayout.tsx'
import Home from 'src/features/Home.tsx'
import {
    TabsTrigger,
    Tabs,
    TabsList,
    TabsContent,
} from 'src/shared/lib/shadcn/components/ui/tabs'
import ProductsTable from 'src/features/product/components/ProductsTable.tsx'
import ProductsLazyScrollTable from 'src/features/product/components/ProductsLazyScrollTable.tsx'

const HomePage = () => {
    return (
        <WhLayout title={'dott'}>
            <Tabs defaultValue="lazytable" className="">
                <TabsList>
                    <TabsTrigger value="lazytable">스크롤 테이블</TabsTrigger>
                    <TabsTrigger value="table">페이지네이션 테이블</TabsTrigger>

                    <TabsTrigger value="list">list</TabsTrigger>
                    <TabsTrigger value="card">card</TabsTrigger>
                </TabsList>
                <TabsContent value="lazytable">
                    <ProductsLazyScrollTable />
                </TabsContent>

                <TabsContent value="table">
                    <ProductsTable />
                </TabsContent>
                <TabsContent value="list">
                    Change your password here.
                </TabsContent>
                <TabsContent value="card">
                    Change your password here.
                </TabsContent>
            </Tabs>
        </WhLayout>
    )
}

export default HomePage
