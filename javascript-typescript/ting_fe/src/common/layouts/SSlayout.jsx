import MobileLayout from 'src/common/layouts/MobileLayout.jsx'
import NavigationBar from 'src/common/layouts/NavigationBar.jsx'

const SSlayout = ({ layoutType = 'mobile', children, useNav = true }) => {
    const navBarSize = 68
    // todo 이거 디자인 맞게 수정시 아이콘 크기, 패딩도 수정 필요

    // todo 500 까지는 모바일, 일단 500보다 커도 배경 나오게끔 설정함 향후 큰 화면 개발시 레이아웃 수정 필요

    return (
        layoutType === 'mobile' && (
            <MobileLayout>
                <section
                    className={`box-border flex flex-1 flex-col items-center`}
                >
                    {children}
                </section>
                {useNav && <NavigationBar navBarSize={navBarSize} />}
            </MobileLayout>
        )
    )
}

export default SSlayout
