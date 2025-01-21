import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";
import TimeBar from "./TRFF/TimePeriod";
import ToggleButtons from "./Togglesampling";
import "./StackedBarDGEB.css";
import DateRangeSelector from "./Dashboard/Daterangeselector";

const AreaChartPowerEnergy = ({
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
  const [totalEnergy, setTotalEnergy] = useState(0); // For displaying energy value

  useEffect(() => {
    if (data && data["resampled data"]) {
      try {
        const resampledData = data["resampled data"];

        // Generate x-axis labels based on selected time period
        const xAxisLabels = generateXAxisLabels(resampledData);

        // Calculate average power and energy
        const powerData = resampledData.map(
          (item) =>
            (item["b_app_power"] + item["r_app_power"] + item["y_app_power"]) /
            3
        );

        // Calculate energy (area under the curve)
        const energy = calculateAreaUnderCurve(powerData, resampledData);

        setTotalEnergy(energy.toFixed(2)); // Round to 2 decimal places

        const datasets = [
          {
            label: "Average Power",
            data: powerData,
            fill: true,
            backgroundColor: "rgba(78, 70, 180, 0.2)",
            borderColor: "rgba(78, 70, 180, 1)",
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 0,
          },
        ];

        setChartData({
          labels: xAxisLabels,
          datasets: datasets,
        });
      } catch (error) {
        console.error("Error processing data", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError("No resampled data available");
    }
  }, [data, timeperiod, backgroundColors]);

  // Function to calculate area under the curve (integral of power over time)
  const calculateAreaUnderCurve = (powerData, resampledData) => {
    let totalEnergy = 0;

    for (let i = 1; i < powerData.length; i++) {
      const powerAvg = (powerData[i - 1] + powerData[i]) / 2; // Trapezoidal rule
      const timeDiff =
        dayjs(resampledData[i].timestamp).diff(
          dayjs(resampledData[i - 1].timestamp),
          "seconds"
        ) / 3600; // Time difference in hours

      totalEnergy += powerAvg * timeDiff; // Energy = Power × Time
    }

    return totalEnergy;
  };

  const generateXAxisLabels = (resampledData) => {
    if (!resampledData || resampledData.length === 0) return [];

    switch (timeperiod) {
      case "T":
        return resampledData.map((item) =>
          dayjs(item.timestamp).format("H:mm")
        );
      case "H":
        return resampledData.map((item) =>
          dayjs(item.timestamp).format("MMM D, H:mm")
        );
      case "D":
        return resampledData.map((item) =>
          dayjs(item.timestamp).format("MMM D, YYYY")
        );
      case "W":
        return resampledData.map((item, index) => {
          const weekNumber = dayjs(item.timestamp).week();
          return `Week ${weekNumber} - ${dayjs(item.timestamp).format("MMM")}`;
        });
      case "M":
        return resampledData.map((item) =>
          dayjs(item.timestamp).format("MMM YYYY")
        );
      case "Q":
        return resampledData.map((item) => {
          const month = dayjs(item.timestamp).month();
          const quarter = Math.floor(month / 3) + 1;
          return `Q${quarter} ${dayjs(item.timestamp).format("YYYY")}`;
        });
      case "Y":
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
    return <div>{error}</div>;
  }

  return (
    <div className="stacked-bar-container">
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row">
            <div className="title">Average Power and Energy Consumption</div>
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
              <Line
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
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
                    annotation: {
                      annotations: {
                        totalEnergy: {
                          type: "label",
                          content: `Total Energy: ${totalEnergy} kWh`,
                          position: {
                            x: "end",
                            y: "start",
                          },
                          font: {
                            size: 16,
                            weight: "bold",
                            family: "DM Sans",
                          },
                          color: "#444",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          padding: 8,
                          cornerRadius: 4,
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        color: "rgba(0, 0, 0, 0.05)",
                      },
                    },
                    y: {
                      grid: {
                        color: "rgba(0, 0, 0, 0.05)",
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

export default AreaChartPowerEnergy;
