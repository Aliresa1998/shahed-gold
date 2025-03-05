import {
  DribbbleOutlined,
  GithubOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Menu,
  Row,
  Typography,
} from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { controller } from "../assets/controller/controller";
import signinbg from "../assets/images/img-signin.jpg";
import { PopupMessage } from "../components/PopupMessage";
import { withRouter } from "react-router-dom";

function onChange(checked) {
  console.log(`تغییر به ${checked}`);
}

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const onFinish = async (values) => {
      this.setState({
        loading: true,
      });
      console.log("موفقیت:", values);

      try {
        const response = await controller.Login(values);

        if (response.status < 250) {
          PopupMessage.openNotification(
            "bottom",
            "ورود موفقیت آمیز",
            "Successful"
          );

          localStorage.setItem("user", JSON.stringify(response.json));

          const responseCheckUser = await controller.checkAdminUser();

          if (responseCheckUser.status < 250) {
            console.log(responseCheckUser.json.detail);
            if (responseCheckUser.json.detail) {
              localStorage.setItem("isAdmin", "true");
              this.props.history.push("/dashboard");
            } else {
              localStorage.setItem("isAdmin", "false");
              this.props.history.push("/customer-create-order");
            }
          } else {
            PopupMessage.openNotification(
              "bottom",
              "خطا در برقراری ارتباط",
              "Error"
            );
          }

          //
        } else {
          PopupMessage.openNotification(
            "bottom",
            "نام کاربری و رمز عبور اشتباه است",
            "Error"
          );
        }
      } catch (e) {
        PopupMessage.openNotification(
          "bottom",
          "خطا در برقراری ارتباط",
          "Error"
        );
        console.log(e);
      }

      this.setState({
        loading: false,
      });
    };

    const onFinishFailed = (errorInfo) => {
      console.log("ناموفق:", errorInfo);
    };

    return (
      <>
        <div className="layout-default">
          <Row justify="center" align="middle" style={{ minHeight: "90vh" }}>
            <Card className="login-card">
              <Title className="mb-15">ورود</Title>
              <Title className="font-regular text-muted" level={5}>
                نام کاربری و رمز عبور خود را وارد کنید
              </Title>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="username"
                  label="نام کاربری"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "لطفا نام کاربری خود را وارد کنید!",
                    },
                  ]}
                >
                  <Input placeholder="نام کاربری" className="ltr" />
                </Form.Item>

                <Form.Item
                  className="username"
                  label="رمز عبور"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "لطفا رمز عبور خود را وارد کنید!",
                    },
                  ]}
                >
                  <Input
                    placeholder="رمز عبور"
                    type="password"
                    className="ltr"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    loading={this.state.loading}
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    ورود
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Row>
        </div>
      </>
    );
  }
}
