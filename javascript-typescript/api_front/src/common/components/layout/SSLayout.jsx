import {theme} from "src/assets/colors/colors.jsx";
import Header from "src/common/components/layout/components/Header.jsx";
import Footer from "src/common/components/layout/components/Footer.jsx";

/**
 * @param {boolean} useHeader - [true], false :: 해더 사용여부
 * @param {boolean} useLeftSidebar - [true], false :: 왼쪽 사이드바 사용여부
 * @param {text} useLeftSidebar - [sm], lg, full :: 왼쪽 사이드바 크기 (해더 옆인지 아래인지)
 * */



const SSLayout = ({
    useLeftSidebar  = true,
    leftSidebarType = "sm",
}) => {
    return (
        <div
            style={{
                backgroundColor: theme.bgColor,
                width: '100vw',
                minHeight: '100vh',
            }}
        >

            {leftSidebarType==="sm"?
                <>
                    <Header/>
                    {useLeftSidebar&&

                        <></>
                    }

                    <Footer/>
                </>
                :
            null
            }

            {leftSidebarType==="lg"?
                <>
                    <div>
                        {useLeftSidebar&&
                            <></>
                        }
                        <div>
                            <Header/>
                        </div>
                    </div>
                </>
                : null
            }









        </div>
    );
};




export default SSLayout;
