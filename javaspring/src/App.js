import React from "react";
import { ConnectedRouter } from "connected-react-router";
import "App.less";

import 'features/common/layout/styles/reset.css';
import 'features/common/layout/styles/common.css';
// import "features/common/layout/styles/custom.scss";
import 'features/common/layout/styles/icon/materialdesignicons.min.css';
import IndexRoute from "routes/IndexRoute";

function App({ history }) {
  return (
    <ConnectedRouter history={history}>
      <IndexRoute />
    </ConnectedRouter>
  );
}
export default App;
