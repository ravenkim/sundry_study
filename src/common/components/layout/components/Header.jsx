import {basicTheme} from "../../../../assets/colors/colors.jsx";
import {CloseOutlined, MenuOutlined} from "@ant-design/icons";
import {useState} from "react";
import {useSelector} from "react-redux";

const Header = ({
    setMenuOpen,
    menuOpen
                }) => {

    const {
        bgcolor1
    } = useSelector(({ assetsReducer }) => ({
    bgcolor1: assetsReducer.colors.bgcolor,
  }));


    return (
        <header
            style = {{
                width: '100%',
                height: '63px',
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}
        >

            <div
                 style = {{
                width: '63px',
                height: '63px',
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            >
                {!menuOpen &&
                    <MenuOutlined
                        onClick={() => setMenuOpen(true)}
                    />
                }

            </div>
            <div

                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                }}
            >
                <img
                    style={{
                        height: 34

                    }}
                    src={'logo/logo_main.png'}  alt={'logo'}/>

            </div>
               <div
                 style = {{
                width: '63px',
                height: '63px',
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>

               </div>






        </header>
        // ussPath = {
        //     pages : '',
        // }
        // <div style={(ussPath ? 'bg-white' : 'gray')}>
        //
        // </div>
    );
};

export default Header;
