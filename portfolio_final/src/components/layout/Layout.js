import React from "react";
import SideBar from "./SideBar";
import "./Layout.scss"
import "../design/resetcss.scss"


const Layout = ({
    mainColor,
    subColor,
    children
}) => {
    const mainColorBG = {
        backgroundColor: mainColor,
    }


    return (
        <>  
            <div className="layout" style={mainColorBG}>
                <SideBar mainColor={mainColor} subColor={subColor}>

                </SideBar>
                <div className="layoutInner">
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}

export default Layout;