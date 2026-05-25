import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Loader2, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import { EcoButton } from 'src/shared/ui/eco'
import { SearchableSelect } from 'src/shared/components/SearchableSelect'
import { useAuth } from 'src/features/auth/AuthContext'
import { getBuildings } from 'src/globals/api/buildingsApi'
import { createReport } from 'src/globals/api/reportApi'
import {
    filterReportableLeafLocations,
    flattenAffiliationLeafLocations,
} from 'src/globals/api/locationUtils'
import type { Building } from 'src/globals/api/types'
import { MOCK_BUILDINGS } from 'src/globals/api/mock/data'

type Step = 'photo' | 'location' | 'loading'

function filterBuildingsByAffiliation(
    items: Building[],
    affiliationId?: number,
): Building[] {
    if (!affiliationId) {
        return items
    }
    return items.filter(
        (building) =>
            building.affiliationId == null ||
            building.affiliationId === affiliationId,
    )
}

function ReportCriteriaGuide() {
    const { t } = useTranslation('report')

    const criteriaItems = [
        t('form.criteriaOffHours'),
        t('form.criteriaEmptyRoom'),
        t('form.criteriaWaste'),
    ]

    const guideItems = [
        t('form.photoGuideClassroom'),
        t('form.photoGuideLighting'),
        t('form.photoGuideWide'),
    ]

    return (
        <div className="border-outline-variant bg-surface-container-low flex flex-col gap-4 rounded-xl border p-4">
            <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold">{t('form.criteriaTitle')}</h3>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                    {t('form.criteriaIntro')}
                </p>
                <ul className="flex flex-col gap-1.5">
                    {criteriaItems.map((item) => (
                        <li
                            key={item}
                            className="text-on-surface flex items-start gap-2 text-xs"
                        >
                            <CheckCircle2 className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-outline-variant flex flex-col gap-2 border-t pt-4">
                <h3 className="text-sm font-bold">{t('form.photoGuideTitle')}</h3>
                <ul className="flex flex-col gap-1.5">
                    {guideItems.map((item) => (
                        <li
                            key={item}
                            className="text-on-surface-variant text-xs leading-relaxed"
                        >
                            • {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export const UserReportForm = () => {
    const { t } = useTranslation('report')
    const navigate = useNavigate()
    const { user } = useAuth()

    const [step, setStep] = useState<Step>('photo')
    const [photo, setPhoto] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [buildings, setBuildings] = useState<Building[]>([])
    const [locationId, setLocationId] = useState<number | ''>('')

    useEffect(() => {
        void getBuildings()
            .then((items) => {
                const scoped = filterBuildingsByAffiliation(
                    items.length > 0 ? items : MOCK_BUILDINGS,
                    user?.affiliationId,
                )
                setBuildings(scoped)
            })
            .catch(() => {
                setBuildings(
                    filterBuildingsByAffiliation(
                        MOCK_BUILDINGS,
                        user?.affiliationId,
                    ),
                )
            })
    }, [user?.affiliationId])

    useEffect(() => {
        if (!photo) {
            setPreviewUrl(null)
            return
        }
        const url = URL.createObjectURL(photo)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [photo])

    const affiliationName = useMemo(() => {
        if (user?.affiliationName) {
            return user.affiliationName
        }
        return buildings[0]?.affiliationName ?? ''
    }, [user?.affiliationName, buildings])

    const leafLocations = useMemo(
        () =>
            filterReportableLeafLocations(
                flattenAffiliationLeafLocations(buildings),
            ),
        [buildings],
    )

    const selectedLocation = leafLocations.find(
        (location) => location.locationId === locationId,
    )

    const locationOptions = useMemo(
        () =>
            leafLocations.map((location) => ({
                value: location.locationId,
                label: location.path ?? location.name,
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
        if (!photo || !selectedLocation) {
            toast.error(t('form.errorPhotoAndLocationRequired'))
            return
        }

        setStep('loading')

        try {
            const response = await createReport({
                image: photo,
                buildingId: selectedLocation.buildingId,
                buildingName: selectedLocation.buildingName,
                locationId: selectedLocation.locationId,
                roomName: selectedLocation.name,
            })

            navigate('/report-success', {
                state: {
                    aiResult: response.aiResult,
                    status: response.status,
                    buildingName: selectedLocation.buildingName,
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
    }, [photo, selectedLocation, navigate, t])

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
                            {t('form.affiliationLabel')}
                        </label>
                        {affiliationName ? (
                            <div className="border-outline-variant bg-surface-container-low rounded-lg border px-4 py-3">
                                <p className="text-on-surface text-sm font-semibold">
                                    {affiliationName}
                                </p>
                            </div>
                        ) : (
                            <p className="text-on-surface-variant text-xs">
                                {t('form.affiliationMissing')}
                            </p>
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
                            disabled={locationOptions.length === 0}
                        />
                        {locationOptions.length === 0 && (
                            <p className="text-on-surface-variant text-xs">
                                {t('form.noReportableRooms')}
                            </p>
                        )}
                    </div>
                </section>

                <div className="flex flex-col gap-3">
                    <EcoButton
                        className="w-full py-4 text-lg"
                        onClick={() => void handleSubmit()}
                        disabled={!selectedLocation}
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

                <ReportCriteriaGuide />

                <label
                    htmlFor="report-photo-input"
                    className={cn(
                        'border-outline-variant bg-surface-container-lowest flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed transition-colors hover:bg-surface-container-low',
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
                </label>

                <input
                    id="report-photo-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        handleFileSelect(e.target.files?.[0])
                        e.target.value = ''
                    }}
                />
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
