import { Card, Row, Spin, Table, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { controller } from "../assets/controller/controller";
import CheckAuth from "../CheckAuth";
import VisibilityTracker from "../VisibilityTracker";
import moment from "jalali-moment";
import placeHolderImage from "../assets/images/elementor-placeholder-image.webp"
const CustomerReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  // State to track if the app is minimized
  const [isMinimized, setIsMinimized] = useState(false);
  const [minimizeTimeout, setMinimizeTimeout] = useState(null);

  // Function to be called when the app is minimized for 30 seconds
  const handleMinimizedForTooLong = () => {
    readData(); // Replace with your actual endpoint call
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
      title: "توضیحات",
      dataIndex: "note",
      render: (_, record) => {
        return <>{record.notes}</>;
      },
    },
    {
      title: "مشتری",
      dataIndex: "note",
      render: (_, record) => {
        return (
          <>
            {record.customer && record.customer.first_name
              ? record.customer.first_name + " "
              : "-"}
            {record.customer && record.customer.last_name
              ? record.customer.last_name
              : ""}
          </>
        );
      },
    },
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
              <img width={80} src={record.file ? record.file : placeHolderImage} alt="file" />
            </a>
          </Row>
        );
      },
    },
  ];

  const readData = async () => {
    setLoading(true);
    const response = await controller.readAttachmentListAdmin(page);
    if (page > 1 && response.status > 250) {
      setPage(page - 1);
      const response = await controller.readAttachmentListAdmin(page - 1);
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
    readData();
  }, [page]);

  useEffect(() => {
    readData();
  }, []);

  return (
    <>
      <VisibilityTracker handleMinimize={handleMinimize} />
      <CheckAuth />
      <Card
        title={
          <Row justify="space-between" style={{ marginRight: "25px" }}>
            <div>{"گزارشات"}</div>
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
    </>
  );
};

export default CustomerReport;
