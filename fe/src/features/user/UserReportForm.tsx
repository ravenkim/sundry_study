import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Camera, ImageIcon, Loader2, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoButton } from 'src/shared/ui/eco'
import { getBuildings } from 'src/globals/api/buildingsApi'
import { createReport } from 'src/globals/api/reportApi'
import type { Building } from 'src/globals/api/types'
import { MOCK_BUILDINGS } from 'src/globals/api/mock/data'

type Step = 'photo' | 'location' | 'loading'

export const UserReportForm = () => {
    const navigate = useNavigate()
    const cameraRef = useRef<HTMLInputElement>(null)
    const galleryRef = useRef<HTMLInputElement>(null)

    const [step, setStep] = useState<Step>('photo')
    const [photo, setPhoto] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [buildings, setBuildings] = useState<Building[]>(MOCK_BUILDINGS)
    const [buildingId, setBuildingId] = useState<number | ''>('')
    const [locationId, setLocationId] = useState<number | ''>('')

    useEffect(() => {
        void getBuildings().then(setBuildings).catch(() => setBuildings(MOCK_BUILDINGS))
    }, [])

    useEffect(() => {
        if (!photo) {
            setPreviewUrl(null)
            return
        }
        const url = URL.createObjectURL(photo)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [photo])

    const selectedBuilding = buildings.find((b) => b.buildingId === buildingId)
    const selectedLocation = selectedBuilding?.locations.find((l) => l.locationId === locationId)

    const handleFileSelect = (file: File | undefined) => {
        if (!file) return
        setPhoto(file)
    }

    const handleNextFromPhoto = () => {
        if (!photo) {
            toast.error('현장 사진을 촬영하거나 선택해 주세요.')
            return
        }
        setStep('location')
    }

    const handleSubmit = useCallback(async () => {
        if (!photo || !selectedBuilding || !selectedLocation) {
            toast.error('사진과 위치를 모두 선택해 주세요.')
            return
        }

        setStep('loading')

        try {
            const response = await createReport({
                image: photo,
                buildingId: selectedBuilding.buildingId,
                buildingName: selectedBuilding.name,
                locationId: selectedLocation.locationId,
                roomName: selectedLocation.name,
            })

            navigate('/report-success', {
                state: {
                    aiResult: response.aiResult,
                    buildingName: selectedBuilding.name,
                    roomName: selectedLocation.name,
                },
            })
        } catch (error) {
            const message =
                error instanceof Error ? error.message : '제보 접수 중 오류가 발생했습니다.'
            toast.error(message)
            setStep('location')
        }
    }, [photo, selectedBuilding, selectedLocation, navigate])

    if (step === 'loading') {
        return (
            <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-6 p-5 text-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">AI가 분석 중입니다...</h2>
                    <p className="text-sm text-on-surface-variant">
                        강의실 사진을 확인하고 에너지 낭비 여부를 판별하고 있어요.
                        <br />
                        약 3~5초 소요됩니다.
                    </p>
                </div>
            </div>
        )
    }

    if (step === 'location') {
        return (
            <div className="flex flex-col gap-8 p-5 pb-8">
                <section className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">위치를 선택해 주세요</h2>
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="제보 사진"
                            className="h-32 w-full rounded-xl object-cover border border-outline-variant"
                        />
                    )}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-on-surface-variant">건물 선택</label>
                        <select
                            value={buildingId}
                            onChange={(e) => {
                                setBuildingId(Number(e.target.value) || '')
                                setLocationId('')
                            }}
                            className="rounded-lg border border-outline-variant bg-surface p-4 outline-none focus:ring-2 focus:ring-primary-container"
                        >
                            <option value="">건물을 선택해주세요</option>
                            {buildings.map((b) => (
                                <option key={b.buildingId} value={b.buildingId}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-on-surface-variant">강의실 선택</label>
                        <select
                            value={locationId}
                            onChange={(e) => setLocationId(Number(e.target.value) || '')}
                            disabled={!selectedBuilding}
                            className="rounded-lg border border-outline-variant bg-surface p-4 outline-none focus:ring-2 focus:ring-primary-container disabled:opacity-50"
                        >
                            <option value="">강의실을 선택해주세요</option>
                            {selectedBuilding?.locations.map((loc) => (
                                <option key={loc.locationId} value={loc.locationId}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                <div className="flex flex-col gap-3">
                    <EcoButton className="w-full py-4 text-lg" onClick={() => void handleSubmit()}>
                        제출하기
                    </EcoButton>
                    <EcoButton
                        variant="outline"
                        className="w-full py-3"
                        onClick={() => setStep('photo')}
                    >
                        이전
                    </EcoButton>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 p-5 pb-8">
            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">현장 사진을 촬영해 주세요</h2>
                <p className="text-sm text-on-surface-variant">
                    빈 강의실의 조명·에어컨 상태가 잘 보이도록 촬영해 주세요.
                </p>

                <div
                    className={cn(
                        'flex min-h-[240px] flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-lowest',
                        previewUrl && 'border-solid p-0',
                    )}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="미리보기" className="h-full w-full object-cover" />
                    ) : (
                        <>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container">
                                <Plus className="h-6 w-6 text-on-surface-variant" />
                            </div>
                            <p className="text-center text-sm text-on-surface-variant">
                                카메라 또는 갤러리에서 사진을 선택하세요
                            </p>
                        </>
                    )}
                </div>

                <input
                    ref={cameraRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                />
                <input
                    ref={galleryRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                />

                <div className="grid grid-cols-2 gap-3">
                    <EcoButton
                        variant="outline"
                        className="py-3"
                        onClick={() => cameraRef.current?.click()}
                    >
                        <Camera className="h-5 w-5" /> 카메라
                    </EcoButton>
                    <EcoButton
                        variant="outline"
                        className="py-3"
                        onClick={() => galleryRef.current?.click()}
                    >
                        <ImageIcon className="h-5 w-5" /> 갤러리
                    </EcoButton>
                </div>
            </section>

            <EcoButton className="w-full py-4 text-lg" onClick={handleNextFromPhoto}>
                다음
            </EcoButton>
        </div>
    )
}
