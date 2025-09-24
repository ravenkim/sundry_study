import CloudTable from '@/features/cloud/components/CloudTable'

export default function Home() {
    return (
        <div className="min-h-screen p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold">
                    복잡한 컴포넌트 설계 및 구현{' '}
                </h1>
            </header>
            <main>
                <div className="rounded-lg border bg-gray-50 p-4">
                    <CloudTable />
                </div>
            </main>
        </div>
    )
}
