import {
  DownloadOutlined,
  FilterOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import dayjs from "dayjs";
import { toGregorian } from "jalaali-js";
import moment from "jalali-moment";
import React, { useEffect, useState } from "react";
import CheckAuth from "../CheckAuth";
import { controller } from "../assets/controller/controller";
// import { DatePicker as DatePickerJalali, Calendar, JalaliLocaleListener } from "antd-jalali";
import { PopupMessage } from "../components/PopupMessage";
import VisibilityTracker from "../VisibilityTracker";
import downIcon from "../assets/images/downIcon.svg";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import NotificationComponent from "./NotificationComponent";
import { updateAtom } from '../store';
import { useAtom } from 'jotai';



const { Option } = Select;

const convertToGregorianDate = (persianDate) => {
  const [jy, jm, jd] = persianDate.split("-").map(Number);
  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  const gregorian = dayjs()
    .year(gy)
    .month(gm - 1)
    .date(gd)
    .format("YYYY-MM-DD");
  return gregorian;
};

const Order = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [mode, setMode] = useState("table");
  /*
    1.  table
    2. detailData
    */
  const [detailData, setDetailData] = useState({});
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [dataModalAttachmentsDownload, setDataModalAttachmentsDownload] =
    useState([]);
  const [openModalAttachmentsDownload, setOpenModalAttachmentsDownload] =
    useState(false);
  const [searchFilter, setSearchFilter] = useState({
    customer: "",
    date_created: "",
    status: "",
    item: "",
    type: "",
  });
  // State to track if the app is minimized
  const [isMinimized, setIsMinimized] = useState(false);
  const [minimizeTimeout, setMinimizeTimeout] = useState(null);

  // Function to be called when the app is minimized for 30 seconds
  const handleMinimizedForTooLong = () => {
    handleGetData();
    handleReadCustomerData();
    handleReadItems();
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
  const handleChangeDate = (e, value) => {
    setPage(1);
    console.log(e);
    console.log(value);
    console.log(convertToGregorianDate(value));
    setSearchFilter({
      ...searchFilter,
      date_created:
        convertToGregorianDate(value) == "-100100-03-01"
          ? ""
          : convertToGregorianDate(value),
    });
  };

  const handleSelectItem = (e) => {
    setPage(1);
    console.log(e);
    setSearchFilter({
      ...searchFilter,
      item: e,
    });
  };

  const handleSelectStatus = (e) => {
    setPage(1);
    console.log(e);
    setSearchFilter({
      ...searchFilter,
      status: e,
    });
  };

  const handleSelectUser = (e) => {
    setPage(1);
    console.log(e);
    setSearchFilter({
      ...searchFilter,
      customer: e,
    });
  };

  const handleShowTable = () => {
    setMode("table");
  };

  const handleShowDetail = (record) => {
    setDetailData(record);
    setMode("detailData");
  };

  const handleReadCustomerData = async () => {
    const response = await controller.getCustmoerList(0, {});
    console.log(response);
    setCustomers(response.json);
  };

  const handleReadItems = async () => {
    const response = await controller.getPriceList(0);
    console.log(response);
    setItems(response.json);
  };

  const handleGetData = async () => {
    setLoading(true);
    const response = await controller.getOrderListAdmin(page, searchFilter);
    console.log(response);
    if (page > 1 && response.status > 250) {
      setPage(page - 1);
      const response = await controller.getCustmoerList(page - 1, searchFilter);
      setPageSize(response.json.count);
      setData(response.json.results);
    } else {
      setPageSize(response.json.count);
      setData(response.json.results);
    }
    setLoading(false);
  };

  const handleChangePage = (new_page) => {
    setPage(new_page);
  };

  useEffect(() => {
    handleGetData();
  }, [page]);

  useEffect(() => {
    handleGetData();
  }, [searchFilter]);

  useEffect(() => {
    handleGetData();
    handleReadCustomerData();
    handleReadItems();
  }, []);

  const handleOpenDownloadAttches = (data) => {
    console.log(data);
    setOpenModalAttachmentsDownload(true);
    setDataModalAttachmentsDownload(data);
  };

  const handleShowFilters = () => {
    setShowFilter(!showFilter);
  };

  const handleConfirm = async (status, id) => {
    setLoading(true);
    if (status) {
      try {
        const response = await controller.approveOrderAdmin(id);

        if (response.status < 250) {
          PopupMessage.openNotification(
            "bottom",
            "سفارش با موفقیت تایید شد.",
            "Successful"
          );
          handleGetData();
        } else {
          PopupMessage.openNotification(
            "bottom",
            "خطا در ارسال اطلاعات",
            "Error"
          );
        }
      } catch (e) {
        PopupMessage.openNotification(
          "bottom",
          "خطا در ارتباط با سرور",
          "Error"
        );
      }
    } else {
      try {
        const response = await controller.declineOrderAdmin(id);

        if (response.status < 250) {
          PopupMessage.openNotification(
            "bottom",
            "سفارش با موفقیت رد شد.",
            "Successful"
          );
          handleGetData();
        } else {
          PopupMessage.openNotification(
            "bottom",
            "خطا در ارسال اطلاعات",
            "Error"
          );
        }
      } catch (e) {
        PopupMessage.openNotification(
          "bottom",
          "خطا در ارتباط با سرور",
          "Error"
        );
      }
    }
    setLoading(false);
  };
  const columns = [
    {
      title: "سفارش دهنده",
      dataIndex: "first_name",
      render: (_, record) => {
        return (
          <>{record.customer.first_name + " " + record.customer.last_name}</>
        );
      },
    },
    {
      title: "سفارش گذار",
      dataIndex: "username",
      render: (_, record) => {
        return <>{record.created_by == "customer" ? "مشتری" : "ادمین"}</>;
      },
    },
    {
      title: "آیتم",
      dataIndex: "username",
      render: (_, record) => {
        return (
          <>{record.price && record.price.label ? record.price.label : "-"}</>
        );
      },
    },
    // {
    //     title: "واحد",
    //     dataIndex: "unit",
    //     render: (_, record) => {
    //         return (
    //             <>
    //                 {record.unit}
    //             </>
    //         );
    //     },
    // },
    {
      title: "قیمت واحد",
      dataIndex: "fee",
      render: (_, record) => {
        return (
          <p style={{ color: record.order_type == "sell" ? "red" : "#00dd22" }}>
            {record.price_snapshot.fee}
          </p>
        );
      },
    },
    // {
    //     title: "قیمت",
    //     dataIndex: "fee",
    //     render: (_, record) => {
    //         return (
    //             <>
    //                 {record.fee}
    //             </>
    //         );
    //     },
    // },
    {
      title: "مقدار تمام شده",
      dataIndex: "finished_unit",
      render: (_, record) => {
        return <>{record.finished_unit}</>;
      },
    },
    // {
    //   title: "خرید",
    //   dataIndex: "finished_fee",
    //   render: (_, record) => {
    //     return (
    //       <p style={{ color: "#00dd22" }}>
    //         {record.order_type == "buy" ? record.finished_fee : "-"}
    //       </p>
    //     );
    //   },
    // },
    // {
    //   title: "فروش",
    //   dataIndex: "finished_fee",
    //   render: (_, record) => {
    //     return (
    //       <p style={{ color: "red" }}>
    //         {record.order_type == "sell" ? record.finished_fee : "-"}
    //       </p>
    //     );
    //   },
    // },
    // {
    //     title: "هزینه تمام شده",
    //     dataIndex: "finished_fee",
    //     render: (_, record) => {
    //         return (
    //             <>
    //                 {record.finished_fee}
    //             </>
    //         );
    //     },
    // },
    // {
    //   title: "وضعیت",
    //   dataIndex: "status",
    //   render: (_, record) => {
    //     return (
    //       <>
    //         {record.status == "pending" ? (
    //           <span style={{ color: "orange" }}>معلق</span>
    //         ) : record.status == "submitted" ? (
    //           <span style={{ color: "orange" }}>در انتظار</span>
    //         ) : record.status == "confirmed" ? (
    //           <span style={{ color: "green" }}>تایید شده</span>
    //         ) : record.status == "rejected" ? (
    //           <span style={{ color: "red" }}>رد شده</span>
    //         ) : record.status == "canceled" ? (
    //           <span style={{ color: "red" }}>لغو شده</span>
    //         ) : (
    //           ""
    //         )}
    //       </>
    //     );
    //   },
    // },
    {
      title: "تاریخ ثبت",
      dataIndex: "date_created",
      render: (_, record) => {
        return (
          <>
            {moment(record.date_created)
              .locale("fa")
              .format(" HH:mm:ss YYYY/MM/DD ")}
          </>
        );
      },
    },

    {
      title: "اقدامات",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <Row>
            {record.status == "submitted" || 1 == 1 ? (
              <>
                {record.status == "pending" ? (
                  <span style={{ color: "orange" }}>معلق</span>
                ) : record.status == "submitted" ? (
                  <span
                    style={{
                      color: "orange",
                      borderRadius: "12px",
                      padding: "2px 18px",
                      backgroundColor: "rgba(234, 190, 46, 0.1)",
                    }}
                  >
                    <Popconfirm
                      title={
                        "آیا سفارش  " +
                        record.customer.username +
                        " را تایید می‌کنید؟ "
                      }
                      description={
                        "آیا سفارش  " +
                        record.customer.username +
                        " را تایید می‌کنید؟ "
                      }
                      okText="تایید"
                      cancelText="لغو"
                      onConfirm={() => {
                        handleConfirm(true, record.id);
                      }}
                      onCancel={() => {
                        handleConfirm(false, record.id);
                      }}
                    >
                      {" "}
                      در انتظار <img src={downIcon} alt="dwon" />
                    </Popconfirm>
                  </span>
                ) : record.status == "confirmed" ? (
                  <span style={{ color: "green" }}>تایید شده</span>
                ) : record.status == "rejected" ? (
                  <span style={{ color: "red" }}>رد شده</span>
                ) : record.status == "canceled" ? (
                  <span style={{ color: "red" }}>لغو شده</span>
                ) : (
                  ""
                )}
              </>
            ) : (
              // <div style={{ minWidth: "50px" }}>
              //   <Row justify="space-between" style={{ width: "100%" }}>
              //     <span
              //       type="primary"
              //       style={{
              //         cursor: "pointer",
              //         textDecoration: "underline",
              //         color: " rgb(19, 221, 36)",
              //         fontSize: "10px",
              //       }}
              //       onClick={() => {
              //         handleConfirm(true, record.id);
              //       }}
              //     >
              //       تایید
              //     </span>

              //     <span
              //       danger
              //       style={{
              //         cursor: "pointer",
              //         textDecoration: "underline",
              //         color: "red",
              //         fontSize: "10px",
              //         marginRight: "8px",
              //       }}
              //       onClick={() => {
              //         handleConfirm(false, record.id);
              //       }}
              //     >
              //       لغو
              //     </span>
              //   </Row>
              // </div>
              <></>
            )}
          </Row>
        );
      },
    },
  ];

  const handleNavigateToCreateNewOrderByCustomer = () => {
    window.location.href = "/create-order-admin";
  };

  const handleUpdateList = () => {
    if (page == 1) handleGetData();
  };
  const [update, setUpdate] = useAtom(updateAtom);

  useEffect(() => {
    console.log(update)
    handleGetData();
    handleReadCustomerData();
    handleReadItems();
  }, [update])

  return (
    <>
      {/* <NotificationComponent updateList={handleUpdateList} /> */}
      <VisibilityTracker handleMinimize={handleMinimize} />
      <Modal
        centered
        footer={null}
        title={"دانلود پیوست ها"}
        visible={openModalAttachmentsDownload}
        width={250}
        onCancel={() => {
          setOpenModalAttachmentsDownload(false);
        }}
      >
        {dataModalAttachmentsDownload.map((attach, index) => (
          <Row justify="space-between">
            <Col>پیوست {index + 1} </Col>
            <Col>
              <a href={attach.file} target="_blank">
                {" "}
                <DownloadOutlined style={{ fontSize: "18px" }} />{" "}
              </a>
            </Col>
          </Row>
        ))}
      </Modal>
      <Card
        title={
          <Row justify="space-between" align="middle">
            <div>
              <span style={{ marginRight: "20px" }}>
                {mode == "detailData" ? "جزئیات سفارش" : " سفارشات"}
              </span>
            </div>
            <div>
              {mode == "detailData" ? (
                <span onClick={handleShowTable} className="back-item">
                  <>
                    <RightOutlined /> بازگشت
                  </>
                </span>
              ) : (
                <>
                  <span
                    style={{ marginLeft: "8px" }}
                    onClick={handleShowFilters}
                  >
                    <FilterOutlined style={{ color: "#3A70AF" }} />
                  </span>
                  <Link to="/create-order-admin">
                    <Button type="primary">+ جدید</Button>
                  </Link>
                </>
              )}
            </div>
          </Row>
        }
        style={{ minHeight: "50px" }}
      >
        {/*  <Row>
          <Col className="mr5">
            <Popover
              content={
                <div style={{ minWidth: "200px" }}>
                  <Col>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="مشتری"
                      allowClear
                      value={
                        searchFilter.customer ? searchFilter.customer : null
                      }
                      onChange={handleSelectUser}
                    >
                      {customers &&
                        customers.length > 0 &&
                        customers.map((customer) => (
                          <Option key={customer.id}>
                            {customer.user.username}
                          </Option>
                        ))}
                    </Select>
                    <br />
                    <br />
                    <Select
                      style={{ width: "100%" }}
                      placeholder="آیتم"
                      allowClear
                      value={searchFilter.item ? searchFilter.item : null}
                      onChange={handleSelectItem}
                    >
                      {items.map((item) => (
                        <Option key={item.item}>{item.label}</Option>
                      ))}
                    </Select>
                  </Col>

                  <br />
                  <Col>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="وضعیت"
                      allowClear
                      value={searchFilter.status ? searchFilter.status : null}
                      onChange={handleSelectStatus}
                    >
                      <Option key={"submitted"}>در انتظار تایید</Option>
                      <Option key={"confirmed"}>تایید </Option>
                      <Option key={"rejected"}>رد</Option>
                    </Select>
                  </Col>
                  <br />
                  <Col>
                    <ConfigProvider locale={fa_IR} direction="rtl">
                      <JalaliLocaleListener />
                      <DatePickerJalali
                        onChange={handleChangeDate}
                        style={{ width: "100%" }}
                      />
                    </ConfigProvider>
                  </Col>
                  <br />
                </div>
              }
              title="فیلترها"
              trigger="click"
              placement="bottom"
            >
              <Button type="dashed">
                فیلتر ها
                <FilterOutlined />
              </Button>
            </Popover>
          </Col> 
        </Row>*/}
        {showFilter && (
          <>
            <Row justify="space-between">
              <Col>
                <Select
                  style={{ minWidth: "200px" }}
                  placeholder="مشتری"
                  showSearch
                  allowClear
                  value={searchFilter.customer ? searchFilter.customer : null}
                  onChange={handleSelectUser}
                >
                  {customers &&
                    customers.length > 0 &&
                    customers.map((customer) => (
                      <Option key={customer.id}>
                        {customer.first_name + " " + customer.last_name}
                      </Option>
                    ))}
                </Select>
              </Col>
              <Col>
                <Select
                  style={{ minWidth: "200px" }}
                  placeholder="آیتم"
                  allowClear
                  value={searchFilter.item ? searchFilter.item : null}
                  onChange={handleSelectItem}
                >
                  {items.map((item) => (
                    <Option key={item.item}>{item.label}</Option>
                  ))}
                </Select>
              </Col>

              <Col>
                <Select
                  style={{ minWidth: "200px" }}
                  placeholder="وضعیت"
                  allowClear
                  value={searchFilter.status ? searchFilter.status : null}
                  onChange={handleSelectStatus}
                >
                  <Option key={"submitted"}>در انتظار تایید</Option>
                  <Option key={"confirmed"}>تایید </Option>
                  <Option key={"rejected"}>رد</Option>
                </Select>
              </Col>

              {/* <Col>
                  <ConfigProvider locale={fa_IR} direction="rtl">
                    <JalaliLocaleListener />
                    <DatePickerJalali
                      onChange={handleChangeDate}
                      style={{ width: "100%" }}
                    />
                  </ConfigProvider>
                </Col> */}
            </Row>
            <div
              style={{
                width: "100%",
                borderBottom: "1px solid #eee",
                marginTop: "15px",
              }}
            />
          </>
        )}

        {mode == "detailData" ? (
          <div style={{ padding: "5px 15px" }}>
            <Row justify="space-between">
              <Col className="disable_text">واحد</Col>
              <Col>{detailData.unit}</Col>
            </Row>
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">قیمت</Col>
              <Col>{detailData.fee}</Col>
            </Row>
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">مقدار تمام شده</Col>
              <Col>{detailData.finished_unit}</Col>
            </Row>
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">هزینه تمام شده</Col>
              <Col>{detailData.finished_fee}</Col>
            </Row>
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">وضعیت</Col>
              <Col>
                {detailData.status == "pending" ? (
                  <span style={{ color: "orange" }}>معلق</span>
                ) : detailData.status == "submitted" ? (
                  <span style={{ color: "orange" }}>در انتظار</span>
                ) : detailData.status == "confirmed" ? (
                  <span style={{ color: "green" }}>تایید شده</span>
                ) : detailData.status == "rejected" ? (
                  <span style={{ color: "red" }}>رد شده</span>
                ) : detailData.status == "canceled" ? (
                  <span style={{ color: "red" }}>لغو شده</span>
                ) : (
                  ""
                )}
              </Col>
            </Row>
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">تاریخ ثبت</Col>
              <Col>
                {moment(detailData.date_created)
                  .locale("fa")
                  .format(" HH:mm:ss YYYY/MM/DD ")}
              </Col>
            </Row>
          </div>
        ) : (
          <>
            {/* <Row justify="space-between">
                                <Col>
                                </Col>
                                <Col>
                                    <Button danger={true} type="primary" style={{ minHeight: "40px", minWidth: "160px" }}>
                                        <FilePdfOutlined style={{ fontSize: "15px" }} />       گزارش PDF
                                    </Button>
                                    <Button className="success-btn" type="primary" style={{ minHeight: "40px", minWidth: "150px", marginRight: "5px" }}>
                                        <FileExcelOutlined style={{ fontSize: "15px" }} />    گزارش Excel
                                    </Button>
                                </Col>
                            </Row> */}

            {loading ? (
              <Row justify="center">
                <Spin />
              </Row>
            ) : (
              <>
                <div className="mt10">
                  <Table
                    style={{ overflowX: "auto" }}
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
            )}
          </>
        )}
      </Card>

      <CheckAuth />
    </>
  );
};

export default Order;
