import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";
import "../Dashboard/StackedBarDGEB.css";
import { OverviewSource } from "../../phasedata";
import ToggleButtons from "../Togglesampling";
import TimeBar from "../TRFF/TimePeriod";

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
}) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Data:", data);

  useEffect(() => {
    if (data && data["resampled data"]) {
      try {
        const resampledData = data["resampled data"];
        console.log("Resampled Data:", resampledData);

        // 🔄 Normalize keys in resampled data
        const normalizedResampledData = resampledData.map((item) => {
          const normalizedItem = {};
          Object.keys(item).forEach((key) => {
            normalizedItem[key.toLowerCase()] = item[key];
          });
          return normalizedItem;
        });

        // 🔄 Aggregate Data for EB, DG, and Solar
        const categories = ["EB", "DG", "Solar"];
        const aggregatedData = categories.map((category) => {
          const apis =
            OverviewSource.find((source) => source.id === category)?.apis || [];
          return {
            label: category,
            data: normalizedResampledData.map((entry) =>
              apis.reduce((sum, api) => {
                const key = api
                  .split("/api/")[1]
                  ?.replace(/\//g, "")
                  .toLowerCase();
                let value = entry[key] || 0;

                // 🚀 Divide Solar values by 1000
                if (category === "Solar") {
                  value = value / 1000;
                }

                return sum + value;
              }, 0)
            ),
            backgroundColor:
              backgroundColors[categories.indexOf(category)] ||
              `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                Math.random() * 255
              )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
          };
        });

        console.log("Aggregated Data:", aggregatedData);

        // 📊 Generate X-axis Labels
        const xAxisLabels = generateXAxisLabels(resampledData);

        setChartData({
          labels: xAxisLabels,
          datasets: aggregatedData,
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
  }, [data, backgroundColors, timeperiod]);

  // 📅 Generate X-axis Labels Based on Time Period
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
            <div className="title">
              Energy Consumption by Source (EB, DG, Solar)
            </div>
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
                      title: {
                        display: true,
                        text: "(in Mwh)",
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

export default StackedBarDGEB;
