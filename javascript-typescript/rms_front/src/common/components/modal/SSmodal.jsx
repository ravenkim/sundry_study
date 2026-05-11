import React from 'react';
import {Modal} from "antd";

const SSmodal = ({
                     title,
                     visible = true,
                     onOk,
                     onCancel,
                     children,
                     ...otherProps
                 }) => {


    return (
        <Modal
            title={title}
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            {...otherProps}
        >
            {children}
        </Modal>
    );
};

export default SSmodal;
