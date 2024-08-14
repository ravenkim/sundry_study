import MobileLayout from 'src/common/layouts/MobileLayout.jsx'
import { useState } from 'react'

const SSlayout = ({ layoutType = 'mobile', children }) => {

    const [paddingTop, setPaddingTop] = useState(48)


    return (
        layoutType === 'mobile' && (
            <MobileLayout
                style={{
                    backgroundColor: 'aqua',
                    width: '100dvw',
                    height: '100dvh',
                }}
            >
                <section
                    style={{
                        width: '100%',
                        height: '100%',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            paddingTop: paddingTop,
                            width: '85%',
                            boxSizing: 'border-box'
                        }}
                    >
                        {children}
                    </div>

                </section>

                <footer></footer>
            </MobileLayout>
        )
    )
}

export default SSlayout
