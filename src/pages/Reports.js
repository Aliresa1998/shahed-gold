import { Row, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { controller } from "../assets/controller/controller";

const Reports = () => {
  const [messages, setMessages] = useState([]);
  const [read, setRead] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(0);

  const handleRead = async (id) => {
    setLoadingItem(id);
    setLoading(true);
    const response = await controller.userReadMessage(id);
    if (response.status) {
      fetchData();
    }

    setLoadingItem(0);
    setLoading(false);
  };

  const fetchData = async () => {
    const response = await controller.getUnreadMessages(1);

    setMessages(response.json.results);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    messages &&
    messages.length > 0 &&
    messages.map((message, index) => (
      <div className="cardReport" style={{ marginTop: "15px" }}>
        <Row>{message.title}</Row>
        <br />
        <Row>{message.message}</Row>
        <br />
        <Row
          justify={"end"}
          onClick={() => {
            handleRead(message.id);
          }}
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          {loading && loadingItem == message.id ? (
            <Spin />
          ) : (
            "متوجه شدم"
          )}
        </Row>
      </div>
    ))
  );
};

export default Reports;
