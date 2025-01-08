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

const RealTimeCurrentChart = ({
  rawData,
  amfOptions,
  selectedAPI,
  onRadioChange,
}) => {
  const [data, setData] = useState([]);

  // Update chart data when rawData changes
  useEffect(() => {
    if (!rawData) return;

    const { timestamp, avg_current, r_current, y_current, b_current } = rawData;

    const newEntry = {
      time: timestamp ? new Date(timestamp) : new Date(),
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
  }, [rawData]);

  // Handle Radio Button Change
  const handleRadioChange = (event) => {
    onRadioChange(event.target.value);
    setData([]); // Clear data on source switch
  };

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
        tension: 0.4,
      },
      {
        label: "R Current",
        data: data.map((item) => item.rCurrent),
        borderColor: "#D33030",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "Y Current",
        data: data.map((item) => item.yCurrent),
        borderColor: "#FFB319",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "B Current",
        data: data.map((item) => item.bCurrent),
        borderColor: "#017EF3",
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
          text: "Current (A)",
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
            if (context.parsed.y !== null) label += context.parsed.y + " A";
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
        <div className="title">Current</div>
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
          <Line data={currentChartData} options={options} />
        </div>
      </div>

      {/* Recent Values */}
      <div className="value-cont">
        <div className="value-heading">Current</div>
        <div className="current-value">Recent Value</div>
        <div className="legend-container">
          {[
            { label: "Avg Current", color: "#6036D4", key: "avgCurrent" },
            { label: "R Current", color: "#D33030", key: "rCurrent" },
            { label: "Y Current", color: "#FFB319", key: "yCurrent" },
            { label: "B Current", color: "#017EF3", key: "bCurrent" },
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
                <span className="value-span">A</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeCurrentChart;
