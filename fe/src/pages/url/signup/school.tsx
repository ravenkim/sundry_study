import { Navigate, useSearchParams } from 'react-router'

export default function SignupSchoolRedirect() {
    const [searchParams] = useSearchParams()
    const query = searchParams.toString()
    const target = query
        ? `/signup/affiliation?${query}`
        : '/signup/affiliation'

    return <Navigate to={target} replace />
}
