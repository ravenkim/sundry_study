import {BrowserRouter} from "react-router-dom";
import IndexRoute from "./routes/IndexRoute.jsx";


function App() {
    return (
        <BrowserRouter>
            <IndexRoute/>
        </BrowserRouter>
    )
}

export default App
