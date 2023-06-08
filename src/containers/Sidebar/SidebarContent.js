import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu } from "antd";
import { Icon } from "@ant-design/compatible";
import { Link } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import remove from "lodash/remove";
import toNumber from "lodash/toNumber";
import includes from "lodash/includes";
import PropTypes from "prop-types";
import CustomScrollbars from "util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";

import { toggleCollapsedSideNav } from "appRedux/actions/Setting";
import {
  THEME_TYPE_LITE,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
} from "src/constants/ThemeSetting";
import { refillMenuPermission, themeColorHome } from "src/util/Common";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

SidebarContent.propTypes = {
  active: PropTypes.bool,
  onChangClose: PropTypes.func,
};
SidebarContent.defaultProps = {
  active: false,
  onChangClose: null,
};

function SidebarContent(props) {
  const { active, onChangClose } = props;
  let { pathname } = useSelector(({ common }) => common).toJS();
  let { themeType, navStyle, themeColor } = useSelector(
    ({ settings }) => settings
  );
  const dispatch = useDispatch();
  const { navCollapsed } = useSelector(({ common }) => common).toJS();
  const menuInfo = useSelector(({ menus }) => menus);
  const rootSubmenuKeys = [];
  const [openKeys, setOpenKeys] = React.useState(["home"]);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const newPathName =
    pathname === window.location.hash ? pathname : window.location.hash;
  const getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };

  const renderMenuItem = (menu) => {
    if (isEmpty(menu.children)) {
      return (
        <Menu.Item key={`${menu.url}`}>
          <Link to={`/${menu.url}`}>
            <Icon type={menu.icon} />
            <span style={{ margin: 0 }}>{menu.tenMenu}</span>
          </Link>
        </Menu.Item>
      );
    } else {
      if (!includes(menu.url, "/home") && !isEmpty(menu.children)) {
        return (
          <SubMenu
            key={menu.url}
            className="gx-menu-group"
            title={
              <>
                <Icon
                  type={menu.icon}
                  style={{ marginTop: 15, color: themeColorHome(themeColor) }}
                />
                <span style={{ color: themeColorHome(themeColor) }}>
                  {menu.tenMenu}
                </span>
              </>
            }
          >
            {map(menu.children, (item) => {
              return renderMenuItem(item);
            })}
          </SubMenu>
        );
      }
      return (
        <SubMenu
          key={menu.url}
          popupClassName={getNavStyleSubMenuClass(navStyle)}
          title={
            <span>
              {" "}
              <i className={`icon icon-${menu.icon}`} />
              <span>{menu.tenMenu}</span>
            </span>
          }
        >
          {map(menu.children, (item) => {
            return renderMenuItem(item);
          })}
        </SubMenu>
      );
    }
  };

  const renderMenu = () => {
    if (menuInfo && !isEmpty(menuInfo.menus)) {
      const refillMenu = refillMenuPermission(menuInfo.menus);
      return map(refillMenu, (menu) => {
        rootSubmenuKeys.push(menu.url);
        return renderMenuItem(menu);
      });
    }
    return null;
  };

  /**
   * Thay đổi lại key menu để thiết lập active menu kể cả khi nhấn vào thêm mới chỉnh sửa
   * @params {*} list danh sách
   * @memberof SidebarContent
   */
  const reSelectedKeys = (selectedKeys) => {
    const listToRemove = [
      "them-moi",
      "chinh-sua",
      "",
      "chi-tiet",
      "phan-quyen",
      "phan-bo-ke-hoach-giao",
      "phan-bo-ke-hoach-nhan",
      "lap-yeu-cau",
    ];
    let selectedKeysTmp = selectedKeys.split("/");
    map(listToRemove, (val) => remove(selectedKeysTmp, (item) => item === val));
    // Remove all number as string in array
    remove(selectedKeysTmp, (item) => {
      let result = false;
      // convert to number
      if (!isNaN(toNumber(item))) {
        result = true;
      }
      if (item.length === 36) {
        result = true;
      }
      return result;
    });
    return selectedKeysTmp.join("/");
  };

  const selectedKeys = newPathName.substr(2);
  const defaultOpenKeys = selectedKeys.split("/")[0];
  const newSelectedKeys = reSelectedKeys(selectedKeys);
  return (
    <>
      <SidebarLogo />
      <div className="gx-sidebar-content" style={{ marginTop: 5 }}>
        <CustomScrollbars className="gx-layout-sider-scrollbar">
          <Menu
            defaultOpenKeys={[defaultOpenKeys]}
            selectedKeys={[newSelectedKeys]}
            theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
            mode="inline"
            onClick={(item) => {
              dispatch(toggleCollapsedSideNav(!navCollapsed));
            }}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
          >
            <Menu.Item key="home">
              <Link to="/home">
                <Icon type="home" />
                <span style={{ margin: 0 }}>Trang chủ</span>
              </Link>
            </Menu.Item>
            {renderMenu()}
          </Menu>
        </CustomScrollbars>
      </div>
    </>
  );
}

export default SidebarContent;
