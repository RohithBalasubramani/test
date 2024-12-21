import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";
import TimeBar from "../TRFF/TimePeriod"; // Ensure this path is correct
import ToggleButtons from "./Togglesampling"; // Import the ToggleButtons component
import "./StackedBarDGEB.css"; // Import the CSS file

const StackedBarDGEB = ({
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
  fields = [],
}) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Fields:", fields, "Data:", data);

  useEffect(() => {
    if (data && data["resampled data"]) {
      try {
        const resampledData = data["resampled data"];
        console.log("Resampled Data:", resampledData);

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

        // Validate if fields align with normalized resampled data keys
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

        // Generate x-axis labels based on time period
        const xAxisLabels = generateXAxisLabels(resampledData);

        // Generate datasets for each field
        const datasets = normalizedFields.map((field, index) => {
          const dataPoints = normalizedResampledData.map(
            (item) => item[field.key] || 0
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
        console.error("Error processing chart data:", error);
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
            <div className="title">Energy Consumption by Source</div>
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
                  maintainAspectRatio: false,
                  responsive: true,
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
                    x: {
                      stacked: true,
                      grid: {
                        color: "rgba(0, 0, 0, 0.05)",
                        borderDash: [8, 4],
                      },
                    },
                    y: {
                      stacked: true,
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

export default StackedBarDGEB;
