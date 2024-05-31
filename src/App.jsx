import {ThemeProvider} from "src/assets/shadcn/ThemeProvider.jsx";

import 'src/styles/shadcn.css'
import {router} from "src/routes/router.jsx";
import {
    RouterProvider, useLocation,
} from "react-router-dom";
import {useEffect} from "react";



function App() {





  return (

        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>

  )
}

export default App
