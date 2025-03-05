import React, { useEffect, useState } from "react";
import { Card } from "antd";
import ReactApexChart from "react-apexcharts";
import { controller } from "../../assets/controller/controller";

const ChartCard = () => {
  const [categories, setCategories] = useState([]);
  const [buyData, setBuyData] = useState([]);
  const [sellData, setSellData] = useState([]);

  const reaChartData = async () => {
    const response = await controller.readBarChartData();
    var my_labels = [];
    var my_buy = [];
    var my_sell = [];
    if (response.json) {
      for (var i in response.json) {
        my_labels.push(i);
        my_buy.push(response.json[i].buy);
        my_sell.push(response.json[i].sell);
      }
    }

    setCategories(my_labels);
    setBuyData(my_buy);
    setSellData(my_sell);
  };

  useEffect(() => {
    reaChartData();
  }, []);

  const chartOptions = {
    chart: {
      type: "bar",
      height: 250,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
    },

    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },
    colors: ["#00E396", "#FF4560"], // Green for خرید, Red for فروش
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
  };

  const chartSeries = [
    {
      name: "خرید",
      data: buyData,
    },
    {
      name: "فروش",
      data: sellData,
    },
  ];

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartSeries}
      type="bar"
      height={350}
    />
  );
};

export default ChartCard;
