import React, { useState, useEffect } from "react";
import { Form, Input, Card, Switch } from "antd";
import { useDispatch } from "react-redux";
import includes from "lodash/includes";

import { Select, FormSubmit } from "src/components/Common";
import { fetchStart, fetchReset } from "src/appRedux/actions";
import { DEFAULT_FORM_STYLE } from "src/constants/Config";
import ContainerHeader from "src/components/ContainerHeader";

const FormItem = Form.Item;

const initialState = {
  email: "",
  fullName: "",
  chucDanh: "",
  userName: "",
  maNhanVien: "",
  phoneNumber: "",
  chucVu_Id: "",
  boPhan_Id: "",
  phongBan_Id: "",
  donVi_Id: "",
  donViTraLuong_Id: "",
  roleNames: [],
  isActive: true,
};
const NguoiDungForm = ({ history, match, permission }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("new");
  const [id, setId] = useState(undefined);
  const [roleSelect, setRoleSelect] = useState([]);
  const [chucVuSelect, setChucVuSelect] = useState([]);
  const [boPhanSelect, setBoPhanSelect] = useState([]);
  const [phongBanSelect, setPhongBanSelect] = useState([]);
  const [donViSelect, setDonViSelect] = useState([]);
  const [donViTraLuongSelect, setDonViTraLuongSelect] = useState([]);
  const [fieldTouch, setFieldTouch] = useState(false);
  const [form] = Form.useForm();
  const {
    email,
    fullName,
    roleNames,
    isActive,
    maNhanVien,
    phoneNumber,
    chucVu_Id,
    boPhan_Id,
    phongBan_Id,
    donVi_Id,
    donViTraLuong_Id,
    chucDanh,
  } = initialState;
  const { validateFields, resetFields, setFieldsValue } = form;

  useEffect(() => {
    const load = () => {
      if (includes(match.url, "them-moi")) {
        if (permission && permission.add) {
          setType("new");
        } else if (permission && !permission.add) {
          history.push("/home");
        }
      } else {
        if (permission && permission.edit) {
          setType("edit");
          // Get info
          const { id } = match.params;
          setId(id);
          getInfo();
        } else if (permission && !permission.edit) {
          history.push("/home");
        }
      }
      getData();
    };
    load();
    return () => dispatch(fetchReset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getData = () => {
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(`ChucVu`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          setChucVuSelect(res.data);
        }
      })
      .catch((error) => console.error(error));
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(`BoPhan`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          setBoPhanSelect(res.data);
        }
      })
      .catch((error) => console.error(error));
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(`PhongBan`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          setPhongBanSelect(res.data);
        }
      })
      .catch((error) => console.error(error));
    new Promise((resolve, reject) => {
      dispatch(fetchStart(`DonVi`, "GET", null, "DETAIL", "", resolve, reject));
    })
      .then((res) => {
        if (res && res.data) {
          setDonViSelect(res.data);
        }
      })
      .catch((error) => console.error(error));
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(`DonViTraLuong`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          setDonViTraLuongSelect(res.data);
        }
      })
      .catch((error) => console.error(error));
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(
          `Role/Form`,
          "GET",
          null,
          "LIST",
          "listRole",
          resolve,
          reject
        )
      );
    })
      .then((res) => {
        if (res && res.data) {
          setRoleSelect(res.data);
        }
      })
      .catch((error) => console.error(error));
  };

  /**
   * Lấy thông tin
   *
   */
  const getInfo = () => {
    const { id } = match.params;
    setId(id);
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(`Account/${id}`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          setFieldsValue({
            user: res.data,
          });
        }
      })
      .catch((error) => console.error(error));
  };

  /**
   * Lấy danh sách quyền
   *
  //  */
  // const getRole = () => {
  //   new Promise((resolve, reject) => {
  //     dispatch(
  //       fetchStart(
  //         `Role/Form`,
  //         "GET",
  //         null,
  //         "LIST",
  //         "listRole",
  //         resolve,
  //         reject
  //       )
  //     );
  //   })
  //     .then((res) => {
  //       if (res && res.data) {
  //         setRoleSelect(res.data);
  //       }
  //     })
  //     .catch((error) => console.error(error));
  // };

  /**
   * Quay lại trang người dùng
   *
   */
  const goBack = () => {
    history.push("/he-thong/nguoi-dung");
  };

  /**
   * Khi submit
   *
   * @param {*} values
   */
  const onFinish = (values) => {
    saveData(values.user);
  };

  const saveAndClose = () => {
    validateFields()
      .then((values) => {
        console.log(values);
        saveData(values.user, true);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const saveData = (user, saveQuit = false) => {
    if (type === "new") {
      const newData = user;
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(`Account`, "POST", newData, "ADD", "", resolve, reject)
        );
      })
        .then((res) => {
          if (saveQuit) {
            if (res.status !== 409) goBack();
          } else {
            resetFields();
            setFieldTouch(false);
          }
        })
        .catch((error) => console.error(error));
    }
    if (type === "edit") {
      const newData = user;
      newData.id = id;
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(
            `Account/${id}`,
            "PUT",
            newData,
            "EDIT",
            "",
            resolve,
            reject
          )
        );
      })
        .then((res) => {
          if (saveQuit) {
            if (res.status !== 409) goBack();
          } else {
            getInfo();
            setFieldTouch(false);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const formTitle =
    type === "new" ? "Thêm mới người dùng" : "Chỉnh sửa người dùng";
  return (
    <div className="gx-main-content">
      <ContainerHeader title={formTitle} back={goBack} />
      <Card className="th-card-margin-bottom">
        <Form
          {...DEFAULT_FORM_STYLE}
          form={form}
          name="nguoi-dung-control"
          onFinish={onFinish}
          onFieldsChange={() => setFieldTouch(true)}
        >
          <FormItem
            label="Địa chỉ email"
            name={["user", "email"]}
            rules={[
              {
                type: "email",
                required: true,
              },
            ]}
            initialValue={email}
          >
            <Input className="input-item" placeholder="Nhập địa chỉ email" />
          </FormItem>
          <FormItem
            label="Họ tên"
            name={["user", "fullName"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={fullName}
          >
            <Input className="input-item" placeholder="Nhập họ tên" />
          </FormItem>
          <FormItem
            label="Mã nhân viên"
            name={["user", "maNhanVien"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={maNhanVien}
          >
            <Input className="input-item" placeholder="Nhập mã nhân viên" />
          </FormItem>
          <FormItem
            label="Số điện thoại"
            name={["user", "phoneNumber"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={phoneNumber}
          >
            <Input className="input-item" placeholder="Nhập số điện thoại" />
          </FormItem>
          <FormItem
            label="Chức vụ"
            name={["user", "chucVu_Id"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={chucVu_Id}
          >
            <Select
              className="heading-select slt-search th-select-heading"
              data={chucVuSelect ? chucVuSelect : []}
              placeholder="Chọn chức vụ"
              optionsvalue={["id", "tenChucVu"]}
              style={{ width: "100%" }}
              // mode="multiple"
            />
          </FormItem>
          <FormItem
            label="Bộ phận"
            name={["user", "boPhan_Id"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={boPhan_Id}
          >
            <Select
              className="heading-select slt-search th-select-heading"
              data={boPhanSelect ? boPhanSelect : []}
              placeholder="Chọn bộ phận"
              optionsvalue={["id", "tenBoPhan"]}
              style={{ width: "100%" }}
              // mode="multiple"
            />
          </FormItem>
          <FormItem
            label="Phòng ban"
            name={["user", "phongBan_Id"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={phongBan_Id}
          >
            <Select
              className="heading-select slt-search th-select-heading"
              data={phongBanSelect ? phongBanSelect : []}
              placeholder="Chọn phòng ban"
              optionsvalue={["id", "tenPhongBan"]}
              style={{ width: "100%" }}
              // mode="multiple"
            />
          </FormItem>
          <FormItem
            label="Đơn vị"
            name={["user", "donVi_Id"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={donVi_Id}
          >
            <Select
              className="heading-select slt-search th-select-heading"
              data={donViSelect ? donViSelect : []}
              placeholder="Chọn đơn vị"
              optionsvalue={["id", "tenDonVi"]}
              style={{ width: "100%" }}
              // mode="multiple"
            />
          </FormItem>
          <FormItem
            label="Đơn vị trả lương"
            name={["user", "donViTraLuong_Id"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={donViTraLuong_Id}
          >
            <Select
              className="heading-select slt-search th-select-heading"
              data={donViTraLuongSelect ? donViTraLuongSelect : []}
              placeholder="Chọn đơn vị trả lương"
              optionsvalue={["id", "tenDonViTraLuong"]}
              style={{ width: "100%" }}
              // mode="multiple"
            />
          </FormItem>
          <FormItem
            label="Vai trò"
            name={["user", "roleNames"]}
            rules={[
              {
                type: "array",
                required: true,
              },
            ]}
            initialValue={roleNames}
          >
            <Select
              className="heading-select slt-search th-select-heading"
              data={roleSelect ? roleSelect : []}
              placeholder="Chọn vai trò"
              optionsvalue={["name", "description"]}
              style={{ width: "100%" }}
              mode="multiple"
            />
          </FormItem>
          <FormItem
            label="Chức danh"
            name={["user", "chucDanh"]}
            // rules={[
            //   {
            //     type: "string",
            //     required: true,
            //   },
            // ]}
            initialValue={chucDanh}
          >
            <Input className="input-item" placeholder="Nhập chức danh" />
          </FormItem>
          <FormItem
            label="Hoạt động"
            name={["user", "isActive"]}
            valuePropName="checked"
            initialValue={isActive}
          >
            <Switch />
          </FormItem>
          <FormSubmit
            goBack={goBack}
            saveAndClose={saveAndClose}
            disabled={fieldTouch}
          />
        </Form>
      </Card>
    </div>
  );
};

export default NguoiDungForm;
