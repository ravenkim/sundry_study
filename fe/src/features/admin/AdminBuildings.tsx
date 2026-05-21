import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Building2, Plus } from 'lucide-react'
import { AdminSidebar, AdminHeader } from 'src/shared/layout/EcoLayouts'
import { EcoButton, EcoCard } from 'src/shared/ui/eco'
import { createBuilding, getBuildings } from 'src/globals/api/buildingsApi'
import type { Building } from 'src/globals/api/types'

export const AdminBuildings = () => {
    const [buildings, setBuildings] = useState<Building[]>([])
    const [name, setName] = useState('')
    const [roomCount, setRoomCount] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const load = () => {
        setLoading(true)
        void getBuildings()
            .then(setBuildings)
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        load()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) {
            toast.error('건물명을 입력해 주세요.')
            return
        }

        setSubmitting(true)
        try {
            await createBuilding({
                name: name.trim(),
                roomCount: Number(roomCount) || 0,
            })
            toast.success('건물이 등록되었습니다.')
            setName('')
            setRoomCount('')
            load()
        } catch {
            toast.error('건물 등록에 실패했습니다.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <AdminSidebar />
            <div className="bg-surface-bright flex min-h-screen flex-col md:ml-64">
                <AdminHeader title="건물·강의실 관리" />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-8">
                    <div>
                        <h2 className="mb-1 text-3xl font-bold">
                            건물·강의실 관리
                        </h2>
                        <p className="text-on-surface-variant text-sm">
                            캠퍼스 건물과 강의실을 등록하고 관리합니다.
                        </p>
                    </div>

                    <EcoCard className="p-6">
                        <h3 className="mb-4 flex items-center gap-2 font-bold">
                            <Plus className="h-5 w-5" /> 건물 등록
                        </h3>
                        <form
                            onSubmit={(e) => void handleSubmit(e)}
                            className="flex flex-wrap items-end gap-4"
                        >
                            <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
                                <label className="text-on-surface-variant text-xs font-bold">
                                    건물명
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="공학관 A동"
                                    className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3 outline-none focus:ring-2"
                                />
                            </div>
                            <div className="flex w-32 flex-col gap-1.5">
                                <label className="text-on-surface-variant text-xs font-bold">
                                    강의실 수
                                </label>
                                <input
                                    type="number"
                                    value={roomCount}
                                    onChange={(e) =>
                                        setRoomCount(e.target.value)
                                    }
                                    placeholder="20"
                                    className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3 outline-none focus:ring-2"
                                />
                            </div>
                            <EcoButton
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-3"
                            >
                                {submitting ? '등록 중...' : '등록'}
                            </EcoButton>
                        </form>
                    </EcoCard>

                    <EcoCard className="overflow-hidden p-0">
                        <div className="border-outline-variant bg-surface-container-low border-b p-4">
                            <h3 className="flex items-center gap-2 font-bold">
                                <Building2 className="h-5 w-5" /> 등록된 건물
                            </h3>
                        </div>
                        {loading ? (
                            <p className="text-on-surface-variant p-8 text-center text-sm">
                                불러오는 중...
                            </p>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-outline-variant bg-surface text-on-surface-variant border-b text-xs font-bold">
                                        <th className="p-4">건물명</th>
                                        <th className="p-4">강의실</th>
                                        <th className="p-4">강의실 수</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-outline-variant/30 divide-y font-medium">
                                    {buildings.map((b) => (
                                        <tr
                                            key={b.buildingId}
                                            className="hover:bg-surface-container-low/30 transition-colors"
                                        >
                                            <td className="p-4 font-bold">
                                                {b.name}
                                            </td>
                                            <td className="text-on-surface-variant p-4">
                                                {b.locations
                                                    .map((l) => l.name)
                                                    .join(', ') || '—'}
                                            </td>
                                            <td className="p-4">
                                                {b.locations.length}개
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </EcoCard>
                </main>
            </div>
        </>
    )
}
