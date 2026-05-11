import Main from 'src/features/main/Main.jsx'
import SSlayout from 'src/common/layouts/SSlayout.jsx'

const MainPage = () => {
    return (
        <SSlayout useNav={false}>
            <Main />
        </SSlayout>
    )
}

export default MainPage