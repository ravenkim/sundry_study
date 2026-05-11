import React, {useEffect, useState} from "react";

/**
 * SubMenu Component
 * 상위메뉴(폴더) 컴포넌트
 * @param menuList
 * @returns {JSX.Element}
 * @constructor
 */
const LimeSubMenu = ({title, icon, children, visible = false, path, menuClickHandler}) => {

    const [submenuVisible, setSubmenuVisible] = useState(false);

    useEffect(() => {
        setSubmenuVisible(visible);
    }, [visible])

    const submenuClickHandler = (e) => {
        e.preventDefault();

        if (menuClickHandler) {
            menuClickHandler(path);
        } else {
            setSubmenuVisible(!submenuVisible);
        }
    }

    return (
        <>
            <a href={"#"} className="nav-btn-folder-40" onClick={(e) => submenuClickHandler(e)}>

                <span className={`mdi ${icon && icon}`}></span>
                {title}

                {!menuClickHandler ?
                    <span className={submenuVisible ? "mdi mdi-chevron-down" : "mdi mdi-chevron-up"}></span>
                    :<span></span>
                }
            </a>
            {submenuVisible && children && children}
        </>
    );
};

export default LimeSubMenu;
