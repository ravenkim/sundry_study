import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {push} from "redux-first-history";
import {adminAction} from "/src/features/admin/adminReducer.jsx";
import {profileAction} from "../../../../../features/profile/profileReducer.jsx";

const SubMenuButtonWrap = ({
                               text,
                               tab,
                                setMenuOpen,
                            selectedButton
                           }) => {
    const dispatch = useDispatch()


    const [mouseOver, setMouseOver] = useState(false)


    return (
        <li
            onClick={() => {

                if (selectedButton === 'MANAGER') {
                    dispatch(adminAction.setTab(tab))

                    dispatch(push('/admin'))
                }

                else if(selectedButton === 'MY PAGE') {
                    dispatch(profileAction.setTab(tab))

                    dispatch(push('/profile'))
                }

                setMenuOpen(false)
            }}
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
