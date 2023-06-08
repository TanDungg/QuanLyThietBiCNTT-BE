import cookie from "react-cookies";
import map from "lodash/map";
import replace from "lodash/replace";

import union from "lodash/union";
import assign from "lodash/assign";
import omit from "lodash/omit";
import flattenDeep from "lodash/flattenDeep";
import isEmpty from "lodash/isEmpty";
import qs from "querystring";
import * as FileSaver from "file-saver";
// import * as XLSX from 'xlsx';

import { BASE_URL_API, BASE_URL_APP } from "src/constants/Config";

/**
 * * Lưu dữ liệu vào localStorage
 *
 * @param {*} key
 * @param {*} value
 * @returns
 */
export const setLocalStorage = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value));
};

/**
 * * Lấy dữ liệu từ localStorage
 *
 * @param {*} key
 * @returns
 */
export const getLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

/**
 * * Xoá dữ liệu từ localStorage theo key
 *
 * @param {*} key
 * @returns
 */
export const removeLocalStorage = (key) => {
  return localStorage.getItem(key);
};

/**
 * * Xoá hết dữ liệu trong localStorage
 *
 * @returns
 */
export const removeAllLocalStorage = () => {
  return localStorage.clear();
};

/**
 * Get toolbar value from localStorage
 *
 * @param {*} toolbarName
 */
export const getToolbarValue = (toolbarName) => {
  const toolbar = getLocalStorage("toolbarValue");
  if (toolbar) {
    return toolbar[toolbarName];
  }
  return undefined;
};

/**
 * Set toolbar value to localStorage
 *
 * @param {*} toolbarName
 * @param {*} value
 */
export const setToolbarValue = (toolbarName, value) => {
  return setLocalStorage("toolbarValue", {
    ...getLocalStorage("toolbarValue"),
    [toolbarName]: value,
  });
};

/**
 * setCookieValue: Gán cookie
 *
 * @param {*} name
 * @param {*} value
 * @returns
 */
export const setCookieValue = (name, value, opt = {}) => {
  return cookie.save(name, value, opt);
};

/**
 * * getCookieValue: Lấy cookie
 *
 * @param {*} name
 * @returns
 */
export const getCookieValue = (name) => {
  return cookie.load(name);
};

/**
 * * removeCookieValue: Xoá cookie value
 *
 * @param {*} name
 * @returns
 */
export const removeCookieValue = (name) => {
  return cookie.remove(name, { path: "/" });
};

/**
 * * Lấy token
 * @returns {string}
 */
export const getTokenInfo = () => {
  return getCookieValue("tokenInfo");
};

/**
 * * logOut: Đăng xuất
 */
export const logOut = async () => {
  await removeCookieValue("tokenInfo");
  await removeCookieValue("toolbarValue");
  if (!getTokenInfo()) {
    window.location.href = BASE_URL_APP + "#/signin";
  }
};
/**
 * * lấy ngày tháng năm hiện tại DD/MM/YYYY
 */
