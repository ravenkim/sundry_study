import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {push} from "redux-first-history";
import {adminAction} from "/src/features/admin/adminReducer.jsx";
import {profileAction} from "../../../../../features/profile/profileReducer.jsx";

const SubMenuButtonWrap = ({
   text,
   tab,
   setMenuOpen,
   selectedButton,
   boardId
}) => {

    const dispatch = useDispatch()


    const [mouseOver, setMouseOver] = useState(false)

    const onClickHandler = () => {
        if (selectedButton === 'MANAGER') {
            dispatch(adminAction.setTab(tab))
            dispatch(push('/admin'))
        } else if (selectedButton === 'MY PAGE') {
            dispatch(profileAction.setTab(tab))
            dispatch(push('/profile'))
        } else if (selectedButton === 'CONTENTS') {
            dispatch(push(`/contents/${boardId}`))
        }

        setMenuOpen(false)
    }


    return (
        <li
            onClick={onClickHandler}
            onMouseOver={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
            style={{
                cursor: "pointer"
            }}
        >
            <div
                style={{
                    width: '364px',
                    height: '67px',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: mouseOver ? "white" : "#51525C",
                    boxSizing: "border-box",
                    flexDirection: "column"

                }}
                className={'text-[22px] font-[NotoSansKR-700]'}
            >
                {text}

            </div>

        </li>
    );
};

export default SubMenuButtonWrap;
