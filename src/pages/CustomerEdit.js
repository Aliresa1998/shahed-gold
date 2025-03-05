import React, { useState, useEffect } from "react";
import { Row, Card, Form, Input, Button } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, RightOutlined } from '@ant-design/icons';
import { PopupMessage } from "../components/PopupMessage";

import { controller } from "../assets/controller/controller";

const CustomerCreate = (props) => {
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState("editForm");
    /*
    1.editForm
    2. password
    */
    const [form] = Form.useForm(); // Get form instance
    const handleShowTable = () => {
        form.resetFields(); // Reset form fields after submission
        props.handleManageMode("table")
    }

    const onFinish = async (values) => {
        setLoading(true)
        console.log('Received values:', values);
        try {
            const response = await controller.editUser(values, props?.editData?.id);

            if (response.status < 250) {
                PopupMessage.openNotification(
                    "bottom",
                    "کاربر با موفقیت ویرایش شد.",
                    "Successful"
                )
                handleShowTable()
            } else {
                PopupMessage.openNotification(
                    "bottom",
                    "خطا در ارسال اطلاعات",
                    "Error"
                )
            }
        } catch (e) {
            PopupMessage.openNotification(
                "bottom",
                "خطا در ارتباط با سرور",
                "Error"
            )
        }

        setLoading(false)
    };

    const onFinishChangePass = async (values) => {
        setLoading(true)
        console.log('Received values:', values);
        values["customer_id"] = props?.editData?.id
        try {
            const response = await controller.changeCustomerPassword(values);

            if (response.status < 250) {
                PopupMessage.openNotification(
                    "bottom",
                    "رمز عبور کاربر با موفقیت ویرایش شد.",
                    "Successful"
                )
                handleShowEditForm()
            } else {
                PopupMessage.openNotification(
                    "bottom",
                    "خطا در ارسال اطلاعات",
                    "Error"
                )
            }
        } catch (e) {
            PopupMessage.openNotification(
                "bottom",
                "خطا در ارتباط با سرور",
                "Error"
            )
        }

        setLoading(false)
    };

    const visiblePassChange = () => {
        setMode("password")
    }

    const handleShowEditForm = () => {
        setMode("editForm")
    }

    useEffect(() => {
        console.log(props)
        form.setFieldsValue(props.editData)
    }, [props.editData])


    return (
        <>
            <Card
                title={
                    <Row justify="space-between">
                        <span>
                            {
                                mode == "password" ?
                                    <>تغییر رمز عبور</>

                                    :
                                    <>
                                        ویرایش مشتری {props?.editData?.user?.username || "-"}
                                    </>
                            }

                        </span>
                        <span onClick={mode == "password" ? handleShowEditForm : handleShowTable} className="back-item">
                            <RightOutlined />  بازگشت
                        </span>
                    </Row>
                }
                style={{ minHeight: "50px" }}>
                {
                    mode == "password" ?

                        <>


                            <div style={{ marginTop: "10px" }}></div>
                            <Form
                                form={form} // Pass the form instance to the Form component
                                name="register-form"
                                onFinish={onFinishChangePass}
                                scrollToFirstError
                                layout="vertical"
                                className="row-col"
                                direction="rtl"  // Set direction to right-to-left for Persian language
                            >


                                <Form.Item
                                    className="username"
                                    name={"new_password"}
                                    label="رمز عبور"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'لطفاً رمز عبور خود را وارد کنید!',
                                        },
                                        {
                                            min: 7,
                                            message: 'رمز عبور باید حداقل 7 کاراکتر باشد!',
                                        },
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password prefix={<LockOutlined />} placeholder="رمز عبور" />
                                </Form.Item>

                                <Form.Item
                                    className="username"
                                    name={"confirm_new_password"}
                                    label="تکرار رمز عبور"

                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'لطفاً تکرار رمز عبور خود را وارد کنید!',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('new_password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('رمز عبورها باید یکسان باشند!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined />} placeholder="تکرار رمز عبور" />
                                </Form.Item>
                                <Row justify="center" >
                                    <Form.Item>
                                        <Button loading={loading} type="primary" htmlType="submit" style={{ minWidth: "120px", marginLeft: "5px" }}>
                                            تغییر رمز عبور
                                        </Button>
                                    </Form.Item>
                                    <Button onClick={handleShowEditForm}>
                                        برگشت
                                    </Button>
                                </Row>


                            </Form>
                        </>

                        :

                        <>
                            <Row justify="end">
                                <Button onClick={visiblePassChange} type="primary" style={{ minWidth: "80px" }}>
                                    تغییر رمز عبور

                                </Button>
                            </Row>
                            <Form
                                form={form} // Pass the form instance to the Form component
                                name="register-form"
                                onFinish={onFinish}
                                scrollToFirstError
                                layout="vertical"
                                className="row-col"
                                direction="rtl"  // Set direction to right-to-left for Persian language
                            >
                                <p style={{ fontWeight: "bold" }}>نام کاربری</p>
                                <Input disabled value={props.editData.user.username} prefix={<UserOutlined />} placeholder="نام کاربری" />

                                <div style={{ marginTop: "10px" }}></div>
                                {/* <Form.Item
                                    className="username"
                                    name={['user', 'email']}
                                    label="ایمیل"
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'لطفاً یک ایمیل معتبر وارد کنید!',
                                        },
                                        {
                                            required: true,
                                            message: 'لطفاً ایمیل خود را وارد کنید!',
                                        },
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} placeholder="ایمیل" />
                                </Form.Item> */}

                                <Form.Item
                                    className="username"
                                    name="phone_number"
                                    label="شماره تلفن"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'لطفاً شماره تلفن خود را وارد کنید!',
                                        },
                                    ]}
                                >
                                    <Input prefix={<PhoneOutlined />} placeholder="شماره تلفن" />
                                </Form.Item>
                                <Row justify="center" >
                                    <Form.Item>
                                        <Button loading={loading} type="primary" htmlType="submit" style={{ minWidth: "120px", marginLeft: "5px" }}>
                                            ویرایش اطلاعات
                                        </Button>
                                    </Form.Item>
                                    <Button onClick={handleShowTable}>
                                        برگشت
                                    </Button>
                                </Row>


                            </Form>
                        </>
                }




            </Card>
        </>
    )
}

export default CustomerCreate;