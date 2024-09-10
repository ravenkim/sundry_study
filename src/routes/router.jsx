import { createBrowserRouter } from 'react-router-dom'
import Test2 from 'src/pages/Test2.jsx'
import Test1 from 'src/pages/Test1.jsx'
import ErrorPage from 'src/pages/ErrorPage/ErrorPage.jsx'
import LoginPage from 'src/pages/login/LoginPage.jsx'
import HomePage from 'src/pages/home/HomePage.jsx'
import MainPage from 'src/pages/main/MainPage.jsx'
import SamplePage from 'src/pages/SamplePage.jsx'
import Onboarding from './../pages/onboarding/OnBoarding'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
        errorElement: <ErrorPage />,
    },

    {
        path: '/login',
        element: <LoginPage />,
    },

    {
        path: '/home',
        element: <HomePage />,
    },

    {
        path: '/onboarding',
        element: <Onboarding />,
    },


    {
        path: '/sample',
        element: <SamplePage />,
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
