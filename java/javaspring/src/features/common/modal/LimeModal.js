import React, {useEffect} from "react";
import {Modal} from "antd";

const LimeModal = ({
                       className="modal gap-0",
                       title,
                       titleClassName,
                       visible,
                       masking = true,
                       closeHandler,
                       closable = true,
                       children,
                        style,
                   }) => {

    const modalCloseHandler = () => {
        if (closeHandler && typeof closeHandler === "function") {
            closeHandler(false);
        }
    }

    return (
        <>
            {masking && <div className={`modal-mask ${visible ? "" : "no-show"}`}></div>}
            <div className={`modal ${className ? className : ""} ${visible ? "" : " no-show"}`} style={{...style}}>
                <div className={`title ${titleClassName ? titleClassName : "mb-24"}`}>
                    <h3>{title}</h3>
                    {closable && <button type="button" className="close" onClick={modalCloseHandler}/>}
                </div>
                {children}
            </div>
        </>
    );
};

export default LimeModal;
