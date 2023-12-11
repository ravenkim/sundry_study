import React, {useEffect, useState} from 'react';
import {Input} from "antd";

const SSsearchInput = ({
                           title,
                           onPressEnter,
                           onChange,
                           value,
                           placeholder = "",
                           inputStyle,
                           containerStyle,
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
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onPressEnter={onPressEnter}
                {...inputOtherProps}
            >
            </Input>
        </div>
    );
};

export default SSsearchInput;
