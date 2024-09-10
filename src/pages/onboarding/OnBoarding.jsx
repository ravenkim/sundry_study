import SSlayout from 'src/common/layouts/SSlayout.jsx'
import Onboarding from './../../features/onboarding/OnBoarding'

const OnboardingPage = () => {
    return (
        <SSlayout useNav={false}>
            <Onboarding />
        </SSlayout>
    )
}

export default OnboardingPage
