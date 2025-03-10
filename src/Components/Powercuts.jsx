import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./StackedBarDGEB.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PowerOutageChart = () => {
  const [powerStatusData, setPowerStatusData] = useState([]);
  const [powerCuts, setPowerCuts] = useState(0);
  const [totalPowerCutTime, setTotalPowerCutTime] = useState(0);

  useEffect(() => {
    // Dummy data
    const dummyData = [
      { status: "on", duration: 8 },
      { status: "off", duration: 2 },
      { status: "on", duration: 6 },
      { status: "off", duration: 1 },
      { status: "on", duration: 7 },
    ];

    const powerCutCount = dummyData.filter(
      (segment) => segment.status === "off"
    ).length;
    const totalPowerCutDuration = dummyData
      .filter((segment) => segment.status === "off")
      .reduce((total, segment) => total + segment.duration, 0);

    setPowerCuts(powerCutCount);
    setTotalPowerCutTime(totalPowerCutDuration);
    setPowerStatusData(dummyData);
  }, []);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes * 60) % 60);
    return `${hours}h ${mins}m ${secs}s`;
  };

  const chartData = {
    labels: ["Power Status"],
    datasets: powerStatusData.map((segment) => ({
      label: segment.status === "on" ? "Power On" : "Power Cut",
      data: [segment.duration],
      backgroundColor:
        segment.status === "on" ? "#82ca9d" : "rgba(255, 0, 0, 0.6)",
      barThickness: 50,
      borderWidth: 0,
      borderRadius: 0,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [8, 4],
        },
        stacked: true,
        ticks: {
          stepSize: 1,
          maxRotation: 0,
          autoSkip: false,
        },
      },
      y: {
        display: false,
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            const datasetLabel = tooltipItem.dataset.label;
            const value = tooltipItem.raw;
            return `${datasetLabel}: ${value} hours`;
          },
        },
      },
    },
    indexAxis: "y",
  };

  return (
    <div className="container">
      <div className="top">
        <div className="title">Power Cuts Today</div>
      </div>
      <div className="contentpower">
        <div className="contentpowerbox">
          <div className="contpowertit">No of Power cuts</div>
          <div className="contpowerpara">
            The number of power cuts over a specific period of time.
          </div>
          <div className="contpowerval">{powerCuts}</div>
        </div>
        <div className="contentpowerbox">
          <div className="contpowertit">Total power cut time</div>
          <div className="contpowerpara">The total time of power outages.</div>
          <div className="contpowerval">
            {formatDuration(totalPowerCutTime)}
          </div>
        </div>
      </div>
      <div className="powerchart-size">
        <Bar data={chartData} options={options} height={60} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
          fontSize: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "15px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              backgroundColor: "#82ca9d",
              marginRight: "5px",
              borderRadius: "50px",
            }}
          ></span>
          On
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              backgroundColor: "red",
              marginRight: "5px",
              borderRadius: "50px",
            }}
          ></span>
          Off
        </div>
      </div>
    </div>
  );
};

export default PowerOutageChart;
