import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import CreateGamePage from "./pages/CreateGamePage";
import io from "socket.io-client";
import { SocketContext } from "./helpers/SocketContext";

let socket = io("http://localhost:3001");

function App() {
  return (
    <div className="App">
      {socket &&
        <SocketContext.Provider value={{socket}}>
          <Router>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/game/:id" exact component={GamePage} />
              <Route path="/creategame" exact component={CreateGamePage} />
            </Switch>
          </Router>
        </SocketContext.Provider>
      }
    </div>
  );
}

export default App;
