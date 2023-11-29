import {Route, Routes} from "react-router-dom";



const IndexRoute = () => {
    return (
        <Routes>
            <Route
              path="/a"
              element={<div>zzzzz</div>}
            />
            <Route
              path="/test"
              element={<div/>}
            />
            <Route
              path="/sample1"
              element={<div/>}
            />
            <Route
              path="/"
              element={<div/>}
            />

        </Routes>
    )
}

export default IndexRoute;