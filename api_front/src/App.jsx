import {BrowserRouter} from "react-router-dom";
import IndexRoute from "src/routes/IndexRoute.jsx";


import 'src/assets/reset.css'



function App() {

    return (
        <BrowserRouter>
            <IndexRoute/>
        </BrowserRouter>
    )
}

export default App
