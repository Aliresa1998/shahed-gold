import {
  LockOutlined,
  PhoneOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, Row } from "antd";
import React, { useState } from "react";
import { PopupMessage } from "../components/PopupMessage";

import { controller } from "../assets/controller/controller";

const CustomerCreate = (props) => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm(); // Get form instance
  const handleShowTable = () => {
    form.resetFields(); // Reset form fields after submission
    props.handleManageMode("table");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values) => {
    setLoading(true);
    console.log("Received values:", values);
    const response = await controller.inviteUser(values);

    if (response.status < 250) {
      PopupMessage.openNotification(
        "bottom",
        "کاربر با موفقیت دعوت شد.",
        "Successful"
      );
      handleShowTable();
    } else {
      PopupMessage.openNotification("bottom", "خطا در ارسال اطلاعات", "Error");
    }
    setLoading(false);
  };

  return (
    <>
      <Card
        title={
          <Row justify="space-between">
            <span>افزودن مشتری جدید</span>
            <span onClick={handleShowTable} className="back-item">
              <RightOutlined /> بازگشت
            </span>
          </Row>
        }
        style={{ minHeight: "50px" }}
      >
        <Form
          form={form}
          name="persianForm"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          //   layout="vertical"
          //   style={{ maxWidth: 400, margin: "0 auto" }}
        >
          {/* Phone Number */}
          <p>شماره تلفن</p>
          <Form.Item
            name="phone_number"
            label=""
            rules={[
              { required: true, message: "لطفا شماره تلفن خود را وارد کنید" },
              { pattern: /^\d{11}$/, message: "شماره تلفن باید 11 رقم باشد" },
            ]}
          >
            <Input placeholder="مثال: 09123456789" />
          </Form.Item>

          {/* First Name */}
          <p>نام</p>
          <Form.Item
            name="first_name"
            label=""
            rules={[{ required: true, message: "لطفا نام خود را وارد کنید" }]}
          >
            <Input placeholder="نام شما" />
          </Form.Item>

          {/* Last Name */}
          <p>نام خانوادگی</p>
          <Form.Item
            name="last_name"
            label=""
            rules={[
              { required: true, message: "لطفا نام خانوادگی خود را وارد کنید" },
            ]}
          >
            <Input placeholder="نام خانوادگی شما" />
          </Form.Item>

          <Row justify="center">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "120px" }}
                loading={loading}
              >
                ارسال
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default CustomerCreate;
