import React, { useEffect, useState } from "react";
import { Card, Row, Col, Input, Form, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { controller } from "../assets/controller/controller";
import { PopupMessage } from "./PopupMessage";

const DetailsCard = ({ data, record }) => {
  const [form] = Form.useForm(); // Get the form instance
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (values) => {
    setLoading(true);
    const response = await controller.updatePrice(values, record.id);
    if (response.status < 250) {
      PopupMessage.openNotification(
        "bottom",
        "اطلاعات با موفقیت آپدیت شد.",
        "Successful"
      );
    } else {
      PopupMessage.openNotification("bottom", "خطا در برقراری ارتباط", "Error");
    }
    setLoading(false);
  };

  console.log(record);

  const [formValue, setFormValue] = useState({});

  useEffect(() => {
    console.log(record);
    setFormValue(record); // Update the formValue state when record changes
  }, [record]);

  useEffect(() => {
    if (formValue) {
      form.setFieldsValue(formValue); // Update the form fields when formValue changes
    }
  }, [formValue, form]);

  return (
    <Card title="جزئیات" style={{ textAlign: "right" }}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Row gutter={[16, 16]}>
          {/* Table Header */}
          <Col span={6} style={{ fontWeight: "bold" }}>
            تلورانس خرید
        
          </Col>
          <Col span={6} style={{ fontWeight: "bold" }}>
            تلورانس فروش
          </Col>
          <Col span={6} style={{ fontWeight: "bold" }}>
            حداقل حجم سفارش
  
          </Col>
          <Col span={6} style={{ fontWeight: "bold" }}>
            حداقل هزینه سفارش
          </Col>

          {/* Data */}
          <Col span={6}>
            <Form.Item name="buy_tolerance">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="sell_tolerance">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="minimum_unit">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="minimum_fee">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end">
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            icon={<CheckOutlined />}
          >
            ویرایش
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default DetailsCard;
