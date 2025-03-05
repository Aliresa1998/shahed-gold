import {
  Button,
  Card,
  Col,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import VisibilityTracker from "../VisibilityTracker";
import { controller } from "../assets/controller/controller";
import NotificationComponent from "./NotificationComponent";
import { PopupMessage } from "../components/PopupMessage";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { RightOutlined } from "@ant-design/icons";
const { Option } = Select;

const MyForm = (props) => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("unit");
  const [openSubmit, setOpenSubmit] = useState(false);
  const [formData, setFormData] = useState({
    unit: "",
    fee: "",
  });
  const [selectedOffer, setSelectedOffer] = useState("-1");

  // State to track if the app is minimized
  const [isMinimized, setIsMinimized] = useState(false);
  const [minimizeTimeout, setMinimizeTimeout] = useState(null);

  // Function to be called when the app is minimized for 30 seconds
  const handleMinimizedForTooLong = () => {
    getPriceList(); // Replace with your actual endpoint call
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

  const formatInputValue = (value) => {
    // Convert value to string to use string methods
    let formattedValue = value.toString();
    // Add comma separator every three digits
    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedValue;
  };

  const handleChangeFee = (e) => {
    var value = e;
    var name = "fee";

    setUserInput(name);
    if (value == 0 || value == null || value == "") {
      setFormData({
        unit: "",
        fee: "",
      });
    }
    // else if (isNaN(value)) {
    //     message.error("عدد وارد کنید.")
    // }
    else {
      if (name == "fee") {
        setFormData({
          unit:
            props.formItems.type == "sell"
              ? (
                  eval(value) / props.formItems.item.calculated_sell_price
                ).toFixed(3)
              : (
                  eval(value) / props.formItems.item.calculated_buy_price
                ).toFixed(3),

          fee: eval(value),
        });
      } else {
        setFormData({
          fee:
            props.formItems.type == "sell"
              ? (
                  eval(value) * props.formItems.item.calculated_sell_price
                ).toFixed(3)
              : (
                  eval(value) * props.formItems.item.calculated_buy_price
                ).toFixed(3),
          unit: eval(value),
        });
      }
    }
  };

  const handleChangeUnit = (e) => {
    var value = e;
    var name = "unit";

    setUserInput(name);
    if (value == 0 || value == null || value == "") {
      setFormData({
        unit: "",
        fee: "",
      });
    } else {
      if (name == "fee") {
        setFormData({
          unit:
            props.formItems.type == "sell"
              ? (
                  eval(value) / props.formItems.item.calculated_sell_price
                ).toFixed(3)
              : (
                  eval(value) / props.formItems.item.calculated_buy_price
                ).toFixed(3),

          fee: eval(value),
        });
      } else {
        setFormData({
          fee:
            props.formItems.type == "sell"
              ? (
                  eval(value) * props.formItems.item.calculated_sell_price
                ).toFixed(3)
              : (
                  eval(value) * props.formItems.item.calculated_buy_price
                ).toFixed(3),
          unit: eval(value),
        });
      }
    }
  };
  const handleChange = (e) => {
    var { name, value } = e.target;
    value = value.replace(/,/g, "");
    setUserInput(name);
    if (value == 0 || value == null || value == "") {
      setFormData({
        unit: "",
        fee: "",
      });
    }
    // else if (isNaN(value)) {
    //     message.error("عدد وارد کنید.")
    // }
    else {
      if (name == "fee") {
        setFormData({
          unit:
            props.formItems.type == "sell"
              ? formatInputValue(
                  (
                    eval(value) / props.formItems.item.calculated_sell_price
                  ).toFixed(3)
                )
              : formatInputValue(
                  (
                    eval(value) / props.formItems.item.calculated_buy_price
                  ).toFixed(3)
                ),

          fee: formatInputValue(eval(value)),
        });
      } else {
        setFormData({
          fee:
            props.formItems.type == "sell"
              ? formatInputValue(
                  (
                    eval(value) * props.formItems.item.calculated_sell_price
                  ).toFixed(3)
                )
              : formatInputValue(
                  (
                    eval(value) * props.formItems.item.calculated_buy_price
                  ).toFixed(3)
                ),
          unit: formatInputValue(eval(value)),
        });
      }
    }
  };

  const onFinish = async () => {
    setLoading(true);

    if (formData.fee == null || formData == "") {
      message.error("قیمت را وارد کنید");
    } else if (formData.unit == null || formData == "") {
      message.error("تعداد را وارد کنید");
    } else if (eval(formData.unit) < eval(props.formItems.item.minimum_unit)) {
      message.error(
        " حداقل تعداد/حجم " + props.formItems.item.minimum_unit + " است. "
      );
    } else if (eval(formData.unit) < eval(props.formItems.item.minimum_fee)) {
      message.error(
        " حداقل قیمت " + props.formItems.item.minimum_fee + " است. "
      );
    } else {
      console.log(props.customer);
      var my_data = {
        price: props.formItems.item.id,
        type: props.formItems.type,
        customer: props.customer,
      };
      if (userInput == "fee") my_data["fee"] = formData.fee;
      else my_data["unit"] = formData.unit;
      try {
        setLoading(true);
        const response = await controller.createOrderAdmin(my_data);
        if (response.status < 250) {
          //setOpenSubmit(true)

          setSelectedOffer(response.json);
          message.success("اطلاعات با موفقیت ثبت شد!");
          setOpenSubmit(false);
          setFormData({
            fee: "",
            unit: "",
          });
          props.handleShowTable();
          // message.success('اطلاعات با موفقیت ثبت شد!');
          // setFormData({
          //     fee: "",
          //     unit: ""
          // })
          // props.handleShowTable();
        } else {
          message.error("خطا در ثبت سفارش");
        }
        setLoading(false);
      } catch (e) {
        message.error("خطا در ارتباط با سرور");
      }
    }
    setLoading(false);
  };

  const getPriceList = async () => {
    const response = await controller.getFullListOfPrice();
    setPrices(response.json);
  };

  React.useEffect(() => {
    getPriceList();
  }, []);

  const handleFinalSubmit = async () => {
    setLoading(true);
    console.log(selectedOffer);
    const response = await controller.submitCustomerOffer(selectedOffer.id);
    message.success("اطلاعات با موفقیت ثبت شد!");
    setOpenSubmit(false);
    setFormData({
      fee: "",
      unit: "",
    });
    props.handleShowTable();
    setLoading(false);
  };

  const showTable = () => {
    props.handleShowTable();
  };

  const readPriceProps = () => {
    console.log(props.formItems);
  };

  useEffect(() => {
    readPriceProps();
  }, []);

  return (
    <>
      <VisibilityTracker handleMinimize={handleMinimize} />
      <Modal visible={openSubmit} title="ثبت نهایی سفارش" footer={null}>
        <Row justify="space-between">
          <Col>
            {props.formItems &&
            props.formItems.type &&
            props.formItems.type == "buy" ? (
              <span
                style={{
                  color: "#52c41a",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                خرید
              </span>
            ) : (
              <span
                style={{ color: "red", fontWeight: "bold", fontSize: "14px" }}
              >
                فروش
              </span>
            )}
          </Col>
        </Row>
        <br />
        <Row justify="space-between">
          <Col>آیتم</Col>
          <Col>{selectedOffer.price && selectedOffer.price.label}</Col>
        </Row>
        <br />
        <Row justify="space-between">
          <Col>قیمت نهایی</Col>
          <Col>{selectedOffer.finished_fee}</Col>
        </Row>
        <br />
        <Row justify="space-between">
          <Col>تعداد/گرم</Col>
          <Col>{selectedOffer.finished_unit}</Col>
        </Row>
        <br />
        <Row justify="space-between">
          <Col>مظنه</Col>
          <Col>
            {props.formItems.type == "buy"
              ? selectedOffer.price && selectedOffer.price.buy_fee
              : selectedOffer.price && selectedOffer.price.sell_fee}
          </Col>
        </Row>
        <br />
        <Row>
          <Row justify="center" style={{ marginTop: "25px" }}>
            <Button
              loading={loading}
              style={{ minWidth: "150px" }}
              type="primary"
              onClick={handleFinalSubmit}
            >
              ثبت
            </Button>

            <Button onClick={showTable} style={{ marginRight: "8px" }}>
              بازگشت
            </Button>
          </Row>
        </Row>
      </Modal>
      <Row justify="space-between" style={{ padding: "5px 25px" }}>
        <Row>
          <div>
            {props.formItems &&
            props.formItems.type &&
            props.formItems.type == "buy" ? (
              <span
                style={{
                  color: "#52c41a",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                خرید
              </span>
            ) : (
              <span
                style={{ color: "red", fontWeight: "bold", fontSize: "14px" }}
              >
                فروش
              </span>
            )}
          </div>

          <div>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                marginRight: "8px",
              }}
            >
              {props.formItems.item.label}
            </span>
          </div>
        </Row>
        <Col>
          <Row>
            <div>
              قیمت واحد :
              <span style={{ fontWeight: "bold" }}>
                {props.formItems.type == "buy"
                  ? props.formItems.item.buy_fee
                  : props.formItems.item.sell_fee}{" "}
              </span>
            </div>
          </Row>
        </Col>
      </Row>

      <p style={{ marginTop: "25px" }}>گرم / تعداد </p>

      <InputNumber
        name="unit"
        onChange={handleChangeUnit}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        value={formData.unit}
        style={{ direction: "ltr", width: "100%" }}
        placeholder=" تعداد / گرم"
      />

      <p style={{ marginTop: "25px" }}>قیمت</p>

      <InputNumber
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        name="fee"
        onChange={handleChangeFee}
        value={formData.fee}
        disabled={props.formItems.item.item.search("coin") != -1 ? true : false}
        style={{ direction: "ltr", width: "100%" }}
        placeholder="0"
      />

      <Row justify="center" style={{ marginTop: "25px" }}>
        <Button
          loading={loading}
          style={{ minWidth: "150px" }}
          type="primary"
          onClick={onFinish}
        >
          {/* {
                        props.formItems.type != "sell" ? "خرید" : "فروش"
                    } */}
          ثبت
        </Button>

        <Button onClick={showTable} style={{ marginRight: "8px" }}>
          بازگشت
        </Button>
      </Row>
    </>
  );
};

const ShowPriceList = (props) => {
  const [data, setData] = useState([]);
  // State to track if the app is minimized
  const [isMinimized, setIsMinimized] = useState(false);
  const [minimizeTimeout, setMinimizeTimeout] = useState(null);

  // Function to be called when the app is minimized for 30 seconds
  const handleMinimizedForTooLong = () => {
    getPriceList(); // Replace with your actual endpoint call
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
  const columns = [
    {
      title: "قیمت خرید ",
      dataIndex: "buy_fee",
      render: (_, record) => {
        return (
          <>
            <span
              className="success_span"
              type="primary"
              onClick={() => {
                props.handleSelectItem(record, "buy");
              }}
            >
              {record.buy_fee}
            </span>
          </>
        );
      },
    },
    {
      title: "آیتم",
      ellipsis: true, // Enable ellipsis for long text
      dataIndex: "item",
      render: (_, record) => {
        return (
          <div style={{ whiteSpace: "pre-line", maxWidth: "100px" }}>
            {record.label}
          </div>
        );
      },
    },

    {
      title: "قیمت فروش",
      dataIndex: "sell_fee",
      render: (_, record) => {
        return (
          <>
            <span
              className="danger_span"
              onClick={() => {
                props.handleSelectItem(record, "sell");
              }}
            >
              {record.sell_fee}
            </span>
          </>
        );
      },
    },
  ];
  const getPriceList = async () => {
    const response = await controller.getFullListOfPrice();
    console.log(response);
    setData(response.json);
  };

  useEffect(() => {
    getPriceList();
  }, []);

  return (
    <>
      <VisibilityTracker handleMinimize={handleMinimize} />
      {/* <NotificationComponent updatePrice={getPriceList} /> */}
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        scroll={{ x: true }}
        responsive
      />
    </>
  );
};

const CustomerCreateOrder = (props) => {
  const [mode, setMode] = useState("price");
  /*
        1. price
        2. submitForm
    */

  const [formItems, stFormItems] = useState({
    item: {},
    type: "sell",
  });

  const handleSelectItem = (item, type) => {
    // type : sell/buy
    if (value) {
      setMode("submitForm");
      stFormItems({
        item: item,
        type: type,
      });
    } else {
      PopupMessage.openNotification("bottom", "مشتری را انتخاب کنید", "Error");
    }
  };

  const handleShowTable = () => {
    setMode("price");
  };

  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    console.log(props.customerForOrderCreation);
  }, [props.customerForOrderCreation]);

  const readCustomers = async () => {
    const response = await controller.getCustmoerList(0, {});
    setCustomerList(response.json);
  };

  const [value, setValue] = React.useState(null);

  const handleChange = (value) => {
    setValue(value);
  };

  const filterOption = (input, option) => {
    return option.children.toLowerCase().includes(input.toLowerCase());
  };

  useEffect(() => {
    readCustomers();
  }, []);

  const handleNavigateToOrderPage = () => {
    window.location.href = "/order-management";
  };

  return (
    <Card
      title={
        <Row justify="space-between">
          <Col>ثبت سفارش</Col>
          <Col>
            <Link to="/order-management">
              <RightOutlined /> بازگشت به صفحه سفارشات
            </Link>
          </Col>
        </Row>
      }
    >
      {mode == "price" ? (
        <div style={{ margin: "0 auto" }}>
          <p>انتخاب مشتری: </p>
          <Select
            allowClear
            showSearch
            value={value}
            placeholder="انتخاب مشتری"
            optionFilterProp="children"
            onChange={handleChange}
            filterOption={filterOption}
            style={{ width: "100%" }}
          >
            {customerList.map((customer) => (
              <Option key={customer.id} value={customer.id}>
                {`${customer.first_name ? customer.first_name + " " : ""} ${
                  customer.last_name ? customer.last_name : ""
                } - ${customer.phone_number ? customer.phone_number : "-"}`}
              </Option>
            ))}
          </Select>

          <p style={{ marginTop: "15px" }}>انتخاب آیتم:</p>
          <ShowPriceList handleSelectItem={handleSelectItem} />
        </div>
      ) : (
        <div style={{ margin: "0 auto" }}>
          <MyForm
            handleShowTable={handleShowTable}
            formItems={formItems}
            customer={value}
          />
        </div>
      )}
    </Card>
  );
};

export default CustomerCreateOrder;
