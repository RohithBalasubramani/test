import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";
import TimeBar from "../TRFF/TimePeriod"; // Ensure this path is correct
import ToggleButtons from "./Togglesampling";
import DateRangeSelector from "./Daterangeselector";
import BarChartLoad from "./ChartLoading";
import "./StackedBarDGEB.css";

const StackedBarChart = ({
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

  useEffect(() => {
    if (data && data["resampled data"]) {
      try {
        const resampledData = data["resampled data"];
        console.log("Original Resampled Data:", resampledData);

        // 🔄 Normalize resampled data keys
        const normalizedResampledData = resampledData.map((item) => {
          const normalizedItem = {};
          Object.keys(item).forEach((key) => {
            normalizedItem[key.toLowerCase()] = item[key];
          });
          return normalizedItem;
        });

        // 🔄 Normalize fields keys
        const normalizedFields = fields.map((field) => ({
          ...field,
          key: field.key.toLowerCase(),
        }));

        console.log("Normalized Fields:", normalizedFields);
        console.log("Normalized Resampled Data:", normalizedResampledData);

        // ✅ Validate fields against normalized resampled data
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

        // 📊 Generate x-axis labels
        const xAxisLabels = generateXAxisLabels(normalizedResampledData);

        // 📊 Generate datasets
        const datasets = normalizedFields
          .map((entry, index) => ({
            label: entry.label,
            data: normalizedResampledData.map((item) => item[entry.key] || 0),
            backgroundColor:
              backgroundColors[index] ||
              `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                Math.random() * 255
              )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
          }))
          .filter((dataset) =>
            dataset.data.some((value) => value !== null && value !== 0)
          );

        setChartData({
          labels: xAxisLabels,
          datasets: datasets,
        });
      } catch (error) {
        console.error("Error processing data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError("No resampled data available");
    }
  }, [data, timeperiod, backgroundColors, fields]);

  // 📅 Function to generate x-axis labels
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

  // 🕒 Loading state
  if (loading) {
    return (
      <div>
        <BarChartLoad />
      </div>
    );
  }

  // 🚨 Error state
  if (error) {
    return <div>{error}</div>;
  }

  // 📊 Render chart
  return (
    <div className="stacked-bar-container">
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row">
            <div className="title">Energy Consumption by Feeders</div>
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
                      align: "start",
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

export default StackedBarChart;
