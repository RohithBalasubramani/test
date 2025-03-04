import React, { useState } from "react";
import styled from "styled-components";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import UserService from "../Services/UserService";
import ToggleButtons from "../Components/Togglesampling";
import "../Components/kpi.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/////////////////////////////////////////////////////
// STYLED COMPONENTS
/////////////////////////////////////////////////////

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  max-width: 98vw;
  margin: 0 auto;
  background-color: #f9f9fa;
  border-radius: 8px;
  margin-top: 3vh;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
`;

const TitleSty = styled.h2`
  margin-bottom: 1rem;
  text-align: right;
  font-family: "DM Sans", sans-serif;
`;

const InputSection = styled.div`
  display: flex;
  align-items: right;
  justify-content: right;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
`;

const PromptInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 300px;
  font-size: 1rem;
  outline: none;
  &:focus {
    border-color: #6b3ceb;
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  background-color: #6b3ceb;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
  &:hover {
    background-color: #5630bc;
  }
`;

const ResultContainer = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
`;

const SubHeading = styled.h2`
  margin-top: 0;
  font-family: "DM Sans", sans-serif;
`;

const Label = styled.span`
  font-weight: 600;
  color: #333;
`;

const Pre = styled.pre`
  background-color: #f7f8fa;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  overflow-x: auto;
`;

const Loader = styled.div`
  margin: 20px auto;
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top: 5px solid #6b3ceb;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// KPI Display
const KPIContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  font-family: "DM Sans", sans-serif;
  background-color: #ffffff;

  .kpi-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .kpi-value {
    font-size: 2rem;
    font-weight: bold;
    color: #6b3ceb;
    margin-bottom: 0.5rem;
  }

  .kpi-units {
    font-size: 1.25rem;
    color: #333;
  }
