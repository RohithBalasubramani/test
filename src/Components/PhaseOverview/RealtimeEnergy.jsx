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

// Legend Items
const legendItems = [
  {
    label: "R Active",
    color: "#C72F08",
    key: "rActiveRecent",
    group: "active",
  },
  {
    label: "Y Active",
    color: "#E6B148",
    key: "yActiveRecent",
    group: "active",
  },
  {
    label: "B Active",
    color: "#0171DB",
    key: "bActiveRecent",
    group: "active",
  },
  {
    label: "R Apparent",
    color: "#E45D3A",
    key: "rAppRecent",
    group: "apparent",
  },
  {
    label: "Y Apparent",
    color: "#B38A38",
    key: "yAppRecent",
    group: "apparent",
  },
  {
    label: "B Apparent",
    color: "#0158AA",
    key: "bAppRecent",
    group: "apparent",
  },
  {
    label: "R Reactive",
    color: "#9B2406",
    key: "rReactiveRecent",
    group: "reactive",
  },
  {
    label: "Y Reactive",
    color: "#FFD173",
    key: "yReactiveRecent",
    group: "reactive",
  },
  {
    label: "B Reactive",
    color: "#3498F5",
    key: "bReactiveRecent",
    group: "reactive",
  },
];

const RealTimeChart = ({ rawData, amfOptions, selectedAPI, onRadioChange }) => {
  const [chartDataEntries, setChartDataEntries] = useState([]);
  const [selectedPower, setSelectedPower] = useState("active");

  // Update chart data when rawData changes
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
      return updatedData.length > 15 ? updatedData.slice(-15) : updatedData;
    });
  }, [rawData]);

  // Handle Power Type Change (no data clearing)
  const handlePowerTypeChange = (event) => {
    setSelectedPower(event.target.value);
  };

  // Prepare datasets dynamically based on selected power type
  const chartDatasets = legendItems
    .filter((item) => item.group === selectedPower)
    .map(({ label, color, key }) => ({
      label,
      data: chartDataEntries.map((entry) => entry[key]),
      borderColor: color,
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
    }));

  const chartData = {
    labels: chartDataEntries.map((entry) => entry.time),
    datasets: chartDatasets,
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
          label: (context) => {
            const label = context.dataset.label || "";
            return `${label}: ${context.parsed.y?.toFixed(2)} kWh`;
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
      <div className="chart-cont">
        <div className="formcontrol">
          <div className="title">
            <div> Energy Consumption </div>
            <FormControl
              component="fieldset"
              className="power-type-formcontrol"
            >
              <StyledRadioGroup
                value={selectedPower}
                onChange={handlePowerTypeChange}
                aria-label="Select Power Type"
              >
                <StyledFormControlLabel
                  value="active"
                  control={<Radio />}
                  label="Active Power"
                />
                <StyledFormControlLabel
                  value="apparent"
                  control={<Radio />}
                  label="Apparent Power"
                />
                <StyledFormControlLabel
                  value="reactive"
                  control={<Radio />}
                  label="Reactive Power"
                />
              </StyledRadioGroup>
            </FormControl>
          </div>
          <FormControl component="fieldset">
            <StyledRadioGroup value={selectedAPI} onChange={onRadioChange}>
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

      <div className="value-cont">
        <div className="value-heading">Power</div>
        <div className="current-value">Recent Value</div>
        <div className="legend-container">
          {legendItems.map(({ label, color, key, group }) => {
            const isSelectedGroup = group === selectedPower;
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
                  {chartDataEntries.length > 0
                    ? chartDataEntries[chartDataEntries.length - 1][
                        key
                      ]?.toFixed(2)
                    : "0.00"}{" "}
                  <span className="value-span" style={{ color: textColor }}>
                    kW
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

export default RealTimeChart;
