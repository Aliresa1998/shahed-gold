import React, { useState } from "react";
import { Input, Typography, Button, Row, Col } from "antd";
import ResendTimer from "./ResendTimer";
import { controller } from "../assets/controller/controller";
import { PopupMessage } from "../components/PopupMessage";
const { Text } = Typography;

const VerificationCodeForm = (props) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // فقط اعداد
    if (value.length <= 5) {
      setCode(value);
    }
  };



  const handleSubmit = async () => {
    setLoading(true);
    console.log("Verification code:", code);
    const my_data = {
      code: code,
      phone_number: props.enteredPhoneNumber,
    };

    const response = await controller.verifyCode(my_data);

    if (response.status < 250) {
      PopupMessage.openNotification(
        "bottom",
        "ورود با موفقیت انجام شد.",
        "Successful"
      );
      localStorage.setItem("user", JSON.stringify(response.json));
      window.location.href = "/customer-create-order";
      //   const responseCheckUser = await controller.checkAdminUserToken(
      //     response.json.token
      //   );

      //   if (responseCheckUser.status < 250) {
      //     console.log(responseCheckUser.json.detail);
      //     if (responseCheckUser.json.detail) {
      //       localStorage.setItem("isAdmin", "true");
      //       window.location.href = "/dashboard";
      //     } else {
      //       localStorage.setItem("isAdmin", "false");
      //       window.location.href = "/customer-create-order";
      //     }
      //   } else {
      //     PopupMessage.openNotification(
      //       "bottom",
      //       "خطا در برقراری ارتباط",
      //       "Error"
      //     );
      //   }
    } else {
      PopupMessage.openNotification(
        "bottom",
        "کد وارد شده اشتباه است",
        "Error"
      );
    }
    setLoading(false);
  };

  const editNumber = () => {
    props.editPhoneNumber();
  };

  return (
    <div
      style={{
        padding: "20px 0px",
      }}
    >
      <Row justify="space-between">
        <Text>
          کد تایید ارسال شده برای شماره{" "}
          <strong style={{ textAlign: "left" }}>
            {props.enteredPhoneNumber}
          </strong>{" "}
          را وارد کنید.
        </Text>
        <Text
          style={{
            cursor: "pointer",
            color: "#1890ff",
          }}
          onClick={editNumber}
        >
          اصلاح شماره
        </Text>
      </Row>

      <div style={{ marginTop: 20 }}>
        <div>
          <Row
            gutter={[0, 10]}
            justify="space-between"
            align="middle"
            style={{ width: "100%" }}
          >
            <Col sm={5}>
              <ResendTimer enteredPhoneNumber={props.enteredPhoneNumber} />
            </Col>
            <Col sm={19}>
              <Input
                value={code}
                onChange={handleInputChange}
                maxLength={5}
                style={{
                  fontSize: "18px",
                  letterSpacing: "10px",
                  textAlign: "center",
                  //border: 'none',
                  border: "2px solid #d9d9d9",
                }}
              />
            </Col>
          </Row>

          {/* <div
            style={{
              position: 'absolute',
              top: '40px',
              left: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 5px',
            }}
          >
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                style={{
                  width: '40px',
                  borderBottom: '2px solid #d9d9d9',
                  textAlign: 'center',
                  margin: '0 2px',
                }}
              >
                {code[index] || ''}
              </div>
            ))}
          </div> */}
        </div>
      </div>
      <Button
        loading={loading}
        type="primary"
        onClick={handleSubmit}
        style={{ marginTop: 20, width: "100%" }}
      >
        ورود
      </Button>
    </div>
  );
};

export default VerificationCodeForm;
