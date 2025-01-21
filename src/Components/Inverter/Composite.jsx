import React, { useEffect, useState } from "react";
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
import axios from "axios";
import "../realtimestyle.css"; // Import the shared CSS file
import "chartjs-adapter-date-fns";
import { sideBarTreeArray } from "../../sidebarInfo2";

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

const RealTimeChart = ({ apiKey, topBar }) => {
  const [data, setData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("ac"); // Default to AC Power

  const fetchData = async () => {
    try {
      if (apiKey && topBar) {
        const apiEndpointsArray = sideBarTreeArray[topBar].find(
          (arr) => arr.id === apiKey
        );
        if (apiEndpointsArray) {
          const apiEndpoint = apiEndpointsArray.apis[0];
          if (apiEndpoint) {
            const response = await axios.get(apiEndpoint);
            const timestamp = response.data["recent data"]["timestamp"];
            const bActiveRecent = response.data["recent data"]["b_ac_power"];
            const rActiveRecent = response.data["recent data"]["r_ac_power"];
            const yActiveRecent = response.data["recent data"]["y_ac_power"];
            const bAppRecent = response.data["recent data"]["dc_power"];
            updateChartData(
              timestamp,
              bActiveRecent,
              rActiveRecent,
              yActiveRecent,
              bAppRecent
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateChartData = (
    timestamp,
    bActiveRecent,
    rActiveRecent,
    yActiveRecent,
    bAppRecent
  ) => {
    const newEntry = {
      time: timestamp,
      bActiveRecent,
      rActiveRecent,
      yActiveRecent,
      bAppRecent,
    };

    setData((prevData) => {
      const updatedData = [...prevData, newEntry];
      return updatedData.length > 15
        ? updatedData.slice(updatedData.length - 15)
        : updatedData;
    });
  };

  useEffect(() => {
    setData([]);
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, [apiKey]);

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  const chartData = {
    labels: data.map((item) => item.time),
    datasets:
      selectedGroup === "ac"
        ? [
            {
              label: "R AC Power",
              data: data.map((item) => item.rActiveRecent),
              borderColor: "#C72F08",
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.4,
            },
            {
              label: "Y AC Power",
              data: data.map((item) => item.yActiveRecent),
              borderColor: "#E6B148",
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.4,
            },
            {
              label: "B AC Power",
              data: data.map((item) => item.bActiveRecent),
              borderColor: "#0171DB",
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.4,
            },
          ]
        : [
            {
              label: "DC Power",
              data: data.map((item) => item.bAppRecent),
              borderColor: "#E45D3A",
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.4,
            },
          ],
  };

  const options = {
    maintainAspectRatio: false,
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
          text: "Power (kW)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5],
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="containerchart">
      <div className="chart-cont">
        <div className="title">
          <div> Power </div>
          <FormControl component="fieldset">
            <StyledRadioGroup
              value={selectedGroup}
              onChange={handleGroupChange}
            >
              <StyledFormControlLabel
                value="ac"
                control={<Radio />}
                label="AC Power"
              />
              <StyledFormControlLabel
                value="dc"
                control={<Radio />}
                label="DC Power"
              />
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
          {[
            {
              label: "R AC Power",
              color: "#C72F08",
              key: "rActiveRecent",
              group: "ac",
            },
            {
              label: "Y AC Power",
              color: "#E6B148",
              key: "yActiveRecent",
              group: "ac",
            },
            {
              label: "B AC Power",
              color: "#0171DB",
              key: "bActiveRecent",
              group: "ac",
            },
            {
              label: "DC Power",
              color: "#E45D3A",
              key: "bAppRecent",
              group: "dc",
            },
          ].map(({ label, color, key, group }) => {
            const isSelectedGroup = group === selectedGroup;
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
