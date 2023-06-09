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
  maChucVu: "",
  tenChucVu: "",
  boPhan_Id: "",
};
const ChucVuForm = ({ history, match, permission }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("new");
  const [id, setId] = useState(undefined);
  const [fieldTouch, setFieldTouch] = useState(false);
  const [form] = Form.useForm();
  const { maChucVu, tenChucVu, boPhan_Id } = initialState;
  const [boPhanSelect, setBoPhanSelect] = useState([]);

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
        fetchStart(`BoPhan`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          setBoPhanSelect(res.data);
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
        fetchStart(`ChucVu/${id}`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          const data = res.data[0];
          setFieldsValue({
            bophan: data,
          });
          setInfo(...res.data, res.data[0].boPhan);
        }
      })
      .catch((error) => console.error(error));
  };

  /**
   * Quay lại trang người dùng
   *
   */
  const goBack = () => {
    history.push("/danh-muc/chuc-vu");
  };

  /**
   * Khi submit
   *
   * @param {*} values
   */
  const onFinish = (values) => {
    saveData(values.chucvu);
  };

  const saveAndClose = () => {
    validateFields()
      .then((values) => {
        saveData(values.chucvu, true);
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
          fetchStart(`ChucVu`, "POST", newData, "ADD", "", resolve, reject)
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
      delete info.boPhan;
      var newData = { ...info, ...user };
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(
            `ChucVu/${id}`,
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

  const formTitle = type === "new" ? "Thêm mới chức vụ" : "Chỉnh sửa chức vụ";
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
            label="Mã chức vụ"
            name={["chucvu", "maChucVu"]}
            rules={[
              {
                type: "string",
                required: true,
              },
              {
                max: 50,
                message: "Mã chức vụ không được quá 50 ký tự",
              },
            ]}
            initialValue={maChucVu}
          >
            <Input className="input-item" placeholder="Nhập mã chức vụ" />
          </FormItem>
          <FormItem
            label="Tên chức vụ"
            name={["chucvu", "tenChucVu"]}
            rules={[
              {
                type: "string",
                required: true,
              },
              {
                max: 250,
                message: "Tên chức vụ không được quá 250 ký tự",
              },
            ]}
            initialValue={tenChucVu}
          >
            <Input className="input-item" placeholder="Nhập tên chức vụ" />
          </FormItem>
          <FormItem
            label="Bộ phận"
            name={["chucvu", "boPhan_Id"]}
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

export default ChucVuForm;
