import React from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import "./Layout.scss"


const Layout = ({
    mainColor,
    subColor,
    accentColor,
    children

}) => {
    const layoutS = {
        backgroundColor: mainColor,
    }


    return (
        <>  
            <div className="layout" style={layoutS}>
                <SideBar>

                </SideBar>
                <div className="layoutInner">
                    <Header
                        accentColor = {accentColor}
                    >

                    </Header>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout;