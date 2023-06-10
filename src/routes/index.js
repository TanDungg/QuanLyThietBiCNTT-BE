import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Auth from "src/helpers/Auth";
import { getTokenInfo } from "src/util/Common";
import asyncComponent from "util/asyncComponent";

const Home = asyncComponent(() => import("./Home"));
const HeThong = asyncComponent(() => import("./HeThong"));
const TaiKhoan = asyncComponent(() => import("./TaiKhoan"));
const DanhMuc = asyncComponent(() => import("./DanhMuc"));
const QuanLyThietBi = asyncComponent(() => import("./QuanLyThietBi"));

const App = ({ match, menus, location }) => {
  const { pathname } = location;
  const tokenInfo = getTokenInfo();
  return (
    <div className="gx-main-content-wrapper">
      {tokenInfo.mustChangePass ? (
        <Switch>
          <Route
            path={`${match.url}home`}
            component={Auth(Home, menus, pathname)}
          />
          <Route
            path={`${match.url}tai-khoan`}
            component={Auth(TaiKhoan, menus, pathname)}
          />
        </Switch>
      ) : (
        <Switch>
          <Route
            path={`${match.url}home`}
            component={Auth(Home, menus, pathname)}
          />
          <Route
            path={`${match.url}he-thong`}
            component={Auth(HeThong, menus, pathname)}
          />
          <Route
            path={`${match.url}tai-khoan`}
            component={Auth(TaiKhoan, menus, pathname)}
          />
          <Route
            path={`${match.url}danh-muc`}
            component={Auth(DanhMuc, menus, pathname)}
          />
          <Route
            path={`${match.url}quan-ly-thiet-bi`}
            component={Auth(QuanLyThietBi, menus, pathname)}
          />

          <Route path="*" component={Auth(Home, menus, pathname)} />
        </Switch>
      )}
      {tokenInfo.mustChangePass && <Redirect to="/tai-khoan" />}
    </div>
  );
};

export default App;
