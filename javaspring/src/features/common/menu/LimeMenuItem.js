import React from 'react';

const LimeMenuItem = ({title, path, menuClickHandler, style, className}) => {

    const clickEvent = (e, menuPath) => {
        e.preventDefault();
        menuClickHandler(menuPath);
    }

    return (

        <a onClick={(e) => clickEvent(e, path)} className={`nav-btn-label-40 ${className ? className : ""}`}
           style={style}>
            {title}
        </a>

    );
};

export default LimeMenuItem;