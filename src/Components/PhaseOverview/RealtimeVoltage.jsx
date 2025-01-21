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

const VoltageChart = ({ rawData }) => {
  const [data, setData] = useState([]);
  const [selectedVoltageType, setSelectedVoltageType] = useState("line"); // "line" or "phase"

  // Update chart data when rawData changes
  useEffect(() => {
    if (!rawData) return;

    // Extract the first entry's timestamp
    let timestamp = Object.values(rawData)[0]?.timestamp;

    // Calculate average line voltage array
    let avgLineVoltages = Object.values(rawData).map((value) => {
      return (value.r_voltage + value.y_voltage + value.b_voltage) / 3;
    });

    // Calculate average phase voltage array
    let avgPhaseVoltages = Object.values(rawData).map((value) => {
      return (value.ry_voltage + value.yb_voltage + value.br_voltage) / 3;
    });

    // Build a new data entry
    const newEntry = {
      time: timestamp ? new Date(timestamp) : new Date(),
      amf1a_avg_line_voltage: avgLineVoltages[0],
      amf1b_avg_line_voltage: avgLineVoltages[1],
      amf2a_avg_line_voltage: avgLineVoltages[2],
      amf2b_avg_line_voltage: avgLineVoltages[3],
      amf1a_avg_phase_voltage: avgPhaseVoltages[0],
      amf1b_avg_phase_voltage: avgPhaseVoltages[1],
      amf2a_avg_phase_voltage: avgPhaseVoltages[2],
      amf2b_avg_phase_voltage: avgPhaseVoltages[3],
    };

    setData((prevData) => {
      const updatedData = [...prevData, newEntry];
      // Keep only the last 15 entries
      return updatedData.length > 15
        ? updatedData.slice(updatedData.length - 15)
        : updatedData;
    });
  }, [rawData]);

  // Handle Voltage Type Change
  const handleVoltageTypeChange = (event) => {
    setSelectedVoltageType(event.target.value);
  };

  // Prepare chart labels
  const labels = data.map((item) => item.time);

  // Decide which datasets to show based on the selected voltage type
  const datasets =
    selectedVoltageType === "line"
      ? [
          {
            label: "AMF1A Avg Line Voltage",
            data: data.map((item) => item.amf1a_avg_line_voltage),
            borderColor: "#D33030",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
          {
            label: "AMF1B Avg Line Voltage",
            data: data.map((item) => item.amf1b_avg_line_voltage),
            borderColor: "#FFB319",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
          {
            label: "AMF2A Avg Line Voltage",
            data: data.map((item) => item.amf2a_avg_line_voltage),
            borderColor: "#017EF3",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
          {
            label: "AMF2B Avg Line Voltage",
            data: data.map((item) => item.amf2b_avg_line_voltage),
            borderColor: "#DC8006",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
        ]
      : [
          {
            label: "AMF1A Avg Phase Voltage",
            data: data.map((item) => item.amf1a_avg_phase_voltage),
            borderColor: "#16896B",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
          {
            label: "AMF1B Avg Phase Voltage",
            data: data.map((item) => item.amf1b_avg_phase_voltage),
            borderColor: "#6036D4",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
          {
            label: "AMF2A Avg Phase Voltage",
            data: data.map((item) => item.amf2a_avg_phase_voltage),
            borderColor: "#16896B",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
          {
            label: "AMF2B Avg Phase Voltage",
            data: data.map((item) => item.amf2b_avg_phase_voltage),
            borderColor: "#6036D4",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
        ];

  // Final chart data
  const voltageChartData = {
    labels,
    datasets,
  };

  // Chart.js options
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
          label: (context) => {
            const label = context.dataset.label || "";
            return `${label}: ${context.parsed.y?.toFixed(2)} V`;
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
      {/* Chart Container */}
      <div className="chart-cont">
        <div className="title">
          <div>
            {" "}
            <div> Voltage </div>
            <FormControl component="fieldset">
              <StyledRadioGroup
                value={selectedVoltageType}
                onChange={handleVoltageTypeChange}
              >
                <StyledFormControlLabel
                  value="line"
                  control={<Radio />}
                  label="Line Voltage"
                />
                <StyledFormControlLabel
                  value="phase"
                  control={<Radio />}
                  label="Phase Voltage"
                />
              </StyledRadioGroup>
            </FormControl>
          </div>
        </div>

        {/* Radio to toggle between Line Voltage and Phase Voltage */}

        <div className="chart-size">
          <Line data={voltageChartData} options={options} />
        </div>
      </div>

      {/* Value Container (Legend) */}
      <div className="value-cont">
        <div className="value-heading">Voltage</div>
        <div className="current-value">Recent Value</div>
        <div className="legend-container">
          {[
            {
              label: "AMF1A Avg Line Voltage",
              color: "#D33030",
              key: "amf1a_avg_line_voltage",
              group: "line",
            },
            {
              label: "AMF1B Avg Line Voltage",
              color: "#FFB319",
              key: "amf1b_avg_line_voltage",
              group: "line",
            },
            {
              label: "AMF2A Avg Line Voltage",
              color: "#017EF3",
              key: "amf2a_avg_line_voltage",
              group: "line",
            },
            {
              label: "AMF2B Avg Line Voltage",
              color: "#DC8006",
              key: "amf2b_avg_line_voltage",
              group: "line",
            },
            {
              label: "AMF1A Avg Phase Voltage",
              color: "#16896B",
              key: "amf1a_avg_phase_voltage",
              group: "phase",
            },
            {
              label: "AMF1B Avg Phase Voltage",
              color: "#6036D4",
              key: "amf1b_avg_phase_voltage",
              group: "phase",
            },
            {
              label: "AMF2A Avg Phase Voltage",
              color: "#16896B",
              key: "amf2a_avg_phase_voltage",
              group: "phase",
            },
            {
              label: "AMF2B Avg Phase Voltage",
              color: "#6036D4",
              key: "amf2b_avg_phase_voltage",
              group: "phase",
            },
          ].map(({ label, color, key, group }) => {
            // Only selected group is colored; the others are grayscale
            const isSelectedGroup = group === selectedVoltageType;
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

export default VoltageChart;
