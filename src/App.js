import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import About from "./routes/About";
import Navigation from "./components/Navigation";
import Detail from "./routes/Detail";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Navigation />
      <Routes>
        <Route path="/" exact={true} element={<Home />} />;
        <Route path="/about" element={<About />} />;
        <Route path="/movie/:id" element={<Detail />} />
      </Routes>
    </HashRouter>
  );
}

export default App;