import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  registerables,
} from "chart.js";
import "./realtimestyle.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  ...registerables
);

const RealTimeChart = ({
  feeders = [], // Array of feeder objects with key and label
  pollingInterval = 5000, // Polling interval in milliseconds
}) => {
  const [data, setData] = useState([]);
  const [powerStatus, setPowerStatus] = useState("Loading...");
  const [activeData, setActiveData] = useState([]);

  // Fetch data from the API
  const fetchData = async () => {
    const currentTime = new Date().toISOString();
    const params = {
      start_date_time: new Date(Date.now() - 60000).toISOString(), // Last one minute
      end_date_time: currentTime,
      resample_period: "T", // Per minute
    };

    try {
      const response = await fetch(
        `http://14.96.26.26:8080/analytics/deltaconsolidated/?start_date_time=${params.start_date_time}&end_date_time=${params.end_date_time}&resample_period=${params.resample_period}`
      );
      const result = await response.json();
      const recentData = result["recent data"];
      updateChartData(recentData);
      updatePowerStatus(recentData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Update chart data
  const updateChartData = (recentData) => {
    const newEntry = {
      time: recentData.timestamp,
      feeders: feeders.map((feeder) => ({
        label: feeder.label,
        value: recentData[feeder.key] || 0,
      })),
    };

    setData((prevData) => {
      const updatedData = [...prevData, newEntry];
      return updatedData.length > 15
        ? updatedData.slice(updatedData.length - 15)
        : updatedData;
    });

    setActiveData(newEntry.feeders);
  };

  // Update power status
  const updatePowerStatus = (recentData) => {
    const activeFeeder = feeders.find((feeder) => recentData[feeder.key] > 0);
    setPowerStatus(
      activeFeeder ? `Running on ${activeFeeder.label}` : "No Power"
    );
  };

  // Set up data fetching interval
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [pollingInterval]);

  // Configure chart data
  const chartData = {
    labels: data.map((item) => item.time),
    datasets: feeders.map((feeder, index) => ({
      type: "line",
      label: feeder.label,
      data: data.map(
        (entry) =>
          entry.feeders.find((f) => f.label === feeder.label)?.value || 0
      ),
      fill: true,
      borderColor: feeder.color || `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: feeder.color
        ? `${feeder.color}33` // Add transparency for fill
        : `hsl(${index * 60}, 70%, 70%, 0.2)`,
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: feeder.color || `hsl(${index * 60}, 70%, 50%)`,
      pointHoverRadius: 6,
      tension: 0.4,
    })),
  };

  const maxValue = Math.max(
    ...data.flatMap((entry) => entry.feeders.map((f) => f.value)),
    0
  );

  // Configure chart options
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          tooltipFormat: "PP HH:mm",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5],
        },
      },
      y: {
        title: {
          display: true,
          text: "Power (kWh)",
        },
        min: maxValue - 5,
        max: maxValue + 5,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5],
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + " kWh";
            }
            return label;
          },
        },
      },
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  // Render the chart component
  return (
    <div className="containerchart">
      <div className="chart-cont">
        <div className="title">Real-Time Energy Consumption</div>
        <div className="chart-size">
          <Line data={chartData} options={options} />
        </div>
      </div>
      <div className="value-cont">
        <div className="value-heading">Power Status</div>
        <div className="current-value">{powerStatus}</div>
        <div className="all-feeders">
          {activeData.map((feeder, index) => (
            <div key={index} className="feeder-row">
              <span className="feeder-label">{feeder.label}:</span>
              <span className="feeder-value">
                {feeder.value.toFixed(2)} kWh
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeChart;
