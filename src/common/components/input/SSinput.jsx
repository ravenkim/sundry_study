import React from 'react';
import {Input} from "antd";

const SSinput = ({
                     children,
                     style,
                     ...otherProps
                 }) => {
    return (
        <Input
            style={{
                marginBottom: '20px',
                ...style,
            }}
            {...otherProps}
        >


            {children}
        </Input>
    );
};


export default SSinput;
