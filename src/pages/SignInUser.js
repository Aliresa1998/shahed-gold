import { Button, Card, Form, Input, Layout, Row, Typography } from "antd";
import React, { Component } from "react";
import { controller } from "../assets/controller/controller";
import { PopupMessage } from "../components/PopupMessage";
import VerifyCode from "../components/VerifyCode";
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
      step: 1, // 1: get phone 2: enter code
      enteredPhoneNumber: "",
    };
  }

  render() {
    const onFinish = async (values) => {
      this.setState({
        loading: true,
      });

      try {
        const response = await controller.LoginPhoneStep1("0" + values.phone);

        if (response.status < 250) {
          this.setState({
            enteredPhoneNumber: "0" + values.phone,
          });
          PopupMessage.openNotification(
            "bottom",
            "کد تایید ارسال شد.",
            "Successful"
          );

          if (response.status < 250) {
            this.setState({
              step: 2,
            });
          }

          //localStorage.setItem("user", JSON.stringify(response.json));

          // const responseCheckUser = await controller.checkAdminUser();

          // if (responseCheckUser.status < 250) {
          //   console.log(responseCheckUser.json.detail);
          //   if (responseCheckUser.json.detail) {
          //     localStorage.setItem("isAdmin", "true");
          //     this.props.history.push("/dashboard");
          //   } else {
          //     localStorage.setItem("isAdmin", "false");
          //     this.props.history.push("/customer-create-order");
          //   }
          // } else {
          //   PopupMessage.openNotification(
          //     "bottom",
          //     "خطا در برقراری ارتباط",
          //     "Error"
          //   );
          // }

          //
        } else {
          if (response.json && response.json[0] == "Code already sent") {
            PopupMessage.openNotification(
              "bottom",
              "کد به تازگی برای شما ارسال شده است.",
              "Error"
            );
            this.setState({
              step: 2,
            });
          } else {
            PopupMessage.openNotification(
              "bottom",
              "شماره شما ثبت نشده است",
              "Error"
            );
          }
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

    const editPhoneNumber = () => {
      this.setState({
        step: 1,
      });
    };

    return (
      <>
        <div className="layout-default">
          <Row justify="center" align="middle" style={{ minHeight: "90vh" }}>
            <Card className={"login-card-user"}>
              <Typography.Title level={4}>ورود</Typography.Title>
              {this.state.step == 1 ? (
                <Form
                  name="phone_number_form"
                  onFinish={onFinish}
                  layout="vertical"
                  style={{ direction: "ltr" }}
                >
                  <Form.Item
                    style={{ direction: "ltr", textAlign: "ltr" }}
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "لطفاً شماره تلفن را وارد کنید!",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "شماره تلفن باید 10 رقم باشد!",
                      },
                    ]}
                  >
                    <Input
                      className="phoneInput"
                      addonAfter="98+"
                      maxLength={10}
                      placeholder="9123456789"
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
              ) : (
                <VerifyCode
                  editPhoneNumber={editPhoneNumber}
                  enteredPhoneNumber={this.state.enteredPhoneNumber}
                  history={this.props.history}
                />
              )}
            </Card>
          </Row>
        </div>
      </>
    );
  }
}
