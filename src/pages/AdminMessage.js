import {
  Form,
  Input,
  Button,
  Spin,
  Card,
  Row,
  Table,
  Pagination,
  Modal,
  Popconfirm,
  Col,
  Switch,
} from "antd";
import { PopupMessage } from "../components/PopupMessage";
import React, { useEffect, useState } from "react";
import { controller } from "../assets/controller/controller";
import CreateNewMessageForm from "../components/CreateNewMessageForm";
import EditMessageForm from "../components/EditMessageForm";
import moment from "jalali-moment";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  MailOutlined,
  MessageOutlined,
  RightOutlined,
} from "@ant-design/icons";
function convertToPersianHijri(isoDateString) {
  // Parse the ISO string using jalali-moment
  const gregorianMoment = moment(isoDateString, "YYYY-MM-DDTHH:mm:ssZ");

  // Convert to Persian Hijri and format
  const persianHijri = gregorianMoment
    .locale("fa")
    .format("YYYY-MM-DD HH:mm:ss");

  return persianHijri;
}

const AdminMessage = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const response = await controller.readAdminMessages(
      page,
      searchFilter.name
    );
    if (page > 1 && response.status > 250) {
      setPage(page - 1);
      const response = await controller.readAdminMessages(
        page,
        searchFilter.name
      );
      setPageSize(response.json.count);
      setData(response.json.results);
    } else {
      setPageSize(response.json.count);
      setData(response.json.results);
    }

    if (openAdd) {
      setOpenAdd(false);
    }
    setLoading(false);
  };

  const [searchFilter, setSearchFilter] = useState({
    name: "",
    phone: "",
  });

  const handleSearch = (e) => {
    console.log(e.target.value);
    setPage(1);
    setSearchFilter({
      ...searchFilter,
      name: e.target.value,
    });
  };

  const handleChangePage = (new_page) => {
    setPage(new_page);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleClose = () => {
    setOpenAdd(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [searchFilter]);

  const handleDelete = async (record) => {
    console.log(record);
    const response = await controller.deleteAdminMessage(record.id);

    if (response.status < 250) {
      PopupMessage.openNotification("bottom", "پیغام حذف شد.", "Successful");
      fetchData();
    } else {
      PopupMessage.openNotification("bottom", "خطا در حذف پیغام", "Error");
    }
  };

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingUpdateID, setLoadingUpdateID] = useState(0);

  const onChange = async (record) => {
    setLoadingUpdate(true);
    var payload = {
      is_available: !record.is_available,
    };
    const response = await controller.updateMessageStatus(payload, record.id);

    if (response.status < 250) {
      PopupMessage.openNotification(
        "bottom",
        " تغییرات با موفقیت اعمال شد.",
        "Successful"
      );
    }else{
       PopupMessage.openNotification("bottom", "خطا در ثبت تغییرات", "Error");
    }

    fetchData();

    setTimeout(() => {
      setLoadingUpdate(false);
    }, 500);
  };

  const columns = [
    {
      title: "تیتر",
      dataIndex: "note",
      render: (_, record) => {
        return <>{record.title}</>;
      },
    },
    {
      title: "متن پیام",
      dataIndex: "message",
      render: (_, record) => {
        return <>{record.message}</>;
      },
    },
    {
      title: "تاریخ ایجاد",
      dataIndex: "available_to",
      render: (_, record) => {
        return (
          <div style={{ direction: "ltr" }}>
            {convertToPersianHijri(record.created_at)}
          </div>
        );
      },
    },
    {
      title: "تاریخ اعتبار",
      dataIndex: "available_to",
      render: (_, record) => {
        return (
          <div style={{ direction: "ltr" }}>
            {convertToPersianHijri(record.available_to)}
          </div>
        );
      },
    },
    {
      title: "وضعیت",
      dataIndex: "available_to",
      render: (_, record) => {
        return loadingUpdate && loadingUpdateID == record.id ? (
          <Spin />
        ) : (
          <>
            <Switch
              checked={record.is_available}
              onChange={() => {
                setLoadingUpdateID(record.id);
                onChange(record);
              }}
            />
          </>
        );
      },
    },
    {
      title: "اقدامات",
      dataIndex: "available_to",
      render: (_, record) => {
        return (
          <Row gutter={[10, 10]}>
            <Popconfirm
              title="آیا از حذف این پیغام مطمئن هستید؟"
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
              <EditOutlined
                onClick={() => {
                  console.log(record);
                  setSelectedRecord(record);
                  setOpenEdit(true);
                }}
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

  return (
    <div>
      <Card
        title={
          <Row
            justify="space-between"
            align="middle"
            style={{ marginRight: "25px" }}
          >
            <div>{"اعلانات"}</div>
            <Row>
              <Col>
                <Input
                  style={{ borderRadius: "20px", marginRight: "15px" }}
                  onChange={handleSearch}
                  placeholder="جستجوی اعلانات"
                />
              </Col>
              <Col style={{ marginRight: "30px" }}>
                <Button
                  type="primary"
                  style={{ minHeight: "40px", minWidth: "100px" }}
                  onClick={() => {
                    setOpenAdd(true);
                  }}
                >
                  + جدید
                </Button>
              </Col>
            </Row>
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
                // expandable={{
                //   expandedRowRender: (record) => (
                //     <div>
                //       {/* Add the content you want to show when a row is expanded */}
                //       <p>Additional details for {record.title}</p>
                //     </div>
                //   ),
                //   rowExpandable: () => true,
                //   expandedRowKeys,
                //   onExpand: () => {}, // No manual control here, handled by Eye click
                // }}
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
        visible={openAdd}
        onCancel={() => {
          setOpenAdd(false);
        }}
        title="پیغام جدید"
        footer={null}
      >
        <CreateNewMessageForm
          handleShowTable={fetchData}
          handleClose={handleClose}
        />
      </Modal>
      <Modal
        visible={openEdit}
        onCancel={() => {
          setOpenEdit(false);
        }}
        title="ویرایش پیغام"
        footer={null}
      >
        <EditMessageForm
          selectedRecord={selectedRecord}
          handleShowTable={fetchData}
          handleClose={handleCloseEdit}
        />
      </Modal>
    </div>
  );
};

export default AdminMessage;
