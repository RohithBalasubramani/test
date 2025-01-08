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
import "chartjs-adapter-date-fns";

// Register Chart.js components
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

// --- Styled Components ---
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
  rawData, // Single { timestamp, value } object from ParentRealtime
  amfOptions, // Array of API options (e.g., AHU, PCC-3, etc.)
  selectedAPI, // Currently selected option (e.g., "AHU")
  onRadioChange, // Function triggered when user selects a different API
}) => {
  const [chartDataEntries, setChartDataEntries] = useState([]);

  // When `rawData` changes, we add a new data point
  useEffect(() => {
    if (!rawData) return;

    // Deconstruct the single data object
    const { timestamp, value } = rawData;

    // Convert to the format this chart uses:
    // { time: Date, energy: number }
    const newEntry = {
      time: timestamp ? new Date(timestamp) : new Date(),
      energy: value || 0,
    };

    setChartDataEntries((prevData) => {
      const updatedData = [...prevData, newEntry];
      // Keep the latest 15 data points
      return updatedData.length > 15
        ? updatedData.slice(updatedData.length - 15)
        : updatedData;
    });
  }, [rawData]);

  // Handle user clicking a different radio button
  const handleRadioChange = (event) => {
    onRadioChange(event.target.value);
    setChartDataEntries([]); // Clear chart data when switching
  };

  // Calculate total energy from all displayed points
  const totalEnergy = chartDataEntries.reduce(
    (sum, entry) => sum + (entry.energy || 0),
    0
  );

  // Prepare data for Chart.js
  const chartData = {
    labels: chartDataEntries.map((item) => item.time),
    datasets: [
      {
        label: "Energy Consumption",
        data: chartDataEntries.map((item) => item.energy),
        borderColor: "#4E46B4",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4,
      },
    ],
  };

  // Chart.js configuration
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
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Energy (kWh)",
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
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2) + " kWh";
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
    <div className="containerchart" style={{ display: "flex" }}>
      {/* Title and Radio Button Group */}
      <div className="chart-cont" style={{ flex: 3 }}>
        <div className="formcontrol">
          <div className="title">Energy Consumption</div>
          <FormControl component="fieldset">
            <StyledRadioGroup
              value={selectedAPI}
              onChange={handleRadioChange}
              aria-label="Select API Source"
            >
              {amfOptions.map((item) => (
                <StyledFormControlLabel
                  key={item.id}
                  value={item.id}
                  control={<Radio />}
                  label={item.label}
                />
              ))}
            </StyledRadioGroup>
          </FormControl>
        </div>
        <div className="chart-size" style={{ height: "400px", width: "100%" }}>
          <Line data={chartData} options={options} />
        </div>
      </div>

      {/* Recent / Aggregated Values */}
      <div className="value-cont" style={{ flex: 1 }}>
        <div className="value-heading" style={{ marginBottom: "10px" }}>
          Recent Values
        </div>
        <div
          className="legend-container"
          style={{ display: "flex", gap: "20px" }}
        >
          {/* Most Recent Energy Value */}
          <div className="legend-item-two">
            <div className="value-name" style={{ marginBottom: "4px" }}>
              <span
                className="legend-color-box"
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#4E46B4",
                  marginRight: "5px",
                }}
              />
              Energy Consumption
            </div>
            <div className="value">
              {chartDataEntries.length > 0
                ? chartDataEntries[chartDataEntries.length - 1].energy.toFixed(
                    2
                  )
                : "0.00"}{" "}
              <span className="value-span">kWh</span>
            </div>
          </div>

          {/* Total Energy */}
          <div className="legend-item-two">
            <div className="value-name" style={{ marginBottom: "4px" }}>
              <span
                className="legend-color-box"
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#FFC107",
                  marginRight: "5px",
                }}
              />
              Total Energy
            </div>
            <div className="value">
              {totalEnergy.toFixed(2)} <span className="value-span">kWh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeChart;
