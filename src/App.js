import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import CreateGamePage from "./pages/CreateGamePage";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/game/:id" exact component={GamePage} />
          <Route path="/creategame" exact component={CreateGamePage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
