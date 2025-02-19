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

// Register chart components with ChartJS
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
  margin: 0 auto; /* center the container */
  background-color: #f9f9fa; /* light background */
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
  overflow-x: auto; /* scroll horizontally if needed */
`;

/////////////////////////////////////////////////////
// DUMMY DATA
/////////////////////////////////////////////////////

const dummyData = {
  question: "responding",
  rag_sql:
    "SELECT date, total_energy\nFROM OG1_Consumption\nWHERE date BETWEEN '2021-07-01' AND '2021-07-31'\nORDER BY date ASC;",
  rag_result:
    "(psycopg2.errors.UndefinedTable) relation \"og1_consumption\" does not exist\nLINE 2: FROM OG1_Consumption\n             ^\n\n[SQL: SELECT date, total_energy\nFROM OG1_Consumption\nWHERE date BETWEEN '2021-07-01' AND '2021-07-31'\nORDER BY date ASC;]\n(Background on this error at: https://sqlalche.me/e/20/f405)",
  chart_type: "Line", // Can be "Line", "Bar" or "Donut"/"Doughnut"
  columns: "Date,Total Energy",
  json_output: JSON.stringify([
    ["2021-07-01", 100],
    ["2021-07-02", 150],
    ["2021-07-03", 120],
    ["2021-07-04", 180],
  ]),
};

/////////////////////////////////////////////////////
// AI COMPONENT
/////////////////////////////////////////////////////

const AI = ({ question }) => {
  const [prompt, setPrompt] = useState(question || "");
  const [responseData, setResponseData] = useState(null);

  // On "Search" click, load the DUMMY data into state
  const handleSearch = () => {
    if (!prompt.trim()) {
      alert("Please enter a question or prompt!");
      return;
    }

    // In a real app, you'd call an API here:
    // const { data } = await axios.post('/api/ask', { prompt });
    // setResponseData(data);

    // For now, we're just using the dummy data:
    setResponseData(dummyData);
  };

  // Chart renderer
  const renderChart = () => {
    if (!responseData) return null;

    const { json_output, chart_type, columns } = responseData;
    let chartDataArray = [];

    try {
      chartDataArray =
        typeof json_output === "string" ? JSON.parse(json_output) : json_output;
    } catch (error) {
      console.error("Error parsing json_output:", error);
      return <div>Error in chart data</div>;
    }

    if (!Array.isArray(chartDataArray) || chartDataArray.length === 0) {
      return <div>No chart data available</div>;
    }

    // Extract labels & data
    const labels = chartDataArray.map((entry) => entry[0]);
    const dataPoints = chartDataArray.map((entry) => entry[1]);

    // Setup chart.js data object
    const chartData = {
      labels,
      datasets: [
        {
          label: columns || "Data",
          data: dataPoints,
          backgroundColor: "rgba(107, 60, 235, 0.4)",
          borderColor: "#6b3ceb",
          borderWidth: 2,
        },
      ],
    };

    // Return appropriate chart
    switch (chart_type) {
      case "Line":
        return <Line data={chartData} />;
      case "Bar":
        return <Bar data={chartData} />;
      case "Donut":
      case "Doughnut":
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
          type="text"
          placeholder="Enter your question here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>Search</SearchButton>
      </InputSection>

      {responseData && (
        <ResultContainer>
          <SubHeading>AI Response</SubHeading>
          <p>
            <Label>Question:</Label> {responseData.question}
          </p>

          <p>
            <Label>SQL Query:</Label>
          </p>
          <Pre>{responseData.rag_sql}</Pre>

          <p>
            <Label>SQL Error:</Label>
          </p>
          <Pre>{responseData.rag_result}</Pre>

          <p>
            <Label>Chart Type:</Label> {responseData.chart_type}
          </p>
          <p>
            <Label>Columns:</Label> {responseData.columns}
          </p>

          <div style={{ marginTop: "1.5rem" }}>{renderChart()}</div>
        </ResultContainer>
      )}
    </Container>
  );
};

export default AI;
