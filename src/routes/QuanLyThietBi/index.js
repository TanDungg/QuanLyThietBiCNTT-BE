import React from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "util/asyncComponent";
import Auth from "helpers/Auth";

const Home = asyncComponent(() => import("../Home"));

const App = ({ match, location, menus, permission }) => {
  const { pathname } = location;
  return (
    <Switch>
      <Route path="*" component={Auth(Home, menus, pathname, permission)} />
    </Switch>
  );
};

export default App;
