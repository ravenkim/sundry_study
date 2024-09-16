import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from 'src/store/store.jsx'

//styles
import 'src/styles/reset.css'
import 'src/styles/shadcn.css'
import 'src/styles/global.scss'

//translator
import 'src/assets/locales/i18n'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>,
)
