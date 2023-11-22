import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import LimeHeader from "features/common/layout/components/LimeHeader";
import LimeSider from "features/common/layout/components/LimeSider";

const LimeLayout = ({title, description, useTooltip, children}) => {
    const {location, cacheData} = useSelector(({router, indexReducer}) => ({
        location: router.location,
        cacheData : indexReducer.cacheData.data
    }));

    const [menuList, setMenuList] = useState([]);

    useEffect(()=>{
        if(cacheData){
            if("menuList" in cacheData){
                setMenuList(cacheData.menuList);
            }
        }
    },[cacheData])

    const [siderVisible, setSiderVisible] = useState(false);
    const siderChangeHandler = () => {
        setSiderVisible(!siderVisible);
    }

    const siderCloseHandler = () => {
        setSiderVisible(false);
    }

    return (
        <>
            {/* ------------ Header -------------- */}
            <LimeHeader pageTitle={title} siderChangeHandler={siderChangeHandler}/>

            {/* ------------ Sider -------------- */}
            <LimeSider menuList={menuList} siderVisible={siderVisible} siderCloseHandler={siderCloseHandler}/>
            {/* ------------ Body -------------- */}
            <main className="grid-col-full p-16">
                <div className="main-height-large overflow-auto">
                    {children}
                </div>
            </main>
        </>
    );
};

export default LimeLayout;
