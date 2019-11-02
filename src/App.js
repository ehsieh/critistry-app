import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import Home from "./pages/Home";

const App = () => (
  <BrowserRouter>
    <div id="app">
      <Header />
      <div id="content">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route component={NotFound} />                   
        </Switch>
      </div>
      <Footer />
    </div>
  </BrowserRouter>
);

export default App;