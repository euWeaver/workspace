import React from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./components/HomePage";
import SecondPage from "./components/SecondPage";
import ThirdPage from "./components/ThirdPage";
import FourthPage from "./components/FourthPage";
function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/second" component={SecondPage} />
        <Route path="/third" component={ThirdPage} />
        <Route path="/fourth" component={FourthPage} />
      </Switch>
    </div>
  );
}

export default App;
