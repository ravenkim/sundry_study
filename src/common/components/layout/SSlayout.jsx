import React, {useState, useRef} from 'react';
import Background from "./components/Background.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Menu from "./menu/Menu.jsx";

const SSlayout = ({
    children,
    style
                  }) => {

    const [menuOpen, setMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)

    const modalRef = useRef(null)
    const modalOutsideClick = (e) => {
        if(modalRef.current === e.target) {
            setProfileOpen(false)
            console.log('작동중')
        }
    }

    return (
        <Background

        >
            <Header
                setMenuOpen={setMenuOpen}
                menuOpen={menuOpen}
                setProfileOpen={setProfileOpen}
                profileOpen={profileOpen}
                modalRef={modalRef}
                onClick={(e)=>modalOutsideClick(e)}
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
                ref={modalRef}
                onClick={(e)=>modalOutsideClick(e)}
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
