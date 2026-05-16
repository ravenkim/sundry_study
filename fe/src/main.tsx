import { createRoot } from 'react-dom/client'
import App from 'src/App'
import { Provider } from 'react-redux'
import store from 'src/globals/store/redux/reduxStore.jsx'

import 'src/styles/index.css'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>,
)
