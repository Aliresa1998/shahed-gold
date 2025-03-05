import React, { useState } from "react";
import { Card, Button, Input, Form } from "antd";
import { EditOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { controller } from "../assets/controller/controller";

const UserInfoCard = ({ user,updateList }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // Initialize form with user data
  const [userInfo, setUserInfo] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
  });

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(userInfo); // Pre-fill the form with current user info
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(async(values) => {
        setUserInfo(values); // Save the updated user data
        const response = await controller.editUser(values,user.id)
        updateList()
        setIsEditing(false);
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Card
      title="اطلاعات"
      extra={
        isEditing ? (
          <>
            <Button type="primary" onClick={handleSave}>
              ویرایش
            </Button>
            <Button style={{ marginRight: 8 }} onClick={handleCancel}>
              لغو
            </Button>
          </>
        ) : (
          <span style={{ cursor: "pointer" }} onClick={handleEdit}>
            <EditOutlined />
          </span>
        )
      }
    >
      {!isEditing ? (
        <div>
          <p>
            <UserOutlined style={{ marginLeft: 8 }} />
            {userInfo.first_name} {userInfo.last_name}
          </p>
          <p>
            <PhoneOutlined style={{ marginLeft: 8 }} />
            {userInfo.phone_number}
          </p>
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            name="first_name"
            label="نام"
            rules={[{ required: true, message: "First name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="نام خانوادگی"
            rules={[{ required: true, message: "Last name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="شماره تلفن"
            rules={[
              { required: true, message: "Phone number is required" },
              { pattern: /^[+]?[\d\s-]+$/, message: "Invalid phone number" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default UserInfoCard;
