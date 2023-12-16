import {CloseOutlined, MenuOutlined} from "@ant-design/icons";
import {shallowEqual, useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {push} from "redux-first-history";

const Header = ({
                    setMenuOpen,
                    menuOpen
                }) => {

    const dispatch = useDispatch()


    const {
        bgcolor1
    } = useSelector(({assetsReducer}) => ({
            bgcolor1: assetsReducer.colors.bgcolor,
        }),
        shallowEqual
    );


    return (
        <header
            style={{
                width: '100%',
                height: '63px',
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                userSelect: 'none',
            }}
        >
            {/*메뉴 버튼*/}
            <div
                style={{
                    width: '63px',
                    height: '63px',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                className={'cursor-pointer'}
                onClick={() => setMenuOpen(true)}
            >
                {!menuOpen &&
                    <MenuOutlined

                    />
                }

            </div>
            {/*로고 이미지*/}
            <div

                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                }}
                onClick={() => dispatch(push('/'))}
            >

                <img
                    style={{
                        height: 34

                    }}
                    src={'/src/assets/logo/logo_main.png'} alt={'logo'}
                />


            </div>
            {/*프로필 영역*/}
            <div
                style={{
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
