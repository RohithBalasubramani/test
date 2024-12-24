import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "./RealTimeStyle.css";

const RealTimeCurrentChart = ({ rawData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (rawData) {
      const { timestamp, avg_current, r_current, y_current, b_current } =
        rawData;

      const newEntry = {
        time: timestamp,
        avgCurrent: avg_current,
        rCurrent: r_current,
        yCurrent: y_current,
        bCurrent: b_current,
      };

      setData((prevData) => {
        const updatedData = [...prevData, newEntry];
        return updatedData.length > 15
          ? updatedData.slice(updatedData.length - 15)
          : updatedData;
      });
    }
  }, [rawData]);

  const labels = data.map((item) => item.time);

  const currentChartData = {
    labels,
    datasets: [
      {
        label: "Avg Current",
        data: data.map((item) => item.avgCurrent),
        borderColor: "#6036D4",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "R Current",
        data: data.map((item) => item.rCurrent),
        borderColor: "#D33030",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Y Current",
        data: data.map((item) => item.yCurrent),
        borderColor: "#FFB319",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "B Current",
        data: data.map((item) => item.bCurrent),
        borderColor: "#017EF3",
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
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5],
        },
      },
      y: {
        title: {
          display: true,
          text: "Current (A)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5],
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide default legend
      },
    },
  };

  return (
    <div className="containerchart">
      <div className="chart-cont">
        <div className="title">Current</div>
        <div className="chart-size">
          <Line data={currentChartData} options={options} />
        </div>
      </div>
      <div className="value-cont">
        <div className="value-heading">Current</div>
        <div className="current-value">Recent Value</div>
        <div className="legend-container">
          <div className="legend-item-two">
            <div className="value-name">
              <span
                className="legend-color-box v1"
                style={{ backgroundColor: "#6036D4" }}
              />{" "}
              Avg Current
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].avgCurrent?.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">A</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box v1" /> R phase
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].rCurrent?.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">A</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box v2" />Y phase
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].yCurrent?.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">A</span>
            </div>
          </div>
          <div className="legend-item-two">
            <div className="value-name">
              <span className="legend-color-box v3" />B phase
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1].bCurrent?.toFixed(2)
                : "0.00"}{" "}
              <span className="value-span">A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeCurrentChart;
