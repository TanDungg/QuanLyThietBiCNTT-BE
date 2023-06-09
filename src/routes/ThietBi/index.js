import React from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "util/asyncComponent";
import Auth from "helpers/Auth";

const LoaiThietBi = asyncComponent(() => import("./LoaiThietBi/LoaiThietBi"));
const LoaiThietBiForm = asyncComponent(() => import("./LoaiThietBi/LoaiThietBiForm"));
const HangThietBi = asyncComponent(() => import("./HangThietBi/HangThietBi"));
const HangThietBiForm = asyncComponent(() => import("./HangThietBi/HangThietBiForm"));

const Home = asyncComponent(() => import("../Home"));

const App = ({ match, location, menus, permission }) => {
  const { pathname } = location;
  return (
    <Switch>
      <Route
        path={`${match.url}/loai-thiet-bi`}
        exact
        component={Auth(LoaiThietBi, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/loai-thiet-bi/them-moi`}
        exact
        component={Auth(LoaiThietBiForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/loai-thiet-bi/:id/chinh-sua`}
        exact
        component={Auth(LoaiThietBiForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/hang-thiet-bi`}
        exact
        component={Auth(HangThietBi, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/hang-thiet-bi/them-moi`}
        exact
        component={Auth(HangThietBiForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/hang-thiet-bi/:id/chinh-sua`}
        exact
        component={Auth(HangThietBiForm, menus, pathname, permission)}
      />
      
      <Route path="*" component={Auth(Home, menus, pathname, permission)} />
    </Switch>
  );
};

export default App;
