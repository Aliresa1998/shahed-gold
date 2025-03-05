import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "antd/dist/antd.css";
import { controller } from "../assets/controller/controller";
import { PopupMessage } from "./PopupMessage";

const CreateNewMessageForm = (props) => {
  const [form] = Form.useForm();
  const [dateTimeValue, setDateTimeValue] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const onFinish = async (values) => {
    setLoading(true);
    const isoDateString = dateTimeValue?.toDate().toISOString();

    const payload = {
      ...values,
      available_to: isoDateString,
    };

    try {
      const response = await controller.CreateNewMessageAdmin(payload);

      if (response.status < 250) {
        PopupMessage.openNotification(
          "bottom",
          "پیغام با موفقیت ایجاد شد.",
          "Successful"
        );
        props.handleShowTable();
      } else {
        PopupMessage.openNotification("bottom", "خطا در ارسال پیغام", "Error");
      }
    } catch (e) {
      PopupMessage.openNotification("bottom", "خطا در ارتباط با سرور", "Error");
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleDateTimeChange = (date) => {
    setDateTimeValue(date);
  };

  const renderTodayButton = () => (
    <div style={{ textAlign: "center", marginTop: 10 }}>
      <a onClick={() => handleDateTimeChange(new Date())}>امروز</a>
    </div>
  );

  const handleClose = () => {
    props.handleClose();
  };

  // Sync form fields when `selectedRecord` changes
  useEffect(() => {
    if (props.selectedRecord) {
      const { title, message, available_to } = props.selectedRecord;

      // Convert ISO string to Date object for the DatePicker
      const formattedDate = available_to ? new Date(available_to) : null;

      // Set initial form values
      form.setFieldsValue({
        title: title || "",
        message: message || "",
        dateTime: formattedDate,
      });

      // Update state for DatePicker
      if (formattedDate) {
        setDateTimeValue(formattedDate);
      }
    }
  }, [props.selectedRecord, form]);

  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="تیتر"
        name="title"
        rules={[{ required: true, message: "لطفا تیتر را وارد کنید!" }]}
      >
        <Input placeholder="تیتر" />
      </Form.Item>

      <Form.Item
        label="پیغام"
        name="message"
        rules={[{ required: true, message: "لطفا پیغام را وارد کنید!" }]}
      >
        <Input.TextArea rows={5} placeholder="متن پیغام ..." />
      </Form.Item>

      <Form.Item label="تاریخ اعتبار" name="dateTime">
        <DatePicker
          value={dateTimeValue}
          onChange={handleDateTimeChange}
          calendar={persian}
          locale={persian_fa}
          format="YYYY/MM/DD HH:mm:ss"
          style={{
            width: "100%",
            direction: "ltr",
            height: "50px",
            paddingLeft: "15px",
          }}
          plugins={[<TimePicker position="bottom" />, renderTodayButton()]}
          placeholder="انتخاب تاریخ و زمان"
        />
      </Form.Item>

      <Row justify="start" align="middle" style={{ gap: "15px" }}>
        <Form.Item style={{ marginBottom: "0px", marginRight: "2px" }}>
          <Button
            style={{ minWidth: "110px" }}
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            ارسال
          </Button>
        </Form.Item>
        <Button onClick={handleClose}>بستن</Button>
      </Row>
    </Form>
  );
};

export default CreateNewMessageForm;
