import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import styled from "styled-components";

// Register only the required Chart.js components globally
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// ----- STYLED COMPONENTS ----- //
const Container = styled.div`
  height: 18vh;
  padding: 2vh;
  width: fit-content;
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
  width: 77vw;
  height: 50%;
  position: relative;
  margin-bottom: 2vh;
`;

// ----- MAIN COMPONENT ----- //
const StackedHeatmapChart = ({
  data,
  backgroundColors = [],
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
      const resampledData = data?.["resampled data"] ?? [];

      if (!Array.isArray(resampledData) || resampledData.length === 0) {
        setChartData(null);
        return;
      }

      const normalizedFields = fields.map((field) => ({
        ...field,
        key: field.key.toLowerCase(),
      }));

      let consumptionArray = normalizedFields.map((field) => {
        const totalValue = resampledData.reduce((sum, item) => {
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

      consumptionArray = consumptionArray.filter((item) => item.value > 0);

      consumptionArray.sort((a, b) => b.value - a.value);

      const topFive = consumptionArray.slice(0, 5);

      if (topFive.length === 0) {
        setChartData(null);
        return;
      }

      const totalConsumption = topFive.reduce(
        (sum, item) => sum + item.value,
        0
      );

      const datasets = topFive.map((item, index) => {
        const percentage = ((item.value / totalConsumption) * 100).toFixed(1);
        const backgroundColor =
          backgroundColors[index] ||
          `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)}, 0.6)`;

        return {
          label: item.label,
          data: [item.value],
          backgroundColor,
          hoverBackgroundColor: backgroundColor,
          percentage,
        };
      });

      setChartData({
        labels: [""], // Single category for stacked horizontal bar
        datasets,
      });
    } catch (error) {
      console.error("Error building chart data:", error);
      setChartData(null);
    }
  }, [data, fields, backgroundColors]);

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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      datalabels: {
        anchor: "center",
        align: "center",
        color: "#ffffff",
        formatter: (value, context) => {
          const label = context.dataset.label;
          const percentage = context.dataset.percentage;
          return `${label}\n${percentage}%`;
        },
        font: {
          size: 14,
          family: "DM Sans",
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(2)} KWh`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        display: false, // Hide x-axis
      },
      y: {
        stacked: true,
        display: false, // Hide y-axis
      },
    },
  };

  return (
    <Container>
      <Title>Top 5 Energy Sources</Title>
      <ChartWrapper>
        <Bar
          data={chartData}
          options={options}
          plugins={[ChartDataLabels]} // Attach ChartDataLabels here, specifically for this chart
        />
      </ChartWrapper>
    </Container>
  );
};

export default StackedHeatmapChart;
