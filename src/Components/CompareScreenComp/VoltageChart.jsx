import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "../realtimestyle.css";

/**
 * Component to display real-time voltage data for two feeders with interactive legends.
 */
const RealTimeVoltageChart = ({ firstFeederApiKey, secondFeederApiKey }) => {
  const [data, setData] = useState([]);
  const ref = useRef();

  // Visibility states for each feeder dataset
  const [firstFeederVisibility, setFirstFeederVisibility] = useState({
    rVol: true,
    yVol: true,
    bVol: true,
    ryVol: true,
    ybVol: true,
    brVol: true,
  });
  const [secondFeederVisibility, setSecondFeederVisibility] = useState({
    rVol: true,
    yVol: true,
    bVol: true,
    ryVol: true,
    ybVol: true,
    brVol: true,
  });

  // Feeder-specific legend data (with color codes)
  const firstFeederLegendData = [
    { id: "rVol", title: "R Voltage", color: "#D33030" },
    { id: "yVol", title: "Y Voltage", color: "#FFB319" },
    { id: "bVol", title: "B Voltage", color: "#017EF3" },
    { id: "ryVol", title: "RY Voltage", color: "#DC8006" },
    { id: "ybVol", title: "YB Voltage", color: "#16896B" },
    { id: "brVol", title: "BR Voltage", color: "#6036D4" },
  ];
  const secondFeederLegendData = [
    { id: "rVol", title: "R Voltage (Sec)", color: "#A82828" },
    { id: "yVol", title: "Y Voltage (Sec)", color: "#D98E1E" },
    { id: "bVol", title: "B Voltage (Sec)", color: "#0166C1" },
    { id: "ryVol", title: "RY Voltage (Sec)", color: "#B46505" },
    { id: "ybVol", title: "YB Voltage (Sec)", color: "#0F6A4F" },
    { id: "brVol", title: "BR Voltage (Sec)", color: "#482899" },
  ];

  /**
   * Fetch data from two feeders concurrently.
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
   * Update the chart data array.
   */
  const updateChartData = (timestamp, firstData, secondData) => {
    const newEntry = {
      time: timestamp,
      rVolFirst: firstData["r_phase_voltage"] || 0,
      yVolFirst: firstData["y_phase_voltage"] || 0,
      bVolFirst: firstData["b_phase_voltage"] || 0,
      ryVolFirst: firstData["ry_voltage"] || 0,
      ybVolFirst: firstData["yb_voltage"] || 0,
      brVolFirst: firstData["br_voltage"] || 0,

      rVolSecond: secondData["r_phase_voltage"] || 0,
      yVolSecond: secondData["y_phase_voltage"] || 0,
      bVolSecond: secondData["b_phase_voltage"] || 0,
      ryVolSecond: secondData["ry_voltage"] || 0,
      ybVolSecond: secondData["yb_voltage"] || 0,
      brVolSecond: secondData["br_voltage"] || 0,
    };

    setData((prevData) => {
      const updatedData = [...prevData, newEntry];
      return updatedData.length > 15
        ? updatedData.slice(updatedData.length - 15)
        : updatedData;
    });
  };

  /**
   * Initialize and set up polling for data fetching.
   */
  useEffect(() => {
    setData([]);
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

  /**
   * Chart.js configuration.
   */
  const labels = data.map((item) => item.time);

  const voltageChartData = {
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
      x: { type: "time" },
      y: {
        title: { display: true, text: "Voltage (V)" },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  /**
   * Custom Legend Component
   */
  const ValueContainer = ({ legendData, visibilityState, isSecondFeeder }) => (
    <div className="value-cont">
      <div className="value-heading">Voltage</div>
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
                ? data[data.length - 1][
                    `${item.id}${isSecondFeeder ? "Second" : "First"}`
                  ]?.toFixed(2)
                : "0.00"}{" "}
              V
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="containerchart">
      <ValueContainer
        legendData={firstFeederLegendData}
        visibilityState={firstFeederVisibility}
      />
      <div className="chart-cont">
        <Line data={voltageChartData} options={options} ref={ref} />
      </div>
      <ValueContainer
        legendData={secondFeederLegendData}
        visibilityState={secondFeederVisibility}
        isSecondFeeder
      />
    </div>
  );
};

export default RealTimeVoltageChart;
