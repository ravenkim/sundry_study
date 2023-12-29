import React from 'react';


import { Typography } from 'antd';


const SStext = (children) => {

    const { Paragraph, Text } = Typography;



    return (
        <Text>
            {children}
        </Text>
    );
};

export default SStext;
