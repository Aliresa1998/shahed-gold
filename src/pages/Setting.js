import React, { useState, useEffect } from "react";
import { Switch, Col, Spin, Input, Button, Card, Row, Checkbox } from "antd";
import { controller } from "../assets/controller/controller";
import CheckAuth from "../CheckAuth";
import VisibilityTracker from "../VisibilityTracker";
const Setting = () => {
  const [config, setConfig] = useState({
    hamta_bot: "off",
    buy: "off",
    sell: "off",
    auto_accept: "off",
  });

  const [loading, setLoading] = useState({
    hamta_bot: false,
    buy: false,
    sell: false,
    auto_accept: false,
  });
  // State to track if the app is minimized
  const [isMinimized, setIsMinimized] = useState(false);
  const [minimizeTimeout, setMinimizeTimeout] = useState(null);

  // Function to be called when the app is minimized for 30 seconds
  const handleMinimizedForTooLong = () => {
    getConfig(); // Replace with your actual endpoint call
  };

  const handleMinimize = (data) => {
    if (data) {
      // App is maximized
      setIsMinimized(false);

      // Clear the minimize timeout if app is maximized before 30 seconds
      if (minimizeTimeout) {
        clearTimeout(minimizeTimeout);
        setMinimizeTimeout(null);
      }
    } else {
      // App is minimized
      setIsMinimized(true);

      // Start a timeout to check if app stays minimized for 30 seconds
      const timeout = setTimeout(handleMinimizedForTooLong, 3000); // 30 seconds (30000ms)
      setMinimizeTimeout(timeout);
    }
  };
  const getConfig = async () => {
    const response = await controller.getConfig();
    console.log(response.json);
    setConfig(response.json);
  };

  useEffect(() => {
    getConfig();
  }, []);

  const handleChange = async (e) => {
    console.log(e);
    if (e == "hamta_bot") {
      setLoading({
        ...loading,
        hamta_bot: true,
      });
      const response = await controller.changeHamta(
        config.hamta_bot == "off" ? "on" : "off"
      );
      setTimeout(() => {
        getConfig();
      }, 500);

      setTimeout(() => {
        setLoading({
          ...loading,
          hamta_bot: false,
        });
      }, 500);
    } else if (e == "buy") {
      setLoading({
        ...loading,
        buy: true,
      });
      const response = await controller.changeBuy(
        config.buy == "off" ? "buy_ok" : "no_buy"
      );
      setTimeout(() => {
        getConfig();
      }, 500);

      setTimeout(() => {
        setLoading({
          ...loading,
          buy: false,
        });
      }, 500);
    } else if (e == "sell") {
      setLoading({
        ...loading,
        sell: true,
      });
      const response = await controller.changeBuy(
        config.sell == "off" ? "sell_ok" : "sell_ok"
      );
      setTimeout(() => {
        getConfig();
      }, 500);

      setTimeout(() => {
        setLoading({
          ...loading,
          sell: false,
        });
      }, 500);
    } else if (e == "auto_accept") {
      setLoading({
        ...loading,
        auto_accept: true,
      });
      const response = await controller.changeAutoAccept(
        config.auto_accept == "off" ? "on" : "off"
      );
      setTimeout(() => {
        getConfig();
      }, 500);

      setTimeout(() => {
        setLoading({
          ...loading,
          auto_accept: false,
        });
      }, 500);
    }
  };

  return (
    <Col>
      <Row style={{ margin: "0px 15px" }}>
        <Col>
          {loading.hamta_bot ? (
            <Spin />
          ) : (
            <Checkbox
              onChange={() => handleChange("hamta_bot")}
              checked={config.hamta_bot == "off" ? false : true}
            />
          )}
        </Col>

        <Col style={{ marginRight: "8px" }}>قیمت گذاری توسط همتا</Col>
      </Row>

      {/* <Row style={{ margin: "0px 15px" }}>
        <Col>خرید</Col>
        <Col>
          {loading.buy ? (
            <Spin />
          ) : (
            <Switch
              onChange={() => handleChange("buy")}
              checked={config.buy == "off" ? false : true}
            />
          )}
        </Col>
      </Row>
      <br />
      <Row style={{ margin: "0px 15px" }}>
 
        <Col>
          {loading.sell ? (
            <Spin />
          ) : (
            <Switch
              onChange={() => handleChange("sell")}
              checked={config.sell == "off" ? false : true}
            />
          )}
        </Col>

        <Col>فروش</Col>
      </Row> */}
      <br />
      <Row style={{ margin: "0px 15px" }}>
        <Col>
          {loading.auto_accept ? (
            <Spin />
          ) : (
            <Checkbox
              onChange={() => handleChange("auto_accept")}
              checked={config.auto_accept == "off" ? false : true}
            />
          )}
        </Col>

        <Col style={{ marginRight: "8px" }}>ثبت خودکار سفارش</Col>
      </Row>
    </Col>
  );
};

export default Setting;
