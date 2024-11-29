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

const VoltageChart = ({ rawData }) => {
  const [data, setData] = useState([]);

  // Update chart data when rawData changes
  useEffect(() => {
    if (rawData && rawData["recent data"]) {
      const {
        timestamp,
        r_phase_voltage,
        y_phase_voltage,
        b_phase_voltage,
        ry_voltage,
        yb_voltage,
        br_voltage,
      } = rawData["recent data"];

      const newEntry = {
        time: timestamp,
        rVoltage: r_phase_voltage,
        yVoltage: y_phase_voltage,
        bVoltage: b_phase_voltage,
        ryVoltage: ry_voltage,
        ybVoltage: yb_voltage,
        brVoltage: br_voltage,
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
        label: "R Voltage",
        data: data.map((item) => item.rVoltage),
        borderColor: "#D33030",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Y Voltage",
        data: data.map((item) => item.yVoltage),
        borderColor: "#FFB319",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "B Voltage",
        data: data.map((item) => item.bVoltage),
        borderColor: "#017EF3",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "RY Voltage",
        data: data.map((item) => item.ryVoltage),
        borderColor: "#DC8006",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "YB Voltage",
        data: data.map((item) => item.ybVoltage),
        borderColor: "#16896B",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "BR Voltage",
        data: data.map((item) => item.brVoltage),
        borderColor: "#6036D4",
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
          text: "Voltage (V)",
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
              label += context.parsed.y + " V";
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
        <div className="title">Voltage</div>
        <div className="chart-size">
          <Line data={chartData} options={options} />
        </div>
      </div>
      <div className="value-cont">
        <div className="value-heading">Recent Values</div>
        <div className="legend-container">
          {[
            { label: "R Voltage", color: "#D33030", key: "rVoltage" },
            { label: "Y Voltage", color: "#FFB319", key: "yVoltage" },
            { label: "B Voltage", color: "#017EF3", key: "bVoltage" },
            { label: "RY Voltage", color: "#DC8006", key: "ryVoltage" },
            { label: "YB Voltage", color: "#16896B", key: "ybVoltage" },
            { label: "BR Voltage", color: "#6036D4", key: "brVoltage" },
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
                <span className="value-span">V</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoltageChart;
