import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Card } from "antd";
import { controller } from "../../assets/controller/controller";

const additionalColors = [
  "#8E44AD", // Purple
  "#F39C12", // Orange
  "#16A085", // Teal
  "#E74C3C", // Red
  "#3498DB", // Light Blue
  "#27AE60", // Green
  "#F1C40F", // Yellow
  "#2C3E50", // Dark Blue
  "#9B59B6", // Violet
  "#34495E", // Grayish Blue
];

const PieChartCard = () => {
  const [labels, setLabels] = useState([]);
  const [chartSeries, setChartSeries] = useState([]);

  const readDataOfPieChart = async () => {
    const response = await controller.readPieChartData();
    if (response.status < 250) {
      var my_labels = [];
      var my_chartSeries = [];
      if (response.json) {
        for (var i in response.json) {
          my_labels.push(i);
          my_chartSeries.push(response.json[i]);
        }
      }

      setLabels(my_labels)
      setChartSeries(my_chartSeries)
    }
  };

  useEffect(() => {
    readDataOfPieChart();
  }, []);

  // Chart data and configuration
  const chartOptions = {
    chart: {
      type: "pie",
    },
    labels: labels,
    colors: ["#1E88E5", "#FFC107", "#D32F2F", "#43A047", ...additionalColors], // Custom colors for the chart
    legend: {
      position: "bottom",
      fontSize: "14px",
      labels: {
        useSeriesColors: true,
      },
    },
  };

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="pie"
      height="300"
    />
  );
};

export default PieChartCard;
