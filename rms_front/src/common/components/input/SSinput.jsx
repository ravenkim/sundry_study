import React from 'react';
import {Input} from "antd";

const SSinput = ({
                     label,
                     children,
                     style,
                    isPassword = false,
                     ...otherProps
                 }) => {

    const ComponentToRender = isPassword ? Input.Password : Input;
    return (
        <>

            {label && <h5>{label}</h5>}

            <ComponentToRender

                style={{
                    marginBottom: '20px',
                    ...style,
                }}
                {...otherProps}
            >


                {children}
            </ComponentToRender>
       </>
    );
};


export default SSinput;
