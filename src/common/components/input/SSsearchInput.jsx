import React from 'react';
import {Input} from "antd";

const SSsearchInput = ({
    children,
    inputStyle,
    containerStyle,
    title,
    onChange,
    onPressEnter,
    placeholder = "",
    inputOtherProps
}) => {
    return (
        <div
            style={{
                marginTop: '40px',
                width: '800px',
                height: '118px',
                display: "flex",
                flexDirection: "column",
                ...containerStyle
            }}
        >
            <h1>
                {title}
            </h1>


            <Input
                style={{
                    marginBottom: '20px',
                    ...inputStyle,
                }}
                placeHolder={{}}
                onChange={onChange}
                placeholder={placeholder}
                onPressEnter={onPressEnter}
                {...inputOtherProps}
            >


                {children}
            </Input>

        </div>


    );
};


export default SSsearchInput;
