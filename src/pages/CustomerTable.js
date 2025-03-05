import {
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  MailOutlined,
  MessageOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Spin,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import CheckAuth from "../CheckAuth";
import { PopupMessage } from "../components/PopupMessage";
import CreateOrderByAdmin from "./CreateOrderByAdmin";
import moment from "jalali-moment";
import { controller } from "../assets/controller/controller";
import VisibilityTracker from "../VisibilityTracker";
import CustomerDetail from "../components/CustomerDetail";
import "antd/dist/antd.css";
const { Search } = Input;

const CustomerTable = (props) => {
  const [dataInvite, setDataInvite] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [searchFilter, setSearchFilter] = useState({
    name: "",
    phone: "",
  });
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // State to track if the app is minimized
  const [isMinimized, setIsMinimized] = useState(false);
  const [minimizeTimeout, setMinimizeTimeout] = useState(null);

  // Function to be called when the app is minimized for 30 seconds
  const handleMinimizedForTooLong = () => {
    handleReadData(); // Replace with your actual endpoint call
  };

  const [showInvite, setShowInvite] = useState(false);

  const handleShowInviteList = () => {
    console.log("reeeeeeeeeeeeee");
    setShowInvite(true);
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

  const handleReadData = async () => {
    setLoading(true);
    const response = await controller.getCustmoerList(page, searchFilter);
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

  useEffect(() => {
    handleReadData();
  }, []);

  const handleEdit = (record) => {
    props.handleEditedData(record);
  };

  const handleTolerence = (record) => {
    props.handleTol(record);
  };

  const handleRowExpand = (recordId) => {
    // Toggle row expansion for the clicked row only
    setExpandedRowKeys((prevKeys) =>
      prevKeys.includes(recordId) ? [] : [recordId]
    );
  };

  const columnsInvite = [
    {
      title: "نام ",
      dataIndex: "first_name",
      render: (_, record) => {
        return <>{record.first_name}</>;
      },
    },
    {
      title: "نام خانوادگی ",
      dataIndex: "last_name",
      render: (_, record) => {
        return <>{record.last_name}</>;
      },
    },
    {
      title: "شماره تلفن",
      dataIndex: "phone_number",
      render: (_, record) => {
        return <>{record.phone_number}</>;
      },
    },
    {
      title: "وضعیت",
      dataIndex: "status",
      render: (_, record) => {
        return record.status == "pending" ? (
          <p style={{ color: "orange" }}>در انتظار</p>
        ) : record.status == "accepted" ? (
          <p style={{ color: "green" }}>تایید شده</p>
        ) : (
          <p style={{ color: "red" }}>منقضی شده</p>
        );
      },
    },
  ];

  const columns = [
    {
      title: "نام ",
      dataIndex: "first_name",
      render: (_, record) => {
        return <>{record.first_name}</>;
      },
    },

    {
      title: "نام خانوادگی ",
      dataIndex: "last_name",
      render: (_, record) => {
        return <>{record.last_name}</>;
      },
    },
    {
      title: "شماره تلفن",
      dataIndex: "phone_number",
      render: (_, record) => {
        return <>{record.phone_number}</>;
      },
    },
    {
      title: "آخرین بازدید",
      dataIndex: "last_visited",
      render: (_, record) => {
        return record.last_visit
          ? moment(record.last_visit)
              .locale("fa")
              .format(" HH:mm:ss YYYY/MM/DD ")
          : "-";
      },
    },

    {
      title: <div className="action-table">اقدامات</div>,
      dataIndex: "action",
      render: (_, record) => {
        return (
          <Row gutter={[10, 10]}>
            <Popconfirm
              title="آیا از حذف این مشتری مطمئن هستید؟"
              onConfirm={() => {
                handleDelete(record);
              }}
            >
              <DeleteOutlined
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#979797",
                }}
              />
            </Popconfirm>

            <Col>
              <EyeOutlined
                onClick={() => handleRowExpand(record.id)}
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#979797",
                }}
              />
            </Col>
          </Row>
        );
      },
    },
  ];

  const [customerForOrderCreation, setCustomerForOrderCreation] = useState({});
  const [createOrderView, setCreateOrderView] = useState(false);

  const handleOpenCreateOrder = (record) => {
    console.log(record);

    setCustomerForOrderCreation(record);
    //localStorage.setItem("sumbmitedOrderUser", rec)
    setCreateOrderView(true);
  };

  const handleAddNewUser = () => {
    props.handleManageMode("new");
  };

  const handleChangePage = (new_page) => {
    setPage(new_page);
  };

  const handleReadInvitedData = async () => {
    const response = await controller.readInvitedUser(1);
    console.log("response.json");
    console.log(response.json);
    setDataInvite(response.json.results);
  };

  useEffect(() => {
    handleReadInvitedData();
    handleReadData();
  }, [page]);

  const handleSearchPhone = (e) => {
    setPage(1);
    console.log(e.target.value);
    setSearchFilter({
      ...searchFilter,
      phone: e.target.value,
    });
  };

  const handleSearchUser = (e) => {
    console.log(e.target.value);
    setPage(1);
    setSearchFilter({
      ...searchFilter,
      name: e.target.value,
    });
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

  const handleSuccessCreateOrderByAdmin = () => {
    setCreateOrderView(false);
    setCustomerForOrderCreation({});
  };

  const handleShowTable = () => {
    setCreateOrderView(false);
    setCustomerForOrderCreation({});
  };

  useEffect(() => {
    handleReadData();
  }, [searchFilter]);

  const updateList = () => {
    handleReadData();
  };

  return (
    <>
      <VisibilityTracker handleMinimize={handleMinimize} />
      <CheckAuth />

      <Card
        title={
          createOrderView ? (
            <Row justify="space-between" style={{ marginRight: "25px" }}>
              <div>
                {"ثبت سفارش - مشتری : " +
                  customerForOrderCreation.user.username}
              </div>

              <div onClick={handleShowTable} className="back-item">
                <RightOutlined /> بازگشت
              </div>
            </Row>
          ) : (
            <Row justify="space-between" align="middle">
              <div>مدیریت مشتریان</div>
              <div>
                <Row justify="start">
                  <Col className="mr5">
                    <Input
                      style={{ borderRadius: "20px" }}
                      onChange={handleSearchUser}
                      placeholder="جستجوی مشتری"
                    />
                    {/* <Popover
                      content={
                        <div style={{ minWidth: "200px" }}>
                          <Col>
                            <Input
                              onChange={handleSearchUser}
                              placeholder="جستجوی نام مشتری"
                            />
                            <br />
                            <br />

                            <Input
                              onChange={handleSearchPhone}
                              placeholder="جستجوی شماره تلفن مشتری"
                            />
                          </Col>
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
                    </Popover> */}
                  </Col>
                  <Col className="mr10">
                    <Button
                      style={{ minHeight: "40px", minWidth: "100px" }}
                      onClick={handleShowInviteList}
                    >
                      لیست دعوت
                    </Button>
                  </Col>
                  <Col className="mr10">
                    <Button
                      type="primary"
                      style={{ minHeight: "40px", minWidth: "100px" }}
                      onClick={handleAddNewUser}
                    >
                      + جدید
                    </Button>
                  </Col>
                </Row>
              </div>
            </Row>
          )
        }
        style={{ minHeight: "50px" }}
      >
        {loading ? (
          <Row justify="center">
            <Spin />
          </Row>
        ) : createOrderView ? (
          <>
            <CreateOrderByAdmin
              customerForOrderCreation={customerForOrderCreation}
              handleSuccessCreateOrderByAdmin={handleSuccessCreateOrderByAdmin}
            />
          </>
        ) : (
          <>
            <div className="mt10">
              <Table
                rowKey="id" // Use "id" as the unique key for rows
                expandable={{
                  expandedRowRender: (record) => (
                    <CustomerDetail user={record} updateList={updateList} />
                  ),
                  rowExpandable: () => true,
                  expandedRowKeys,
                  onExpand: () => {}, // No manual control here, handled by Eye click
                }}
                expandIconColumnIndex={-1} // Remove the default expand icon column
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

      <Modal
        title="لیست کاربران دعوت شده"
        footer={null}
        visible={showInvite}
        onCancel={() => {
          setShowInvite(false);
        }}
      >
        <Table
          dataSource={dataInvite}
          columns={columnsInvite}
          pagination={false}
        />
      </Modal>
    </>
  );
};

export default CustomerTable;
