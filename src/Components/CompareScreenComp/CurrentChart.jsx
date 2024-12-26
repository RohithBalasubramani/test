import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "../realtimestyle.css"; // Shared CSS file
import { Checkbox } from "@mui/material";

/**
 * Component to display real-time current data for two feeders with styled legends and checkboxes.
 */
const RealTimeCurrentChart = ({ firstFeederApiKey, secondFeederApiKey }) => {
  const [data, setData] = useState([]);
  const ref = useRef();

  // Checkbox states for each feeder
  const [firstFeederCheckBox, setFirstFeederCheckBox] = useState({
    avgCurrent: true,
    rCurrent: true,
    yCurrent: true,
    bCurrent: true,
  });
  const [secondFeederCheckBox, setSecondFeederCheckBox] = useState({
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

  // Labels for the x-axis
  const labels = data.map((item) => item.time);

  /**
   * Configure Chart.js datasets.
   */
  const currentChartData = {
    labels,
    datasets: [
      // First Feeder Datasets
      ...firstFeederLegendData.map((item) => ({
        label: `${item.title} F1`,
        data: data.map((entry) => entry[`${item.id}First`] || 0),
        borderColor: item.color,
        hidden: !firstFeederCheckBox[item.id],
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      })),
      // Second Feeder Datasets
      ...secondFeederLegendData.map((item) => ({
        label: `${item.title} F2`,
        data: data.map((entry) => entry[`${item.id}Second`] || 0),
        borderColor: item.color,
        hidden: !secondFeederCheckBox[item.id],
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      })),
    ],
  };

  /**
   * Chart.js configuration options.
   */
  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          tooltipFormat: "PP HH:mm",
          displayFormats: {
            minute: "HH:mm",
          },
        },
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
        display: false, // Custom legend used below
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) label += ": ";
            if (context.parsed.y !== null) label += context.parsed.y + " A";
            return label;
          },
        },
      },
    },
  };

  /**
   * Handle checkbox state changes.
   */
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
  };

  /**
   * Reusable ValueContainer component for feeder legends.
   */
  const ValueContainer = ({
    legendData,
    checkBoxState,
    data,
    feederLabel,
    isSecondFeeder,
  }) => (
    <div className="value-cont">
      <div className="value-heading">Feeder {feederLabel} Current</div>
      <div className="legend-container">
        {legendData.map((item) => (
          <div key={item.id} className="legend-item-two">
            <div className="value-name">
              <span
                className="legend-color-box"
                style={{ backgroundColor: item.color }}
              />
              <Checkbox
                style={{ padding: "0px" }}
                checked={checkBoxState[item.id]}
                onChange={(e) => handleCheckBox(e, item.id, isSecondFeeder)}
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
              <span className="value-span">A</span>
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
        checkBoxState={firstFeederCheckBox}
        data={data}
        feederLabel="1"
        isSecondFeeder={false}
      />
      <div className="chart-cont">
        <div className="title">Current</div>
        <div className="chart-size">
          <Line data={currentChartData} options={options} ref={ref} />
        </div>
      </div>

      <ValueContainer
        legendData={secondFeederLegendData}
        checkBoxState={secondFeederCheckBox}
        data={data}
        feederLabel="2"
        isSecondFeeder={true}
      />
    </div>
  );
};

export default RealTimeCurrentChart;
