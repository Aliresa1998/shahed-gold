import React, { useEffect, useState } from "react";
import {
  InputNumber,
  Table,
  Row,
  Card,
  Col,
  Input,
  Select,
  Button,
  message,
  Modal,
} from "antd";
import { controller } from "../assets/controller/controller";
import { ArrowUpOutlined, RightOutlined } from "@ant-design/icons";
import NotificationComponent from "./NotificationComponent";
import CustomerOrderListToday from "./CostomerOrderListToday";
import { FormattedNumber, IntlProvider } from "react-intl";
import Reports from "./Reports";
import infoIcon from "../assets/images/info.svg";
import CreateOrderByAdmin from "./CreateOrderByAdmin";
import { updateAtom, updateUserAtom } from '../store';
import { useAtom } from 'jotai';
const { Option } = Select;

const MyFormCreateOrder = (props) => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("unit");
  const [openSubmit, setOpenSubmit] = useState(false);
  const [formData, setFormData] = useState({
    unit: "",
    fee: "",
  });
  const [selectedOffer, setSelectedOffer] = useState("-1");

  const formatInputValue = (value) => {
    // Convert value to string to use string methods
    let formattedValue = value.toString();
    // Add comma separator every three digits
    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedValue;
  };


  useEffect(() => {
    console.log(props)
  }, [props])

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
      var my_data = {
        price: props.formItems.item.id,
        type: props.formItems.type,
      };
      if (userInput == "fee") my_data["fee"] = formData.fee;
      else my_data["unit"] = formData.unit;
      try {
        const response = await controller.createOrder(my_data);
        if (response.status < 250) {
          setOpenSubmit(true);

          setSelectedOffer(response.json);
          // message.success('اطلاعات با موفقیت ثبت شد!');
          // setFormData({
          //     fee: "",
          //     unit: ""
          // })
          // props.handleShowTable();
        } else {
          message.error("خطا در ثبت سفارش");
        }
      } catch (e) {
        message.error("خطا در ارتباط با سرور");
      }
    }
    setLoading(false);
  };

  const getPriceList = async () => {
    const response = await controller.getFullListOfPriceCustomer();
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
    //props.handleShowTable();
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

  useEffect(() => {
    console.log('hi')
    handleChangeUnit(formData.unit)
    //  handleChangeFee(formData.fee)
  }, [props])

  return (
    <>
      <Modal
        onCancel={() => {
          setOpenSubmit(false)
        }}
        visible={openSubmit} title="ثبت نهایی سفارش" footer={null}>
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

        <Row justify="center" style={{ marginTop: "25px" }}>
          <Button
            loading={loading}
            style={{ minWidth: "150px" }}
            type="primary"
            onClick={handleFinalSubmit}
          >
            ثبت
          </Button>
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

      <Row justify={"space-between"} style={{ margin: "10px" }}>
        <Col>
          <InputNumber
            name="unit"
            onChange={handleChangeUnit}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            value={formData.unit}
            style={{ direction: "ltr", width: "100%" }}
            placeholder={props.formItems.item.unit == "count" ? 'تعداد' : 'گرم'}
          />
        </Col>
        <Col>یا</Col>
        <Col>
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            name="fee"
            onChange={handleChangeFee}
            value={formData.fee}
            disabled={
              props.formItems.item.item.search("coin") != -1 ? true : false
            }
            style={{ direction: "ltr", width: "100%" }}
            placeholder="0"
          />
        </Col>
      </Row>
      <Row justify="center" style={{ margin: "25px 10px" }}>
        <Button
          className={props.formItems.type == "buy" ? "buyButton" : "sellButton"}
          loading={loading}
          style={{ minWidth: "100%" }}
          type="primary"
          onClick={onFinish}
        >
          {props.formItems.type == "buy" ? "بخرید" : "بفروشید"}
          {`${formData.fee}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Button>
      </Row>
    </>
  );
};

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
      var my_data = {
        price: props.formItems.item.id,
        type: props.formItems.type,
      };
      if (userInput == "fee") my_data["fee"] = formData.fee;
      else my_data["unit"] = formData.unit;
      try {
        const response = await controller.createOrder(my_data);
        if (response.status < 250) {
          setOpenSubmit(true);

          setSelectedOffer(response.json);
          // message.success('اطلاعات با موفقیت ثبت شد!');
          // setFormData({
          //     fee: "",
          //     unit: ""
          // })
          // props.handleShowTable();
        } else {
          message.error("خطا در ثبت سفارش");
        }
      } catch (e) {
        message.error("خطا در ارتباط با سرور");
      }
    }
    setLoading(false);
  };

  const getPriceList = async () => {
    const response = await controller.getFullListOfPriceCustomer();
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
    //props.handleShowTable();
    setLoading(false);
  };

  const showTable = () => {
    // props.handleShowTable();
  };

  const readPriceProps = () => {
    console.log(props.formItems);
  };

  useEffect(() => {
    readPriceProps();
  }, []);

  return (
    <>
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
    const response = await controller.getFullListOfPriceCustomer();
    console.log(response);
    setData(response.json);
  };

  const [expandItem, setExpandItem] = useState(null);
  const [expandItemColor, setExpandItemColor] = useState("green"); // 1.green 2.red

  const handleBuyItem = (item) => {
    setExpandItem(item);
    setExpandItemColor("green");
  };

  const handleSellItem = (item) => {
    setExpandItem(item);
    setExpandItemColor("red");
  };

  const [updateUser, setUpdateUser] = useAtom(updateUserAtom);

  useEffect(() => {
    getPriceList();
  }, []);
  useEffect(() => {
    getPriceList();
  }, [updateUser]);

  return (
    <div>
      {/* <NotificationComponent updatePrice={getPriceList} /> */}
      <div style={{ fontSize: "16px", fontWeight: "700" }}>آبشده</div>

      <Row
        justify={"space-between"}
        style={{ paddingLeft: "5%", paddingRight: "5%" }}
      >
        <Col style={{ width: "40%" }}></Col>
        <Col style={{ marginLeft: "20%", color: "#979797" }}>خرید شما</Col>
        <Col
          style={{
            paddingLeft: "3%",
            display: "flex",
            justifyContent: "start",
            color: "#979797",
          }}
        >
          فروش شما
        </Col>
      </Row>
      {data &&
        data.length > 0 &&
        data.map((item, index) =>
          item.unit == "grams" &&
            expandItem &&
            expandItem.label &&
            expandItem.label == item.label ? (
            <div
              className="orderCustomerNewRow"
              style={{
                backgroundColor:
                  expandItemColor == "green" ? "#d4ffdd" : "#ffe0e0",
              }}
            >
              <Row
                justify={"space-between"}
                style={{ paddingLeft: "5%", paddingRight: "5%" }}
              >
                <Col style={{ width: "40%" }}>{item.label}</Col>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingLeft: "20%",
                  }}
                >
                  <Row
                    style={{ justifyContent: "center" }}
                    className="buyCard"
                    onClick={() => {
                      if (item.buy_fee) handleBuyItem(item);
                    }}
                  >
                    {item.buy_fee}
                  </Row>
                </Col>
                <Col style={{ display: "flex", justifyContent: "end" }}>
                  <Row
                    style={{ justifyContent: "end" }}
                    className="sellCard"
                    onClick={() => {
                      if (item.sell_fee) handleSellItem(item);
                    }}
                  >
                    {item.sell_fee + "" == "0" ? "0" : item.sell_fee}
                  </Row>
                </Col>
              </Row>

              {/* <Row
                justify={"space-between"}
                style={{
                  paddingLeft: "5%",
                  paddingRight: "5%",

                  margin: "15px 10px",
                }}
                className="reportOfExpandedCard"
              >
                در صورت آفلاین بودن با شماره 44333333-021 تماس بگیرید.
                <br /> نقد فردا برای روز شنبه و نقد پس فردا روز یکشنبه است.
              </Row> */}

              {/* <Row
                justify={"space-between"}
                align={"middle"}
                style={{
                  paddingLeft: "5%",
                  paddingRight: "5%",
                  marginTop: "15px",
                }}
              >
                <Col>
                  <Input placeholder="گرم" />
                </Col>
                <Col>
                  <span style={{ color: "#979797" }}>یا</span>
                </Col>
                <Col>
                  <Input placeholder="تومان" />
                </Col>
              </Row>
              <Row style={{ margin: "5px", color: "#979797" }}>
                <img src={infoIcon} alt="info" />
                <p>حداقل حجم 10گرم و حداقل قیمت 10،000،000</p>
              </Row>

              <Button className="buyButton" style={{ width: "100%" }}>
                بخرید 0
              </Button> */}
              {expandItemColor == "green" ? (
                <MyFormCreateOrder
                  formItems={{
                    item: item,
                    type: "buy",
                  }}
                />
              ) : (
                <MyFormCreateOrder
                  formItems={{
                    item: item,
                    type: "sell",
                  }}
                />
              )}
              <Row
                style={{
                  color: expandItemColor == "green" ? 'green' : 'red',
                  marginTop: "15px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                justify={"center"}
                onClick={() => {
                  setExpandItem(false);
                }}
              >
                <span style={{ color: expandItemColor == "green" ? 'green' : 'red', }}>

                  {"<"}
                </span>
              </Row>
            </div>
          ) : (
            item.unit == "grams" && (
              <div className="orderCustomerNewRow">
                <Row
                  justify={"space-between"}
                  //   className="orderCustomerNewRow"
                  style={{ paddingLeft: "5%", paddingRight: "5%" }}
                >
                  <Col style={{ width: "40%" }}>{item.label}</Col>
                  <Col
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingLeft: "20%",
                    }}
                  >
                    <Row
                      style={{ justifyContent: "center" }}
                      className="buyCard"
                      onClick={() => {
                        if (item.buy_fee) handleBuyItem(item);
                      }}
                    >
                      {item.buy_fee}
                    </Row>
                  </Col>
                  <Col style={{ display: "flex", justifyContent: "end" }}>
                    <Row
                      style={{ justifyContent: "end" }}
                      className="sellCard"
                      onClick={() => {
                        if (item.sell_fee) handleSellItem(item);
                      }}
                    >
                      {item.sell_fee + "" == "0" ? "0" : item.sell_fee}
                    </Row>
                  </Col>
                </Row>
              </div>
            )
          )
        )}

      <div style={{ fontSize: "16px", fontWeight: "700" }}>مسکوکات</div>
      <Row
        justify={"space-between"}
        style={{ paddingLeft: "5%", paddingRight: "5%" }}
      >
        <Col style={{ width: "40%" }}></Col>
        <Col style={{ marginLeft: "20%", color: "#979797" }}>خرید شما</Col>
        <Col
          style={{
            paddingLeft: "3%",
            display: "flex",
            justifyContent: "start",
            color: "#979797",
          }}
        >
          فروش شما
        </Col>
      </Row>
      {data &&
        data.length > 0 &&
        data.map((item, index) =>
          item.unit != "grams" &&
            expandItem &&
            expandItem.label &&
            expandItem.label == item.label ? (
            <div
              className="orderCustomerNewRow"
              style={{
                backgroundColor:
                  expandItemColor == "green" ? "#d4ffdd" : "#ffe0e0",
              }}
            >
              <Row
                justify={"space-between"}
                style={{
                  paddingLeft: "5%",
                  paddingRight: "5%",
                  margin: "12px -5px",
                }}
              >
                <Col style={{ width: "40%" }}>{item.label}</Col>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingLeft: "20%",
                  }}
                >
                  <Row
                    style={{ justifyContent: "center" }}
                    className="buyCard"
                    onClick={() => {
                      if (item.buy_fee) handleBuyItem(item);
                    }}
                  >
                    {item.buy_fee}
                  </Row>
                </Col>
                <Col style={{ display: "flex", justifyContent: "end" }}>
                  <Row
                    style={{ justifyContent: "end" }}
                    className="sellCard"
                    onClick={() => {
                      if (item.sell_fee) handleSellItem(item);
                    }}
                  >
                    {item.sell_fee + "" == "0" ? "0" : item.sell_fee}
                  </Row>
                </Col>
              </Row>

              {expandItemColor == "green" ? (
                <MyFormCreateOrder
                  formItems={{
                    item: item,
                    type: "buy",
                  }}
                />
              ) : (
                <MyFormCreateOrder
                  formItems={{
                    item: item,
                    type: "sell",
                  }}
                />
              )}
              <Row
                style={{
                  color: expandItemColor == "green" ? '#42b75b' : '#db4b4b',
                  marginTop: "15px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                justify={"center"}
                onClick={() => {
                  setExpandItem(false);
                }}
              >
                <span style={{ color: expandItemColor == "green" ? '#42b75b' : '#db4b4b' }}>

                  {"<"}
                </span>

              </Row>
              {/* <Row
                justify={"space-between"}
                style={{
                  paddingLeft: "5%",
                  paddingRight: "5%",
                  marginTop: "15px",
                }}
              >
                گرم یا تومان
              </Row> */}
            </div>
          ) : (
            item.unit != "grams" && (
              <div className="orderCustomerNewRow">
                <Row
                  justify={"space-between"}
                  //   className="orderCustomerNewRow"
                  style={{ paddingLeft: "5%", paddingRight: "5%" }}
                >
                  <Col style={{ width: "40%" }}>{item.label}</Col>
                  <Col
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingLeft: "20%",
                    }}
                  >
                    <Row
                      style={{ justifyContent: "center" }}
                      className="buyCard"
                      onClick={() => {
                        if (item.buy_fee) handleBuyItem(item);
                      }}
                    >
                      {item.buy_fee}
                    </Row>
                  </Col>
                  <Col style={{ display: "flex", justifyContent: "end" }}>
                    <Row
                      style={{ justifyContent: "end" }}
                      className="sellCard"
                      onClick={() => {
                        if (item.sell_fee) handleSellItem(item);
                      }}
                    >
                      {item.sell_fee + "" == "0" ? "0" : item.sell_fee}
                    </Row>
                  </Col>
                </Row>
              </div>
            )
          )
        )}
    </div>
  );
};

const CustomerCreateOrder = () => {
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
    setMode("submitForm");
    stFormItems({
      item: item,
      type: type,
    });
  };

  const handleShowTable = () => {
    //setMode("price");
  };

  return (
    <>
      {mode == "price" ? (
        <>
          <div style={{ margin: "20px" }}>
            <Row justify="space-between">
              <span
                style={{
                  // marginRight: "20px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                سفارش جدید
                {/* <div style={{ fontSize: "11px", color: "#999" }}>
                  * تمامی قیمت‌ها بر حسب تومان می‌باشد.{" "}
                </div> */}
              </span>
              {mode != "price" && (
                <span onClick={handleShowTable} className="back-item">
                  <RightOutlined /> بازگشت
                </span>
              )}
            </Row>
            <Reports />
            <br />
            <ShowPriceList handleSelectItem={handleSelectItem} />
          </div>
          <br />

          <CustomerOrderListToday />
        </>
      ) : (
        <Card
          title={
            <Row justify="space-between">
              <span style={{ marginRight: "20px" }}>
                ثبت سفارش
                <div style={{ fontSize: "11px", color: "#999" }}>
                  * تمامی قیمت‌ها بر حسب تومان می‌باشد.{" "}
                </div>
              </span>
              {mode != "price" && (
                <span onClick={handleShowTable} className="back-item">
                  <RightOutlined /> بازگشت
                </span>
              )}
            </Row>
          }
          style={{ margin: "0 auto" }}
        >
          <MyForm handleShowTable={handleShowTable} formItems={formItems} />
        </Card>
      )}
    </>
  );
};

export default CustomerCreateOrder;
