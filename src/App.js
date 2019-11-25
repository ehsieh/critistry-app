import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NewRequest from "./pages/NewRequest";

const App = () => (
  <BrowserRouter>
    <div id="app">
      <Header />
      <div id="content">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/signin" exact component={SignIn} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/new-request" exact component={NewRequest} />
          <Route component={NotFound} />                   
        </Switch>
      </div>
      <Footer />
    </div>
  </BrowserRouter>
);

export default App;