import { Card, Form, Input } from "antd";
import includes from "lodash/includes";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { fetchReset, fetchStart } from "src/appRedux/actions";
import { FormSubmit } from "src/components/Common";
import ContainerHeader from "src/components/ContainerHeader";
import { DEFAULT_FORM_CUSTOM } from "src/constants/Config";

const FormItem = Form.Item;

const initialState = {
  maDonViTraLuong: "",
  tenDonViTraLuong: "",
};
const DonViTraLuongForm = ({ history, match, permission }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("new");
  const [id, setId] = useState(undefined);
  const [fieldTouch, setFieldTouch] = useState(false);
  const [form] = Form.useForm();
  const { maDonViTraLuong, tenDonViTraLuong } = initialState;
  const { validateFields, resetFields, setFieldsValue } = form;
  const [info, setInfo] = useState({});
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
    };
    load();
    return () => dispatch(fetchReset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Lấy thông tin
   *
   */
  const getInfo = () => {
    const { id } = match.params;
    setId(id);
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(
          `DonViTraLuong/${id}`,
          "GET",
          null,
          "DETAIL",
          "",
          resolve,
          reject
        )
      );
    })
      .then((res) => {
        if (res && res.data) {
          setFieldsValue({
            donvitraluong: res.data,
          });
          setInfo(res.data);
        }
      })
      .catch((error) => console.error(error));
  };

  /**
   * Quay lại trang người dùng
   *
   */
  const goBack = () => {
    history.push("/danh-muc/don-vi-tra-luong");
  };

  /**
   * Khi submit
   *
   * @param {*} values
   */
  const onFinish = (values) => {
    saveData(values.donvitraluong);
  };

  const saveAndClose = () => {
    validateFields()
      .then((values) => {
        saveData(values.donvitraluong, true);
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
          fetchStart(
            `DonViTraLuong`,
            "POST",
            newData,
            "ADD",
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
            resetFields();
            setFieldTouch(false);
          }
        })
        .catch((error) => console.error(error));
    }
    if (type === "edit") {
      var newData = { ...info, ...user };
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(
            `DonViTraLuong/${id}`,
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
    type === "new" ? "Thêm mới đơn vị trả lương" : "Chỉnh sửa đơn vị trả lương";
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
            label="Mã đơn vị trả lương"
            name={["donvitraluong", "maDonViTraLuong"]}
            rules={[
              {
                type: "string",
                required: true,
              },
              {
                max: 50,
                message: "Mã đơn vị trả lương không được quá 50 ký tự",
              },
            ]}
            initialValue={maDonViTraLuong}
          >
            <Input
              className="input-item"
              placeholder="Nhập mã đơn vị trả lương"
            />
          </FormItem>
          <FormItem
            label="Tên đơn vị trả lương"
            name={["donvitraluong", "tenDonViTraLuong"]}
            rules={[
              {
                type: "string",
                required: true,
              },
              {
                max: 250,
                message: "Tên đơn vị trả lương không được quá 250 ký tự",
              },
            ]}
            initialValue={tenDonViTraLuong}
          >
            <Input
              className="input-item"
              placeholder="Nhập tên đơn vị trả lương"
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

export default DonViTraLuongForm;
