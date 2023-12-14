import React from 'react';
import {Divider} from "antd";

const MenuButtonWrap = ({
    text,
    onMouseOver,
    selected = false,
    cursor,
    onClick
}) => {


    return (
        <li
            onMouseOver={onMouseOver}
            onClick = {onClick}
           style = {  {
                /*backgroundColor: selected && "rgba(0, 0, 0, 0.95)"*/
            }}
            className={'border-b-[1px] border-[#51525c] border-solid hover:border-[#ffffff] text-[#51525c] hover:text-[#ffffff]'}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                    flexDirection: "column",
                    cursor: cursor
                }}
                className={'py-[30px] w-[300px]'}
            >
                <p className={'text-[30px] font-[NotoSansKR-900]'}>{text}</p>

            </div>
        </li>
    );
};

export default MenuButtonWrap;
