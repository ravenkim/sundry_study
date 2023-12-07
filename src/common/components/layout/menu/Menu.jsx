import React from 'react';

import {CloseOutlined} from "@ant-design/icons";



const Menu = ({
    setMenuOpen,
    menuOpen
              }) => {


    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                position: 'absolute',
                left: 0,
                top: 0,
                backgroundColor: "black",
                opacity: 0.8,
                display: 'flex',

            }}
        >
            <div>
                <div
                    style = {{
                        height: '63px',
                        width: '63px',
                        color: 'white',
                        display:'flex',
                                        alignItems: "center",
                justifyContent: "center"
                    }}
                    onClick={() => setMenuOpen(false)}

                >
                    {menuOpen && <CloseOutlined/>}
                </div>

            </div>

        </div>
    );
};

export default Menu;
