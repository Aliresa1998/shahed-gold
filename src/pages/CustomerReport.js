import React, { useEffect, useState } from "react";

import ImageUploader from "./ImageUploader";

import {
  Button,
  Card,
  Form,
  Modal,
  Pagination,
  Row,
  Spin,
  Table,
  message,
} from "antd";
import VisibilityTracker from "../VisibilityTracker";
import { controller } from "../assets/controller/controller";
const CustomerReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  // State to track if the app is minimized
  const [isMinimized, setIsMinimized] = useState(false);
  const [minimizeTimeout, setMinimizeTimeout] = useState(null);

  // Function to be called when the app is minimized for 30 seconds
  const handleMinimizedForTooLong = () => {
    readData(); // Replace with your actual endpoint call
  };

  const props0 = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        setFile(info.file.originFileObj);
        handlePreview(info.file);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} حجم فایل زیاد است.`);
      }
    },
  };

  const onFinish = async (values) => {
    // Handle form submission logic here
    setLoading(true);
    const formData = new FormData();

    formData.append("file", file);
    formData.append("notes", values.notes);

    try {
      const response = await controller.createAttachment(formData);
      if (response.status < 250) {
        form.resetFields();
        setFile(null);
        setPreviewImage(null);
        message.success("فرم ثبت شد.");
        setOpen(false);
        readData();
      }
    } catch (e) {
      message("خطا در ارتباط با سرور");
    }
    setLoading(false);
  };

  const handleChangePage = (new_page) => {
    setPage(new_page);
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

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleReset = () => {
    form.resetFields();
    setFile(null);
    setPreviewImage(null);
    setOpen(false);
  };

  const columns = [
    {
      title: "توضیحات",
      dataIndex: "note",
      render: (_, record) => {
        return <>{record.notes}</>;
      },
    },

    {
      title: "",
      dataIndex: "file",
      render: (_, record) => {
        return (
          <Row justify="end">
            <a
              target="_blank"
              alt="file"
              href={record.file}
              download="downloaded-image.jpg"
            >
              <img width={80} src={record.file} alt="file" />
            </a>
          </Row>
        );
      },
    },
  ];

  const customRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const beforeUpload = (file) => {
    // You can perform additional checks here before uploading the file
    // For example, checking file size or type
    return true;
  };

  const readData = async () => {
    setLoading(true);
    const response = await controller.readAttachmentList(page);
    if (page > 1 && response.status > 250) {
      setPage(page - 1);
      const response = await controller.readAttachmentList(page - 1);
      setPageSize(response.json.count);
      setData(response.json.results);
    } else {
      setPageSize(response.json.count);
      setData(response.json.results);
    }
    setLoading(false);
  };

  const handleSuccessUpload = () => {
    readData();
    setOpen(false);
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

  useEffect(() => {
    readData();
  }, [page]);

  useEffect(() => {
    readData();
  }, []);

  return (
    <>
      <VisibilityTracker handleMinimize={handleMinimize} />
      <Card
        title={
          <Row justify="space-between" style={{ marginRight: "25px" }}>
            <div>{"گزارشات"}</div>
          </Row>
        }
        style={{ minHeight: "50px" }}
      >
        <Row>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            + ثبت
          </Button>
        </Row>

        {loading ? (
          <Row justify="center">
            <Spin />
          </Row>
        ) : (
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
        )}
      </Card>
      <Modal
        title="ثبت فایل جدید"
        onCancel={handleReset}
        visible={open}
        footer={null}
      >
        <ImageUploader handleSuccessUpload={handleSuccessUpload} />
        {/* <Form form={form} onFinish={onFinish}>
                    <Form.Item
                        label="توضیحات"
                        name="notes"
                        rules={[{ required: true, message: 'لطفا توضیحات را وارد نمایید' }]}
                    >
                        <Input placeholder="توضیحات" />
                    </Form.Item>

                    <Form.Item
                        label="بارگزاری فایل"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >

                        <Upload
                            {...props0}
                            showUploadList={false}

                            // beforeUpload={beforeUpload}
                            //customRequest={customRequest}
                            multiple={false}
                        >

                            <Button>
                                بارگزاری تصویر
                            </Button>
                        </Upload>

                    </Form.Item>
                    {
                        previewImage ?
                            <img alt="Preview" style={{ maxWidth: 150 }} src={previewImage} />
                            : <></>
                    }
                    <br />
                    <Row justify="center">

                        <Form.Item>
                            <Button loading={loading} type="primary" htmlType="submit" style={{ marginLeft: 8, minWidth: "120px" }}>
                                ثبت
                            </Button>
                        </Form.Item>
                        <Button onClick={handleReset} >
                            بازگشت
                        </Button>
                    </Row>

                </Form> */}
      </Modal>
    </>
  );
};

export default CustomerReport;
