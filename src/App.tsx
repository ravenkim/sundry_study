import { RouterProvider } from 'react-router'
import router from 'src/app/router/router.tsx'
import useRouteListener from 'src/app/router/useRouteListener.tsx'
import { Bounce, ToastContainer } from 'react-toastify'
import { ThemeProvider } from 'src/shared/lib/shadcn/components/ThemeProvider.tsx'
import { useEffect } from 'react'

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
        <ThemeProvider>
            <RouterProvider router={router} />
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
                theme="light"
                transition={Bounce}
            />
        </ThemeProvider>
    )
}

export default App