`;

/////////////////////////////////////////////////////
// AI COMPONENT
/////////////////////////////////////////////////////
const AI = ({ question }) => {
  const [prompt, setPrompt] = useState(question || "");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Time-based resampling states
  const [timeperiod, setTimeperiod] = useState("H");
  const [dateRange, setDateRange] = useState("lastWeek");

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom", // Position legend at the bottom
        align: "start", // Align legends to the start of the container
        labels: {
          boxWidth: 15,
          boxHeight: 15,
          padding: 20,
          font: {
            size: 14,
            family: "DM Sans",
          },
          usePointStyle: true,
          color: "#333",
        },
      },
    },
  };

  // 1) Fetch from your AI endpoint
  const handleSearch = async () => {
    try {
      if (!prompt.trim()) {
        alert("Please enter a question!");
        return;
      }
      setLoading(true);

      const response = await fetch("https://www.neuract.org/rag_api/query/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${UserService.getToken()}`,
        },
        body: JSON.stringify({ question: prompt }),
      });
      const data = await response.json();
      setResponseData(data);
      console.log("res", data);
    } catch (error) {
      console.error("Error fetching data from AI:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2) Resample function for multi-line or single-line data
  const resampleData = (dataArr, timeperiod) => {
    if (!dataArr || dataArr.length === 0) return [];
    const groupedData = {};

    dataArr.forEach((entry) => {
      const date = new Date(entry.timestamp);
      let key;
      switch (timeperiod) {
        case "T":
          key = date.toISOString().substring(0, 16); // to the minute
          break;
        case "H":
          key = date.toISOString().substring(0, 13); // to the hour
          break;
        case "D":
          key = date.toISOString().substring(0, 10); // daily
          break;
        case "W":
          key = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
          break;
        case "M":
          key = date.toISOString().substring(0, 7); // monthly
          break;
        case "Y":
          key = date.getFullYear().toString(); // yearly
          break;
        default:
          key = date.toISOString().substring(0, 10); // fallback daily
      }

      if (!groupedData[key]) {
        groupedData[key] = {};
      }
      // Accumulate fields
      Object.entries(entry).forEach(([field, val]) => {
        if (field !== "timestamp") {
          if (!groupedData[key][field]) {
            groupedData[key][field] = [];
          }
          groupedData[key][field].push(val);
        }
      });
    });

    // Compute average for each field
    const finalArr = [];
    for (const [timestamp, obj] of Object.entries(groupedData)) {
      const aggregated = { timestamp };
      for (const [fieldName, arrVals] of Object.entries(obj)) {
        const sum = arrVals.reduce((a, b) => a + b, 0);
        aggregated[fieldName] = sum / arrVals.length;
      }
      finalArr.push(aggregated);
    }
    return finalArr;
  };

  // 4) Render Chart or KPI
  const renderChart = () => {
    if (!responseData) return null;

    let { data, chart_type, fields } = responseData;
    if (!Array.isArray(data) || data.length === 0) {
      return <div>No data available</div>;
    }

    // Normalize chart type
    chart_type =
      typeof chart_type === "string"
        ? chart_type.toLowerCase().replace(" chart", "").trim()
        : "";

    // --------------------------------------------
    // STEP A: Decide if we need to resample
    // (skip resampling if it's a direct KPI that doesn't rely on timestamp)
    // --------------------------------------------
    if (chart_type !== "kpi") {
      data = resampleData(data, timeperiod);
      if (!data.length) {
        return <div>No data available after resampling</div>;
      }
    }

    // --------------------------------------------
    // STEP B: Identify API fields & map them
    // --------------------------------------------
    const apiFields = Object.keys(data[0]).filter(
      (key) => key.toLowerCase() !== "timestamp"
    );
    const userFriendlyFields = (fields || []).filter(
      (f) => f.toLowerCase() !== "timestamp"
    );

    const fieldMapping = {};
    apiFields.forEach((apiField, idx) => {
      fieldMapping[apiField] = userFriendlyFields[idx] || apiField;
    });

    // For chart labels (all except KPI):
    const labels = data.map((row) => row.timestamp);

    // --------------------------------------------
    // KPI
    // --------------------------------------------
    if (chart_type === "kpi") {
      // Choose the first API field as the KPI value
      const firstField = apiFields[0];
      if (!firstField) {
        return <div>No KPI data</div>;
      }

      const kpiVal = data[0][firstField];
      const kpiLabel = fieldMapping[firstField] || "KPI Value";
      const isNumber = typeof kpiVal === "number" && !isNaN(kpiVal);

      return (
        <KPIContainer>
          <div className="kpi-title" style={{ textTransform: "capitalize" }}>
            {kpiLabel}
          </div>
          {isNumber ? (
            <>
              <div className="kpi-value">{kpiVal.toFixed(2)}</div>
              {/* <span className="kpi-units">A</span> */}
            </>
          ) : (
            <div>No KPI data</div>
          )}
        </KPIContainer>
      );
    }

    // --------------------------------------------
    // MULTI-LINE
    // --------------------------------------------
    if (chart_type === "multiline line") {
      // Build multiple datasets, one per field
      const datasets = apiFields.map((apiField, idx) => ({
        label: fieldMapping[apiField],
        data: data.map((row) => row[apiField] ?? null),
        borderWidth: 2,
        borderColor: [
          "#6b3ceb",
          "#e63946",
          "#ffa600",
          "#00bfa5",
          "#2d98da",
          "#eb3b5a",
        ][idx % 6],
        backgroundColor: "rgba(107, 60, 235, 0.1)",
        spanGaps: true,
      }));

      const chartData = { labels, datasets };
      console.log("Multi-Line Chart Data:", chartData);

      return (
        <div className="stacked-bar-container">
          <div className="card shadow mb-4">
            <div className="card-body">
              <div className="row">
                <div className="title">Comparison of trends</div>
                <div className="controls">
                  <ToggleButtons
                    dateRange={dateRange}
                    timeperiod={timeperiod}
                    setTimeperiod={setTimeperiod}
                  />
                </div>
              </div>
              {chartData.labels && chartData.labels.length > 0 ? (
                <div className="chart-size">
                  <Line data={chartData} options={options} />
                </div>
              ) : (
                <div>No data available for the selected range.</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // --------------------------------------------
    // DONUT
    // --------------------------------------------
    if (chart_type === "donut") {
      // Use the first data row for aggregated categories
      const donutObj = data[0];
      // Each API field becomes a slice
      const chartLabels = apiFields.map((apiField) => fieldMapping[apiField]);
      const chartValues = apiFields.map((apiField) => donutObj[apiField] || 0);

      const chartData = {
        labels: chartLabels,
        datasets: [
          {
            data: chartValues,
            backgroundColor: ["#6b3ceb", "#e63946", "#ffa600", "#00bfa5"],
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      };

      return (
        <div className="stacked-bar-container">
          <div className="card shadow mb-4">
            <div className="card-body">
              <div className="row">
                <div className="title">Donut Chart Showing Comparison</div>
                <div className="controls">
                  <ToggleButtons
                    dateRange={dateRange}
                    timeperiod={timeperiod}
                    setTimeperiod={setTimeperiod}
                  />
                </div>
              </div>
              {chartData.labels.length > 0 ? (
                <div className="chart-size">
                  <Doughnut data={chartData} options={options} />
                </div>
              ) : (
                <div>No data available.</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // --------------------------------------------
    // SINGLE LINE / BAR
    // --------------------------------------------
    // We'll just use the first mapped field for a single line or bar
    const firstField = apiFields[0];
    if (!firstField) {
      return <div>No chart data available</div>;
    }

    const singleDataset = [
      {
        label: fieldMapping[firstField],
        data: data.map((row) => row[firstField] ?? null),
        borderWidth: 2,
        borderColor: "#6b3ceb",
        backgroundColor: "rgba(107, 60, 235, 0.4)",
        spanGaps: true,
      },
    ];

    const chartData = { labels, datasets: singleDataset };

    switch (chart_type) {
      case "line":
        return (
          <div className="stacked-bar-container">
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="title">Trends Chart</div>
                  <div className="controls">
                    <ToggleButtons
                      dateRange={dateRange}
                      timeperiod={timeperiod}
                      setTimeperiod={setTimeperiod}
                    />
                  </div>
                </div>
                {chartData.labels && chartData.labels.length > 0 ? (
                  <div className="chart-size">
                    <Line data={chartData} options={options} />
                  </div>
                ) : (
                  <div>No data available.</div>
                )}
              </div>
            </div>
          </div>
        );
      case "bar":
        return (
          <div className="stacked-bar-container">
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="title">Bar Chart</div>
                  <div className="controls">
                    <ToggleButtons
                      dateRange={dateRange}
                      timeperiod={timeperiod}
                      setTimeperiod={setTimeperiod}
                    />
                  </div>
                </div>
                {chartData.labels && chartData.labels.length > 0 ? (
                  <div className="chart-size">
                    <Bar data={chartData} options={options} />
                  </div>
                ) : (
                  <div>No data available.</div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return <div>Unsupported chart type: {chart_type}</div>;
    }
  };

  // 5) JSX Return
  return (
    <Container>
      <TitleSty>Chat more with AI</TitleSty>

      <InputSection>
        <PromptInput
          type="text"
          placeholder="Enter your question here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>Search</SearchButton>
      </InputSection>

      {loading ? (
        <Loader />
      ) : (
        responseData && (
          <>
            <SubHeading>AI Response</SubHeading>
            <p>
              <Label>Question:</Label> {responseData.question}
            </p>
            <p>
              <Label>SQL Query:</Label>
            </p>
            <Pre>{responseData.rag_sql}</Pre>
            <p>
              <Label>Chart Type:</Label> {responseData.chart_type}
            </p>
            <p>
              <Label>Fields:</Label> {responseData.fields?.join(", ")}
            </p>
            <div>{renderChart()}</div>
          </>
        )
      )}
    </Container>
  );
};

export default AI;
