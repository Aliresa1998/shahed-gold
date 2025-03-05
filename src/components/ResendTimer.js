import React, { useState, useEffect } from "react";
import { Input, Typography, Button, Row, Spin } from "antd";
import { PopupMessage } from "../components/PopupMessage";
import { controller } from "../assets/controller/controller";
const { Text } = Typography;

const TimerWithButton = (props) => {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [showButton, setShowButton] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup interval
    } else {
      setShowButton(true);
    }
  }, [timeLeft]);

  const handleResendCode = async () => {
    setLoading(true);
    const response = await controller.LoginPhoneStep1(props.enteredPhoneNumber);
    if (response.status < 250) {
      PopupMessage.openNotification(
        "bottom",
        "کد تایید  مجددا ارسال شد.",
        "Successful"
      );
    } else {
      PopupMessage.openNotification("bottom", "خطا در برقراری ارتباط", "Error");
    }
    setShowButton(false); 
    setTimeLeft(120);
    setLoading(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return !showButton ? (
    <div>
      <Text style={{ display: "flex", color: "#1890ff" }}>
        {formatTime(timeLeft)}
      </Text>
    </div>
  ) : (
    <Text
      style={{
        fontSize: "12px",
        cursor: "pointer",
        color: "#1890ff",
      }}
      onClick={handleResendCode}
    >
      {loading ? <Spin size='small' />: "ارسال مجدد"}
    </Text>
  );
};

export default TimerWithButton;
