import React from 'react';
import {Input} from "antd";

const SSsearchInput = ({
                           children,
                           inputStyle,
                           containerStyle,
                            title,
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
                {...inputOtherProps}
            >


                {children}
            </Input>

        </div>


    );
};


export default SSsearchInput;
