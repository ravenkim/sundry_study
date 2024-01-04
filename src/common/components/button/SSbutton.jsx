import React from 'react';
import {Button} from "antd";

const SSbutton = ({
    children,
    style,
    onClick,
    className,
    disabled,
    type,

}) => {

    return (
        <Button

            style={{
                ...style,
            }}
            {...otherProps}
            onClick={onClick}
            className={className}
            disabled={disabled}
            type={type}
        >
            {children}
        </Button>
    );
};

export default SSbutton;
