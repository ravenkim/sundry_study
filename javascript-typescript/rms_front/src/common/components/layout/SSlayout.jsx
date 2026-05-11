import React, {useEffect, useState} from 'react';
import Background from "src/common/components/layout/components/Background.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Menu from "./menu/Menu.jsx";
import {useDispatch} from "react-redux";

const SSlayout = ({
    children,
    style
                  }) => {

    const [menuOpen, setMenuOpen] = useState(false)


    const dispatch = useDispatch()

    useEffect(() => {

    }, []);



    return (
        <Background

        >
            <Header
                setMenuOpen={setMenuOpen}
                menuOpen={menuOpen}
            />
            <main
                style={{
                    width: '100%',
                    minHeight: 'calc(100vh - 123px)',
                    backgroundColor: 'white',
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: "center",
                    ...style
                }}

            >
                {children}
            </main>
            <Footer/>


            {menuOpen &&
                <Menu
                    setMenuOpen={setMenuOpen}
                    menuOpen={menuOpen}
                />
            }

        </Background>
    );
};

export default SSlayout;
