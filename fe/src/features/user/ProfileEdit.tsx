import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from 'src/features/auth/AuthContext'
import { checkNicknameAvailability } from 'src/globals/api/authApi'
import { getAffiliations } from 'src/globals/api/affiliationsApi'
import { getBuildings } from 'src/globals/api/buildingsApi'
import {
    assignAffiliation,
    assignBuilding,
    getMyProfile,
    updateProfile,
    type MemberProfile,
} from 'src/globals/api/memberProfileApi'
import type { Affiliation, Building } from 'src/globals/api/types'
import { SearchableSelect } from 'src/shared/components/SearchableSelect'
import { EcoButton } from 'src/shared/ui/eco'
import { SSloadingState } from 'src/shared/components/motion'
import { getErrorMessage } from 'src/shared/lib/i18n/getErrorMessage'
import { isValidNicknameFormat } from 'src/shared/lib/nicknameUtils'

function isValidPhoneFormat(phone: string): boolean {
    const digits = phone.replace(/[^0-9]/g, '')
    return /^01[016789]\d{7,8}$/.test(digits)
}

function isValidEmailFormat(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function ProfileEdit() {
    const { t } = useTranslation(['user', 'errors', 'common'])
    const navigate = useNavigate()
    const { refreshUser } = useAuth()

    const [profile, setProfile] = useState<MemberProfile | null>(null)
    const [affiliations, setAffiliations] = useState<Affiliation[]>([])
    const [buildings, setBuildings] = useState<Building[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [affiliationId, setAffiliationId] = useState<number | ''>('')
    const [buildingId, setBuildingId] = useState<number | ''>('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [nicknameChecked, setNicknameChecked] = useState(false)
    const [nicknameAvailable, setNicknameAvailable] = useState(false)
    const [checkingNickname, setCheckingNickname] = useState(false)

    useEffect(() => {
        Promise.all([getMyProfile(), getAffiliations(), getBuildings()])
            .then(([profileData, affiliationList, buildingList]) => {
                setProfile(profileData)
                setNickname(profileData.nickname ?? '')
                setEmail(profileData.email ?? '')
                setPhoneNumber(profileData.phoneNumber ?? '')
                setAffiliationId(profileData.affiliationId ?? '')
                setBuildingId(profileData.buildingId ?? '')
                setAffiliations(affiliationList)
                setBuildings(buildingList)
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

    const buildingOptions = useMemo(
        () =>
            buildings
                .filter(
                    (building) =>
                        !affiliationId ||
                        building.affiliationId === Number(affiliationId),
                )
                .map((building) => ({
                    value: building.buildingId,
                    label: building.name,
                })),
        [affiliationId, buildings],
    )

    const isOAuthUser = Boolean(profile?.provider)

    const handleNicknameChange = (value: string) => {
        setNickname(value)
        setNicknameChecked(false)
        setNicknameAvailable(false)
    }

    const handleCheckNickname = async () => {
        const trimmed = nickname.trim()
        if (!trimmed) {
            toast.error(t('errors:nicknameRequired'))
            return
        }
        if (!isValidNicknameFormat(trimmed)) {
            toast.error(t('errors:nicknameInvalidFormat'))
            return
        }
        if (trimmed === (profile?.nickname ?? '')) {
            setNicknameChecked(true)
            setNicknameAvailable(true)
            toast.success(t('user:profileEdit.nicknameUnchanged'))
            return
        }

        setCheckingNickname(true)
        try {
            const result = await checkNicknameAvailability(trimmed)
            setNicknameChecked(true)
            setNicknameAvailable(result.available)
            if (result.available) {
                toast.success(t('user:profileEdit.nicknameAvailable'))
            } else {
                toast.error(t('user:profileEdit.nicknameTaken'))
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setCheckingNickname(false)
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!profile) return

        const trimmedNickname = nickname.trim()
        const trimmedEmail = email.trim()
        const trimmedPhone = phoneNumber.trim()

        if (!trimmedNickname) {
            toast.error(t('user:profileEdit.errorNicknameRequired'))
            return
        }
        if (!isValidNicknameFormat(trimmedNickname)) {
            toast.error(t('errors:nicknameInvalidFormat'))
            return
        }
        if (!trimmedEmail) {
            toast.error(t('user:profileEdit.errorEmailRequired'))
            return
        }
        if (!isValidEmailFormat(trimmedEmail)) {
            toast.error(t('user:profileEdit.errorEmailInvalid'))
            return
        }
        if (!trimmedPhone) {
            toast.error(t('user:profileEdit.errorPhoneRequired'))
            return
        }
        if (!isValidPhoneFormat(trimmedPhone)) {
            toast.error(t('user:profileEdit.errorPhoneInvalid'))
            return
        }
        if (!affiliationId) {
            toast.error(t('user:profileEdit.errorAffiliationRequired'))
            return
        }

        const nicknameChanged = trimmedNickname !== (profile.nickname ?? '')
        const emailChanged = trimmedEmail !== (profile.email ?? '')
        const phoneChanged = trimmedPhone !== (profile.phoneNumber ?? '')
        const affiliationChanged =
            Number(affiliationId) !== (profile.affiliationId ?? null)
        const buildingChanged =
            buildingId !== '' &&
            Number(buildingId) !== (profile.buildingId ?? null)
        const passwordChanged = password.length > 0

        if (nicknameChanged && (!nicknameChecked || !nicknameAvailable)) {
            toast.error(t('errors:nicknameCheckRequired'))
            return
        }

        if (passwordChanged) {
            if (password.length < 8) {
                toast.error(t('user:profileEdit.errorPasswordMinLength'))
                return
            }
            if (password !== passwordConfirm) {
                toast.error(t('user:profileEdit.errorPasswordMismatch'))
                return
            }
            if (!isOAuthUser && !currentPassword) {
                toast.error(t('user:profileEdit.errorCurrentPasswordRequired'))
                return
            }
        }

        if (
            !nicknameChanged &&
            !emailChanged &&
            !phoneChanged &&
            !affiliationChanged &&
            !buildingChanged &&
            !passwordChanged
        ) {
            toast.info(t('user:profileEdit.infoNoChanges'))
            return
        }

        setSaving(true)
        try {
            let latestProfile = profile

            if (
                nicknameChanged ||
                emailChanged ||
                phoneChanged ||
                passwordChanged
            ) {
                latestProfile = await updateProfile({
                    ...(nicknameChanged ? { nickname: trimmedNickname } : {}),
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

            if (buildingChanged) {
                latestProfile = await assignBuilding({
                    buildingId: Number(buildingId),
                })
            } else if (affiliationChanged) {
                latestProfile = await assignAffiliation({
                    affiliationId: Number(affiliationId),
                })
            }

            refreshUser({
                userName: latestProfile.userName,
                nickname: latestProfile.nickname,
                email: latestProfile.email,
                affiliationName: latestProfile.affiliationName,
                buildingId: latestProfile.buildingId,
                buildingName: latestProfile.buildingName,
                userType: latestProfile.userType,
            })

            toast.success(t('user:profileEdit.successSaved'))
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
                <h1 className="text-primary text-lg font-bold">
                    {t('user:profileEdit.title')}
                </h1>
                <div className="w-10" />
            </header>

            <main className="flex flex-grow flex-col gap-6 p-5 pb-28">
                {loading ? (
                    <SSloadingState
                        text={t('user:profileEdit.loading')}
                        mascot="sleepy"
                    />
                ) : (
                    <>
                        <div>
                            <h2 className="text-on-surface mb-1 text-xl font-bold">
                                {t('user:profileEdit.sectionTitle')}
                            </h2>
                            <p className="text-on-surface-variant text-sm">
                                {t('user:profileEdit.sectionDescription')}
                            </p>
                        </div>

                        <form
                            id="profile-edit-form"
                            className="flex flex-col gap-5"
                            onSubmit={handleSubmit}
                        >
                            <div className="flex flex-col gap-1.5">
                                <label className="text-on-surface text-sm font-semibold">
                                    {t('user:profileEdit.username')}
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
                                    {t('user:profileEdit.nickname')}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) =>
                                            handleNicknameChange(e.target.value)
                                        }
                                        placeholder={t(
                                            'user:profileEdit.nicknamePlaceholder',
                                        )}
                                        autoComplete="nickname"
                                        className="border-outline-variant bg-surface focus:ring-primary-container flex-1 rounded-lg border p-3.5 outline-none focus:ring-2"
                                    />
                                    <EcoButton
                                        variant="outline"
                                        className="px-4 whitespace-nowrap"
                                        type="button"
                                        disabled={checkingNickname}
                                        onClick={handleCheckNickname}
                                    >
                                        {checkingNickname
                                            ? t('common:checking')
                                            : t('common:duplicateCheck')}
                                    </EcoButton>
                                </div>
                                {nicknameChecked && (
                                    <p
                                        className={`text-xs font-medium ${
                                            nicknameAvailable
                                                ? 'text-primary'
                                                : 'text-error'
                                        }`}
                                    >
                                        {nicknameAvailable
                                            ? t('user:profileEdit.nicknameAvailable')
                                            : t('user:profileEdit.nicknameTaken')}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-on-surface text-sm font-semibold">
                                    {t('user:profileEdit.email')}
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t(
                                        'user:profileEdit.emailPlaceholder',
                                    )}
                                    autoComplete="email"
                                    className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-on-surface text-sm font-semibold">
                                    {t('user:profileEdit.phone')}
                                </label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                        setPhoneNumber(e.target.value)
                                    }
                                    placeholder={t(
                                        'user:profileEdit.phonePlaceholder',
                                    )}
                                    autoComplete="tel"
                                    className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-on-surface text-sm font-semibold">
                                    {t('user:profileEdit.affiliation')}
                                </label>
                                {affiliations.length > 0 ? (
                                    <SearchableSelect
                                        options={affiliationOptions}
                                        value={affiliationId}
                                        onChange={setAffiliationId}
                                        placeholder={t(
                                            'user:profileEdit.affiliationPlaceholder',
                                        )}
                                        searchPlaceholder={t(
                                            'user:profileEdit.affiliationSearchPlaceholder',
                                        )}
                                    />
                                ) : (
                                    <p className="text-on-surface-variant text-sm">
                                        {t('user:profileEdit.noAffiliations')}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-on-surface text-sm font-semibold">
                                    {t('user:profileEdit.building')}
                                </label>
                                {buildingOptions.length > 0 ? (
                                    <SearchableSelect
                                        options={buildingOptions}
                                        value={buildingId}
                                        onChange={setBuildingId}
                                        placeholder={t(
                                            'user:profileEdit.buildingPlaceholder',
                                        )}
                                        searchPlaceholder={t(
                                            'user:profileEdit.buildingSearchPlaceholder',
                                        )}
                                    />
                                ) : (
                                    <p className="text-on-surface-variant text-sm">
                                        {t('user:profileEdit.noBuildings')}
                                    </p>
                                )}
                                <p className="text-on-surface-variant text-xs">
                                    {t('user:profileEdit.buildingHint')}
                                </p>
                            </div>

                            <div className="border-outline-variant flex flex-col gap-4 border-t pt-5">
                                <div>
                                    <h3 className="text-on-surface text-sm font-semibold">
                                        {t('user:profileEdit.passwordSectionTitle')}
                                    </h3>
                                    <p className="text-on-surface-variant mt-1 text-xs">
                                        {isOAuthUser
                                            ? t(
                                                  'user:profileEdit.passwordHintOAuth',
                                              )
                                            : t(
                                                  'user:profileEdit.passwordHintLocal',
                                              )}
                                    </p>
                                </div>

                                {!isOAuthUser && (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-on-surface text-sm font-semibold">
                                            {t(
                                                'user:profileEdit.currentPassword',
                                            )}
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
                                        {t('user:profileEdit.newPassword')}
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder={t(
                                            'user:profileEdit.newPasswordPlaceholder',
                                        )}
                                        autoComplete="new-password"
                                        className="border-outline-variant bg-surface focus:ring-primary-container rounded-lg border p-3.5 outline-none focus:ring-2"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-on-surface text-sm font-semibold">
                                        {t('user:profileEdit.confirmPassword')}
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
                    {saving
                        ? t('user:profileEdit.saving')
                        : t('user:profileEdit.save')}
                </EcoButton>
            </div>
        </div>
    )
}
