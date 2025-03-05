import { Button, Card, Col, Row } from "antd";
import React, { useState, useEffect } from "react";
import CustomerOrderHistory from "./CustomerOrderHistory";
import PersonalInformation from "./PersonalInformation";
import CustomerTolSingle from "./CustomerTolSingle";
const CustomerDetail = (props) => {
  const updateList = () => {
    props.updateList();
  };

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col sm={12}>
          <Card style={{ height: "100%" }} title="تاریخچه معاملات">
            <CustomerOrderHistory user={props.user} />
          </Card>
        </Col>
        <Col sm={12}>
          <PersonalInformation user={props.user} updateList={updateList} />
          <CustomerTolSingle user={props.user} />
        </Col>
      </Row>
    </>
  );
};

export default CustomerDetail;
