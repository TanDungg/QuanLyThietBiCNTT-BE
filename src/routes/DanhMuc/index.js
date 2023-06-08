import React from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "util/asyncComponent";
import Auth from "helpers/Auth";

const TapDoan = asyncComponent(() => import("./TapDoan/TapDoan"));
const TapDoanForm = asyncComponent(() => import("./TapDoan/TapDoanForm"));
const DonVi = asyncComponent(() => import("./DonVi/DonVi"));
const DonViForm = asyncComponent(() => import("./DonVi/DonViForm"));
const PhongBan = asyncComponent(() => import("./PhongBan/PhongBan"));
const PhongBanForm = asyncComponent(() => import("./PhongBan/PhongBanForm"));
const BoPhan = asyncComponent(() => import("./BoPhan/BoPhan"));
const BoPhanForm = asyncComponent(() => import("./BoPhan/BoPhanForm"));
const DonViTinh = asyncComponent(() => import("./DonViTinh/DonViTinh"));
const DonViTinhForm = asyncComponent(() => import("./DonViTinh/DonViTinhForm"));

const Home = asyncComponent(() => import("../Home"));

const App = ({ match, location, menus, permission }) => {
  const { pathname } = location;
  return (
    <Switch>
      <Route
        path={`${match.url}/tap-doan`}
        exact
        component={Auth(TapDoan, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/tap-doan/them-moi`}
        exact
        component={Auth(TapDoanForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/tap-doan/:id/chinh-sua`}
        exact
        component={Auth(TapDoanForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/don-vi`}
        exact
        component={Auth(DonVi, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/don-vi/them-moi`}
        exact
        component={Auth(DonViForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/don-vi/:id/chinh-sua`}
        exact
        component={Auth(DonViForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/phong-ban`}
        exact
        component={Auth(PhongBan, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/phong-ban/them-moi`}
        exact
        component={Auth(PhongBanForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/phong-ban/:id/chinh-sua`}
        exact
        component={Auth(PhongBanForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/bo-phan`}
        exact
        component={Auth(BoPhan, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/bo-phan/them-moi`}
        exact
        component={Auth(BoPhanForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/bo-phan/:id/chinh-sua`}
        exact
        component={Auth(BoPhanForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/don-vi-tinh`}
        exact
        component={Auth(DonViTinh, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/don-vi-tinh/them-moi`}
        exact
        component={Auth(DonViTinhForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/don-vi-tinh/:id/chinh-sua`}
        exact
        component={Auth(DonViTinhForm, menus, pathname, permission)}
      />
      <Route path="*" component={Auth(Home, menus, pathname, permission)} />
    </Switch>
  );
};

export default App;
