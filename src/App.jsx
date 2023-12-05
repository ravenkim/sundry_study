import {BrowserRouter} from "react-router-dom";
import IndexRoute from "/src/routes/IndexRoute.jsx";



import '/src/assets/reset.css'
import '/src/assets/text/font.css'

function App() {
    return (
        <BrowserRouter>
            <IndexRoute/>
        </BrowserRouter>
    )
}

export default App
