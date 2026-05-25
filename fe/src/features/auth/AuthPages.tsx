import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { ArrowLeft, CheckCircle2, Mail, Phone } from 'lucide-react'
import { toast } from 'react-toastify'
import { getAffiliations } from 'src/globals/api/affiliationsApi'
import { getOAuthAuthorizationUrl } from 'src/globals/api/oauth'
import type { Affiliation } from 'src/globals/api/types'
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
    const [affiliationId, setAffiliationId] = useState<number | ''>('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAffiliations()
            .then((affiliationList) => {
                setAffiliations(affiliationList)
            })
            .catch(() => toast.error('소속 목록을 불러오지 못했습니다.'))
            .finally(() => setLoading(false))
    }, [])

    const selectedAffiliation = affiliations.find(
        (affiliation) => affiliation.affiliationId === affiliationId,
    )

    const affiliationOptions = useMemo(
        () =>
            affiliations.map((affiliation) => ({
                value: affiliation.affiliationId,
                label: affiliation.name,
            })),
        [affiliations],
    )

    const handleContinue = (e: FormEvent) => {
        e.preventDefault()

        if (!affiliationId) {
            toast.error('소속을 선택해 주세요.')
            return
        }

        setPendingAffiliation(
            Number(affiliationId),
            selectedAffiliation?.name,
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
                        소속 선택
                    </h2>
                    <p className="text-on-surface-variant text-sm">{subtitle}</p>
                </div>

                {loading ? (
                    <p className="text-on-surface-variant text-sm">
                        소속 목록을 불러오는 중...
                    </p>
                ) : (
                    <form
                        id="affiliation-form"
                        className="flex flex-col gap-5"
                        onSubmit={handleContinue}
                    >
                        {affiliations.length > 0 ? (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-on-surface text-sm font-semibold">
                                    학교·캠퍼스
                                </label>
                                <SearchableSelect
                                    options={affiliationOptions}
                                    value={affiliationId}
                                    onChange={setAffiliationId}
                                    placeholder="학교를 검색·선택해 주세요"
                                    searchPlaceholder="학교명 검색..."
                                />
                            </div>
                        ) : (
                            <p className="text-on-surface-variant text-sm">
                                등록된 소속이 없습니다. 관리자에게 문의해 주세요.
                            </p>
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

interface SignupCompleteState {
    userName?: string
    affiliationName?: string
}

export function SignupComplete() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = (location.state as SignupCompleteState | null) ?? {}

    const handleContinue = () => {
        navigate('/login', { replace: true })
    }

    return (
        <div className="bg-background flex min-h-screen flex-col md:mx-auto md:max-w-[390px]">
            <header className="border-outline-variant bg-surface sticky top-0 z-10 flex h-14 items-center justify-between border-b px-5">
                <div className="w-10" />
                <h1 className="text-primary text-lg font-bold">가입 완료</h1>
                <div className="w-10" />
            </header>

            <main className="flex flex-grow flex-col items-center justify-center gap-8 p-5 pb-28 text-center">
                <div className="bg-secondary-container/20 rounded-full p-8">
                    <CheckCircle2 className="text-secondary h-20 w-20" />
                </div>
                <div className="flex flex-col gap-2">
                    <MascotImage emotion="smile" size="md" decorative />
                    <h2 className="text-on-surface text-2xl font-black">
                        회원가입 완료!
                    </h2>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                        에코리포트에 오신 것을 환영합니다.
                        <br />
                        아래 버튼을 눌러 로그인해 주세요.
                    </p>
                </div>

                {(state.userName || state.affiliationName) && (
                    <div className="border-outline-variant bg-surface w-full rounded-xl border p-5 text-left">
                        {state.userName && (
                            <div className="border-outline-variant/60 flex justify-between border-b py-2.5 text-sm">
                                <span className="text-on-surface-variant">
                                    아이디
                                </span>
                                <span className="font-semibold">
                                    {state.userName}
                                </span>
                            </div>
                        )}
                        {state.affiliationName && (
                            <div className="flex justify-between py-2.5 text-sm">
                                <span className="text-on-surface-variant">
                                    소속
                                </span>
                                <span className="font-semibold">
                                    {state.affiliationName}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <div className="border-outline-variant bg-surface sticky bottom-0 border-t p-5">
                <EcoButton
                    className="w-full py-4 text-lg font-bold"
                    onClick={handleContinue}
                >
                    다음
                </EcoButton>
            </div>
        </div>
    )
}

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
