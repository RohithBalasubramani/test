import React, { useState, useEffect } from "react";
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

const VoltageChart = ({ rawData, amfOptions, selectedAPI, onRadioChange }) => {
  const [data, setData] = useState([]);

  // Update chart data when rawData changes
  useEffect(() => {
    if (!rawData) return;

    const {
      timestamp,
      r_voltage,
      y_voltage,
      b_voltage,
      ry_voltage,
      yb_voltage,
      br_voltage,
    } = rawData;

    const newEntry = {
      time: timestamp ? new Date(timestamp) : new Date(),
      rVoltage: r_voltage,
      yVoltage: y_voltage,
      bVoltage: b_voltage,
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
  }, [rawData]);

  // Handle Radio Button Change
  const handleRadioChange = (event) => {
    onRadioChange(event.target.value);
    setData([]); // Clear data on source switch
  };

  const labels = data.map((item) => item.time);

  const voltageChartData = {
    labels,
    datasets: [
      {
        label: "R Voltage",
        data: data.map((item) => item.rVoltage),
        borderColor: "#D33030",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "Y Voltage",
        data: data.map((item) => item.yVoltage),
        borderColor: "#FFB319",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "B Voltage",
        data: data.map((item) => item.bVoltage),
        borderColor: "#017EF3",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "RY Voltage",
        data: data.map((item) => item.ryVoltage),
        borderColor: "#DC8006",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "YB Voltage",
        data: data.map((item) => item.ybVoltage),
        borderColor: "#16896B",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "BR Voltage",
        data: data.map((item) => item.brVoltage),
        borderColor: "#6036D4",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
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
          tooltipFormat: "PP HH:mm",
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
            if (label) label += ": ";
            if (context.parsed.y !== null) label += context.parsed.y + " V";
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
      {/* Styled Radio Button Group */}

      {/* Chart Container */}
      <div className="chart-cont">
        <div className="title">Voltage</div>

        <div className="formcontrol">
          <FormControl component="fieldset">
            <StyledRadioGroup
              value={selectedAPI}
              onChange={handleRadioChange}
              aria-label="Select AMF Source"
            >
              {amfOptions.map((item) => (
                <StyledFormControlLabel
                  key={item.id}
                  value={item.apis[0]}
                  control={<Radio />}
                  label={item.label}
                />
              ))}
            </StyledRadioGroup>
          </FormControl>
        </div>

        <div className="chart-size">
          <Line data={voltageChartData} options={options} />
        </div>
      </div>

      {/* Recent Values */}
      <div className="value-cont">
        <div className="value-heading">Voltage</div>
        <div className="current-value">Recent Value</div>
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
