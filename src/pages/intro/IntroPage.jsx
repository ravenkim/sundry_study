import SSlayout from 'src/common/layouts/SSlayout.jsx'
import Intro from 'src/features/intro/Intro.jsx'

const IntroPage = () => {
    return (
        <SSlayout useNav={false}>
            <Intro />
        </SSlayout>
    )
}

export default IntroPage