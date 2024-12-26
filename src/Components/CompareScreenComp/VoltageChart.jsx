import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "../realtimestyle.css";
import { Checkbox } from "@mui/material";

const RealTimeVoltageChart = ({ firstFeederApiKey, secondFeederApiKey }) => {
  const [data, setData] = useState([]);
  const ref = useRef();

  // Maintain checkbox states for each feeder
  const [firstFeederCheckBox, setFirstFeederCheckBox] = useState({
    rVol: true,
    yVol: true,
    bVol: true,
    ryVol: true,
    ybVol: true,
    brVol: true,
  });
  const [secondFeederCheckBox, setSecondFeederCheckBox] = useState({
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
    { id: "rVol", title: "R Voltage", color: "#A82828" },
    { id: "yVol", title: "Y Voltage", color: "#D98E1E" },
    { id: "bVol", title: "B Voltage", color: "#0166C1" },
    { id: "ryVol", title: "RY Voltage", color: "#B46505" },
    { id: "ybVol", title: "YB Voltage", color: "#0F6A4F" },
    { id: "brVol", title: "BR Voltage", color: "#482899" },
  ];

  // Fetch data from two feeders
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

  // Update the chart data array
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

  // Initialize / poll data every 5 seconds
  useEffect(() => {
    setData([]);
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [firstFeederApiKey, secondFeederApiKey]);

  // Chart.js config
  const labels = data.map((item) => item.time);

  // Each dataset is either "___First" or "___Second"
  const voltageChartData = {
    labels,
    datasets: [
      // First feeder
      {
        label: "R Voltage F1",
        data: data.map((item) => item.rVolFirst),
        borderColor: firstFeederLegendData[0].color,
        hidden: !firstFeederCheckBox.rVol,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: "Y Voltage F1",
        data: data.map((item) => item.yVolFirst),
        borderColor: firstFeederLegendData[1].color,
        hidden: !firstFeederCheckBox.yVol,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: "B Voltage F1",
        data: data.map((item) => item.bVolFirst),
        borderColor: firstFeederLegendData[2].color,
        hidden: !firstFeederCheckBox.bVol,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: "RY Voltage F1",
        data: data.map((item) => item.ryVolFirst),
        borderColor: firstFeederLegendData[3].color,
        hidden: !firstFeederCheckBox.ryVol,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: "YB Voltage F1",
        data: data.map((item) => item.ybVolFirst),
        borderColor: firstFeederLegendData[4].color,
        hidden: !firstFeederCheckBox.ybVol,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: "BR Voltage F1",
        data: data.map((item) => item.brVolFirst),
        borderColor: firstFeederLegendData[5].color,
        hidden: !firstFeederCheckBox.brVol,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },

      // Second feeder
      {
        label: "R Voltage F2",
        data: data.map((item) => item.rVolSecond),
        borderColor: secondFeederLegendData[0].color,
        hidden: !secondFeederCheckBox.rVol,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: "Y Voltage F2",
        data: data.map((item) => item.yVolSecond),
        borderColor: secondFeederLegendData[1].color,
        hidden: !secondFeederCheckBox.yVol,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: "B Voltage F2",
        data: data.map((item) => item.bVolSecond),
        borderColor: secondFeederLegendData[2].color,
        hidden: !secondFeederCheckBox.bVol,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: "RY Voltage F2",
        data: data.map((item) => item.ryVolSecond),
        borderColor: secondFeederLegendData[3].color,
        hidden: !secondFeederCheckBox.ryVol,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: "YB Voltage F2",
        data: data.map((item) => item.ybVolSecond),
        borderColor: secondFeederLegendData[4].color,
        hidden: !secondFeederCheckBox.ybVol,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: "BR Voltage F2",
        data: data.map((item) => item.brVolSecond),
        borderColor: secondFeederLegendData[5].color,
        hidden: !secondFeederCheckBox.brVol,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
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
          text: "Voltage (V)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5],
        },
      },
    },
    plugins: {
      legend: {
        display: false, // We'll use custom legends below
      },
    },
  };

  // Handle checkbox toggling
  const handleCheckBox = (e, id, isSecondFeeder) => {
    if (isSecondFeeder) {
      setSecondFeederCheckBox((prev) => ({
        ...prev,
        [id]: e.target.checked,
      }));
    } else {
      setFirstFeederCheckBox((prev) => ({
        ...prev,
        [id]: e.target.checked,
      }));
    }
    // We'll automatically hide/unhide datasets in "datasets" using the "hidden" property
  };

  return (
    <div className="containerchart">
      {/* Value Container for Feeder 1 */}
      <div className="value-cont">
        <div className="value-heading">Feeder 1 Voltage</div>
        <div className="legend-container">
          {firstFeederLegendData.map((item, index) => (
            <div key={item.id} className="legend-item-two">
              <div className="value-name">
                <span
                  className="legend-color-box"
                  style={{ backgroundColor: item.color }}
                />
                <Checkbox
                  style={{ padding: 0 }}
                  checked={firstFeederCheckBox[item.id]}
                  onChange={(e) => handleCheckBox(e, item.id, false)}
                />
                {item.title}
              </div>
              <div className="value">
                {data.length > 0
                  ? (data[data.length - 1][`${item.id}First`] || 0).toFixed(2)
                  : "0.00"}
                <span className="value-span"> V</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Chart Container */}
      <div className="chart-cont">
        <div className="title">Voltage</div>
        <div className="chart-size">
          <Line data={voltageChartData} options={options} ref={ref} />
        </div>
      </div>

      {/* Value Container for Feeder 2 */}
      <div className="value-cont">
        <div className="value-heading">Feeder 2 Voltage</div>
        <div className="legend-container">
          {secondFeederLegendData.map((item, index) => (
            <div key={item.id} className="legend-item-two">
              <div className="value-name">
                <span
                  className="legend-color-box"
                  style={{ backgroundColor: item.color }}
                />
                <Checkbox
                  style={{ padding: 0 }}
                  checked={secondFeederCheckBox[item.id]}
                  onChange={(e) => handleCheckBox(e, item.id, true)}
                />
                {item.title}
              </div>
              <div className="value">
                {data.length > 0
                  ? (data[data.length - 1][`${item.id}Second`] || 0).toFixed(2)
                  : "0.00"}
                <span className="value-span"> V</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeVoltageChart;
