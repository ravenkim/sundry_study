import MobileLayout from 'src/common/layouts/MobileLayout.jsx'
import NavigationBar from 'src/common/layouts/NavigationBar.jsx'

const SSlayout = ({ layoutType = 'mobile', children, useNav = true }) => {
    const navBarSize = '60px'


    // todo 500 까지는 모바일, 일단 500보다 커도 배경 나오게끔 설정함 향후 큰 화면 개발시 레이아웃 수정 필요

    return (
        layoutType === 'mobile' && (
            <MobileLayout>
                <section
                    className={`w-full ${useNav ? `h-[calc(100%-${navBarSize})]` : 'h-full'} flex flex-col items-center box-border`}
                >
                    {children}
                </section>
                {useNav && <NavigationBar navBarSize={navBarSize} />}
            </MobileLayout>
        )
    )
}

export default SSlayout
