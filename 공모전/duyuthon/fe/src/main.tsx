import 'src/assets/locales/i18n'
import { createRoot } from 'react-dom/client'
import App from 'src/App'
import { Provider } from 'react-redux'
import store from 'src/globals/store/redux/reduxStore.jsx'

import 'react-toastify/dist/ReactToastify.css'
import 'src/styles/index.css'
import 'src/styles/toast.pcss'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>,
)
