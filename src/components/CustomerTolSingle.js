import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Col,
  Spin,
  Table,
} from "antd";
import moment from "jalali-moment";
import React, { useEffect, useState } from "react";
import CheckAuth from "../CheckAuth";
import { controller } from "../assets/controller/controller";
import { PopupMessage } from "../components/PopupMessage";
import VisibilityTracker from "../VisibilityTracker";
const { Option } = Select;
const CustomerTolSingle = (props) => {
  const readData = async () => {
    const response = await controller.readCustomerTolSingle(props.user.id);

    console.log("response");
    console.log(response);
  };

  useEffect(() => {
    handleReadData();
  }, []);

  useEffect(() => {
    handleReadData();
  }, [props]);

  //----------------
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [prices, setPrices] = useState([]);
  const [pageSize, setPageSize] = useState(0);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    console.log("Form values:", values);
    values["customer"] = props?.user?.id;
    try {
      const response = await controller.createTol(values);
      if (response.status < 250) {
        PopupMessage.openNotification(
          "bottom",
          "تلورانس با موفقیت افزوده شد.",
          "Successful"
        );
        handleReadData();
        setOpenCreateModal(false);
        form.resetFields();
      } else {
        PopupMessage.openNotification(
          "bottom",
          "خطا در ارسال اطلاعات",
          "Error"
        );
      }
    } catch (e) {
      PopupMessage.openNotification("bottom", "خطا در ارتباط با سرور", "Error");
    }

    setLoading(false);
  };

  const onReset = () => {
    form.resetFields();
    setOpenCreateModal(false);
  };

  const handleDelete = async (record) => {
    const response = await controller.deleteTol(record.id);

    if (response.status < 250) {
      PopupMessage.openNotification("bottom", "تلورانس حذف شد.", "Successful");
      handleReadData();
    } else {
      PopupMessage.openNotification("bottom", "خطا در حذف تلورانس", "Error");
    }
  };

  const handleChangePage = (new_page) => {
    setPage(new_page);
  };

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

  const handleReadData = async () => {
    setLoading(true);
    const responseprice = await controller.getFullListOfPrice(
      props?.useer?.id,
      page
    );
    console.log(responseprice.json);
    setPrices(responseprice.json);
    console.log('props?.useer?.id');
    console.log(props.user.id);
    const response = await controller.getTolerenceUser(props.user.id, page);
    console.log(response.json.results);
    if (page > 1 && response.status > 250) {
      setPage(page - 1);
      const response = await controller.getCustmoerList(page - 1);
      setPageSize(response.json.count);
      console.log(response.json.results);
      setData(response.json.results);
    } else {
      setPageSize(response.json.count);
      setData(response.json.results);
    }
    setLoading(false);
  };

  const handleShowTable = () => {
    props.handleManageMode("table");
  };

  const handleEdit = (record) => {
    console.log(record);
  };

  const handleAddNewFee = () => {
    console.log();
  };

  const columns = [
    {
      title: "آیتم",

      render: (_, record) => {
        return <>{record.price.label}</>;
      },
    },
    {
      title: "تلورانس خرید",
      dataIndex: "buy_tolerance",
      render: (_, record) => {
        return <>{record.buy_tolerance}</>;
      },
    },
    {
      title: "تلورانس فروش",
      dataIndex: "sell_tolerance",
      render: (_, record) => {
        return <>{record.sell_tolerance}</>;
      },
    },
    {
      title: "تاریخ ایجاد",
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
      title: "",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <Row justify="end">
            <Popconfirm
              title="آیا از حذف این تلورانس مطمئن هستید؟"
              onConfirm={() => {
                handleDelete(record);
              }}
            >
              <span className="delButton">حذف</span>
            </Popconfirm>
          </Row>
        );
      },
    },
  ];

  return (
    <Card
      title={
        <Row justify="space-between" align="middle">
          <Col>تلورانس</Col>
          <Col>
            <Button
              style={{ minHeight: "40px" }}
              onClick={() => {
                setOpenCreateModal(true);
              }}
            >
              + جدید
            </Button>
          </Col>
        </Row>
      }
      style={{ marginTop: "10px" }}
    >
      <>
        <div className="mt10">
          <Table dataSource={data} columns={columns} pagination={false} />
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
      <Modal
        footer={null}
        visible={openCreateModal}
        title="افزودن تلورانس جدید"
        onCancel={onReset}
      >
        <Form
          form={form}
          name="myForm"
          onFinish={onFinish}
          direction="rtl"
          className="row-col"
        >
          <div>آیتم</div>
          <Form.Item
            label=""
            name="price"
            rules={[{ required: true, message: "لطفاً آیتم را انتخاب کنید" }]}
          >
            <Select placeholder="لطفاً آیتم را انتخاب کنید" allowClear>
              {prices &&
                prices.length > 0 &&
                prices.map((price) => (
                  <Option value={price.id}>{price.label}</Option>
                ))}
            </Select>
          </Form.Item>
          <p>تلورانس خرید (تومان)</p>
          <Form.Item
            label=""
            name="buy_tolerance"
            rules={[
              { required: true, message: "لطفاً حداقل خرید را وارد کنید" },
            ]}
          >
            <Input className="ltr" placeholder="0" prefix={"تومان"} />
          </Form.Item>
          <p>تلورانس فروش (تومان)</p>
          <Form.Item
            name="sell_tolerance"
            rules={[
              { required: true, message: "لطفاً حداقل فروش را وارد کنید" },
            ]}
          >
            <Input className="ltr" placeholder="0" prefix={" تومان "} />
          </Form.Item>
          <Row justify="center">
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                loading={loading}
                style={{ minWidth: "150px", marginLeft: "10px" }}
                type="primary"
                htmlType="submit"
              >
                ثبت
              </Button>
              <Button
                type="default"
                onClick={onReset}
                style={{ marginLeft: 8 }}
              >
                بازگشت
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
};

export default CustomerTolSingle;
