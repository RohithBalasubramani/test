import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "../realtimestyle.css"; // Shared CSS file

/**
 * Component to display real-time current data for two feeders with interactive legends.
 */
const RealTimeCurrentChart = ({ firstFeederApiKey, secondFeederApiKey }) => {
  const [data, setData] = useState([]);
  const ref = useRef();

  // Visibility states for each feeder dataset
  const [firstFeederVisibility, setFirstFeederVisibility] = useState({
    avgCurrent: true,
    rCurrent: true,
    yCurrent: true,
    bCurrent: true,
  });
  const [secondFeederVisibility, setSecondFeederVisibility] = useState({
    avgCurrent: true,
    rCurrent: true,
    yCurrent: true,
    bCurrent: true,
  });

  // Legend data with colors for each dataset
  const firstFeederLegendData = [
    { id: "avgCurrent", title: "Avg Current", color: "#6036D4" },
    { id: "rCurrent", title: "R Current", color: "#D33030" },
    { id: "yCurrent", title: "Y Current", color: "#FFB319" },
    { id: "bCurrent", title: "B Current", color: "#017EF3" },
  ];
  const secondFeederLegendData = [
    { id: "avgCurrent", title: "Avg Current (Sec)", color: "#482899" },
    { id: "rCurrent", title: "R Current (Sec)", color: "#A82828" },
    { id: "yCurrent", title: "Y Current (Sec)", color: "#D98E1E" },
    { id: "bCurrent", title: "B Current (Sec)", color: "#0166C1" },
  ];

  /**
   * Fetch data concurrently from two feeders.
   */
  const fetchData = async () => {
    try {
      if (firstFeederApiKey && secondFeederApiKey) {
        const [firstFeederResponse, secondFeederResponse] = await Promise.all([
          axios.get(firstFeederApiKey),
          axios.get(secondFeederApiKey),
        ]);

        const timestamp = firstFeederResponse.data["recent data"]["timestamp"];
        updateChartData(
          timestamp,
          firstFeederResponse.data["recent data"],
          secondFeederResponse.data["recent data"]
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /**
   * Update the data array for chart visualization.
   */
  const updateChartData = (timestamp, firstData, secondData) => {
    const newEntry = {
      time: timestamp,
      avgCurrentFirst: firstData["avg_current"] || 0,
      rCurrentFirst: firstData["r_current"] || 0,
      yCurrentFirst: firstData["y_current"] || 0,
      bCurrentFirst: firstData["b_current"] || 0,

      avgCurrentSecond: secondData["avg_current"] || 0,
      rCurrentSecond: secondData["r_current"] || 0,
      yCurrentSecond: secondData["y_current"] || 0,
      bCurrentSecond: secondData["b_current"] || 0,
    };

    setData((prevData) => {
      const updatedData = [...prevData, newEntry];
      return updatedData.length > 15
        ? updatedData.slice(updatedData.length - 15)
        : updatedData;
    });
  };

  /**
   * Set up polling for data fetching.
   */
  useEffect(() => {
    setData([]);
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [firstFeederApiKey, secondFeederApiKey]);

  /**
   * Toggle visibility state for a legend item.
   */
  const toggleVisibility = (id, isSecondFeeder) => {
    if (isSecondFeeder) {
      setSecondFeederVisibility((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } else {
      setFirstFeederVisibility((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  // Labels for the x-axis
  const labels = data.map((item) => item.time);

  /**
   * Configure Chart.js datasets dynamically.
   */
  const currentChartData = {
    labels,
    datasets: [
      ...firstFeederLegendData.map((item) => ({
        label: `${item.title} F1`,
        data: data.map((entry) => entry[`${item.id}First`] || 0),
        borderColor: item.color,
        hidden: !firstFeederVisibility[item.id],
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      })),
      ...secondFeederLegendData.map((item) => ({
        label: `${item.title} F2`,
        data: data.map((entry) => entry[`${item.id}Second`] || 0),
        borderColor: item.color,
        hidden: !secondFeederVisibility[item.id],
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      })),
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
      },
      y: {
        title: {
          display: true,
          text: "Current (A)",
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Custom legend used below
      },
    },
  };

  /**
   * Reusable ValueContainer component for feeder legends.
   */
  const ValueContainer = ({ legendData, visibilityState, isSecondFeeder }) => (
    <div className="value-cont">
      <div className="value-heading">Current</div>
      <div className="legend-container">
        {legendData.map((item) => (
          <div
            key={item.id}
            className={`legend-item-two ${
              !visibilityState[item.id] ? "crossed-out" : ""
            }`}
            onClick={() => toggleVisibility(item.id, isSecondFeeder)}
          >
            <div className="value-name">
              <span
                className="legend-color-box"
                style={{
                  backgroundColor: visibilityState[item.id]
                    ? item.color
                    : "#ccc",
                }}
              />
              {item.title}
            </div>
            <div className="value">
              {data.length > 0
                ? (
                    data[data.length - 1][
                      `${item.id}${isSecondFeeder ? "Second" : "First"}`
                    ] || 0
                  ).toFixed(2)
                : "0.00"}{" "}
              A
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="containerchart">
      {/* First Feeder Legends */}
      <ValueContainer
        legendData={firstFeederLegendData}
        visibilityState={firstFeederVisibility}
      />

      {/* Chart */}
      <div className="chart-cont">
        <Line data={currentChartData} options={options} ref={ref} />
      </div>

      {/* Second Feeder Legends */}
      <ValueContainer
        legendData={secondFeederLegendData}
        visibilityState={secondFeederVisibility}
        isSecondFeeder
      />
    </div>
  );
};

export default RealTimeCurrentChart;
