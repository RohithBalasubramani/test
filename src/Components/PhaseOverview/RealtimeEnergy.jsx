// RealTimeChart.jsx
import React, { useState, useEffect } from "react";
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
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/system";
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

// --- Styled Radio Components (Toggle Bar Style) ---
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
  // Props passed down from parent
  rawData, // Object with the most recent fetched data
  amfOptions, // Filtered array (amf1a, amf1b, amf2a, amf2b)
  selectedAPI, // Currently selected API URL
  onRadioChange, // Function to notify parent when user switches radio
}) => {
  // Local state for chartable data
  const [chartDataEntries, setChartDataEntries] = useState([]);

  // When rawData changes, create a new chart data entry
  useEffect(() => {
    if (!rawData) return;
    const {
      timestamp,
      b_ac_power,
      r_ac_power,
      y_ac_power,
      b_app_power,
      r_app_power,
      y_app_power,
      b_reactive_power,
      r_reactive_power,
      y_reactive_power,
    } = rawData;

    const newEntry = {
      // Convert timestamp to a valid Date so the x-axis is dynamic
      time: timestamp ? new Date(timestamp) : new Date(),
      bActiveRecent: b_ac_power,
      rActiveRecent: r_ac_power,
      yActiveRecent: y_ac_power,
      bAppRecent: b_app_power,
      rAppRecent: r_app_power,
      yAppRecent: y_app_power,
      bReactiveRecent: b_reactive_power,
      rReactiveRecent: r_reactive_power,
      yReactiveRecent: y_reactive_power,
    };

    setChartDataEntries((prevData) => {
      const updatedData = [...prevData, newEntry];
      // Keep only the last 15 entries
      return updatedData.length > 15
        ? updatedData.slice(updatedData.length - 15)
        : updatedData;
    });
  }, [rawData]);

  // Handle Radio Button Change - calls parent
  const handleRadioChange = (event) => {
    // Pass the newly selected API up to the parent
    onRadioChange(event.target.value);
    setChartDataEntries([]); // Clear old data on source switch
  };

  // Prepare data for Chart.js
  const chartData = {
    labels: chartDataEntries.map((item) => item.time),
    datasets: [
      {
        label: "R Active",
        data: chartDataEntries.map((item) => item.rActiveRecent),
        borderColor: "#C72F08",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "Y Active",
        data: chartDataEntries.map((item) => item.yActiveRecent),
        borderColor: "#E6B148",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
      {
        label: "B Active",
        data: chartDataEntries.map((item) => item.bActiveRecent),
        borderColor: "#0171DB",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
    ],
  };

  // Chart.js options
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          // Show date/time in tooltip
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
          text: "Power (kWh)",
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
              label += context.parsed.y + " kWh";
            }
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
        <div className="formcontrol">
          <div className="title">Energy Consumption</div>
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
          <Line data={chartData} options={options} />
        </div>
      </div>

      {/* Recent Values (unchanged) */}
      <div className="value-cont">
        <div className="value-heading">Power</div>
        <div className="current-value">Recent Value</div>
        <div className="legend-container">
          {[
            { label: "R Active", color: "#C72F08", key: "rActiveRecent" },
            { label: "Y Active", color: "#E6B148", key: "yActiveRecent" },
            { label: "B Active", color: "#0171DB", key: "bActiveRecent" },
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
                {chartDataEntries.length > 0
                  ? chartDataEntries[chartDataEntries.length - 1][key]?.toFixed(
                      2
                    )
                  : "0.00"}{" "}
                <span className="value-span">kW</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeChart;
