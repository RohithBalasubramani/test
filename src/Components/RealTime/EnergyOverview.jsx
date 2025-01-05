import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/system";
import "./RealTimeStyle.css";
import "chartjs-adapter-date-fns";
import OverviewRealTimeEnergyLoader from "../LoadingScreens/OverviewRealTimeEnergyLoader";

// --- Styled Radio Components ---
const StyledRadioGroup = styled(RadioGroup)({
  display: "flex",
  gap: "16px",
  flexDirection: "row",
  marginBottom: "16px",
});

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  border: "1px solid #EAECF0",
  borderRadius: "8px",
  margin: "0",
  padding: "1vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  backgroundColor: "#FFFFFF",
  "& .MuiFormControlLabel-label": {
    fontFamily: "DM Sans",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "16px",
    color: "#445164",
  },
  "& .MuiRadio-root": {
    padding: "0 8px",
    color: "#445164",
  },
  "& .MuiRadio-root.Mui-checked": {
    color: "#4E46B4",
  },
  "&:hover": {
    backgroundColor: "#F3F4F6",
  },
}));

const RealTimeChart = ({
  feeders = [], // Array of feeder objects with key and label
  pollingInterval = 5000, // Polling interval in milliseconds
}) => {
  const [data, setData] = useState([]);
  const [powerStatus, setPowerStatus] = useState("Loading...");
  const [activeData, setActiveData] = useState([]);

  // Normalize feeders to lowercase keys
  const normalizedFeeders = feeders.map((feeder) => ({
    ...feeder,
    key: feeder.key.toLowerCase(),
  }));

  // Fetch data from the API
  const fetchData = async () => {
    const currentTime = new Date().toISOString();
    const params = {
      start_date_time: new Date(Date.now() - 600000).toISOString(), // Last 10 minutes
      end_date_time: currentTime,
      resample_period: "H", // Per hour
    };

    try {
      const response = await fetch(
        `http://14.96.26.26:8080/analytics/deltaconsolidated/?start_date_time=${params.start_date_time}&end_date_time=${params.end_date_time}&resample_period=${params.resample_period}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const recentData = result?.["recent data"] || null;

      if (!recentData) {
        console.warn("No recent data available in response.");
        return;
      }

      const normalizedRecentData = {};
      Object.keys(recentData).forEach((key) => {
        normalizedRecentData[key.toLowerCase()] = recentData[key];
      });

      updateChartData(normalizedRecentData);
      updatePowerStatus(normalizedRecentData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Update chart data
  const updateChartData = (recentData) => {
    if (!recentData.timestamp) {
      console.warn("Timestamp missing in recent data.");
      return;
    }

    const newEntry = {
      time: recentData.timestamp,
      feeders: normalizedFeeders.map((feeder) => ({
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
    const activeFeeder = normalizedFeeders.find(
      (feeder) => recentData[feeder.key] > 0
    );
    setPowerStatus(
      activeFeeder ? `Running on ${activeFeeder.label}` : "No Power"
    );
  };

  // Set up data fetching interval
  useEffect(() => {
    setData([]);
    const interval = setInterval(() => {
      fetchData();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [pollingInterval, feeders]);

  // Configure chart data
  const chartData = {
    labels: data.map((item) => item.time),
    datasets: normalizedFeeders.map((feeder, index) => ({
      type: "line",
      label: feeder.label,
      data: data.map(
        (entry) =>
          entry.feeders.find((f) => f.label === feeder.label)?.value || 0
      ),
      fill: true,
      borderColor: `rgba(86, 48, 188, 0.6)`,
      backgroundColor: `rgba(86, 48, 188, 0.6)`,
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: `rgba(86, 48, 188, 0.6)`,
      pointHoverRadius: 6,
      tension: 0.4,
    })),
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          tooltipFormat: "PP HH:mm",
        },
      },
      y: {
        title: {
          display: true,
          text: "Power (kWh)",
        },
      },
    },
    plugins: {
      legend: {
        display: false, // ✅ Legend removed
      },
    },
  };

  return (
    <div className="containerchart">
      {data?.length ? (
        <>
          <div className="chart-cont">
            <div className="title">Real-Time Energy Consumption</div>
            <div className="chart-size">
              <Line data={chartData} options={options} />
            </div>
          </div>
          <div className="value-cont">
            <div className="value-heading">Power Status</div>
            <div className="current-value">{powerStatus}</div>
            <div className="legend-container">
              {normalizedFeeders.map((feeder, index) => (
                <div className="legend-item-two" key={index}>
                  <div className="value-name">
                    <span
                      className="legend-color-box"
                      style={{ backgroundColor: "rgba(86, 48, 188, 0.6)" }}
                    />
                    {feeder.label}
                  </div>
                  <div className="value">
                    {data.length > 0
                      ? data[data.length - 1].feeders[index]?.value?.toFixed(3)
                      : "0.00"}{" "}
                    <span className="value-span">kWh</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <OverviewRealTimeEnergyLoader />
      )}
    </div>
  );
};

export default RealTimeChart;
