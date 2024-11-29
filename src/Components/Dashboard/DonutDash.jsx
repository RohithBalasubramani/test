import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import TimeDrop from "./Timedrop"; // Ensure this path is correct
import ToggleButtons from "./Togglesampling"; // Import the ToggleButtons component
import DateRangeSelector from "./Daterangeselector"; // Import the DateRangeSelector component
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styled from "styled-components";
import "./EnergyComp.css";

const Title = styled.div`
  color: var(--Gray---Typography-700, #242f3e);
  font-feature-settings: "liga" off, "clig" off;

  /* Paragraph/text-md/[R] */
  font-family: "DM Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`;

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({
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
  ], // Specify fields dynamically
}) => {
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data["resampled data"]) {
      const resampledData = data["resampled data"];

      // Calculate sum of values for each field
      const values = fields.map((field) =>
        resampledData.reduce((sum, item) => sum + (item[field.key] || 0), 0)
      );

      const total = values.reduce((sum, value) => sum + value, 0); // Calculate total for percentages

      const labels = fields.map(
        (field, index) =>
          `${field.label} (${((values[index] / total) * 100).toFixed(2)}%)` // Add percentage to labels
      );
      const links = fields.map((field) => `/details/${field.key}`);

      // Update chart data
      setChartData({
        labels,
        datasets: [
          {
            data: values,
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
            links, // Add links to the dataset for navigation
          },
        ],
      });
    } else {
      console.error("No resampled data available");
    }
  }, [data, backgroundColors, fields]);

  if (!chartData) {
    return <div>Loading data...</div>;
  }

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom", // Position the legend at the bottom
        align: "center", // Align the legend items
        labels: {
          boxWidth: 15, // Box size for legend color
          boxHeight: 15,
          padding: 20, // Padding between legend items
          font: {
            size: 14, // Font size for legend text
            family: "DM Sans", // Font family for legend text
          },
          usePointStyle: true, // Use point style for legends
          color: "#333", // Text color for legend
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (sum, currentValue) => sum + currentValue,
              0
            );
            const percentage = total ? ((value / total) * 100).toFixed(2) : 0; // Calculate percentage
            return `${label}: ${value.toFixed(2)} kWh (${percentage}%)`; // Display value with percentage
          },
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const datasetIndex = elements[0].datasetIndex;
        const index = elements[0].index;
        const link = chartData.datasets[datasetIndex].links[index];
        if (link) {
          navigate(link);
        }
      }
    },
  };

  return (
    <div className="container">
      <div className="top">
        <div className="title">Check Energy Consumption</div>
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
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DonutChart;
