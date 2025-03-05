import { EyeOutlined, RightOutlined } from "@ant-design/icons";
import { Switch, Card, Col, Pagination, Row, Spin, Table } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import CheckAuth from "../CheckAuth";
import { controller } from "../assets/controller/controller";
import { PopupMessage } from "../components/PopupMessage";
import EditPrice from "./EditPrice";
import VisibilityTracker from "../VisibilityTracker";
import Setting from "./Setting";
import PriceDetail from "../components/PriceDetail";
import PriceDetail2 from "../components/PriceDetail2";
const Price = (props) => {
  const [buyLoading, setBuyLoading] = useState({
    id: 0,
    status: false,
  });
  const [sellLoading, setSelloading] = useState({
    id: 0,
    status: false,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [editedData, setEditedData] = useState({});
  const [detailData, setDetailData] = useState({});
  const [detailDataID, setDetailDataID] = useState("-1");
  const [mode, setMode] = useState("table");
  /*
        1. table
        2. edit
        3. detailData
    */

  // State to track if the app is minimized
  const [isMinimized, setIsMinimized] = useState(false);
  const [minimizeTimeout, setMinimizeTimeout] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const handleRowExpand = (recordId) => {
    // Toggle row expansion for the clicked row only
    setExpandedRowKeys((prevKeys) =>
      prevKeys.includes(recordId) ? [] : [recordId]
    );
  };

  // Function to be called when the app is minimized for 30 seconds
  const handleMinimizedForTooLong = () => {
    handleReadData(); // Replace with your actual endpoint call
  };

  const handleEnableSell = async (record) => {
    setSelloading({
      id: record.id,
      status: true,
    });
    console.log(record);
    var payload = { id: record.id };
    payload["sell_available"] = !record.sell_available;

    const response = await controller.updatePrice(payload, record.id);
    handleReadData();
    setTimeout(() => {
      setSelloading({
        id: 0,
        status: false,
      });
    }, 500);
  };

  const handleEnableBuy = async (record) => {
    setBuyLoading({
      id: record.id,
      status: true,
    });
    console.log(record);
    var payload = { id: record.id };
    payload["buy_available"] = !record.buy_available;

    const response = await controller.updatePrice(payload, record.id);

    handleReadData();

    setTimeout(() => {
      setBuyLoading({
        id: 0,
        status: false,
      });
    }, 500);
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

  const updatePrice = async () => {
    console.log(localStorage.getItem("DetailDataID"));
    const response = await controller.getPriceList(page);
    console.log(response);
    if (page > 1 && response.status > 250) {
      setPage(page - 1);
      const response = await controller.getPriceList(page - 1);
      setPageSize(response.json.count);
      setData(response.json.results);
      for (var i in response.json.results) {
        if (
          response.json.results[i].id == localStorage.getItem("DetailDataID")
        ) {
          setDetailData(response.json.results[i]);
        }
      }
    } else {
      setPageSize(response.json.count);
      setData(response.json.results);
      for (var i in response.json.results) {
        if (
          response.json.results[i].id == localStorage.getItem("DetailDataID")
        ) {
          setDetailData(response.json.results[i]);
        }
      }
    }
  };

  const handleReadData = async () => {
    const response = await controller.getPriceList(page);
    console.log(response);
    if (page > 1 && response.status > 250) {
      setPage(page - 1);
      const response = await controller.getPriceList(page - 1);
      setPageSize(response.json.count);
      setData(response.json.results);
    } else {
      setPageSize(response.json.count);
      setData(response.json.results);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleReadData();
  }, []);

  const handleEdit = (record) => {
    setEditedData(record);
    setMode("edit");
  };

  // const handleShowTable = () => {
  //     setMode("table")
  // }

  const handleChangePage = (new_page) => {
    setPage(new_page);
  };

  useEffect(() => {
    handleReadData();
  }, [page]);

  const handleShowDetail = (record) => {
    setDetailData(record);
    setDetailDataID(record.id);
    localStorage.setItem("DetailDataID", record.id);
    setMode("detailData");
  };

  const handleShowTable = () => {
    setMode("table");
    handleReadData();
  };

  const handleDelete = async (record) => {
    const response = await controller.deleteCustomer(record.id);

    if (response.status < 250) {
      PopupMessage.openNotification("bottom", "کاربر حذف شد.", "Successful");
      handleReadData();
    } else {
      PopupMessage.openNotification("bottom", "خطا در حذف کاربر", "Error");
    }
  };

  const columns = [
    {
      title: "آیتم",
      dataIndex: "item",
      render: (_, record) => {
        return <b>{record.label}</b>;
      },
    },
    {
      title: "قیمت خرید",
      dataIndex: "buy_fee",
      render: (_, record) => {
        return <>{record.buy_fee}</>;
      },
    },
    {
      title: "قیمت فروش",
      dataIndex: "sell_fee",
      render: (_, record) => {
        return <>{record.sell_fee}</>;
      },
    },
    {
      title: "وضعیت",
      dataIndex: "sell_fee",
      render: (_, record) => {
        return (
          <>
            <Row>
              <Col style={{ minWidth: "100px" }}>
                {buyLoading.status && buyLoading.id == record.id ? (
                  <Spin />
                ) : (
                  <Switch
                    onClick={() => {
                      handleEnableBuy(record);
                    }}
                    style={{
                      backgroundColor: record.buy_available ? "green" : "",
                    }}
                    checked={record.buy_available}
                    checkedChildren="خرید"
                    unCheckedChildren="خرید"
                  />
                )}
              </Col>

              <Col style={{ minWidth: "100px" }}>
                {sellLoading.status && sellLoading.id == record.id ? (
                  <Spin />
                ) : (
                  <Switch
                    onClick={() => {
                      handleEnableSell(record);
                    }}
                    style={{
                      backgroundColor: record.sell_available ? "red" : "",
                    }}
                    checked={record.sell_available}
                    checkedChildren="فروش"
                    unCheckedChildren="فروش"
                  />
                )}
              </Col>
            </Row>
          </>
        );
      },
    },
    // {
    //   title: " خرید",
    //   dataIndex: "sell_fee",
    //   render: (_, record) => {
    //     return (
    //       <>
    //         {
    //           record.buy_available ? (
    //             <CheckOutlined style={{ color: "green" }} />
    //           ) : (
    //             <CloseOutlined style={{ color: "red" }} />
    //           )

    //           //record.sell
    //         }
    //       </>
    //     );
    //   },
    // },
    // {
    //   title: " فروش",
    //   dataIndex: "sell_fee",
    //   render: (_, record) => {
    //     return (
    //       <>
    //         {
    //           record.sell_available ? (
    //             <CheckOutlined style={{ color: "green" }} />
    //           ) : (
    //             <CloseOutlined style={{ color: "red" }} />
    //           )

    //           //record.sell
    //         }
    //       </>
    //     );
    //   },
    // },
    // {
    //     title: "منبع",
    //     dataIndex: "source",
    //     render: (_, record) => {
    //         return (
    //             <>
    //                 {record.source}
    //             </>
    //         );
    //     },
    // },
    // {
    //     title: "حداقل حجم سفارش",
    //     dataIndex: "minimum_unit",
    //     render: (_, record) => {
    //         return (
    //             <>
    //                 {record.minimum_unit}
    //             </>
    //         );
    //     },
    // },
    // {
    //     title: "حداقل هزینه سفارش",
    //     dataIndex: "minimum_fee",
    //     render: (_, record) => {
    //         return (
    //             <>
    //                 {record.minimum_fee}
    //             </>
    //         );
    //     },
    // },
    // {
    //     title: "تلورانس خرید",
    //     dataIndex: "buy_tolerance",
    //     render: (_, record) => {
    //         return (
    //             <>
    //                 {record.buy_tolerance}
    //             </>
    //         );
    //     },
    // },
    // {
    //     title: "تلورانس فروش",
    //     dataIndex: "sell_tolerance",
    //     render: (_, record) => {
    //         return (
    //             <>
    //                 {record.sell_tolerance}
    //             </>
    //         );
    //     },
    // },

    {
      title: "اقدامات",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <div>
            <EyeOutlined
              onClick={() => handleRowExpand(record.id)}
              style={{
                cursor: "pointer",
                fontSize: "14px",
                color: "#979797",
              }}
            />
          </div>
          // <Row justify="end">
          //   <span
          //     className="editButton"
          //     style={{ marginLeft: "8px" }}
          //     onClick={() => {
          //       handleEdit(record);
          //     }}
          //   >
          //     ویرایش
          //   </span>
          //   <span
          //     className="detail_btn"
          //     onClick={() => {
          //       handleShowDetail(record);
          //     }}
          //   >
          //     جزئیات
          //   </span>
          // </Row>
        );
      },
    },
  ];
  return (
    <>
      <VisibilityTracker handleMinimize={handleMinimize} />
      <CheckAuth />
      <Card
        title={
          <Row justify="space-between">
            <span style={{ marginRight: "20px" }}>
              {mode == "table"
                ? "  نرخ"
                : mode == "detailData"
                ? "جزئیات آیتم"
                : " ویرایش اطلاعات " + editedData.label}
            </span>
            <span onClick={handleShowTable} className="back-item">
              {mode != "table" && (
                <>
                  <RightOutlined /> بازگشت
                </>
              )}
            </span>
          </Row>
        }
        style={{ minHeight: "50px" }}
      >
        {mode == "table" && (
          <Row>
            <Setting />
          </Row>
        )}
        {/* <NotificationComponent updatePrice={updatePrice} /> */}
        {mode == "detailData" ? (
          <div style={{ padding: "5px 15px" }}>
            <Row justify="space-between">
              <Col className="disable_text" onClick={updatePrice}>
                آیتم
              </Col>
              <Col>{detailData.label}</Col>
            </Row>
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">قیمت خرید</Col>
              <Col>{detailData.buy_fee} تومان</Col>
            </Row>
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">قیمت فروش</Col>
              <Col>{detailData.sell_fee} تومان</Col>
            </Row>
            {/* <Row justify="space-between" className="mt15">
                                <Col className="disable_text">
                                    واحد
                                </Col>
                                <Col>
                                    {detailData.unit}
                                </Col>
                            </Row> */}
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">منبع</Col>
              <Col>{detailData.source}</Col>
            </Row>
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">حداقل حجم سفارش</Col>
              <Col>{detailData.minimum_unit} گرم/تعداد</Col>
            </Row>
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">حداقل هزینه سفارش</Col>
              <Col>{detailData.minimum_fee} تومان</Col>
            </Row>
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">تلورانس خرید</Col>
              <Col>{detailData.buy_tolerance}</Col>
            </Row>
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">تلورانس فروش</Col>
              <Col>{detailData.sell_tolerance}</Col>
            </Row>
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">خرید</Col>
              <Col>{detailData.sell_available ? "فعال" : "غیرفعال"}</Col>
            </Row>
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">فروش</Col>
              <Col>{detailData.buy_available ? "فعال" : "غیرفعال"}</Col>
            </Row>
            {/* <Row justify="space-between" className="mt15">
                                <Col className="disable_text">
                                    date_created
                                </Col>
                                <Col>
                                    {
                                        moment(detailData.date_created).locale('fa').format(' HH:mm:ss YYYY/MM/DD ')
                                    }

                                </Col>
                            </Row> */}
          </div>
        ) : mode == "table" ? (
          loading ? (
            <Row justify="center">
              <Spin />
            </Row>
          ) : (
            <>
              <div className="mt10">
                <Table
                  rowKey={"id"}
                  expandable={{
                    expandedRowRender: (record) => (
                      <>
                        <PriceDetail
                          record={record}
                          sellingPrice={record.sell_fee.replaceAll(',','')}
                          purchasePrice={record.buy_fee.replaceAll(',','')}
                        />
                        <br />
                        <PriceDetail2
                          data={{
                            purchaseTolerance: "20.000",
                            salesTolerance: "20.000",
                            minOrderVolume: "2",
                            minOrderCost: "200.000.000",
                          }}
                          record={record}
                          sellingPrice={record.sell_fee}
                          purchasePrice={record.buy_fee}
                        />
                      </>
                    ),
                    rowExpandable: () => true,
                    expandedRowKeys,
                    onExpand: () => {}, // No manual control here, handled by Eye click
                  }}
                  expandIconColumnIndex={-1}
                  dataSource={data}
                  columns={columns}
                  pagination={false}
                />
              </div>

              <Row justify="center" className="mt10">
                <Pagination
                  showSizeChanger={false}
                  hideOnSinglePage={true}
                  onChange={handleChangePage}
                  current={page}
                  total={pageSize}
                />
              </Row>
            </>
          )
        ) : (
          <>
            <EditPrice
              editedData={editedData}
              handleShowTable={handleShowTable}
            />
          </>
        )}
      </Card>
    </>
  );
};

export default Price;
