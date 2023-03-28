import React from "react";
import SideBar from "./SideBar";
import "./Layout.scss"


const Layout = ({
    mainColor,
    subColor,
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
                    
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout;