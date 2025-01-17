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

    let timestamp = Object.values(rawData)[0].timestamp

    let amfsAvgLineVoltageValues = Object.values(rawData).map((value) => {
      return (value.r_voltage + value.y_voltage + value.b_voltage)/3
    })

    let amfsAvgPhaseVoltageValues = Object.values(rawData).map((value) => {
      return (value.ry_voltage + value.yb_voltage + value.br_voltage)/3
    })

    // const {
    //   timestamp,
    //   r_voltage,
    //   y_voltage,
    //   b_voltage,
    //   ry_voltage,
    //   yb_voltage,
    //   br_voltage,
    // } = rawData;

    const newEntry = {
      time: timestamp ? new Date(timestamp) : new Date(),
      amf1a_avg_line_voltage: amfsAvgLineVoltageValues[0],
      amf1b_avg_line_voltage: amfsAvgLineVoltageValues[1],
      amf2a_avg_line_voltage: amfsAvgLineVoltageValues[2],
      amf2b_avg_line_voltage: amfsAvgLineVoltageValues[3],
      amf1a_avg_phase_voltage: amfsAvgPhaseVoltageValues[0],
      amf1b_avg_phase_voltage: amfsAvgPhaseVoltageValues[1],
      amf2a_avg_phase_voltage: amfsAvgPhaseVoltageValues[2],
      amf2b_avg_phase_voltage: amfsAvgPhaseVoltageValues[3],
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
        label: "AMF1A Avg Line Voltage",
        data: data.map((item) => item.amf1a_avg_line_voltage),
        borderColor: "#D33030",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "AMF1B Avg Line Voltage",
        data: data.map((item) => item.amf1b_avg_line_voltage),
        borderColor: "#FFB319",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "AMF2A Avg Line Voltage",
        data: data.map((item) => item.amf2a_avg_line_voltage),
        borderColor: "#017EF3",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "AMF2B Avg Line Voltage",
        data: data.map((item) => item.amf2b_avg_line_voltage),
        borderColor: "#DC8006",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "AMF1A Avg Phase Voltage",
        data: data.map((item) => item.amf1a_avg_phase_voltage),
        borderColor: "#16896B",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "AMF1B Avg Phase Voltage",
        data: data.map((item) => item.amf1b_avg_phase_voltage),
        borderColor: "#6036D4",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "AMF2A Avg Phase Voltage",
        data: data.map((item) => item.amf2a_avg_phase_voltage),
        borderColor: "#16896B",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "AMF2B Avg Phase Voltage",
        data: data.map((item) => item.amf2b_avg_phase_voltage),
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
          <Line data={voltageChartData} options={options} />
        </div>
      </div>

      {/* Recent Values */}
      <div className="value-cont">
        <div className="value-heading">Voltage</div>
        <div className="current-value">Recent Value</div>
        <div className="legend-container">
          {[
            { label: "AMF1A Avg Line Voltage", color: "#D33030", key: "amf1a_avg_line_voltage" },
            { label: "AMF1B Avg Line Voltage", color: "#FFB319", key: "amf1b_avg_line_voltage" },
            { label: "AMF2A Avg Line Voltage", color: "#017EF3", key: "amf2a_avg_line_voltage" },
            { label: "AMF2B Avg Line Voltage", color: "#DC8006", key: "amf2b_avg_line_voltage" },
            { label: "AMF1A Avg Phase Voltage", color: "#16896B", key: "amf1a_avg_phase_voltage" },
            { label: "AMF1B Avg Phase Voltage", color: "#6036D4", key: "amf1b_avg_phase_voltage" },
            { label: "AMF2A Avg Phase Voltage", color: "#16896B", key: "amf2a_avg_phase_voltage" },
            { label: "AMF2B Avg Phase Voltage", color: "#6036D4", key: "amf2b_avg_phase_voltage" },
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