export const getDateNow = () => {
  const date = new Date();
  const day =
    (date.getDate().toString().length === 1
      ? "0" + date.getDate()
      : date.getDate()) +
    "/" +
    ((date.getMonth() + 1).toString().length === 1
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    "/" +
    date.getFullYear();
  return day.toString();
};

/**
 * * Xóa ký tự tìm thấy đầu tiên trong string
 *
 * @param {*} string
 * @param {*} character
 * @returns
 */
export const removeFirstCharacterWithInputCharacter = (string, character) => {
  while (string.charAt(0) === character) {
    return string.substr(1);
  }
  return string;
};

/**
 * * Chuyển đổi dữ liệu dạng cây thành thông thường
 *
 * @param {*} tree
 * @returns
 */
export const treeToFlatlist = (tree) => {
  function recurse(nodes, path) {
    return map(nodes, function (node) {
      const newPath = union(path, [node.id]);
      return [
        assign(
          { level: path.length, isParent: path.length % 2 === 0 },
          omit(node, "children")
        ),
        recurse(node.children, newPath),
      ];
    });
  }

  return flattenDeep(recurse(tree, []));
};

/**
 * Convert tree to flat list with level, isParent
 *
 * @param {*} nodes
 * @param {*} path
 * @return {*} array
 */
export const newTreeToFlatlist = (tree, uniqId) => {
  function recurse(nodes, path) {
    return map(nodes, function (node) {
      const newPath = union(path, [node[uniqId]]);
      return [
        assign(
          { level: path.length, isParent: node.children.length > 0 },
          omit(node, "children")
        ),
        recurse(node.children, newPath),
      ];
    });
  }
  return flattenDeep(recurse(tree, []));
};

/**
 * * Chuyển đổi object thành params. Ex: {a: 1, b: 2} => a=1&b=2
 *
 * @param {*} object
 * @returns
 */
export const convertObjectToUrlParams = (object) => {
  return qs.stringify(object);
};
/**
 * * lấy số ngày trong 1 tháng
 *
 *
 * @returns number
 */
export const getNumberDayOfMonth = (thang) => {
  const date = new Date();
  const thangNow = date.getMonth() + 1;
  const nam = date.getFullYear();
  if (thang) {
    if (
      Number(thang) === 1 ||
      Number(thang) === 3 ||
      Number(thang) === 5 ||
      Number(thang) === 7 ||
      Number(thang) === 8 ||
      Number(thang) === 10 ||
      Number(thang) === 12
    ) {
      return 31;
    } else if (
      Number(thang) === 4 ||
      Number(thang) === 6 ||
      Number(thang) === 9 ||
      Number(thang) === 11
    ) {
      return 30;
    } else {
      if (nam % 4 == 0 && nam % 100 != 0) {
        return 29;
      }
      return 28;
    }
  }

  if (
    thangNow === 1 ||
    thangNow === 3 ||
    thangNow === 5 ||
    thangNow === 7 ||
    thangNow === 8 ||
    thangNow === 10 ||
    thangNow === 12
  ) {
    return 31;
  } else if (
    thangNow === 4 ||
    thangNow === 6 ||
    thangNow === 9 ||
    thangNow === 11
  ) {
    return 30;
  } else {
    if (nam % 4 == 0 && nam % 100 != 0) {
      return 29;
    }
    return 28;
  }
};

export const getThangNow = () => {
  return (new Date().getMonth() + 1).toString().length == 1
    ? "0" + (new Date().getMonth() + 1).toString()
    : (new Date().getMonth() + 1).toString();
};
export const getNamNow = () => {
  return new Date().getFullYear().toString();
};
/**
 * * Fill lại cây thông tin khi set lại từ CheckBox
 *
 * @param {*} tree
 * @param {*} id
 * @param {*} value
 * @param {*} name
 */
export const fillTreeWithValue = (tree, id, value, name) =>
  map(tree, (item) => {
    if (item.id === id) {
      if (!item.permission.view && name !== "view" && value) {
        item.permission.view = value;
      }
      item.permission[name] = value;
    } else {
      if (item.children) {
        fillTreeWithValue(item.children, id, value, name);
      }
    }
    return item;
  });

/**
 * * reDataForTable: Dùng cho phân trang
 *
 * @param {array} data
 * @param {number} activePage
 * @param {number} pageSize
 */
export const reDataForTable = (data, activePage = 1, pageSize = 5000) =>
  map(data, (item, index) => {
    if (item.key) delete item.key;
    return {
      key:
        activePage === 1 ? index + 1 : index + (activePage - 1) * pageSize + 1,
      ...item,
    };
  });

/**
 * * reDataForTable: Dùng cho phân trang
 *
 * @param {array} data
 * @param {string} key
 * @param {number} activePage
 * @param {number} pageSize
 */
export const reDataForTableByKey = (
  data,
  key,
  activePage = 1,
  pageSize = 5000
) =>
  map(data, (item, index) => {
    if (item.key) delete item.key;
    if (item.stt) delete item.stt;
    return {
      key: item[key],
      stt:
        activePage === 1 ? index + 1 : index + (activePage - 1) * pageSize + 1,
      ...item,
    };
  });

/**
 * * reDataSelectedTable: Dành cho bảng có phần select
 * * Cần phải thay key mặc định bằng id mới có thể gọi select mặc định
 *
 * @param {*} data
 */
export const reDataSelectedTable = (data) =>
  map(data, (item) => {
    item = { key: item.id, ...item };
    return item;
  });

/**
 * Áp dụng với mảng dữ liệu không có chứa Object bên trong
 *
 * @param {*} data
 */
export const reSelectDataFromArray = (data, options) => {
  if (!isEmpty(data)) {
    return map(data, (item, index) => {
      item = { key: index, name: item[options[1]], value: item[options[0]] };
      return item;
    });
  } else {
    return [];
  }
};

/**
 * * Xử lý nếu menu cấp cha phần View là false nhưng ở menu con bật view hay bất kỳ
 * * thành phần nào là true thì menu cấp cha sẽ trả về view là true
 *
 * @param {array} menus menu lấy từ cơ sở dữ liệu
 */
export const refillMenuPermission = (menus) =>
  map(menus, (item) => {
    if (item && item.permission && !item.permission.view && item.children) {
      let viewValue = undefined;
      map(item.children, (val) => {
        if (
          val.permission.view ||
          val.permission.add ||
          val.permission.edit ||
          val.permission.del ||
          val.permission.cof ||
          val.permission.print
        )
          viewValue = true;
        else viewValue = false;
        if (val.children) {
          refillMenuPermission(val.children);
        }
      });
      item.permission.view = viewValue;
    }
    return item;
  });

/**
 * * Cấu hình màu nút home
 *
 * @param {string} theme
 * @returns
 */
export const themeColorHome = (theme) => {
  let color = "";
  switch (theme) {
    case "light_purple":
      color = "#8A2BE2";
      break;
    case "red":
      color = "#00D9C9";
      break;
    case "blue":
      color = "#FCB53B";
      break;
    case "dark_blue":
      color = "#17BDE5";
      break;
    case "orange":
      color = "#F1D065";
      break;
    case "light_blue":
      color = "#59DCFF";
      break;
    case "deep_orange":
      color = "#70A288";
      break;
    case "light_purple_1":
      color = "#E14594";
      break;
    case "light_purple_2":
      color = "#64D7D6";
      break;
    default:
      color = "#fa8c15";
  }
  return color;
};

/**
 * * Chuyển đổi ảnh thành dạng base64
 *
 * @param file
 * @returns {Promise<unknown>}
 */
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * * numberLocalConvert: chuyển đổi đơn vị số bản địa
 *
 * @param {*} value
 * @returns
 */
export const numberLocalConvert = (value) => {
  if (value && value !== 0) return value.toLocaleString("en-US");
  return value;
};

/**
 * * Chuyển đổi sang đơn vị là MỸ
 *
 * @param {*} value
 * @returns
 */
export const numberLocalConverCurrency = (value, currency = "USD") => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
  });
  return formatter.format(value);
};

