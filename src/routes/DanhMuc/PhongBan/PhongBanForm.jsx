import { Card, Form, Input } from "antd";
import includes from "lodash/includes";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { fetchReset, fetchStart } from "src/appRedux/actions";
import { FormSubmit, Select } from "src/components/Common";
import ContainerHeader from "src/components/ContainerHeader";
import { DEFAULT_FORM_CUSTOM } from "src/constants/Config";

const FormItem = Form.Item;

const initialState = {
  maPhongBan: "",
  tenPhongBan: "",
  donVi_Id: "",
  tapDoan_Id: "",
};
const PhongBanForm = ({ history, match, permission }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("new");
  const [id, setId] = useState(undefined);
  const [fieldTouch, setFieldTouch] = useState(false);
  const [form] = Form.useForm();
  const { maPhongBan, tenPhongBan, donVi_Id, tapDoan_Id } = initialState;
  const [donViSelect, setDonViSelect] = useState([]);
  const [tapDoanSelect, setTapDoanSelect] = useState([]);

  const { validateFields, resetFields, setFieldsValue } = form;
  const [infoDonVi, setInfoDonVi] = useState({});
  const [infoTapDoan, setInfoTapDoan] = useState({});
  useEffect(() => {
    const load = () => {
      if (includes(match.url, "them-moi")) {
        if (permission && permission.add) {
          getDataDonVi();
          getDataTapDoan();
          setType("new");
        } else if (permission && !permission.add) {
          history.push("/home");
        }
      } else {
        if (permission && permission.edit) {
          setType("edit");
          const { id } = match.params;
          setId(id);
          getInfoDonVi();
          getInfoTapDoan();
        } else if (permission && !permission.edit) {
          history.push("/home");
        }
      }
    };
    load();
    return () => dispatch(fetchReset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDataDonVi = () => {
    new Promise((resolve, reject) => {
      dispatch(fetchStart(`DonVi`, "GET", null, "DETAIL", "", resolve, reject));
    })
      .then((res) => {
        if (res && res.data) {
          setDonViSelect(res.data);
        }
      })
      .catch((error) => console.error(error));
  };
  const getDataTapDoan = () => {
    new Promise((resolve, reject) => {
      dispatch(fetchStart(`TapDoan`, "GET", null, "DETAIL", "", resolve, reject));
    })
      .then((res) => {
        if (res && res.data) {
          setTapDoanSelect(res.data);
        }
      })
      .catch((error) => console.error(error));
  };

  /**
   * Lấy thông tin
   *
   */
  const getInfoDonVi = () => {
    const { id } = match.params;
    getDataDonVi();
    setId(id);
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(`PhongBan/${id}`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          const data = res.data[0];
          setFieldsValue({
            phongban: data,
          });
          setInfoDonVi(...res.data, res.data[0].donVi);
        }
      })
      .catch((error) => console.error(error));
  };
  const getInfoTapDoan = () => {
    const { id } = match.params;
    getDataTapDoan();
    setId(id);
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(`PhongBan/${id}`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          const data = res.data[0];
          setFieldsValue({
            phongban: data,
          });
          setInfoTapDoan(...res.data, res.data[0].tapDoan);
        }
      })
      .catch((error) => console.error(error));
  };
  /**
   * Quay lại trang người dùng
   *
   */
  const goBack = () => {
    history.push("/danh-muc/phong-ban");
  };

  /**
   * Khi submit
   *
   * @param {*} values
   */
  const onFinish = (values) => {
    saveData(values.phongban);
  };

  const saveAndClose = () => {
    validateFields()
      .then((values) => {
        saveData(values.phongban, true);
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
          fetchStart(`PhongBan`, "POST", newData, "ADD", "", resolve, reject)
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
      delete infoDonVi.donVi;
      var newData = { ...infoDonVi, ...user };
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(
            `PhongBan/${id}`,
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
            getInfoDonVi();
            setFieldTouch(false);
          }
        })
        .catch((error) => console.error(error));
    }
    if (type === "edit") {
        delete infoTapDoan.tapDoan;
        var newData = { ...infoTapDoan, ...user };
        new Promise((resolve, reject) => {
          dispatch(
            fetchStart(
              `PhongBan/${id}`,
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
              getInfoTapDoan();
              setFieldTouch(false);
            }
          })
          .catch((error) => console.error(error));
      }
  };

  const formTitle = type === "new" ? "Thêm mới phòng ban" : "Chỉnh sửa phòng ban";
  return (
    <div className="gx-main-content">
      <ContainerHeader title={formTitle} back={goBack} />
      <Card className="th-card-margin-bottom">
        <Form
          {...DEFAULT_FORM_CUSTOM}
          form={form}
          name="nguoi-dung-control"
          onFinish={onFinish}
          onFieldsChange={() => setFieldTouch(true)}
        >
          <FormItem
            label="Mã phòng ban"
            name={["phongban", "maPhongBan"]}
            rules={[
              {
                type: "string",
                required: true,
              },
              {
                max: 50,
                message: "Mã phòng ban không được quá 50 ký tự",
              },
            ]}
            initialValue={maPhongBan}
          >
            <Input className="input-item" placeholder="Nhập mã phòng ban" />
          </FormItem>
          <FormItem
            label="Tên phòng ban"
            name={["phongban", "tenPhongBan"]}
            rules={[
              {
                type: "string",
                required: true,
              },
              {
                max: 250,
                message: "Tên phòng ban không được quá 250 ký tự",
              },
            ]}
            initialValue={tenPhongBan}
          >
            <Input className="input-item" placeholder="Nhập tên phòng ban" />
          </FormItem>
          <FormItem
            label="Đơn vị"
            name={["phongban", "donVi_Id"]}
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
              placeholder="Chọn loại đơn vị"
              optionsvalue={["id", "tenDonVi"]}
              style={{ width: "100%" }}
            />
          </FormItem>
          <FormItem
            label="Tập đoàn"
            name={["phongban", "tapDoan_Id"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={tapDoan_Id}
          >
            <Select
              className="heading-select slt-search th-select-heading"
              data={tapDoanSelect ? tapDoanSelect : []}
              placeholder="Chọn loại tập đoàn"
              optionsvalue={["id", "tenTapDoan"]}
              style={{ width: "100%" }}
            />
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

export default PhongBanForm;
