import MobileLayout from 'src/common/layouts/MobileLayout.jsx'
import { useState } from 'react'
import NavigationBar from 'src/common/layouts/NavigationBar.jsx'

const SSlayout = ({ layoutType = 'mobile', children, useNav = true }) => {

    const navBarSize = '50px';


    return (
        layoutType === 'mobile' && (
            <MobileLayout
            >
                <section
                    style={{
                        width: '100%',
                        height: useNav ? `calc(100% - ${navBarSize})` : '100%',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '85%',
height:'100%',
                            boxSizing: 'border-box'
                        }}
                    >
                        {children}
                    </div>
                </section>
                {useNav && <NavigationBar

                    navBarSize = { navBarSize }
                   />}




            </MobileLayout>
        )
    )
}

export default SSlayout
