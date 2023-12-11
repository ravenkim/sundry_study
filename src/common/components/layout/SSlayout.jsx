import React, {useState} from 'react';
import Background from "./components/Background.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Menu from "./menu/Menu.jsx";

const SSlayout = ({
    children
                  }) => {

    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <Background>
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
                    alignItems: "center"
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
