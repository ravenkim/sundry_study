import React from 'react';
import {Divider} from "antd";

const MenuButtonWrap = ({
    text,
    onMouseOver,
    selected = false,
    cursor
}) => {


    return (
        <li
            onMouseOver={onMouseOver}
           style = {  {
                backgroundColor: selected && "rgba(0, 0, 0, 0.95)"
            }}
        >
            <div
                style={{
                    width: '364px',
                    height: '100px',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "wheat",
                    boxSizing: "border-box",
                    flexDirection: "column",
                    cursor: cursor

                }}
            >
                {text}

            </div>
            <Divider
                style={{
                    backgroundColor: "wheat",
                    margin: 0,
                    padding: 0,

                }}
            />
        </li>
    );
};

export default MenuButtonWrap;
