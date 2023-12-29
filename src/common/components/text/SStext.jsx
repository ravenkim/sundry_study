import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const SStext = ({ children }) => {
    return (
        <Text>
            {children}
        </Text>
    );
};

export default SStext;
