import {
    DownloadOutlined,
    ReloadOutlined,
    RightOutlined
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Modal,
    Pagination,
    Row,
    Spin,
    Table,
    Upload,
    message
} from "antd";
import moment from "jalali-moment";
import React, { useCallback, useEffect, useState } from "react";
import CheckAuth from "../CheckAuth";
import VisibilityTracker from "../VisibilityTracker";
import { controller } from "../assets/controller/controller";
import { PopupMessage } from "../components/PopupMessage";
const CostomerOrderList = (props) => {
  const columns = [
    {
      title: "آیتم",
      dataIndex: "price",
      render: (_, record) => {
        return <>{record.price && record.price.label}</>;
      },
    },
    // {
    //     title: "finished_unit",
    //     dataIndex: "finished_unit",
    //     render: (_, record) => {
    //         return (
    //             <>
    //                 {record.finished_unit}
    //             </>
    //         );
    //     },
    // },
    // {
    //     title: "finished_fee",
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
    //     title: "fee",
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
      title: "وضعیت",
      dataIndex: "status",
      render: (_, record) => {
        return (
          <>
            {record.status == "pending" ? (
              <span style={{ color: "orange" }}>معلق</span>
            ) : record.status == "submitted" ? (
              <span style={{ color: "orange" }}>در انتظار</span>
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
        );
      },
    },
    // {
    //     title: "تاریخ ثبت",
    //     dataIndex: "date_created",
    //     render: (_, record) => {
    //         return (
    //             <>
    //                 {
    //                     moment(record.date_created).locale('fa').format(' HH:mm:ss YYYY/MM/DD ')
    //                 }
    //             </>
    //         );
    //     },
    // },

    // {
    //     title: " پیوست",
    //     dataIndex: "attachment",
    //     render: (_, record) => {
    //         return (
    //             <>
    //                 {

    //                     record && record.attachments
    //                         ? record.attachments.length < 1 ?
    //                             ""
    //                             :
    //                             record.attachments.length == 1 ?
    //                                 <a href={record.attachments[0].file} target="_blank">
    //                                     <DownloadOutlined style={{ fontSize: "18px" }} />
    //                                 </a>
    //                                 :
    //                                 record.attachments.length > 1 ?
    //                                     <span style={{ cursor: "pointer" }}
    //                                         onClick={() => { handleOpenDownloadAttches(record.attachments) }}>
    //                                         <DownloadOutlined style={{ fontSize: "18px" }} />
    //                                     </span>
    //                                     :
    //                                     <></>
    //                         :
    //                         <>-</>
    //                 }
    //             </>
    //         );
    //     },
    // },

    {
      title: "",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <Row justify="end">
            <Row justify="space-between" style={{ minWidth: "40%" }}>
              <div style={{ marginLeft: "20px" }}>
                <span
                  className="detail_btn"
                  onClick={() => {
                    handleShowDetail(record);
                  }}
                >
                  جزئیات
                </span>
              </div>
              {/* <div>
                                {
                                    record.status == "pending" ?

                                        <Row>
                                            <span style={{ color: "red", fontSize: "10px", marginRight: "8px" }}
                                            //onClick={() => { handleConfirm(false, record.id) }}
                                            >
                                                لغو
                                            </span>
                                        </Row>

                                        :
                                        <>-</>
                                }
                            </div> */}
            </Row>
          </Row>
        );
      },
    },
  ];
  const [detailData, setDetailData] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [dataModalAttachmentsDownload, setDataModalAttachmentsDownload] =
    useState([]);
  const [openModalAttachmentsDownload, setOpenModalAttachmentsDownload] =
    useState(false);
  const [mode, setMode] = useState("table");
  /*
        1. table
        2. attachments
        3. detailData
    */
  const [selectedRecord, setSelectedRecord] = useState(0);
  const [file, setFile] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // State to track if the app is minimized
  const [isMinimized, setIsMinimized] = useState(false);
  const [minimizeTimeout, setMinimizeTimeout] = useState(null);

  // Function to be called when the app is minimized for 30 seconds
  const handleMinimizedForTooLong = () => {
    handleReadData(); // Replace with your actual endpoint call
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

  const handleShowDetail = (record) => {
    setDetailData(record);
    setMode("detailData");
  };

  const handlePreview = async (myFile) => {
    console.log(myFile);
    if (myFile) {
      console.log(myFile);
      const base64 = await getBase64(myFile.originFileObj);
      setPreviewImage(base64);
      setPreviewVisible(true);
    }
  };

  const handleCancel = () => setPreviewVisible(false);

  const handleChangeFile = useCallback((info) => {
    if (info.file.status === "uploading") {
      setFile({ loading: true, image: null });
      info.file.status = "done";
    }

    if (info.file.status === "done") {
      console.log(info);
      console.log(info.file);
      console.log(info.file.status);
      setFile(info.file);
      handlePreview(info.file);
    }
  }, []);

  const beforeUpload = (file) => {
    // You can perform additional checks here before uploading the file
    // For example, checking file size or type
    return true;
  };
  const customRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleReadData = async () => {
    setLoading(true);
    const response = await controller.getCustomerOrderList(page);
    console.log(response);
    if (page > 1 && response.status > 250) {
      setPage(page - 1);
      const response = await controller.getCustomerOrderList(page - 1);
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
    props.handleEditedData(record);
  };

  const handleTolerence = (record) => {
    props.handleTol(record);
  };

  const handleOpenDownloadAttches = (data) => {
    console.log(data);
    setOpenModalAttachmentsDownload(true);
    setDataModalAttachmentsDownload(data);
  };

  const handleAddNewUser = () => {
    props.handleManageMode("new");
  };

  const handleChangePage = (new_page) => {
    setPage(new_page);
  };

  useEffect(() => {
    handleReadData();
  }, [page]);

  const handleDelete = async (record) => {
    const response = await controller.deleteCustomer(record.id);

    if (response.status < 250) {
      PopupMessage.openNotification("bottom", "کاربر حذف شد.", "Successful");
      handleReadData();
    } else {
      PopupMessage.openNotification("bottom", "خطا در حذف کاربر", "Error");
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append("file", file.originFileObj);
    formData.append("order", selectedRecord.id);
    try {
      const response = await controller.uploadAttachment(formData);
      if (response.status < 250) {
        setPreviewVisible(false);
        setFile(null);
        message.success("فایل با موفقیت ارسال شد");
      } else {
        message.error("خطا در ارسال فایل");
      }
    } catch (e) {
      message.error("خطا در ارتباط با سرور");
    }
    setLoading(false);
  };

  const handleShowTable = () => {
    setMode("table");
  };

  return (
    <>
      <VisibilityTracker handleMinimize={handleMinimize} />
      {mode == "detailData" ? (
        <Card
          title={
            <Row justify="space-between" style={{ marginRight: "25px" }}>
              <div>{"جزئیات "}</div>
              <div onClick={handleShowTable} className="back-item">
                <RightOutlined /> بازگشت
              </div>
            </Row>
          }
          style={{ minHeight: "50px" }}
        >
          <div style={{ padding: "5px 15px" }}>
            <Row justify="space-between">
              <Col className="disable_text">حجم تمام شده</Col>
              <Col>{detailData.finished_unit}</Col>
            </Row>
            <Row justify="space-between" className="mt15">
              <Col className="disable_text">قیمت تمام شده</Col>
              <Col>{detailData.finished_fee}</Col>
            </Row>
            {/* <Row justify="space-between" className="mt15">
                        <Col className="disable_text">
                            مظنه
                        </Col>
                        <Col>
                            {detailData.fee}
                        </Col>
                    </Row> */}
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

            {/* <Row justify="space-between" className="mt15">
                        <Col className="disable_text">
                            پیوست
                        </Col>
                        <Col>

                            {

                                detailData && detailData.attachments
                                    ? detailData.attachments.length < 1 ?
                                        ""
                                        :
                                        detailData.attachments.length == 1 ?
                                            <a href={detailData.attachments[0].file} target="_blank">
                                                <DownloadOutlined style={{ fontSize: "18px" }} />
                                            </a>
                                            :
                                            detailData.attachments.length > 1 ?
                                                <span style={{ cursor: "pointer" }}
                                                    onClick={() => { handleOpenDownloadAttches(detailData.attachments) }}>
                                                    <DownloadOutlined style={{ fontSize: "18px" }} />
                                                </span>
                                                :
                                                <></>
                                    :
                                    <>-</>

                            }

                        </Col>
                    </Row> */}

            <Row justify="space-between" className="mt15">
              <Col className="disable_text">تاریخ ثبت</Col>
              <Col>
                {moment(detailData.date_created)
                  .locale("fa")
                  .format(" HH:mm:ss YYYY/MM/DD ")}
              </Col>
            </Row>
            {/* <Row justify="space-between" className="mt15">
                       <Col className="disable_text">
                            افزودن پیوست
                        </Col> 
                        <Col>
                            {
                                <span className="success_btn" style={{ border: "1px solid black", fontSize: "18px", borderRadius: "4px", padding: "2px 10px", cursor: "pointer" }} onClick={() => {
                                    setSelectedRecord(detailData)
                                    setMode("attachments")
                                }}>
                                    +
                                </span>


                            }
                        </Col>
                    </Row> */}
          </div>
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
        </Card>
      ) : mode != "table" ? (
        <Card
          title={
            <Row justify="space-between">
              <div>
                {"پیش نمایش پیوست‌های سفارش " +
                  selectedRecord.price_snapshot.item}
              </div>
              <div onClick={handleShowTable} className="back-item">
                <RightOutlined /> بازگشت
              </div>
            </Row>
          }
          style={{ minHeight: "50px" }}
        >
          <Row justify="center" style={{ marginTop: "25px" }}>
            <Upload
              showUploadList={false}
              onChange={handleChangeFile}
              beforeUpload={beforeUpload}
              customRequest={customRequest}
            >
              <Button
                style={{
                  minWidth: "100px",
                  minHeight: "100px",
                  fontSize: "40px",
                  fontWeight: "bold",
                  marginRight: "5px",
                }}
              >
                +
              </Button>
            </Upload>
          </Row>
          <Modal
            visible={previewVisible}
            title="پیش نمایش پیوست"
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
            <Row justify="center" style={{ marginTop: "8px" }}>
              <Button
                loading={loading}
                style={{ minWidth: "120px" }}
                type="primary"
                onClick={handleConfirm}
              >
                تایید
              </Button>
              <Button
                style={{ minWidth: "80px", marginRight: "8px" }}
                onClick={() => {
                  setFile(null);
                  setPreviewVisible(false);
                }}
              >
                لغو
              </Button>
            </Row>
          </Modal>
        </Card>
      ) : (
        <>
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
              <Row style={{ margin: "0% 2%" }} justify="space-between">
                <div>سفارشات</div>
                <div>
                  <ReloadOutlined
                    onClick={handleReadData}
                    style={{ fontSize: "18px" }}
                  />
                </div>
              </Row>
            }
            style={{ minHeight: "50px" }}
          >
            {loading ? (
              <Row justify="center">
                <Spin />
              </Row>
            ) : (
              <>
                <div className="mt10">
                  <Table
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
          </Card>
          <CheckAuth />
        </>
      )}
    </>
  );
};

export default CostomerOrderList;
