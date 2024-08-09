import MobileLayout from 'src/common/layouts/MobileLayout.jsx'

const SSlayout = ({
                     layoutType='mobile',
                      children

}) => {
    return (
        layoutType && <MobileLayout
            style={{
                backgroundColor: 'aqua',
                width: '100dvw',
                height: '100dvh'
            }}
        >
            {children}
        </MobileLayout>
    )
}

export default SSlayout