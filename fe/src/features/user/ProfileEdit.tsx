import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { isAxiosError } from 'axios'
import { useAuth } from 'src/features/auth/AuthContext'
import { getAffiliations } from 'src/globals/api/affiliationsApi'
import {
    assignAffiliation,
    getMyProfile,
    updateProfile,
    type MemberProfile,
} from 'src/globals/api/memberProfileApi'
import type { Affiliation } from 'src/globals/api/types'
import { SearchableSelect } from 'src/shared/components/SearchableSelect'
import { EcoButton } from 'src/shared/ui/eco'

function getErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const serverMsg = (error.response?.data as { message?: string })
            ?.message
        return serverMsg || error.message || '서버와 통신할 수 없습니다.'
    }
    if (error instanceof Error) {
        return error.message || '요청 처리 중 오류가 발생했습니다.'
    }
    return '요청 처리 중 오류가 발생했습니다.'
}

function isValidPhoneFormat(phone: string): boolean {
    const digits = phone.replace(/[^0-9]/g, '')
    return /^01[016789]\d{7,8}$/.test(digits)
}

function isValidEmailFormat(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function ProfileEdit() {
    const navigate = useNavigate()
    const { refreshUser } = useAuth()

    const [profile, setProfile] = useState<MemberProfile | null>(null)
    const [affiliations, setAffiliations] = useState<Affiliation[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [affiliationId, setAffiliationId] = useState<number | ''>('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    useEffect(() => {
        Promise.all([getMyProfile(), getAffiliations()])
            .then(([profileData, affiliationList]) => {
                setProfile(profileData)
                setEmail(profileData.email ?? '')
                setPhoneNumber(profileData.phoneNumber ?? '')
                setAffiliationId(profileData.affiliationId ?? '')
                setAffiliations(affiliationList)
            })
            .catch((error) => {
                toast.error(getErrorMessage(error))
                navigate('/profile')
            })
            .finally(() => setLoading(false))
    }, [navigate])

    const affiliationOptions = useMemo(
        () =>
            affiliations.map((affiliation) => ({
                value: affiliation.affiliationId,
                label: affiliation.name,
            })),
        [affiliations],
    )

    const isOAuthUser = Boolean(profile?.provider)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!profile) return

        const trimmedEmail = email.trim()
        const trimmedPhone = phoneNumber.trim()

        if (!trimmedEmail) {
            toast.error('이메일을 입력해 주세요.')
            return
        }
        if (!isValidEmailFormat(trimmedEmail)) {
            toast.error('올바른 이메일 형식을 입력해 주세요.')
            return
        }
        if (!trimmedPhone) {
            toast.error('전화번호를 입력해 주세요.')
            return
        }
        if (!isValidPhoneFormat(trimmedPhone)) {
            toast.error('올바른 휴대전화 번호 형식을 입력해 주세요.')
            return
        }
        if (!affiliationId) {
            toast.error('소속을 선택해 주세요.')
            return
        }

        const emailChanged = trimmedEmail !== (profile.email ?? '')
        const phoneChanged = trimmedPhone !== (profile.phoneNumber ?? '')
        const affiliationChanged =
            Number(affiliationId) !== (profile.affiliationId ?? null)
        const passwordChanged = password.length > 0

        if (passwordChanged) {
            if (password.length < 8) {
                toast.error('비밀번호는 8자 이상이어야 합니다.')
                return
            }
            if (password !== passwordConfirm) {
                toast.error('새 비밀번호가 일치하지 않습니다.')
                return
            }
            if (!isOAuthUser && !currentPassword) {
                toast.error('현재 비밀번호를 입력해 주세요.')
                return
            }
        }

        if (
            !emailChanged &&
            !phoneChanged &&
            !affiliationChanged &&
            !passwordChanged
        ) {
            toast.info('변경된 내용이 없습니다.')
            return
        }

        setSaving(true)
        try {
            let latestProfile = profile

            if (emailChanged || phoneChanged || passwordChanged) {
                latestProfile = await updateProfile({
                    ...(emailChanged ? { email: trimmedEmail } : {}),
                    ...(phoneChanged ? { phoneNumber: trimmedPhone } : {}),
                    ...(passwordChanged
                        ? {
                              password,
                              ...(isOAuthUser
                                  ? {}
                                  : { currentPassword }),
                          }
                        : {}),
                })
            }

            if (affiliationChanged) {
                latestProfile = await assignAffiliation({
                    affiliationId: Number(affiliationId),
                })
            }

            refreshUser({
                userName: latestProfile.userName,
                email: latestProfile.email,
                affiliationName: latestProfile.affiliationName,
                buildingId: latestProfile.buildingId,
                buildingName: latestProfile.buildingName,
                userType: latestProfile.userType,
            })

            toast.success('프로필이 저장되었습니다.')
            navigate('/profile')
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="bg-background flex min-h-screen flex-col md:mx-auto md:max-w-[390px]">
            <header className="border-outline-variant bg-surface sticky top-0 z-10 flex h-14 items-center justify-between border-b px-5">
                <Link to="/profile" className="text-on-surface-variant -ml-2 p-2">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-primary text-lg font-bold">프로필 수정</h1>
                <div className="w-10" />
            </header>

            <main className="flex flex-grow flex-col gap-6 p-5 pb-28">
                {loading ? (
                    <p className="text-on-surface-variant text-center text-sm">
                        프로필을 불러오는 중...
                    </p>
                ) : (
                    <>
                        <div>
                            <h2 className="text-on-surface mb-1 text-xl font-bold">
                                내 정보
                            </h2>
                            <p className="text-on-surface-variant text-sm">
                                연락처와 소속 정보를 변경할 수 있습니다.
                            </p>
                        </div>

                        <form
                            id="profile-edit-form"
                            className="flex flex-col gap-5"
                            onSubmit={handleSubmit}
                        >
                            <div className="flex flex-col gap-1.5">
                                <label className="text-on-surface text-sm font-semibold">
                                    아이디
                                </label>
                                <input
                                    type="text"
                                    value={profile?.userName ?? ''}
                                    readOnly
                                    className="border-outline-variant bg-surface-container-low text-on-surface-variant rounded-lg border p-3.5"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-on-surface text-sm font-semibold">
                                    이메일
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    autoComplete="email"
                                    className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-on-surface text-sm font-semibold">
                                    전화번호
                                </label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                        setPhoneNumber(e.target.value)
                                    }
                                    placeholder="010-1234-5678"
                                    autoComplete="tel"
                                    className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-on-surface text-sm font-semibold">
                                    소속
                                </label>
                                {affiliations.length > 0 ? (
                                    <SearchableSelect
                                        options={affiliationOptions}
                                        value={affiliationId}
                                        onChange={setAffiliationId}
                                        placeholder="학교를 검색·선택해 주세요"
                                        searchPlaceholder="학교명 검색..."
                                    />
                                ) : (
                                    <p className="text-on-surface-variant text-sm">
                                        등록된 소속이 없습니다.
                                    </p>
                                )}
                            </div>

                            <div className="border-outline-variant flex flex-col gap-4 border-t pt-5">
                                <div>
                                    <h3 className="text-on-surface text-sm font-semibold">
                                        비밀번호 변경
                                    </h3>
                                    <p className="text-on-surface-variant mt-1 text-xs">
                                        {isOAuthUser
                                            ? '소셜 로그인 계정은 새 비밀번호만 입력하면 설정됩니다.'
                                            : '변경하지 않으려면 비워 두세요.'}
                                    </p>
                                </div>

                                {!isOAuthUser && (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-on-surface text-sm font-semibold">
                                            현재 비밀번호
                                        </label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) =>
                                                setCurrentPassword(
                                                    e.target.value,
                                                )
                                            }
                                            autoComplete="current-password"
                                            className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-on-surface text-sm font-semibold">
                                        새 비밀번호
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="8자 이상"
                                        autoComplete="new-password"
                                        className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-on-surface text-sm font-semibold">
                                        새 비밀번호 확인
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordConfirm}
                                        onChange={(e) =>
                                            setPasswordConfirm(e.target.value)
                                        }
                                        autoComplete="new-password"
                                        className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                                    />
                                </div>
                            </div>
                        </form>
                    </>
                )}
            </main>

            <div className="border-outline-variant bg-surface sticky bottom-0 border-t p-5">
                <EcoButton
                    className="w-full py-4 text-lg font-bold"
                    type="submit"
                    form="profile-edit-form"
                    disabled={loading || saving}
                >
                    {saving ? '저장 중...' : '저장하기'}
                </EcoButton>
            </div>
        </div>
    )
}
