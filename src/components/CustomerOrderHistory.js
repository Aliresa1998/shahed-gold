import React, { useEffect, useState } from "react";
import { Table } from "antd";
import moment from "jalali-moment";
import { controller } from "../assets/controller/controller";
const CustomerOrderHistory = (props) => {
  const [data, setData] = useState([]);
  const columns = [
    {
      title: "آِیتم ",
      dataIndex: "label",
      render: (_, record) => {
        return (
          <p
            onClick={() => {
              console.log(record.price_snapshot.fee);
            }}
          >
            {record.price && record.price.label ? record.price.label : "-"}
          </p>
        );
      },
    },
    {
      title: "قیمت واحد ",

      render: (_, record) => {
        return <>{record.price_snapshot.fee}</>;
      },
    },
    {
      title: "مقدار تمام شده ",
      dataIndex: "finished_unit",
      render: (_, record) => {
        return <>{record.finished_unit}</>;
      },
    },
    {
      title: "تاریخ ثبت ",
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
  ];

  const fetchData = async () => {
    console.log(props.user);
    const response = await controller.readOrderOfCustomer(props.user);

    setData(response.json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ marginTop: "5px" }}>
      <Table dataSource={data} columns={columns} pagination={false} />
    </div>
  );
};

export default CustomerOrderHistory;
