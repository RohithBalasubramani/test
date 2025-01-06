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
  rawData, // Object with the most recent fetched data
  amfOptions, // Filtered array (ltpanel, pcc3, ahus)
  selectedAPI, // Currently selected API URL
  onRadioChange, // Function to notify parent when user switches radio
}) => {
  const [chartDataEntries, setChartDataEntries] = useState([]);

  // When rawData changes, create a new chart data entry
  useEffect(() => {
    if (!rawData) return;

    const { timestamp, value } = rawData;

    const newEntry = {
      time: timestamp ? new Date(timestamp) : new Date(),
      energy: value,
    };

    setChartDataEntries((prevData) => {
      const updatedData = [...prevData, newEntry];
      return updatedData.length > 15
        ? updatedData.slice(updatedData.length - 15)
        : updatedData;
    });
  }, [rawData]);

  // Handle Radio Button Change - calls parent
  const handleRadioChange = (event) => {
    onRadioChange(event.target.value);
    setChartDataEntries([]); // Clear old data on source switch
  };

  // Calculate total energy
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
                  value={item.id}
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

      {/* Simplified Recent Values */}
      <div className="value-cont">
        <div className="value-heading">Recent Values</div>
        <div className="legend-container">
          {/* Energy */}
          <div className="legend-item-two">
            <div className="value-name">
              <span
                className="legend-color-box"
                style={{ backgroundColor: "#4E46B4" }}
              />
              Energy Consumption
            </div>
            <div className="value">
              {chartDataEntries.length > 0
                ? chartDataEntries[chartDataEntries.length - 1].energy?.toFixed(
                    2
                  )
                : "0.00"}{" "}
              <span className="value-span">kWh</span>
            </div>
          </div>
          {/* Total Energy */}
          <div className="legend-item-two">
            <div className="value-name">
              <span
                className="legend-color-box"
                style={{ backgroundColor: "#FFC107" }}
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
