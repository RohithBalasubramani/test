import React, { useState, useEffect } from "react";
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
// import ToggleButtons from "./ToggleButtons"; // Import Toggle Button Component

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

/////////////////////////////////////////////////////
// AI COMPONENT
/////////////////////////////////////////////////////

const AI = ({ question }) => {
  const [prompt, setPrompt] = useState(question || "");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeperiod, setTimeperiod] = useState("H"); // Default: Hour
  const [dateRange, setDateRange] = useState("lastWeek"); // Default: Last Week

  // Function to fetch AI response (WITHOUT time period)
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
        body: JSON.stringify({ question: prompt }), // 🔹 Do NOT send timeperiod
      });

      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      console.error("Error fetching data from AI:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Function to resample data based on selected time period
  const resampleData = (data, timeperiod) => {
    if (!data) return [];

    let groupedData = {};

    data.forEach(({ timestamp, value }) => {
      const date = new Date(timestamp);
      let key;

      switch (timeperiod) {
        case "T": // Minute
          key = date.toISOString().substring(0, 16); // YYYY-MM-DDTHH:MM
          break;
        case "H": // Hourly
          key = date.toISOString().substring(0, 13); // YYYY-MM-DDTHH
          break;
        case "D": // Daily
          key = date.toISOString().substring(0, 10); // YYYY-MM-DD
          break;
        case "W": // Weekly
          const week = `${date.getFullYear()}-W${Math.ceil(
            date.getDate() / 7
          )}`;
          key = week;
          break;
        case "M": // Monthly
          key = date.toISOString().substring(0, 7); // YYYY-MM
          break;
        case "Y": // Yearly
          key = date.getFullYear().toString();
          break;
        default:
          key = date.toISOString().substring(0, 10); // Default: Daily
      }

      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(value);
    });

    return Object.entries(groupedData).map(([timestamp, values]) => ({
      timestamp,
      value: values.reduce((a, b) => a + b, 0) / values.length, // Average for resampling
    }));
  };

  // Chart renderer
  const renderChart = () => {
    if (!responseData) return null;

    let { data, chart_type, fields } = responseData;
    if (!Array.isArray(data) || data.length === 0) {
      return <div>No chart data available</div>;
    }

    // 🔹 Resample the data based on selected time period
    data = resampleData(data, timeperiod);

    // Normalize chart type
    chart_type = chart_type.toLowerCase().replace(" chart", "").trim();

    // Build Chart.js dataset
    const labels = data.map((row) => row.timestamp);
    const dataPoints = data.map((row) => row.value);

    const chartData = {
      labels,
      datasets: [
        {
          label: fields ? fields.join(", ") : "Data",
          data: dataPoints,
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
            <Line data={chartData} />;
          </div>
        );
      case "bar":
        return <Bar data={chartData} />;
      case "donut":
      case "doughnut":
        return <Doughnut data={chartData} />;
      default:
        return <div>Unsupported chart type: {chart_type}</div>;
    }
  };

  return (
    <Container>
      <TitleSty>Chat more with AI</TitleSty>
      <InputSection>
        <PromptInput
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>Search</SearchButton>
      </InputSection>

      {loading ? (
        <Loader />
      ) : (
        responseData && (
          <div>
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
          </div>
        )
      )}
    </Container>
  );
};

export default AI;
