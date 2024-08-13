import { ThemeProvider } from 'src/assets/shadcn/ThemeProvider.jsx'
import { router } from 'src/routes/router.jsx'
import { RouterProvider } from 'react-router-dom'
import useRouteListener from 'src/routes/useRouteListener.jsx'


//styles
import 'src/styles/reset.css'
import 'src/styles/shadcn.css'
import 'src/styles/global.css'


function App() {


    useRouteListener();

    return (
        <ThemeProvider defaultTheme="root" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    )
}

export default App
