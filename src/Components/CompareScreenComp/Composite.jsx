import React, { useEffect, useRef, useState } from "react";
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
import axios from "axios";
import "../realtimestyle.css";
import "chartjs-adapter-date-fns";
import { Checkbox } from "@mui/material";

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

/**
 * Component to display real-time power data for two feeders with styled legends and checkboxes.
 */
const RealTimeChart = ({ firstFeederApiKey, secondFeederApiKey }) => {
  const [data, setData] = useState([]);
  const ref = useRef();

  // Maintain checkbox states for each feeder
  const [firstFeederCheckBox, setFirstFeederCheckBox] = useState({
    rActive: true,
    yActive: true,
    bActive: true,
    rApp: true,
    yApp: true,
    bApp: true,
    rReactive: true,
    yReactive: true,
    bReactive: true,
  });
  const [secondFeederCheckBox, setSecondFeederCheckBox] = useState({
    rActive: true,
    yActive: true,
    bActive: true,
    rApp: true,
    yApp: true,
    bApp: true,
    rReactive: true,
    yReactive: true,
    bReactive: true,
  });

  // Feeder legend data with color mappings
  const firstFeederLegendData = [
    { id: "rActive", title: "R Active", color: "#C72F08" },
    { id: "yActive", title: "Y Active", color: "#E6B148" },
    { id: "bActive", title: "B Active", color: "#0171DB" },
    { id: "rApp", title: "R App", color: "#E45D3A" },
    { id: "yApp", title: "Y App", color: "#B38A38" },
    { id: "bApp", title: "B App", color: "#0158AA" },
    { id: "rReactive", title: "R Reactive", color: "#9B2406" },
    { id: "yReactive", title: "Y Reactive", color: "#FFD173" },
    { id: "bReactive", title: "B Reactive", color: "#3498F5" },
  ];
  const secondFeederLegendData = [
    { id: "rActive", title: "R Active (Sec)", color: "#A82828" },
    { id: "yActive", title: "Y Active (Sec)", color: "#D98E1E" },
    { id: "bActive", title: "B Active (Sec)", color: "#0166C1" },
    { id: "rApp", title: "R App (Sec)", color: "#B25030" },
    { id: "yApp", title: "Y App (Sec)", color: "#967A26" },
    { id: "bApp", title: "B App (Sec)", color: "#014899" },
    { id: "rReactive", title: "R Reactive (Sec)", color: "#7A1C05" },
    { id: "yReactive", title: "Y Reactive (Sec)", color: "#D0A954" },
    { id: "bReactive", title: "B Reactive (Sec)", color: "#2B7ACD" },
  ];

  /**
   * Fetch data from two feeders.
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
      ...Object.fromEntries(
        firstFeederLegendData.map((item) => [
          `${item.id}First`,
          firstData[
            item.id
              .replace("App", "_app_power")
              .replace("Active", "_ac_power")
              .replace("Reactive", "_reactive_power")
          ] || 0,
        ])
      ),
      ...Object.fromEntries(
        secondFeederLegendData.map((item) => [
          `${item.id}Second`,
          secondData[
            item.id
              .replace("App", "_app_power")
              .replace("Active", "_ac_power")
              .replace("Reactive", "_reactive_power")
          ] || 0,
        ])
      ),
    };

    setData((prevData) => {
      const updatedData = [...prevData, newEntry];
      return updatedData.length > 15
        ? updatedData.slice(updatedData.length - 15)
        : updatedData;
    });
  };

  /**
   * Initialize and set up data polling.
   */
  useEffect(() => {
    setData([]);
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [firstFeederApiKey, secondFeederApiKey]);

  const labels = data.map((item) => item.time);

  /**
   * Configure Chart.js datasets dynamically.
   */
  const chartData = {
    labels,
    datasets: [
      ...firstFeederLegendData.map((item) => ({
        label: `${item.title} F1`,
        data: data.map((entry) => entry[`${item.id}First`] || 0),
        borderColor: item.color,
        hidden: !firstFeederCheckBox[item.id],
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      })),
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

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: { type: "time" },
      y: {
        title: { display: true, text: "Power (kW)" },
      },
    },
    plugins: { legend: { display: false } },
  };

  const handleCheckBox = (e, id, isSecondFeeder) => {
    if (isSecondFeeder) {
      setSecondFeederCheckBox((prev) => ({ ...prev, [id]: e.target.checked }));
    } else {
      setFirstFeederCheckBox((prev) => ({ ...prev, [id]: e.target.checked }));
    }
  };

  const ValueContainer = ({ legendData, checkBoxState, isSecondFeeder }) => (
    <div className="value-cont">
      <div className="value-heading">Power</div>
      <div className="legend-container">
        {legendData.map((item) => (
          <div key={item.id} className="legend-item-two">
            <div className="value-name">
              <span
                className="legend-color-box"
                style={{ backgroundColor: item.color }}
              />
              <Checkbox
                checked={checkBoxState[item.id]}
                onChange={(e) => handleCheckBox(e, item.id, isSecondFeeder)}
              />
              {item.title}
            </div>
            <div className="value">
              {data.length > 0
                ? data[data.length - 1][
                    `${item.id}${isSecondFeeder ? "Second" : "First"}`
                  ]?.toFixed(2)
                : "0.00"}{" "}
              kW
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
      />
      <div className="chart-cont">
        <Line data={chartData} options={options} ref={ref} />
      </div>
      <ValueContainer
        legendData={secondFeederLegendData}
        checkBoxState={secondFeederCheckBox}
        isSecondFeeder
      />
    </div>
  );
};

export default RealTimeChart;
