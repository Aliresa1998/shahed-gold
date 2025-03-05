import React, { useState, useEffect } from "react";
import { Card, ConfigProvider, InputNumber, Row } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { controller } from "../assets/controller/controller";

const SplitNumberInput = ({ record, sellingPrice, purchasePrice }) => {
  // Ensure sellingPrice is a string for splitting into digits
  const formattedPrice = sellingPrice.toString().padStart(10, "0");
  const formattedPricePurchase = purchasePrice.toString().padStart(10, "0");

  // Initialize state for each digit
  const [digits, setDigits] = useState(Array(10).fill("0"));
  const [digitsPurchase, setDigitsPurchase] = useState(Array(10).fill("0"));

  useEffect(() => {
    // Set initial digits when sellingPrice changes
    const updatedDigits = formattedPricePurchase.split("");
    setDigitsPurchase(updatedDigits);
  }, [purchasePrice]);

  useEffect(() => {
    // Set initial digits when sellingPrice changes
    const updatedDigits = formattedPrice.split("");
    setDigits(updatedDigits);
  }, [sellingPrice]);

  const handleChange = async (index, value) => {
    // Ensure only a single digit is allowed
    if (value === null || value < 0 || value > 9) return;

    const newDigits = [...digits];
    newDigits[index] = value.toString();
    setDigits(newDigits);

    const response = await controller.updatePrice(
      { sell_fee: parseInt(newDigits.join(""), 10) },
      record.id
    );
  };

  const handleChangePurchase = async (index, value) => {
    // Ensure only a single digit is allowed
    if (value === null || value < 0 || value > 9) return;

    const newDigits = [...digitsPurchase];
    newDigits[index] = value.toString();
    setDigitsPurchase(newDigits);

    const response = await controller.updatePrice(
      { buy_fee: parseInt(newDigits.join(""), 10) },
      record.id
    );
  };

  return (
    <Card>
      <Row justify="space-between">
        <h4>
          <ShoppingCartOutlined /> قیمت خرید
        </h4>
        <div style={{ display: "flex", gap: "8px", direction: "ltr" }}>
          {digits.map((digit, index) => (
            <ConfigProvider direction="ltr">
              <InputNumber
                key={index}
                min={0}
                max={9}
                value={parseInt(digit, 10)}
                onChange={(value) => handleChange(index, value)}
                style={{ width: "50px", textAlign: "center" }}
              />
            </ConfigProvider>
          ))}
        </div>
      </Row>

      <Row className="mt10" justify="space-between">
        <h4>
          <ShoppingCartOutlined /> قیمت فروش
        </h4>
        <div style={{ display: "flex", gap: "8px", direction: "ltr" }}>
          {digitsPurchase.map((digit, index) => (
            <ConfigProvider direction="ltr">
              <InputNumber
                key={index}
                min={0}
                max={9}
                value={parseInt(digit, 10)}
                onChange={(value) => handleChangePurchase(index, value)}
                style={{ width: "50px", textAlign: "center" }}
              />
            </ConfigProvider>
          ))}
        </div>
      </Row>
    </Card>
  );
};

export default SplitNumberInput;
