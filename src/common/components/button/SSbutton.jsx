import React from 'react';
import {Button} from "antd";

const SSbutton = ({
    children,
    style,
    ...otherProps
}) => {

    return (
        <Button

            style={{

                ...style,
            }}
            {...otherProps}

        >
            {children}
        </Button>
    );
};

export default SSbutton;