/**
 * * Tải file đính kèm
 *
 * @param {*} path
 * @param {*} name
 * @param {*} usePath
 */
export const downloadFile = async (path, name, usePath = false) => {
  const token = getTokenInfo().token;
  let url = path;
  if (usePath) url = BASE_URL_API + "/" + path;
  await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.blob())
    .then(async (response) => {
      const data = await window.URL.createObjectURL(response);

      const link = await document.createElement("a");
      link.href = data;
      link.download = name;
      link.click();
    });
};

/**
 * * Chuyển đổi từ số tuần trong năm sang range từ ngày đến ngày
 *
 * @param {number} w week
 * @param {number} y year
 * @returns {Date}
 */
export const getDateOfISOWeek = (w, y) => {
  const simple = new Date(y, 0, 1 + (w - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
};

/**
 * * Chuyển đổi nhanh tháng năm
 *
 * @param {moment} thang
 * @returns {{Thang: *, Nam: *}}
 */
export const convertThangNam = (thang) => {
  const Thang = thang.format("M");
  const Nam = thang.format("YYYY");
  return { Thang, Nam };
};

/**
 * * Chuyển đổi nhanh tuần năm
 *
 * @param {moment} tuan
 * @returns {{Tuan: *, Nam: *}}
 */
export const convertTuanNam = (tuan) => {
  const Tuan = tuan.format("W");
  const Nam = tuan.format("YYYY");
  return { Tuan, Nam };
};

/**
 * * Trả về danh sách cây tiêu chuẩn trong ANTD
 *
 * @param {object} dataTree - Danh sách cây
 * @param {array} options - Danh sach thuộc tính. Example: ['id', 'tenDonVi', 'children', 'isLeaf']
 * @type {unknown[]}
 */
export const regenaratorTreeList = (dataTree, options) => {
  return map(dataTree, (item) => {
    if (options) {
      item.key = item[options[0]];
      item.title = item[options[1]];
      item.isLeaf = item[options[3]];
      item.children = item[options[2]];
      if (!isEmpty(item.children)) {
        regenaratorTreeList(item.children, options);
      }
      return item;
    }
  });
};

/**
 * * Xuất excel
 *
 * @param fileName
 * @param fileContent
 * @returns {*}
 */
export const exportExcel = (fileName, fileContent) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const byteCharacters = atob(fileContent);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const datawb = new Blob([byteArray], { type: fileType });
  return FileSaver.saveAs(datawb, fileName);
};

/**
 * * Kiểm tra toàn bộ giá trị trong object có rỗng hoặc null hay không ?
 *
 * @param {*} obj
 * @returns true - Toàn bộ là giá trị rỗng
 */
export const checkProperties = (obj) => {
  for (var key in obj) {
    if (obj[key] !== null && obj[key] !== "") return false;
  }
  return true;
};

/**
 * Xuất ra danh sách key theo level
 *
 * @param {*} treeArray
 * @param {*} level
 * @returns
 */
export const expandTreeByKey = (treeArray, level) => {
  let newExpandKey = [];
  map(treeToFlatlist(treeArray), (item) => {
    if (item.level === level) {
      newExpandKey = [...newExpandKey, item.id];
    }
  });
  return newExpandKey;
};

/**
 * Chuyển đổi danh sách lịch
 *
 * @param {*} array
 * @param {array} options [title: noiDung, start: tuNgay, end: denNgay]
 * @returns
 */
export const convertCalendarValue = (array, options) => {
  return map(array, (item) => {
    const start = new Date(item[options[1]]);
    const end = new Date(item[options[2]]);
    return { ...item, title: item[options[0]], start, end };
  });
};
/**
 * convertArrayToSingleArray
 * * Example: [{ id: 1, name: "a" }, { id: n, name: "n" }]
 * * Result: convertArrayToSingleArray(array)('id') => [1, n]
 * @param {*} array
 */
export const convertArrayToSingleArray = (array) => (key) =>
  map(array, (item) => item[key]);

/**
 * Valid vietnamese phone number
 *
 * @param {*} phone
 * @return {*}
 */
export const validatePhone = (phone) => {
  const regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  return regex.test(phone);
};
export const removeDiacritics = (text) => {
  const diacriticsMap = {
    á: "a",
    à: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ắ: "a",
    ằ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    â: "a",
    ấ: "a",
    ầ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    đ: "d",
    é: "e",
    è: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ế: "e",
    ề: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    í: "i",
    ì: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ó: "o",
    ò: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ố: "o",
    ồ: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ớ: "o",
    ờ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ú: "u",
    ù: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ứ: "u",
    ừ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    ý: "y",
    ỳ: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
  };

  return replace(
    text,
    /[áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]/g,
    (match) => diacriticsMap[match] || match
  );
};
