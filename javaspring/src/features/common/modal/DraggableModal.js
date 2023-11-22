import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import Draggable from "react-draggable";
import { CloseOutlined } from "@ant-design/icons";

const DraggableModal = ({
  title,
  visible,
  okText,
  cancelText,
  okButtonProps,
  cancelButtonProps,
  onOkCallbackHandler,
  onCancelCallbackHandler,
  titleStyle,
  modalStyle,
  bodyStyle,
  afterClose,
  width,
  maskClosable = true,
  closable = true,
  children,
  footer,
}) => {
  const [disabled, setDisabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (visible != null && typeof visible === "boolean") {
      setModalVisible(visible);
    }
  }, [visible]);

  // ok 버튼 클릭 Handler
  const modalOkClickHandler = (e) => {
    if (onOkCallbackHandler) {
      onOkCallbackHandler(false);
    } else {
      setModalVisible(false);
    }
  };
  // cancel 버튼 클릭 Handler
  const modalCancelClickHandler = (e) => {
    if (onCancelCallbackHandler) {
      onCancelCallbackHandler(false);
    } else {
      setModalVisible(false);
    }
  };

  return (
    <Modal
      title={
        <div
          style={{
            width: "100%",
            cursor: "move",
            height: "10px",
            ...titleStyle,
          }}
          onMouseOver={() => setDisabled(false)}
          onMouseOut={() => setDisabled(true)}
          onFocus={() => {}}
          onBlur={() => {}}
        >
          <Button
            className={"ant-modal-close"}
            type={"link"}
            style={{ top: "5px", right: "10px" }}
            icon={<CloseOutlined />}
            onClick={modalCancelClickHandler}
          />
          <strong>{title ? title : ""}</strong>
        </div>
      }
      // onOk={modalCancelClickHandler}
      // okButtonProps={{ type: "default", ...cancelButtonProps }}
      // okText={cancelText ? cancelText : "닫기"}
      // onCancel={modalOkClickHandler}
      // cancelButtonProps={{ type: "primary", ...okButtonProps, }}
      // cancelText={okText ? okText : "확인"}
      afterClose={afterClose && afterClose}
      visible={modalVisible}
      modalRender={(modal) => (
        <Draggable disabled={disabled}>{modal}</Draggable>
      )}
      style={modalStyle}
      bodyStyle={{ ...bodyStyle }}
      maskClosable={false}
      closable={false}
      footer={
        footer ? (
          footer
        ) : (
          <>
            <Button
              onClick={modalOkClickHandler}
              size={"small"}
              type={"primary"}
            >
              확인
            </Button>
            <Button onClick={modalCancelClickHandler} size={"small"}>
              닫기
            </Button>
          </>
        )
      }
      width={width}
      getContainer={false}
    >
      {children}
    </Modal>
  );
};

export default DraggableModal;
