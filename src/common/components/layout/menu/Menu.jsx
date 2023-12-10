import React from 'react';

import {CloseOutlined} from "@ant-design/icons";
import {Divider} from "antd";
import MenuButtonWrap from "./components/MenuButtonWrap.jsx";


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
                display: 'flex',
                flexDirection: 'row',
                opacity: '0.9'
            }}
        >
            {/*닫기 버튼*/}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '63px',
                    width: '63px',
                    color: 'white',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onClick={() => setMenuOpen(false)}

            >
                {menuOpen && <CloseOutlined/>}
            </div>


            
            {/*왼쪽 메뉴*/}
            <div
                style={{
                    width: '50%',
                    height: '100%',
                    backgroundColor: "rgba(22, 22, 22, 0.95)",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row-reverse"

                }}
            >
                <ul>
                    <li>
                        <MenuButtonWrap
                            text = {"aaaa"}
                            url = {'/'}
                        />

                    </li>
                    <li>
                        <MenuButtonWrap
                            text = {"aaaa"}
                            url = {'/asd'}
                        />

                    </li>
                </ul>


            </div>
            
            {/*오른쪽 메뉴*/}
            <div
                style={{
                    width: '50%',
                    height: '100%',
                    backgroundColor: "rgba(0, 0, 0, 0.2)"

                }}
            >

            </div>


            {/*<div*/}
            {/*    style={{*/}
            {/*        width: '100%',*/}
            {/*        height: 'calc(100vh - 123px)',*/}
            {/*        display: "flex",*/}
            {/*        alignItems: "center",*/}
            {/*        justifyContent: "center",*/}
            {/*        color: "wheat"*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <div*/}
            {/*        style={{*/}

            {/*            display: "flex",*/}
            {/*            flexDirection: "row",*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <div*/}
            {/*            style={{*/}

            {/*                display: "flex",*/}
            {/*                flexDirection: "column",*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            <ul>*/}
            {/*                <li*/}
            {/*                    style={{*/}
            {/*                        width: '364px',*/}
            {/*                        height: '102px',*/}
            {/*                        padding: '20px',*/}


            {/*                        alignItems: "center",*/}
            {/*                        justifyContent: "center",*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    Home*/}

            {/*                    <Divider*/}
            {/*                        style={{*/}
            {/*                            backgroundColor: "wheat",*/}
            {/*                            margin: 0,*/}
            {/*                            padding: 0*/}
            {/*                        }}*/}
            {/*                    />*/}
            {/*                </li>*/}

            {/*            </ul>*/}


            {/*            <div>*/}

            {/*            </div>*/}

            {/*            <div>*/}
            {/*                222*/}
            {/*            </div>*/}
            {/*            <div>*/}

            {/*                333*/}
            {/*            </div>*/}

            {/*        </div>*/}
            {/*        <div*/}
            {/*            style={{*/}

            {/*                display: "flex",*/}
            {/*                flexDirection: "column",*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            <div>*/}
            {/*                111*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                222*/}
            {/*            </div>*/}
            {/*            <div>*/}

            {/*                333*/}
            {/*            </div>*/}

            {/*        </div>*/}


            {/*    </div>*/}
            {/*</div>*/}

        </div>
    );
};

export default Menu;
