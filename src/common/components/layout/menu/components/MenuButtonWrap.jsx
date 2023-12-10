import React from 'react';
import {Divider} from "antd";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

const MenuButtonWrap = ({
                            text,
                            url,
                        }) => {


    const dispatch =  useDispatch()


    return (
        <a
            onClick={() =>  dispatch(push(url))}
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
                    flexDirection: "column"

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
        </a>
    );
};

export default MenuButtonWrap;
