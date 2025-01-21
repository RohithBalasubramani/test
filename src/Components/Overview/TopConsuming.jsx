import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// ----- STYLED COMPONENTS ----- //
const Container = styled.div`
  width: 100vw;
  height: 20vh;
  padding: 16px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.div`
  font-family: "DM Sans", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

// ----- MAIN COMPONENT ----- //
const StackedHeatmapChart = ({
  data,
  fields = [
    { key: "P1_AMFS_Transformer2", label: "Transformer 2" },
    { key: "P1_AMFS_Generator2", label: "Generator 2" },
    { key: "P1_AMFS_Outgoing2", label: "Outgoing 2" },
    { key: "P1_AMFS_APFC2", label: "APFC 2" },
    { key: "P1_AMFS_Transformer3", label: "Transformer 3" },
  ],
}) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    try {
      // Safely extract "resampled data"
      const resampledData = data?.["resampled data"] ?? [];

      if (!Array.isArray(resampledData) || resampledData.length === 0) {
        // No valid data available
        setChartData(null);
        return;
      }

      // Normalize field keys to lowercase
      const normalizedFields = fields.map((field) => ({
        ...field,
        key: field.key.toLowerCase(),
      }));

      // Sum up consumption for each field
      let consumptionArray = normalizedFields.map((field) => {
        const totalValue = resampledData.reduce((sum, item) => {
          // Make item keys lowercase to match field.key
          const lowerItem = Object.fromEntries(
            Object.entries(item).map(([k, v]) => [k.toLowerCase(), v])
          );
          return sum + (lowerItem[field.key] || 0);
        }, 0);

        return {
          label: field.label,
          key: field.key,
          value: totalValue,
        };
      });

      // Filter out zero values
      consumptionArray = consumptionArray.filter((item) => item.value > 0);

      // Sort in descending order
      consumptionArray.sort((a, b) => b.value - a.value);

      // Take top 5 only
      const topFive = consumptionArray.slice(0, 5);

      if (topFive.length === 0) {
        // Means all fields were zero or invalid
        setChartData(null);
        return;
      }

      // Build a single label for the stacked bar
      const labels = ["Energy Sources"];

      // Each source becomes its own dataset segment
      const datasets = topFive.map((item, index) => {
        // Use a nice color palette or generate dynamic colors
        const backgroundColor = `hsl(${(index * 60) % 360}, 70%, 60%)`;
        const hoverColor = `hsl(${(index * 60) % 360}, 70%, 50%)`;

        return {
          label: item.label,
          data: [item.value], // Single label => single data point
          backgroundColor,
          hoverBackgroundColor: hoverColor,
        };
      });

      // Final chart data
      setChartData({
        labels,
        datasets,
      });
    } catch (error) {
      console.error("Error building chart data:", error);
      setChartData(null);
    }
  }, [data, fields]);

  // If chartData is null, show a fallback message
  if (!chartData) {
    return (
      <Container>
        <Title>Top 5 Energy Sources</Title>
        <div style={{ padding: "1rem", fontFamily: "DM Sans" }}>
          No valid data available.
        </div>
      </Container>
    );
  }

  // Chart options for a single stacked horizontal bar
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            family: "DM Sans",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.x || 0;
            return `${label}: ${value.toFixed(2)} KWh`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          font: {
            family: "DM Sans",
            size: 12,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      y: {
        stacked: true,
        ticks: {
          font: {
            family: "DM Sans",
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Container>
      <Title>Top 5 Energy Sources</Title>
      <ChartWrapper>
        <Bar data={chartData} options={options} />
      </ChartWrapper>
    </Container>
  );
};

export default StackedHeatmapChart;
