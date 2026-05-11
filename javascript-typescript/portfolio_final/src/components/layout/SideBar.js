import React from "react";

import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./Sidebar.scss"

//사이드바
const SideBar = ({
    mainColor,
    subColor
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    }
    
    const subColorBG = {
        backgroundColor: subColor,
    }
    const mainColorC = {
        color: mainColor,
    }
    

    const menuItem=[
        {
            path:"/",
            name:"Home",
            icon:<FontAwesomeIcon icon="fa-solid fa-house" />,
        },
        {
            path:"/profile",
            name:"Profile",
            icon:<FontAwesomeIcon icon="fa-solid fa-address-card" />,
        },
        {
            path:"/career",
            name:"Career",
            icon:<FontAwesomeIcon icon="fa-solid fa-clock-rotate-left" />,
        },
        {
            path:"/aboutme",
            name:"Aboutme",
            icon:<FontAwesomeIcon icon="fa-solid fa-book" />,
        },
        {
            path:"/project",
            name:"Project",
            icon:<FontAwesomeIcon icon="fa-solid fa-diagram-project" />,
        },
        {
            path:"/connect",
            name:"Connect",
            icon:<FontAwesomeIcon icon="fa-solid fa-link" />,
        },


    ]

    return (
        <>
            <nav style={subColorBG} className="sidebar_container">
                <div onClick={toggle} style={mainColorC} className="index_list">
                    {isOpen 
                        ? <FontAwesomeIcon icon="fa-solid fa-xmark" /> 
                        : <FontAwesomeIcon icon="fa-solid fa-list" /> 
                    } 
                </div>
                {
                    menuItem.map((item,index)=>(
                        <Link to={item.path}>
                            <div style={mainColorC} className="index_icon">
                            {item.icon} <span>{isOpen ? item.name : null}</span>
                            </div>
                        </Link>
                    ))
                }
                
            </nav>

            
        </>
    )
}

export default SideBar;