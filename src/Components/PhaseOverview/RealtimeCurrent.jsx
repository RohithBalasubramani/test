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

    let timestamp = Object.values(rawData)[0].timestamp

    let amfsAvgCurrentValues = Object.values(rawData).map((value) => value.avg_current)

    //const { timestamp, avg_current, r_current, y_current, b_current } = rawData;

    const newEntry = {
      time: timestamp ? new Date(timestamp) : new Date(),
      amf1a_avg_current: amfsAvgCurrentValues[0],
      amf1b_avg_current: amfsAvgCurrentValues[1],
      amf2a_avg_current: amfsAvgCurrentValues[2],
      amf2b_avg_current: amfsAvgCurrentValues[3],
    };

    setData((prevData) => {
      const updatedData = [...prevData, newEntry];
      return updatedData.length > 15
        ? updatedData.slice(updatedData.length - 15)
        : updatedData;
    });
  }, [rawData]);

  // Handle Radio Button Change
  // const handleRadioChange = (event) => {
  //   onRadioChange(event.target.value);
  //   setData([]); // Clear data on source switch
  // };

  const labels = data.map((item) => item.time);

  const currentChartData = {
    labels,
    datasets: [
      {
        label: "AMF1A Avg Current",
        data: data.map((item) => item.amf1a_avg_current),
        borderColor: "#6036D4",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "AMF1B Avg Current",
        data: data.map((item) => item.amf1b_avg_current),
        borderColor: "#D33030",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "AMF2A Avg Current",
        data: data.map((item) => item.amf2a_avg_current),
        borderColor: "#FFB319",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "AMF2B Avg Current",
        data: data.map((item) => item.amf2b_avg_current),
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
        {/* <div className="formcontrol">
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
        </div> */}
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
            { label: "AMF1A Avg", color: "#6036D4", key: "amf1a_avg_current" },
            { label: "AMF1B Avg", color: "#D33030", key: "amf1b_avg_current" },
            { label: "AMF2A Avg", color: "#FFB319", key: "amf2a_avg_current" },
            { label: "AMF2B Avg", color: "#017EF3", key: "amf2b_avg_current" },
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
