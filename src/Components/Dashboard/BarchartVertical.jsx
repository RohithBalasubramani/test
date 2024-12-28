import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import TimeDrop from "./Timedrop"; // Ensure this path is correct
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import styled from "styled-components";
import "./EnergyComp.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Title = styled.div`
  color: var(--Gray---Typography-700, #242f3e);
  font-feature-settings: "liga" off, "clig" off;
  font-family: "DM Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
`;

const HorizontalChart = ({
  data,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  timeperiod,
  setTimeperiod,
  dateRange,
  setDateRange,
  backgroundColors = [],
  fields = [
    { key: "P1_AMFS_Transformer2", label: "Transformer 2" },
    { key: "P1_AMFS_Generator2", label: "Generator 2" },
    { key: "P1_AMFS_Outgoing2", label: "Outgoing 2" },
    { key: "P1_AMFS_APFC2", label: "APFC 2" },
    { key: "P1_AMFS_Transformer3", label: "Transformer 3" },
  ],
}) => {
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data["resampled data"]) {
      try {
        const resampledData = data["resampled data"];
        console.log("Original Resampled Data:", resampledData);

        // Normalize resampled data keys
        const normalizedResampledData = resampledData.map((item) => {
          const normalizedItem = {};
          Object.keys(item).forEach((key) => {
            normalizedItem[key.toLowerCase()] = item[key];
          });
          return normalizedItem;
        });

        // Normalize fields
        const normalizedFields = fields.map((field) => ({
          ...field,
          key: field.key.toLowerCase(),
        }));

        console.log("Normalized Fields:", normalizedFields);
        console.log("Normalized Resampled Data:", normalizedResampledData);

        // Validate fields against normalized resampled data
        const invalidFields = normalizedFields.filter(
          (field) =>
            !normalizedResampledData.some(
              (item) => item[field.key] !== undefined
            )
        );

        if (invalidFields.length > 0) {
          console.error(
            "Invalid fields detected:",
            invalidFields.map((field) => field.key)
          );
        }

        // Sum up the values for each field
        const values = normalizedFields.map((field) => ({
          label: field.label,
          value: normalizedResampledData.reduce(
            (sum, item) => sum + (item[field.key] || 0),
            0
          ),
          key: field.key,
        }));

        // Sort values in descending order
        values.sort((a, b) => b.value - a.value);

        const labels = values.map((item) => item.label);
        const sortedValues = values.map((item) => item.value);
        const links = values.map((item) => `/details/${item.key}`);

        // Update chart data
        setChartData({
          labels,
          datasets: [
            {
              label: "Energy Sources (KWh)",
              data: sortedValues,
              backgroundColor: backgroundColors.length
                ? backgroundColors
                : [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                    "#FFCD56",
                    "#C9CBCF",
                  ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FFCD56",
                "#C9CBCF",
              ],
              links,
            },
          ],
        });
      } catch (error) {
        console.error("Error processing chart data:", error);
      }
    } else {
      console.error("No resampled data available");
    }
  }, [data, backgroundColors, fields]);

  if (!chartData) {
    return <div>Loading data...</div>;
  }

  // Chart.js options for horizontal bar chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y", // Horizontal bar chart
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "center",
        labels: {
          generateLabels: (chart) => {
            return chart.data.labels.map((label, i) => ({
              text: label,
              fillStyle: chart.data.datasets[0].backgroundColor[i],
            }));
          },
          boxWidth: 15,
          boxHeight: 15,
          padding: 20,
          font: {
            size: 14,
            family: "DM Sans",
          },
          usePointStyle: true,
          color: "#333",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(2)} KWh`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Energy Consumption (KWh)",
          font: {
            family: "DM Sans",
            size: 14,
          },
          color: "#666",
        },
        ticks: {
          callback: function (value) {
            return value.toFixed(2) + " KWh";
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Sources",
          font: {
            family: "DM Sans",
            size: 14,
          },
          color: "#666",
        },
        grid: {
          display: false,
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const datasetIndex = elements[0].datasetIndex;
        const index = elements[0].index;
        const fieldKey = chartData.datasets[datasetIndex].links[index]
          .split("/")
          .pop(); // Extract field key

        // Get the current location and modify the path
        const currentPath = window.location.hash
          .split("/")
          .slice(0, -1)
          .join("/");
        const newPath = `${currentPath}/${fieldKey}`;

        navigate(-1)
        navigate(`/${fieldKey}`);
        console.log("Redirecting to:", newPath);
      }
    },
  };

  return (
    <div className="container">
      <div className="top">
        <div className="title">Energy Consumption by Sources</div>
        <div className="menubar">
          <TimeDrop
            dateRange={dateRange}
            setStartDate={setStartDate}
            setDateRange={setDateRange}
            setEndDate={setEndDate}
            setTimeperiod={setTimeperiod}
          />
        </div>
      </div>
      <div className="chart-size">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default HorizontalChart;
