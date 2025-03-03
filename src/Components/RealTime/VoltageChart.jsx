import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { styled } from "@mui/system";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
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
import "./RealTimeStyle.css";
import "chartjs-adapter-date-fns";

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

const StyledRadioGroup = styled(RadioGroup)({
  display: "flex",
  gap: "16px", // Add space between radio buttons
  flexDirection: "row",
});

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  border: "1px solid #EAECF0",
  borderRadius: "8px", // Rounded corners
  margin: "0", // Remove margin between buttons
  padding: "1vh", // Padding for each button
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  backgroundColor: "#FFFFFF", // Default background color

  "& .MuiFormControlLabel-label": {
    fontFamily: "DM Sans",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "16px", // Line height as a string
    color: "#445164", // Custom text color
  },
  "& .MuiRadio-root": {
    padding: "0 8px", // Padding for radio icon
    color: "#445164", // Default color for unchecked
  },
  "& .MuiRadio-root.Mui-checked": {
    color: "#4E46B4", // Color when checked
  },
  "&:hover": {
    backgroundColor: "#F3F4F6", // Hover background
  },
}));

// We define a legendItems array to map each voltage to a group.
// 'phase_voltage' -> R, Y, B
// 'line_voltage'  -> RY, YB, BR
const legendItems = [
  {
    label: "R Voltage",
    color: "#D33030",
    key: "rVoltage",
    group: "phase_voltage",
  },
  {
    label: "Y Voltage",
    color: "#FFB319",
    key: "yVoltage",
    group: "phase_voltage",
  },
  {
    label: "B Voltage",
    color: "#017EF3",
    key: "bVoltage",
    group: "phase_voltage",
  },
  {
    label: "RY Voltage",
    color: "#DC8006",
    key: "ryVoltage",
    group: "line_voltage",
  },
  {
    label: "YB Voltage",
    color: "#16896B",
    key: "ybVoltage",
    group: "line_voltage",
  },
  {
    label: "BR Voltage",
    color: "#6036D4",
    key: "brVoltage",
    group: "line_voltage",
  },
];

const VoltageChart = ({ rawData }) => {
  const [data, setData] = useState([]);
  // Radio group state to switch between phase voltages and line-to-line voltages
  const [radioGroup, setRadioGroup] = useState("phase_voltage"); // default

  // Update chart data when rawData changes
  useEffect(() => {
    if (rawData) {
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
        time: timestamp,
        rVoltage: r_voltage,
        yVoltage: y_voltage,
        bVoltage: b_voltage,
        ryVoltage: ry_voltage,
        ybVoltage: yb_voltage,
        brVoltage: br_voltage,
      };

      setData((prevData) => {
        const updatedData = [...prevData, newEntry];
        // Keep only the most recent 15 entries
        return updatedData.length > 15
          ? updatedData.slice(updatedData.length - 15)
          : updatedData;
      });
    }
  }, [rawData]);

  // Decide which datasets to show based on the selected radio group
  let chartDatasets = [];
  if (radioGroup === "phase_voltage") {
    chartDatasets = [
      {
        label: "R Voltage",
        data: data.map((item) => item.rVoltage),
        borderColor: "#D33030",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "Y Voltage",
        data: data.map((item) => item.yVoltage),
        borderColor: "#FFB319",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "B Voltage",
        data: data.map((item) => item.bVoltage),
        borderColor: "#017EF3",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
    ];
  } else {
    // radioGroup === "line_voltage"
    chartDatasets = [
      {
        label: "RY Voltage",
        data: data.map((item) => item.ryVoltage),
        borderColor: "#DC8006",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "YB Voltage",
        data: data.map((item) => item.ybVoltage),
        borderColor: "#16896B",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
      {
        label: "BR Voltage",
        data: data.map((item) => item.brVoltage),
        borderColor: "#6036D4",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4, // Smooth line
      },
    ];
  }

  const chartData = {
    labels: data.map((item) => item.time),
    datasets: chartDatasets,
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          tooltipFormat: "ll HH:mm",
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
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + " V";
            }
            return label;
          },
        },
      },
      legend: {
        display: false, // We'll manage our own "legend" in the value container
      },
    },
  };

  // Radio button handler
  const handleRadioChange = (event) => {
    setRadioGroup(event.target.value);
  };

  return (
    <div className="containerchart">
      <div className="chart-cont">
        <div className="title">
          Voltage
          <StyledRadioGroup value={radioGroup} onChange={handleRadioChange}>
            <StyledFormControlLabel
              value="phase_voltage"
              control={<Radio />}
              label="Phase Voltage"
            />
            <StyledFormControlLabel
              value="line_voltage"
              control={<Radio />}
              label="Line Voltage"
            />
          </StyledRadioGroup>
        </div>
        <div className="chart-size">
          <Line data={chartData} options={options} />
        </div>
      </div>

      {/* VALUE CONT / LEGEND */}
      <div className="value-cont">
        <div className="value-heading">Voltage</div>
        <div className="current-value">Recent Value</div>
        <div className="legend-container">
          {legendItems.map(({ label, color, key, group }) => {
            // If this item's group is the selected group, show color; otherwise, grayscale
            const isSelected = group === radioGroup;
            const boxColor = isSelected ? color : "#999";
            const textColor = isSelected ? "#000" : "#999";

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
