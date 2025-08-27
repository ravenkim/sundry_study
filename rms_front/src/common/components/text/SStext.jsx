import React from 'react';
import {Typography} from 'antd';

const {Text} = Typography;

const SStext = ({
                    children,
                    className
                }) => {
    return (
        <Text
            className={className}
        >
            {children}
        </Text>
    );
};

export default SStext;
