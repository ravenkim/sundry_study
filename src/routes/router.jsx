import {
    createBrowserRouter,
} from "react-router-dom";
import Test2 from "src/pages/Test2.jsx";
import Test1 from "src/pages/Test1.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <div>Hello world!</div>,
    },

    {
        path: "/bb",
        element: <Test2/>,
    },
    {
        path: "/aa",
        element: <Test1/>,
    },
])