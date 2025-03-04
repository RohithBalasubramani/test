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

  // 3) Extract KPI
  const extractKPIValue = (ragResult) => {
    try {
      if (!ragResult || typeof ragResult !== "string") return null;
      const match = ragResult.match(/[-+]?[0-9]*\\.?[0-9]+/);
      return match ? parseFloat(match[0]) : null;
    } catch (e) {
      console.error("Error extracting KPI value:", e);
      return null;
    }
  };

  // 4) Render Chart or KPI
  const renderChart = () => {
    if (!responseData) return null;

    let { data, chart_type, fields, rag_result } = responseData;
    if (!Array.isArray(data)) data = [];

    // Normalize chart type
    chart_type = chart_type.toLowerCase().replace(" chart", "").trim();

    // KPI
    if (chart_type === "kpi") {
      const kpiVal = extractKPIValue(rag_result);
      return (
        <KPIContainer>
          <div className="kpi-title">{fields?.[0] || "KPI Value"}</div>
          {kpiVal !== null ? (
            <>
              <div className="kpi-value">{kpiVal.toFixed(2)}</div>
              <span className="kpi-units">A</span>
            </>
          ) : (
            <div>No KPI data</div>
          )}
        </KPIContainer>
      );
    }

    // Multi-Line
    if (chart_type === "multiline line") {
      if (!data.length) {
        return <div>No chart data available</div>;
      }

      // ✅ Resample Data
      data = resampleData(data, timeperiod);
      const labels = data.map((row) => row.timestamp);

      // ✅ Extract numeric field names from `data`
      const apiFields = Object.keys(data[0]).filter(
        (key) => key !== "timestamp"
      );

      // ✅ Ensure we have a valid `fields[]` from API response
      const userFriendlyFields = fields.filter(
        (f) => f.toLowerCase() !== "timestamp"
      );

      // ✅ Create a mapping between `apiFields` (e.g. "Value 1", "Value 2") and `userFriendlyFields` (e.g. "Transformer 1 Current")
      const fieldMapping = {};
      apiFields.forEach((apiField, idx) => {
        fieldMapping[apiField] = userFriendlyFields[idx] || apiField; // Fallback to API field name if no mapping found
      });

      // ✅ Build datasets dynamically
      const datasets = apiFields.map((apiField, idx) => ({
        label: fieldMapping[apiField], // Use user-friendly name
        data: data.map((row) => row[apiField] ?? null), // Extract correct values
        borderWidth: 2,
        borderColor: [
          "#6b3ceb",
          "#e63946",
          "#ffa600",
          "#00bfa5",
          "#2d98da",
          "#eb3b5a",
        ][idx % 6], // Color palette
        backgroundColor: "rgba(107, 60, 235, 0.1)",
        spanGaps: true, // Prevent broken lines
      }));

      const chartData = { labels, datasets };
      console.log("Multi-Line Chart Data:", chartData);

      return (
        <div>
          <ToggleButtons
            dateRange={dateRange}
            timeperiod={timeperiod}
            setTimeperiod={setTimeperiod}
          />
          <Line data={chartData} />
        </div>
      );
    }

    // Donut
    if (chart_type === "donut") {
      if (!data.length) {
        return <div>No chart data available</div>;
      }
      // Typically for aggregated data
      const donutObj = data[0];
      const chartLabels = fields;
      const chartValues = chartLabels.map((label, idx) => {
        const key = `Value ${idx + 1}`;
        return donutObj[key] || 0;
      });

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
      return <Doughnut data={chartData} />;
    }

    // Single line / bar
    if (!data.length) return <div>No chart data available</div>;
    data = resampleData(data, timeperiod);
    const labels = data.map((row) => row.timestamp);
    const numericFields = fields.filter((f) => f.toLowerCase() !== "timestamp");
    const firstField = numericFields[0] || "Value";

    const chartData = {
      labels,
      datasets: [
        {
          label: firstField,
          data: data.map((row) => row[firstField]),
          borderWidth: 2,
          borderColor: "#6b3ceb",
          backgroundColor: "rgba(107, 60, 235, 0.4)",
        },
      ],
    };

    switch (chart_type) {
      case "line":
        return (
          <div>
            <ToggleButtons
              dateRange={dateRange}
              timeperiod={timeperiod}
              setTimeperiod={setTimeperiod}
            />
            <Line data={chartData} />
          </div>
        );
      case "bar":
        return (
          <div>
            <ToggleButtons
              dateRange={dateRange}
              timeperiod={timeperiod}
              setTimeperiod={setTimeperiod}
            />
            <Bar data={chartData} />
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
            <ResultContainer>{renderChart()}</ResultContainer>
          </>
        )
      )}
    </Container>
  );
};

export default AI;
