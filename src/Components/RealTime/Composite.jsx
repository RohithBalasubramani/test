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
import "./realtimestyle.css";
import "chartjs-adapter-date-fns";

// Register all the Chart.js components
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

// ---------------------- STYLED COMPONENTS ----------------------
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

// ---------------------- LEGEND CONFIG ----------------------
// We'll store all 9 legend items here. Each item knows:
//  - label (display text)
//  - color (its main color when selected)
//  - key (the property from the data array to display the value)
//  - group (which radio group it belongs to => "ac_power", "app_power", or "reactive_power")
const legendItems = [
  {
    label: "R Active",
    color: "#C72F08",
    key: "rActiveRecent",
    group: "ac_power",
  },
  {
    label: "Y Active",
    color: "#E6B148",
    key: "yActiveRecent",
    group: "ac_power",
  },
  {
    label: "B Active",
    color: "#0171DB",
    key: "bActiveRecent",
    group: "ac_power",
  },
  {
    label: "R App",
    color: "#E45D3A",
    key: "rAppRecent",
    group: "app_power",
  },
  {
    label: "Y App",
    color: "#B38A38",
    key: "yAppRecent",
    group: "app_power",
  },
  {
    label: "B App",
    color: "#0158AA",
    key: "bAppRecent",
    group: "app_power",
  },
  {
    label: "R Reactive",
    color: "#9B2406",
    key: "rReactiveRecent",
    group: "reactive_power",
  },
  {
    label: "Y Reactive",
    color: "#FFD173",
    key: "yReactiveRecent",
    group: "reactive_power",
  },
  {
    label: "B Reactive",
    color: "#3498F5",
    key: "bReactiveRecent",
    group: "reactive_power",
  },
];

const RealTimeChart = ({ rawData }) => {
  const [data, setData] = useState([]);
  // This state tracks which radio button is selected
  const [radioGroup, setRadioGroup] = useState("ac_power"); // default

  // Update chart data when rawData changes
  useEffect(() => {
    if (rawData) {
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
        time: timestamp,
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

      setData((prevData) => {
        const updatedData = [...prevData, newEntry];
        // Keep only the most recent 15 entries
        return updatedData.length > 15
          ? updatedData.slice(updatedData.length - 15)
          : updatedData;
      });
    }
  }, [rawData]);

  // Construct the datasets for the chart based on the selected radioGroup
  let chartDatasets = [];

  if (radioGroup === "ac_power") {
    chartDatasets = [
      {
        label: "R Active",
        data: data.map((item) => item.rActiveRecent),
        borderColor: "#C72F08",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4, // Smooth the line
      },
      {
        label: "Y Active",
        data: data.map((item) => item.yActiveRecent),
        borderColor: "#E6B148",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4, // Smooth the line
      },
      {
        label: "B Active",
        data: data.map((item) => item.bActiveRecent),
        borderColor: "#0171DB",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4, // Smooth the line
      },
    ];
  } else if (radioGroup === "app_power") {
    chartDatasets = [
      {
        label: "R App",
        data: data.map((item) => item.rAppRecent),
        borderColor: "#E45D3A",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4, // Smooth the line
      },
      {
        label: "Y App",
        data: data.map((item) => item.yAppRecent),
        borderColor: "#B38A38",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4, // Smooth the line
      },
      {
        label: "B App",
        data: data.map((item) => item.bAppRecent),
        borderColor: "#0158AA",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4, // Smooth the line
      },
    ];
  } else {
    chartDatasets = [
      {
        label: "R Reactive",
        data: data.map((item) => item.rReactiveRecent),
        borderColor: "#9B2406",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4, // Smooth the line
      },
      {
        label: "Y Reactive",
        data: data.map((item) => item.yReactiveRecent),
        borderColor: "#FFD173",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4, // Smooth the line
      },
      {
        label: "B Reactive",
        data: data.map((item) => item.bReactiveRecent),
        borderColor: "#3498F5",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4, // Smooth the line
      },
    ];
  }

  // Prepare the final chart data structure
  const chartData = {
    labels: data.map((item) => item.time),
    datasets: chartDatasets,
  };

  // Chart options
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
        display: false, // We'll manage our own legend below
      },
    },
  };

  // Handle radio changes
  const handleRadioChange = (event) => {
    setRadioGroup(event.target.value);
  };

  return (
    <div className="containerchart">
      {/* ---------------- RADIO GROUP ---------------- */}

      {/* ---------------- CHART AREA ---------------- */}
      <div className="chart-cont">
        <div className="title">
          <div>Power Consumption </div>
          <StyledRadioGroup value={radioGroup} onChange={handleRadioChange}>
            <StyledFormControlLabel
              value="ac_power"
              control={<Radio />}
              label="AC Power"
            />
            <StyledFormControlLabel
              value="app_power"
              control={<Radio />}
              label="App Power"
            />
            <StyledFormControlLabel
              value="reactive_power"
              control={<Radio />}
              label="Reactive Power"
            />
          </StyledRadioGroup>
        </div>
        <div className="chart-size">
          <Line data={chartData} options={options} />
        </div>
      </div>

      {/* ---------------- VALUE / LEGEND AREA ---------------- */}
      <div className="value-cont">
        <div className="value-heading">Power Consumption</div>
        <div className="current-value">Recent Value</div>

        {/* We display all 9 items, coloring only the selected group in color. 
            Others are black & white (grayscale). */}
        <div className="legend-container">
          {legendItems.map(({ label, color, key, group }) => {
            // Decide if this item is from the selected group
            const isSelectedGroup = group === radioGroup;
            // Use color if selected, else grayscale (#999 / #CCC, etc.)
            const boxColor = isSelectedGroup ? color : "#999"; // the color box
            const textColor = isSelectedGroup ? "#000" : "#999"; // text color

            return (
              <div className="legend-item-two" key={key}>
                <div
                  className="value-name"
                  style={{ color: textColor }} // label in black if selected, grey if not
                >
                  <span
                    className="legend-color-box"
                    style={{
                      backgroundColor: boxColor,
                    }}
                  />
                  {label}
                </div>
                <div className="value" style={{ color: textColor }}>
                  {data.length > 0
                    ? data[data.length - 1][key]?.toFixed(2)
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
