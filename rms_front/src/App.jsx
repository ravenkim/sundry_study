import IndexRoute from "src/routes/IndexRoute.jsx";
import {HistoryRouter as Router} from "redux-first-history/rr6";
//css import
import 'src/assets/reset.css'
import 'src/assets/global/global.css';
import 'src/assets/text/font.css'

import {history} from "src/app/store.jsx";

function App() {
    return (

        <Router history={history}>

            <IndexRoute/>
        </Router>
    )
}

export default App
