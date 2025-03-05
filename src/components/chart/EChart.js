

import ReactApexChart from "react-apexcharts";
import { Row, Col, Typography } from "antd";
import eChart from "./configs/eChart";

function EChart() {
  const { Title, Paragraph } = Typography;

  const items = [
    {
      Title: "3,6K",
      user: "Users",
    },
    {
      Title: "2m",
      user: "Clicks",
    },
    {
      Title: "$772",
      user: "Sales",
    },
    {
      Title: "82",
      user: "Items",
    },
  ];

  return (
    <>
      {/* <div id="chart">
        <ReactApexChart
          className="bar-chart"
          options={eChart.options}
          series={eChart.series}
          type="bar"
          height={220}
        />
      </div>
      <div className="chart-vistior">
        <Title level={5}>مشتریان فعال</Title>
        <Paragraph className="lastweek">
          <span className="bnb2">+30%</span>      افزایش نسبت به ماه قبل
        </Paragraph>
        <Paragraph className="lastweek">
          مشتریان شما نسبت به ماه قبل 30% افزایش داشته اند که 80 درصد مشتریان جدید در هفته قبل ثبت سفارش انجام داده اند.
        </Paragraph>

      </div> */}
    </>
  );
}

export default EChart;
