import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, Button, Switch, InputNumber } from 'antd';
import { controller } from '../assets/controller/controller';
import { PopupMessage } from "../components/PopupMessage";

const EditPrice = (props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        buy_fee: "",
        fee: ""
    })



    const handleShowTable = () => {
        props.handleShowTable();
    }

    const onFinish = async (values) => {
        console.log('Form values:', values);
        setLoading(true);

        const myData = {
            ...formData,
            ...values,
            buy_fee: formData.buy_fee && (("" + formData.buy_fee).replace(/,/g, '')) ? (("" + formData.buy_fee).replace(/,/g, '')) : 0,
            sell_fee: formData.sell_fee && (("" + formData.sell_fee).replace(/,/g, '')) ? (("" + formData.sell_fee).replace(/,/g, '')) : 0,
            minimum_unit: formData.minimum_unit && (("" + formData.minimum_unit).replace(/,/g, '')) ? (("" + formData.minimum_unit).replace(/,/g, '')) : 0,
            buy_tolerance: formData.buy_tolerance && (("" + formData.buy_tolerance).replace(/,/g, '')) ? (("" + formData.buy_tolerance).replace(/,/g, '')) : 0,
            sell_tolerance: formData.sell_tolerance && (("" + formData.sell_tolerance).replace(/,/g, '')) ? (("" + formData.sell_tolerance).replace(/,/g, '')) : 0,
        }
        console.log(myData)
        try {
            const response = await controller.updatePrice(myData, props.editedData.id)
            if (response.status < 250) {
                PopupMessage.openNotification(
                    "bottom",
                    "اطلاعات بروزرسانی شد.",
                    "Successful"
                )
                handleShowTable();
            } else {
                PopupMessage.openNotification(
                    "bottom",
                    "خطا در ارسال اطلاعات",
                    "Error"
                )
            }
        } catch (e) {
            // Handle error
        }
        setLoading(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleReset = () => {
        form.resetFields();
        props.handleShowTable();
    };

    const formItemLayout = {
        wrapperCol: { span: 24 },
    };

    useEffect(() => {
        setFormData(props.editedData)
    }, [props.editedData])

    const { Item } = Form;

    return (
        <Form
            {...formItemLayout}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            initialValues={props.editedData}
            form={form}
        >
            <p>قیمت خرید</p>

            <InputNumber
                name="buy_fee"
                onChange={(e) => {
                    console.log(e)
                    setFormData({
                        ...formData,
                        buy_fee: e
                    })
                }}
                size="large"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                value={formData.buy_fee}
                style={{ direction: "ltr", width: "100%" }}
                placeholder=" قیمت خرید"
            />



            <p className='mt20'>قیمت فروش</p>
            <InputNumber
                name="sell_fee"
                onChange={(e) => {
                    console.log(e)
                    setFormData({
                        ...formData,
                        sell_fee: e
                    })
                }}
                size="large"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                value={formData.sell_fee}
                style={{ direction: "ltr", width: "100%" }}
                placeholder=" قیمت فروش"
            />


            <p className='mt20'>حداقل حجم سفارش</p>
            <InputNumber
                name="minimum_unit"
                onChange={(e) => {
                    console.log(e)
                    setFormData({
                        ...formData,
                        minimum_unit: e
                    })
                }}
                size="large"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                value={formData.minimum_unit}
                style={{ direction: "ltr", width: "100%" }}
                placeholder=" حداقل حجم سفارش"
            />


            <p className='mt20'>حداقل هزینه سفارش</p>
            <InputNumber
                name="minimum_fee"
                onChange={(e) => {
                    setFormData({
                        ...formData,
                        minimum_fee: e
                    })
                }}
                size="large"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                value={formData.minimum_fee}
                style={{ direction: "ltr", width: "100%" }}
                placeholder=" حداقل هزینه سفارش"
            />

            <p className='mt20'>تلورانس خرید</p>
            <InputNumber
                name="buy_tolerance"
                onChange={(e) => {
                    setFormData({
                        ...formData,
                        buy_tolerance: e
                    })
                }}
                size="large"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                value={formData.buy_tolerance}
                style={{ direction: "ltr", width: "100%" }}
                placeholder=" تلورانس خرید"
            />

            <p className='mt20'>تلورانس فروش</p>
            <InputNumber
                name="sell_tolerance"
                onChange={(e) => {
                    setFormData({
                        ...formData,
                        sell_tolerance: e
                    })
                }}
                size="large"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                value={formData.sell_tolerance}
                style={{ direction: "ltr", width: "100%" }}
                placeholder=" تلورانس فروش"
            />


            {/* Switch for Sell Available */}
            <p className='mt20'></p>
            <Item
                label="فروش "
                name="sell_available"
                valuePropName="checked"
            >
                <Switch />
            </Item>

            {/* Switch for Buy Available */}
            <p className='mt20'></p>
            <Item
                label="خرید "
                name="buy_available"
                valuePropName="checked"
            >
                <Switch />
            </Item>

            <Row justify="center">
                <Item wrapperCol={{ span: 24 }}>
                    <Button loading={loading} style={{ minWidth: "125px", marginLeft: "10px" }} type="primary" htmlType="submit">
                        ثبت
                    </Button>
                    <Button onClick={handleReset} style={{ marginLeft: 8 }}>
                        بازگشت
                    </Button>
                </Item>
            </Row>
        </Form>
    );
};

export default EditPrice;
