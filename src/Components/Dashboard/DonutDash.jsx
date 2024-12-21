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

        // Calculate sum of values for each field
        const values = normalizedFields.map((field) =>
          normalizedResampledData.reduce(
            (sum, item) => sum + (item[field.key] || 0),
            0
          )
        );

        const total = values.reduce((sum, value) => sum + value, 0); // Calculate total for percentages

        const labels = normalizedFields.map(
          (field, index) =>
            `${field.label} (${((values[index] / total) * 100).toFixed(2)}%)`
        );
        const links = normalizedFields.map((field) => `/details/${field.key}`);

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

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "center",
        labels: {
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
            const total = context.dataset.data.reduce(
              (sum, currentValue) => sum + currentValue,
              0
            );
            const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
            return `${label}: ${value.toFixed(2)} kWh (${percentage}%)`;
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
