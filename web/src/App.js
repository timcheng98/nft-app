import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './Home'
import Collections from './Collections'
import Account from './Account'

export default function App() {
  return (
    <Router>
        <Switch>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/collections">
            <Collections />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </Router>
  );
}
