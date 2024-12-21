import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";
import TimeBar from "../TRFF/TimePeriod"; // Ensure this path is correct
import ToggleButtons from "./Togglesampling"; // Import the ToggleButtons component
import DateRangeSelector from "./Daterangeselector"; // Import the DateRangeSelector component
import "./StackedBarDGEB.css"; // Import the CSS file

const CostChart = ({
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
    { key: "P1_AMFS_Transformer1", label: "Transformer 1" },
    { key: "P1_AMFS_Generator1", label: "Generator 1" },
    { key: "P1_AMFS_Outgoing1", label: "Outgoing 1" },
  ], // Specify fields dynamically
}) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data && data["resampled data"]) {
      try {
        const resampledData = data["resampled data"];
        console.log("Original Resampled Data:", resampledData);

        // Normalize keys in resampled data
        const normalizedResampledData = resampledData.map((item) => {
          const normalizedItem = {};
          Object.keys(item).forEach((key) => {
            normalizedItem[key.toLowerCase()] = item[key];
          });
          return normalizedItem;
        });

        // Normalize keys in fields
        const normalizedFields = fields.map((field) => ({
          ...field,
          key: field.key.toLowerCase(),
        }));

        console.log("Normalized Fields:", normalizedFields);
        console.log("Normalized Resampled Data:", normalizedResampledData);

        // Validate fields
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

        // Generate x-axis labels
        const xAxisLabels = generateXAxisLabels(normalizedResampledData);

        // Map datasets
        const datasets = normalizedFields.map((field, index) => {
          const dataPoints = normalizedResampledData.map(
            (item) => (item[field.key] || 0) * 10 // Multiply kW by 10 for cost
          );

          console.log(`Data for ${field.label}:`, dataPoints);

          return {
            label: field.label,
            data: dataPoints,
            backgroundColor:
              backgroundColors[index] ||
              `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                Math.random() * 255
              )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
          };
        });

        setChartData({
          labels: xAxisLabels,
          datasets: datasets,
        });
      } catch (error) {
        console.error("Error processing data:", error);
        setError(error.message || "Error processing data.");
      } finally {
        setLoading(false);
      }
    } else {
      console.error("No resampled data available.");
      setLoading(false);
      setError("No resampled data available.");
    }
  }, [data, fields, backgroundColors, timeperiod]);

  // Function to generate x-axis labels based on timeperiod
  const generateXAxisLabels = (resampledData) => {
    if (!resampledData || resampledData.length === 0) return [];

    switch (timeperiod) {
      case "H": // Hourly
        return resampledData.map((item) =>
          dayjs(item.timestamp).format("MMM D, H:mm")
        );
      case "D": // Daily
        return resampledData.map((item) =>
          dayjs(item.timestamp).format("MMM D, YYYY")
        );
      case "W": // Weekly
        return resampledData.map((item) => {
          const weekNumber = dayjs(item.timestamp).week();
          return `Week ${weekNumber} - ${dayjs(item.timestamp).format("MMM")}`;
        });
      case "M": // Monthly
        return resampledData.map((item) =>
          dayjs(item.timestamp).format("MMM YYYY")
        );
      case "Q": // Quarterly
        return resampledData.map((item) => {
          const month = dayjs(item.timestamp).month();
          const quarter = Math.floor(month / 3) + 1;
          return `Q${quarter} ${dayjs(item.timestamp).format("YYYY")}`;
        });
      case "Y": // Yearly
        return resampledData.map((item) =>
          dayjs(item.timestamp).format("YYYY")
        );
      default:
        return resampledData.map((item) =>
          dayjs(item.timestamp).format("MMM D, YYYY")
        );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div className="stacked-bar-container">
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row">
            <div className="title">Energy Cost by Source (Rs)</div>
            <div className="controls">
              <TimeBar
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                dateRange={dateRange}
                setDateRange={setDateRange}
                setTimeperiod={setTimeperiod}
                startDate={startDate}
                endDate={endDate}
              />
              <DateRangeSelector
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              />
            </div>
          </div>
          <div className="row">
            <ToggleButtons
              dateRange={dateRange}
              timeperiod={timeperiod}
              setTimeperiod={setTimeperiod}
            />
          </div>

          {chartData && chartData.labels && chartData.labels.length > 0 ? (
            <div className="chart-size">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: "bottom",
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
                  },
                  scales: {
                    x: { stacked: true },
                    y: {
                      stacked: true,
                      title: {
                        display: true,
                        text: "Cost (Rs)",
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div>No data available for the selected range.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostChart;
