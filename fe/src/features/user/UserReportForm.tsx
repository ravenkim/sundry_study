import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Camera, ImageIcon, Loader2, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoButton } from 'src/shared/ui/eco'
import { SearchableSelect } from 'src/shared/components/SearchableSelect'
import { useAuth } from 'src/features/auth/AuthContext'
import { getBuildings } from 'src/globals/api/buildingsApi'
import { createReport } from 'src/globals/api/reportApi'
import { flattenLeafLocations } from 'src/globals/api/locationUtils'
import type { Building } from 'src/globals/api/types'
import { MOCK_BUILDINGS } from 'src/globals/api/mock/data'

type Step = 'photo' | 'location' | 'loading'

export const UserReportForm = () => {
    const { t } = useTranslation('report')
    const navigate = useNavigate()
    const { user } = useAuth()
    const cameraRef = useRef<HTMLInputElement>(null)
    const galleryRef = useRef<HTMLInputElement>(null)

    const [step, setStep] = useState<Step>('photo')
    const [photo, setPhoto] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [buildings, setBuildings] = useState<Building[]>([])
    const [buildingId, setBuildingId] = useState<number | ''>('')
    const [locationId, setLocationId] = useState<number | ''>('')

    const applyBuildings = useCallback(
        (items: Building[]) => {
            setBuildings(items)
            if (items.length === 0) {
                setBuildingId('')
                return
            }

            const preferred = user?.buildingId
                ? items.find((b) => b.buildingId === user.buildingId)
                : undefined

            if (preferred) {
                setBuildingId(preferred.buildingId)
            } else if (items.length === 1) {
                setBuildingId(items[0].buildingId)
            } else {
                setBuildingId('')
            }
        },
        [user?.buildingId],
    )

    useEffect(() => {
        void getBuildings()
            .then((items) => {
                const scoped =
                    items.length > 0
                        ? items
                        : MOCK_BUILDINGS.filter(
                              (building) =>
                                  !user?.buildingId ||
                                  building.buildingId === user.buildingId,
                          )
                applyBuildings(scoped)
            })
            .catch(() => {
                const fallback = MOCK_BUILDINGS.filter(
                    (building) =>
                        !user?.buildingId ||
                        building.buildingId === user.buildingId,
                )
                applyBuildings(fallback)
            })
    }, [applyBuildings])

    useEffect(() => {
        setLocationId('')
    }, [buildingId])

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
    const leafLocations = useMemo(
        () => flattenLeafLocations(selectedBuilding?.children),
        [selectedBuilding],
    )
    const selectedLocation = leafLocations.find(
        (l) => l.locationId === locationId,
    )

    const buildingOptions = useMemo(
        () =>
            buildings.map((building) => ({
                value: building.buildingId,
                label: building.name,
            })),
        [buildings],
    )

    const locationOptions = useMemo(
        () =>
            leafLocations.map((loc) => ({
                value: loc.locationId,
                label: loc.path ?? loc.name,
            })),
        [leafLocations],
    )

    const handleFileSelect = (file: File | undefined) => {
        if (!file) return
        setPhoto(file)
    }

    const handleNextFromPhoto = () => {
        if (!photo) {
            toast.error(t('form.errorPhotoRequired'))
            return
        }
        setStep('location')
    }

    const handleSubmit = useCallback(async () => {
        if (!photo || !selectedBuilding || !selectedLocation) {
            toast.error(t('form.errorPhotoAndLocationRequired'))
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
                    status: response.status,
                    buildingName: selectedBuilding.name,
                    roomName: selectedLocation.name,
                },
            })
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : t('form.errorSubmitFailed'),
            )
            setStep('location')
        }
    }, [photo, selectedBuilding, selectedLocation, navigate, t])

    if (step === 'loading') {
        return (
            <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-6 p-5 text-center">
                <Loader2 className="text-primary h-16 w-16 animate-spin" />
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">
                        {t('form.loadingTitle')}
                    </h2>
                    <p className="text-on-surface-variant text-sm">
                        {t('form.loadingDescription')}
                        <br />
                        {t('form.loadingDuration')}
                    </p>
                </div>
            </div>
        )
    }

    if (step === 'location') {
        return (
            <div className="flex flex-col gap-8 p-5 pb-8">
                <section className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">
                        {t('form.locationTitle')}
                    </h2>
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt={t('form.reportPhotoAlt')}
                            className="border-outline-variant h-32 w-full rounded-xl border object-cover"
                        />
                    )}
                    <div className="flex flex-col gap-2">
                        <label className="text-on-surface-variant text-xs font-bold">
                            {t('form.buildingLabel')}
                        </label>
                        {buildings.length === 1 && selectedBuilding ? (
                            <div className="border-outline-variant bg-surface-container-low rounded-lg border px-4 py-3">
                                <p className="text-on-surface text-sm font-semibold">
                                    {selectedBuilding.name}
                                </p>
                            </div>
                        ) : (
                            <SearchableSelect
                                options={buildingOptions}
                                value={buildingId}
                                onChange={setBuildingId}
                                placeholder={t('form.buildingPlaceholder')}
                                searchPlaceholder={t(
                                    'form.buildingSearchPlaceholder',
                                )}
                                disabled={buildings.length === 0}
                            />
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-on-surface-variant text-xs font-bold">
                            {t('form.roomLabel')}
                        </label>
                        <SearchableSelect
                            options={locationOptions}
                            value={locationId}
                            onChange={setLocationId}
                            placeholder={t('form.roomPlaceholder')}
                            searchPlaceholder={t('form.roomSearchPlaceholder')}
                            disabled={!selectedBuilding || locationOptions.length === 0}
                        />
                        {selectedBuilding && locationOptions.length === 0 && (
                            <p className="text-on-surface-variant text-xs">
                                {t('form.noRooms')}
                            </p>
                        )}
                    </div>
                </section>

                <div className="flex flex-col gap-3">
                    <EcoButton
                        className="w-full py-4 text-lg"
                        onClick={() => void handleSubmit()}
                    >
                        {t('form.submit')}
                    </EcoButton>
                    <EcoButton
                        variant="outline"
                        className="w-full py-3"
                        onClick={() => setStep('photo')}
                    >
                        {t('form.back')}
                    </EcoButton>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 p-5 pb-8">
            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">{t('form.photoTitle')}</h2>
                <p className="text-on-surface-variant text-sm">
                    {t('form.photoHint')}
                </p>

                <div
                    className={cn(
                        'border-outline-variant bg-surface-container-lowest flex min-h-[240px] flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed',
                        previewUrl && 'border-solid p-0',
                    )}
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt={t('form.previewAlt')}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <>
                            <div className="bg-surface-container flex h-12 w-12 items-center justify-center rounded-full">
                                <Plus className="text-on-surface-variant h-6 w-6" />
                            </div>
                            <p className="text-on-surface-variant text-center text-sm">
                                {t('form.photoPlaceholder')}
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
                        <Camera className="h-5 w-5" /> {t('form.camera')}
                    </EcoButton>
                    <EcoButton
                        variant="outline"
                        className="py-3"
                        onClick={() => galleryRef.current?.click()}
                    >
                        <ImageIcon className="h-5 w-5" /> {t('form.gallery')}
                    </EcoButton>
                </div>
            </section>

            <EcoButton
                className="w-full py-4 text-lg"
                onClick={handleNextFromPhoto}
            >
                {t('form.next')}
            </EcoButton>
        </div>
    )
}
