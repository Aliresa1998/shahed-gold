import React, { useState } from "react";
import { Form, Input, Button, Card, Row } from "antd";
import { LockOutlined } from '@ant-design/icons';
import { controller } from "../assets/controller/controller";
import { PopupMessage } from "../components/PopupMessage";
import CheckAuth from "../CheckAuth";
const ChangePassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)

    const onFinish = async (values) => {
        setLoading(true);
        console.log("Received values:", values);

        const data = {
            new_password: values.new_password1,
            confirm_new_password: values.new_password2,
        }

        try {
            const response = await controller.ChangePassword(values)
            console.log(response.status)
            if (response && response.status && eval(response.status) < 250) {
                PopupMessage.openNotification(
                    "bottom",
                    "رمزعبور با موفقیت بروزرسانی شد.",
                    "Successful"
                )
                form.resetFields();
            } else {
                PopupMessage.openNotification(
                    "bottom",
                    "خطا در ارسال اطلاعات",
                    "Error"
                )
            }
        } catch (e) {
            console.log(e);
            PopupMessage.openNotification(
                "bottom",
                "خطا در برقراری ارتباط",
                "Error"
            )
        }
        setLoading(false);

    };

    return (
        <Card title="تغییر رمز عبور" style={{ margin: "0 auto" }}>
            <CheckAuth />
            <Form
                form={form}
                name="passwordForm"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                direction="rtl"
                className="row-col"
            >
                <Form.Item
                    className="username"
                    name="new_password1"
                    label="رمز عبور جدید"
                    rules={[
                        { required: true, message: "لطفا رمز عبور خود را وارد کنید" },
                        {
                            min: 8,
                            message: "رمز عبور باید حداقل ۸ کاراکتر باشد"
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="رمز عبور جدید را وارد کنید"
                    />
                </Form.Item>

                <Form.Item
                    className="username"
                    name="new_password2"
                    label="تایید رمز عبور جدید"
                    rules={[
                        { required: true, message: "لطفا رمز عبور جدید خود را تأیید کنید" },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (value === getFieldValue("new_password1")) {
                                    return Promise.resolve();
                                }
                                return Promise.reject("دو رمز عبور وارد شده مطابقت ندارند");
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="رمز عبور جدید خود را تأیید کنید"
                    />
                </Form.Item>

                <Row type={"flex"} justify={"center"} >
                    <Form.Item>
                        <Button loading={loading} type="primary" htmlType="submit" style={{ width: "250px", fontSize: "15px" }}>
                            تغییر رمز عبور
                        </Button>
                    </Form.Item>
                </Row>

            </Form>
        </Card>
    );
};

export default ChangePassword;