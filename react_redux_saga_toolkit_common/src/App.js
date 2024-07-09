import { BrowserRouter } from 'react-router-dom';
import IndexRoute from 'routes/IndexRoute';
import './App.css';

function App({history}) {
  return (
    <BrowserRouter history={history}>
      <IndexRoute/>
    </BrowserRouter>
  );
}

export default App;
