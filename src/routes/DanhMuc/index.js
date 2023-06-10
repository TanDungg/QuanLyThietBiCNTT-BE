import React from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "util/asyncComponent";
import Auth from "helpers/Auth";

const NhomThietBi = asyncComponent(() => import("./NhomThietBi/NhomThietBi"));
const NhomThietBiForm = asyncComponent(() =>
  import("./NhomThietBi/NhomThietBiForm")
);

const LoaiThietBi = asyncComponent(() => import("./LoaiThietBi/LoaiThietBi"));
const LoaiThietBiForm = asyncComponent(() =>
  import("./LoaiThietBi/LoaiThietBiForm")
);
const HangThietBi = asyncComponent(() => import("./HangThietBi/HangThietBi"));
const HangThietBiForm = asyncComponent(() =>
  import("./HangThietBi/HangThietBiForm")
);
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
const DonViTraLuong = asyncComponent(() =>
  import("./DonViTraLuong/DonViTraLuong")
);
const DonViTraLuongForm = asyncComponent(() =>
  import("./DonViTraLuong/DonViTraLuongForm")
);

const Home = asyncComponent(() => import("../Home"));

const App = ({ match, location, menus, permission }) => {
  const { pathname } = location;
  return (
    <Switch>
      <Route
        path={`${match.url}/nhom-thiet-bi`}
        exact
        component={Auth(NhomThietBi, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/nhom-thiet-bi/them-moi`}
        exact
        component={Auth(NhomThietBiForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/nhom-thiet-bi/:id/chinh-sua`}
        exact
        component={Auth(NhomThietBiForm, menus, pathname, permission)}
      />

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
      <Route
        path={`${match.url}/don-vi-tra-luong`}
        exact
        component={Auth(DonViTraLuong, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/don-vi-tra-luong/them-moi`}
        exact
        component={Auth(DonViTraLuongForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/don-vi-tra-luong/:id/chinh-sua`}
        exact
        component={Auth(DonViTraLuongForm, menus, pathname, permission)}
      />

      <Route path="*" component={Auth(Home, menus, pathname, permission)} />
    </Switch>
  );
};

export default App;
