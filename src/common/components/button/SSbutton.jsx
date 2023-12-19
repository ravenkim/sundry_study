import React from 'react';
import {Button} from "antd";

const SSbutton = ({
    children,
    style,
    onClick,
    className,
    ...otherProps
}) => {

    return (
        <Button

            style={{

                ...style,
            }}
            {...otherProps}
            onClick={onClick}
            className={className}
        >
            {children}
        </Button>
    );
};

export default SSbutton;
