import {ThemeProvider} from "src/assets/shadcn/ThemeProvider.jsx";

import 'src/styles/shadcn.css'
import {router} from "src/routes/router.jsx";
import {
    RouterProvider,
} from "react-router-dom";

function App() {

  return (

        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>

  )
}

export default App
