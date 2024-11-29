import React, { useState, useEffect } from "react";
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
import "chartjs-adapter-date-fns";

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

const RealTimeChart = ({ rawData }) => {
  const [data, setData] = useState([]);

  // Update chart data when rawData changes
  useEffect(() => {
    if (rawData && rawData["recent data"]) {
      const {
        timestamp,
        b_ac_power,
        r_ac_power,
        y_ac_power,
        b_app_power,
        r_app_power,
        y_app_power,
        b_reactive_power,
        r_reactive_power,
        y_reactive_power,
      } = rawData["recent data"];

      const newEntry = {
        time: timestamp,
        bActiveRecent: b_ac_power,
        rActiveRecent: r_ac_power,
        yActiveRecent: y_ac_power,
        bAppRecent: b_app_power,
        rAppRecent: r_app_power,
        yAppRecent: y_app_power,
        bReactiveRecent: b_reactive_power,
        rReactiveRecent: r_reactive_power,
        yReactiveRecent: y_reactive_power,
      };

      setData((prevData) => {
        const updatedData = [...prevData, newEntry];
        return updatedData.length > 15
          ? updatedData.slice(updatedData.length - 15)
          : updatedData;
      });
    }
  }, [rawData]);

  const chartData = {
    labels: data.map((item) => item.time),
    datasets: [
      {
        label: "R Active",
        data: data.map((item) => item.rActiveRecent),
        borderColor: "#C72F08",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Y Active",
        data: data.map((item) => item.yActiveRecent),
        borderColor: "#E6B148",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "B Active",
        data: data.map((item) => item.bActiveRecent),
        borderColor: "#0171DB",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "R App",
        data: data.map((item) => item.rAppRecent),
        borderColor: "#E45D3A",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Y App",
        data: data.map((item) => item.yAppRecent),
        borderColor: "#B38A38",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "B App",
        data: data.map((item) => item.bAppRecent),
        borderColor: "#0158AA",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "R Reactive",
        data: data.map((item) => item.rReactiveRecent),
        borderColor: "#9B2406",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Y Reactive",
        data: data.map((item) => item.yReactiveRecent),
        borderColor: "#FFD173",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "B Reactive",
        data: data.map((item) => item.bReactiveRecent),
        borderColor: "#3498F5",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          tooltipFormat: "ll HH:mm",
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
        display: false,
      },
    },
  };

  return (
    <div className="containerchart">
      <div className="chart-cont">
        <div className="title">Energy Consumption</div>
        <div className="chart-size">
          <Line data={chartData} options={options} />
        </div>
      </div>
      <div className="value-cont">
        <div className="value-heading">Recent Values</div>
        <div className="legend-container">
          {[
            { label: "R Active", color: "#C72F08", key: "rActiveRecent" },
            { label: "Y Active", color: "#E6B148", key: "yActiveRecent" },
            { label: "B Active", color: "#0171DB", key: "bActiveRecent" },
            { label: "R App", color: "#E45D3A", key: "rAppRecent" },
            { label: "Y App", color: "#B38A38", key: "yAppRecent" },
            { label: "B App", color: "#0158AA", key: "bAppRecent" },
            { label: "R Reactive", color: "#9B2406", key: "rReactiveRecent" },
            { label: "Y Reactive", color: "#FFD173", key: "yReactiveRecent" },
            { label: "B Reactive", color: "#3498F5", key: "bReactiveRecent" },
          ].map(({ label, color, key }) => (
            <div className="legend-item-two" key={key}>
              <div className="value-name">
                <span
                  className="legend-color-box"
                  style={{ backgroundColor: color }}
                />
                {label}
              </div>
              <div className="value">
                {data.length > 0
                  ? data[data.length - 1][key]?.toFixed(2)
                  : "0.00"}{" "}
                <span className="value-span">kWh</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeChart;
