import { createBrowserRouter } from 'react-router-dom'
import Test2 from 'src/pages/Test2.jsx'
import Test1 from 'src/pages/Test1.jsx'
import ErrorPage from 'src/pages/ErrorPage/ErrorPage.jsx'
import HomePage from 'src/pages/home/HomePage.jsx'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/aa',
        element: <Test1 />,
    },
    {
        path: '/bb',
        element: <Test2 />,
    },
])
