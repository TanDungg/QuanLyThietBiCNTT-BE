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
  maBoPhan: "",
  tenBoPhan: "",
  phongBan_Id: "",
};
const BoPhanForm = ({ history, match, permission }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("new");
  const [id, setId] = useState(undefined);
  const [fieldTouch, setFieldTouch] = useState(false);
  const [form] = Form.useForm();
  const { maBoPhan, tenBoPhan, phongBan_Id } = initialState;
  const [phongBanSelect, setPhongBanSelect] = useState([]);

  const { validateFields, resetFields, setFieldsValue } = form;
  const [info, setInfo] = useState({});
  useEffect(() => {
    const load = () => {
      if (includes(match.url, "them-moi")) {
        if (permission && permission.add) {
          getData();
          setType("new");
        } else if (permission && !permission.add) {
          history.push("/home");
        }
      } else {
        if (permission && permission.edit) {
          setType("edit");
          const { id } = match.params;
          setId(id);
          getInfo();
        } else if (permission && !permission.edit) {
          history.push("/home");
        }
      }
    };
    load();
    return () => dispatch(fetchReset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(`Phongban`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          setPhongBanSelect(res.data);
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
    getData();
    setId(id);
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(`BoPhan/${id}`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          const data = res.data[0];
          setFieldsValue({
            bophan: data,
          });
          setInfo(...res.data, res.data[0].phongBan);
        }
      })
      .catch((error) => console.error(error));
  };
  /**
   * Quay lại trang người dùng
   *
   */
  const goBack = () => {
    history.push("/danh-muc/bo-phan");
  };

  /**
   * Khi submit
   *
   * @param {*} values
   */
  const onFinish = (values) => {
    saveData(values.bophan);
  };

  const saveAndClose = () => {
    validateFields()
      .then((values) => {
        saveData(values.bophan, true);
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
          fetchStart(`BoPhan`, "POST", newData, "ADD", "", resolve, reject)
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
      delete info.phongban;
      var newData = { ...info, ...user };
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(
            `BoPhan/${id}`,
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

  const formTitle = type === "new" ? "Thêm mới bộ phận" : "Chỉnh sửa bộ phận";
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
            label="Mã bộ phận"
            name={["bophan", "maBoPhan"]}
            rules={[
              {
                type: "string",
                required: true,
              },
              {
                max: 50,
                message: "Mã bộ phận không được quá 50 ký tự",
              },
            ]}
            initialValue={maBoPhan}
          >
            <Input className="input-item" placeholder="Nhập mã bộ phận" />
          </FormItem>
          <FormItem
            label="Tên bộ phận"
            name={["bophan", "tenBoPhan"]}
            rules={[
              {
                type: "string",
                required: true,
              },
              {
                max: 250,
                message: "Tên bộ phận không được quá 250 ký tự",
              },
            ]}
            initialValue={tenBoPhan}
          >
            <Input className="input-item" placeholder="Nhập tên bộ phận" />
          </FormItem>
          <FormItem
            label="Phòng ban"
            name={["bophan", "phongBan_Id"]}
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

export default BoPhanForm;
