import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { ArrowLeft, Mail, Phone } from 'lucide-react'
import { toast } from 'react-toastify'
import { getAffiliations } from 'src/globals/api/affiliationsApi'
import { getBuildingsForRegister } from 'src/globals/api/buildingsApi'
import { getOAuthAuthorizationUrl } from 'src/globals/api/oauth'
import type { Affiliation, Building } from 'src/globals/api/types'
import { setPendingAffiliation } from 'src/features/auth/signupBuildingStorage'
import { EcoButton } from 'src/shared/ui/eco'
import { MascotImage } from 'src/shared/components/mascort'
import { SearchableSelect } from 'src/shared/components/SearchableSelect'

type SignupIntent = 'signup' | 'oauth'

export function AffiliationSelection() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const intent = (searchParams.get('intent') as SignupIntent) || 'signup'

    const [affiliations, setAffiliations] = useState<Affiliation[]>([])
    const [buildings, setBuildings] = useState<Building[]>([])
    const [affiliationId, setAffiliationId] = useState<number | ''>('')
    const [buildingId, setBuildingId] = useState<number | ''>('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getAffiliations(), getBuildingsForRegister()])
            .then(([affiliationList, buildingList]) => {
                setAffiliations(affiliationList)
                setBuildings(buildingList)
                if (affiliationList.length === 1) {
                    setAffiliationId(affiliationList[0].affiliationId)
                }
            })
            .catch(() => toast.error('소속 목록을 불러오지 못했습니다.'))
            .finally(() => setLoading(false))
    }, [])

    const buildingsForAffiliation = useMemo(() => {
        if (!affiliationId) return buildings
        const filtered = buildings.filter((b) => b.affiliationId === affiliationId)
        return filtered.length > 0 ? filtered : buildings
    }, [affiliationId, buildings])

    const buildingOptions = useMemo(
        () =>
            buildingsForAffiliation.map((building) => ({
                value: building.buildingId,
                label: building.name,
            })),
        [buildingsForAffiliation],
    )

    const selectedAffiliation = affiliations.find(
        (affiliation) => affiliation.affiliationId === affiliationId,
    )

    useEffect(() => {
        setBuildingId('')
    }, [affiliationId])

    const hasSubLocations = buildingsForAffiliation.length > 0
    const requireBuildingSelection = buildingsForAffiliation.length > 0

    const handleContinue = (e: FormEvent) => {
        e.preventDefault()

        if (!affiliationId) {
            toast.error('소속을 선택해 주세요.')
            return
        }
        if (requireBuildingSelection && !buildingId) {
            toast.error('소속 건물을 선택해 주세요.')
            return
        }

        const selectedBuilding = buildingsForAffiliation.find(
            (building) => building.buildingId === buildingId,
        )

        setPendingAffiliation(
            Number(affiliationId),
            buildingId ? Number(buildingId) : undefined,
            selectedBuilding?.name,
        )

        if (intent === 'oauth') {
            try {
                window.location.href = getOAuthAuthorizationUrl('google')
            } catch {
                toast.error('API 서버 주소(VITE_API_HOST)가 설정되지 않았습니다.')
            }
            return
        }

        navigate('/signup')
    }

    const title =
        intent === 'oauth' ? 'Google 로그인' : '회원가입'
    const subtitle =
        intent === 'oauth'
            ? 'Google 계정으로 로그인하기 전, 소속을 선택해 주세요.'
            : '에코리포트 이용을 위해 소속을 선택해 주세요.'

    return (
        <div className="bg-background flex min-h-screen flex-col md:mx-auto md:max-w-[390px]">
            <header className="border-outline-variant bg-surface sticky top-0 z-10 flex h-14 items-center justify-between border-b px-5">
                <Link to="/login" className="text-on-surface-variant -ml-2 p-2">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-primary text-lg font-bold">{title}</h1>
                <div className="w-10" />
            </header>

            <main className="flex flex-grow flex-col gap-8 p-5 pb-28">
                <div className="flex justify-center">
                    <MascotImage emotion="smile" size="md" decorative />
                </div>
                <div>
                    <h2 className="text-on-surface mb-1 text-xl font-bold">
                        소속 건물 선택
                    </h2>
                    <p className="text-on-surface-variant text-sm">{subtitle}</p>
                    <p className="text-on-surface-variant/80 mt-2 text-xs leading-relaxed">
                        가입 후 선택한 건물의 제보·절약 정보만 확인할 수 있습니다.
                    </p>
                </div>

                {loading ? (
                    <p className="text-on-surface-variant text-sm">
                        건물 목록을 불러오는 중...
                    </p>
                ) : (
                    <form
                        id="affiliation-form"
                        className="flex flex-col gap-5"
                        onSubmit={handleContinue}
                    >
                        {affiliations.length > 1 ? (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-on-surface text-sm font-semibold">
                                    학교·캠퍼스
                                </label>
                                <select
                                    value={affiliationId}
                                    onChange={(e) =>
                                        setAffiliationId(Number(e.target.value) || '')
                                    }
                                    className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                                >
                                    <option value="">학교를 선택해 주세요</option>
                                    {affiliations.map((affiliation) => (
                                        <option
                                            key={affiliation.affiliationId}
                                            value={affiliation.affiliationId}
                                        >
                                            {affiliation.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : selectedAffiliation ? (
                            <div className="border-outline-variant bg-surface-container-low rounded-lg border px-4 py-3">
                                <p className="text-on-surface-variant text-xs font-bold">
                                    학교·캠퍼스
                                </p>
                                <p className="text-on-surface text-sm font-semibold">
                                    {selectedAffiliation.name}
                                </p>
                            </div>
                        ) : null}

                        {hasSubLocations && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-on-surface text-sm font-semibold">
                                    소속 건물
                                </label>
                                <SearchableSelect
                                    options={buildingOptions}
                                    value={buildingId}
                                    onChange={setBuildingId}
                                    placeholder="건물을 검색·선택해 주세요"
                                    searchPlaceholder="건물명 검색..."
                                    disabled={!affiliationId && affiliations.length > 1}
                                />
                            </div>
                        )}
                    </form>
                )}
            </main>

            <div className="border-outline-variant bg-surface sticky bottom-0 border-t p-5">
                <EcoButton
                    className="w-full py-4 text-lg font-bold"
                    type="submit"
                    form="affiliation-form"
                    disabled={loading}
                >
                    {intent === 'oauth' ? 'Google 계정으로 계속' : '다음'}
                </EcoButton>
            </div>
        </div>
    )
}

/** @deprecated use AffiliationSelection */
export const SchoolSelection = AffiliationSelection

interface AuthInquiryPageProps {
    title: string
    description: string
    phone: string
    email: string
}

export function AuthInquiryPage({
    title,
    description,
    phone,
    email,
}: AuthInquiryPageProps) {
    return (
        <div className="bg-background flex min-h-screen flex-col md:mx-auto md:max-w-[390px]">
            <header className="border-outline-variant bg-surface sticky top-0 z-10 flex h-14 items-center justify-between border-b px-5">
                <Link to="/login" className="text-on-surface-variant -ml-2 p-2">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-primary text-lg font-bold">{title}</h1>
                <div className="w-10" />
            </header>

            <main className="flex flex-grow flex-col gap-6 p-5">
                <div className="flex justify-center pt-4">
                    <MascotImage emotion="sad" size="md" decorative />
                </div>

                <div className="flex flex-col gap-2 text-center">
                    <h2 className="text-on-surface text-xl font-bold">{title}</h2>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="border-outline-variant bg-surface flex flex-col gap-4 rounded-xl border p-5">
                    <a
                        href={`tel:${phone.replace(/\s/g, '')}`}
                        className="text-on-surface hover:text-primary flex items-center gap-3 text-sm font-medium"
                    >
                        <Phone className="text-primary h-5 w-5 shrink-0" />
                        <span>{phone}</span>
                    </a>
                    <a
                        href={`mailto:${email}`}
                        className="text-on-surface hover:text-primary flex items-center gap-3 text-sm font-medium"
                    >
                        <Mail className="text-primary h-5 w-5 shrink-0" />
                        <span>{email}</span>
                    </a>
                </div>

                <p className="text-on-surface-variant text-center text-xs leading-relaxed">
                    운영 시간 내 문의 주시면 순차적으로 안내해 드립니다.
                </p>
            </main>

            <div className="border-outline-variant bg-surface border-t p-5">
                <EcoButton
                    className="w-full py-4 text-lg font-bold"
                    variant="outline"
                    onClick={() => window.history.back()}
                >
                    돌아가기
                </EcoButton>
            </div>
        </div>
    )
}

export function FindAccountInquiry() {
    return (
        <AuthInquiryPage
            title="아이디 · 비밀번호 찾기"
            description="아이디 또는 비밀번호를 잊으셨다면 아래 연락처로 문의해 주세요. 본인 확인 후 안내해 드립니다."
            phone="010-1111-1111"
            email="eco@repoort.com"
        />
    )
}

export function AdminSignupInquiry() {
    return (
        <AuthInquiryPage
            title="관리자 회원가입"
            description="건물 관리자 계정은 별도 승인 후 발급됩니다. 아래 연락처로 소속명과 담당 구역 정보를 함께 문의해 주세요."
            phone="010-1111-1111"
            email="eco@repoort.com"
        />
    )
}
