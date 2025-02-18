import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "../realtimestyle.css"; // Import the CSS file
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/system";
import { sideBarTreeArray } from "../../sidebarInfo2";
import { httpClient } from "../../Services/HttpClient";

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

const RealTimeVoltageChart = ({ apiKey, topBar }) => {
  const [data, setData] = useState([]);
  const [selectedVoltageGroup, setSelectedVoltageGroup] = useState("phase"); // "phase" or "line"

  const fetchData = async () => {
    const currentTime = new Date().toISOString();
    const params = {
      start_date_time: new Date(Date.now() - 60000).toISOString(), // last one minute
      end_date_time: currentTime,
      resample_period: "T", // per minute
    };
    try {
      if (apiKey && topBar) {
        const apiEndpointsArray = sideBarTreeArray[topBar].find(
          (arr) => arr.id === apiKey
        );
        if (apiEndpointsArray) {
          const apiEndpoint = apiEndpointsArray.apis[0];
          if (apiEndpoint) {
            const response = await httpClient.get(apiEndpoint);

            const rVol = response.data["recent data"]["r_voltage"];
            const yVol = response.data["recent data"]["y_voltage"];
            const bVol = response.data["recent data"]["b_voltage"];
            const ryVol = response.data["recent data"]["ry_voltage"];
            const ybVol = response.data["recent data"]["yb_voltage"];
            const brVol = response.data["recent data"]["br_voltage"];
            const timestamp = response.data["recent data"]["timestamp"];

            updateChartData(timestamp, rVol, yVol, bVol, ryVol, ybVol, brVol);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateChartData = (
    timestamp,
    rVol,
    yVol,
    bVol,
    ryVol,
    ybVol,
    brVol
  ) => {
    const newEntry = {
      time: timestamp,
      Vr: rVol,
      Vy: yVol,
      Vb: bVol,
      Vry: ryVol,
      Vyb: ybVol,
      Vbr: brVol,
    };

    setData((prevData) => {
      const updatedData = [...prevData, newEntry];
      return updatedData.length > 15
        ? updatedData.slice(updatedData.length - 15)
        : updatedData;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Polling every 5 seconds

    return () => clearInterval(interval);
  }, [apiKey]);

  const handleVoltageGroupChange = (event) => {
    setSelectedVoltageGroup(event.target.value);
  };

  const labels = data.map((item) => item.time);

  const datasets =
    selectedVoltageGroup === "phase"
      ? [
          {
            label: "R Voltage",
            data: data.map((item) => item.Vr),
            borderColor: "#D33030",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
          {
            label: "Y Voltage",
            data: data.map((item) => item.Vy),
            borderColor: "#FFB319",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
          {
            label: "B Voltage",
            data: data.map((item) => item.Vb),
            borderColor: "#017EF3",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
        ]
      : [
          {
            label: "RY Voltage",
            data: data.map((item) => item.Vry),
            borderColor: "#DC8006",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
          {
            label: "YB Voltage",
            data: data.map((item) => item.Vyb),
            borderColor: "#16896B",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
          {
            label: "BR Voltage",
            data: data.map((item) => item.Vbr),
            borderColor: "#6036D4",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
        ];

  const voltageChartData = {
    labels,
    datasets,
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
        display: false,
      },
    },
  };

  return (
    <div className="containerchart">
      <div className="chart-cont">
        <div className="title">
          <div> Voltage </div>
          <FormControl component="fieldset">
            <StyledRadioGroup
              value={selectedVoltageGroup}
              onChange={handleVoltageGroupChange}
            >
              <StyledFormControlLabel
                value="phase"
                control={<Radio />}
                label="Phase Voltage"
              />
              <StyledFormControlLabel
                value="line"
                control={<Radio />}
                label="Line Voltage"
              />
            </StyledRadioGroup>
          </FormControl>
        </div>

        <div className="chart-size">
          <Line data={voltageChartData} options={options} />
        </div>
      </div>

      <div className="value-cont">
        <div className="value-heading">Voltage</div>
        <div className="current-value">Recent Value</div>
        <div className="legend-container">
          {[
            { label: "R Voltage", color: "#D33030", key: "Vr", group: "phase" },
            { label: "Y Voltage", color: "#FFB319", key: "Vy", group: "phase" },
            { label: "B Voltage", color: "#017EF3", key: "Vb", group: "phase" },
            {
              label: "RY Voltage",
              color: "#DC8006",
              key: "Vry",
              group: "line",
            },
            {
              label: "YB Voltage",
              color: "#16896B",
              key: "Vyb",
              group: "line",
            },
            {
              label: "BR Voltage",
              color: "#6036D4",
              key: "Vbr",
              group: "line",
            },
          ].map(({ label, color, key, group }) => {
            const isSelectedGroup = group === selectedVoltageGroup;
            const textColor = isSelectedGroup ? "#000" : "#999";
            const boxColor = isSelectedGroup ? color : "#999";

            return (
              <div className="legend-item-two" key={key}>
                <div className="value-name" style={{ color: textColor }}>
                  <span
                    className="legend-color-box"
                    style={{ backgroundColor: boxColor }}
                  />
                  {label}
                </div>
                <div className="value" style={{ color: textColor }}>
                  {data.length > 0
                    ? data[data.length - 1][key]?.toFixed(2)
                    : "0.00"}{" "}
                  <span className="value-span" style={{ color: textColor }}>
                    V
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RealTimeVoltageChart;
