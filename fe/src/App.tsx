import { RouterProvider } from 'react-router'
import router from 'src/globals/router/router.tsx'
import useRouteListener from 'src/globals/router/useRouteListener.tsx'
import { Bounce, ToastContainer } from 'react-toastify'
import { ThemeProvider } from 'src/shared/lib/shadcn/components/ThemeProvider.tsx'
import { useTheme } from 'src/shared/utils/themeUtils.tsx'
import { useEffect } from 'react'
import { AuthProvider } from 'src/features/auth/AuthContext'
import { PointsProvider } from 'src/features/points/PointsContext'
import { RequireAuth } from 'src/shared/components/auth/RequireAuth'

function AppToastContainer() {
    const { theme } = useTheme()

    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme}
            transition={Bounce}
        />
    )
}

function App() {
    useRouteListener()

    // 새로 고침시 애니메이션, 임시 배경색상 처리
    useEffect(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const root = document.documentElement
                const computedBg =
                    getComputedStyle(root).getPropertyValue('--background')

                if (computedBg?.trim()) {
                    root.style.backgroundColor = ''
                    document.body.classList.remove('preload')
                    document.documentElement.classList.remove('theme-instant')
                }
            })
        })
    }, [])

    return (
        <ThemeProvider defaultTheme="light">
            <AuthProvider>
                <PointsProvider>
                    <RequireAuth>
                        <RouterProvider router={router} />
                    </RequireAuth>
                </PointsProvider>
            </AuthProvider>
            <AppToastContainer />
        </ThemeProvider>
    )
}

export default App
