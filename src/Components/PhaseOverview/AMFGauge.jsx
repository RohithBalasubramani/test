import React, { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, Tooltip } from "recharts";
import styled from "styled-components";
import dayjs from "dayjs";

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50vw;
  height: 50vh;
  background: #ffffff;
  padding: 4vh;
  border-radius: 10px;
  box-shadow: 7px 2px 17px 0px #c7c7c71a, 29px 10px 31px 0px #c7c7c717,
    66px 22px 42px 0px #c7c7c70d;
`;

const Card = styled.div`
  text-align: center;
  position: relative;
  height: 40vh;
`;

const CenterText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
`;

// Data Source Definition
export const OverviewSource = [
  {
    id: "DG",
    label: "Diesel Generator",
    apis: [
      "http://14.96.26.26:8080/api/p1_amfs_generator1/",
      "http://14.96.26.26:8080/api/p1_amfs_generator2/",
      "http://14.96.26.26:8080/api/p1_amfs_generator3/",
      "http://14.96.26.26:8080/api/p1_amfs_generator4/",
    ],
  },
  {
    id: "EB",
    label: "EB Supply",
    apis: [
      "http://14.96.26.26:8080/api/p1_amfs_transformer1/",
      "http://14.96.26.26:8080/api/p1_amfs_transformer2/",
      "http://14.96.26.26:8080/api/p1_amfs_transformer3/",
      "http://14.96.26.26:8080/api/p1_amfs_transformer4/",
    ],
  },
  {
    id: "Solar",
    label: "AMF 2a",
    apis: [
      "http://14.96.26.26:8080/api/p1_inverter1/",
      "http://14.96.26.26:8080/api/p1_inverter2/",
      "http://14.96.26.26:8080/api/p1_inverter3/",
      "http://14.96.26.26:8080/api/p1_inverter4/",
    ],
  },
];

const AMFgaugeStacked = () => {
  const [aggregatedData, setAggregatedData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);

  /**
   * 🛠️ Fetch and Aggregate Feeder Data from API
   */
  const fetchFeederData = async () => {
    try {
      const response = await fetch(
        `http://14.96.26.26:8080/analytics/deltaconsolidated/?start_date_time=${dayjs()
          .startOf("day")
          .toISOString()}&end_date_time=${dayjs()
          .endOf("day")
          .toISOString()}&resample_period=H`
      );
      const result = await response.json();

      // Extract resampled data for aggregation
      const resampledData = result?.["resampled data"] || [];
      const aggregated = {};

      OverviewSource.forEach((source) => {
        aggregated[source.label] = source.apis.reduce((sum, api) => {
          const key = api.split("/api/")[1]?.replace(/\//g, "");
          const feederData = resampledData.find((entry) => entry[key]);

          if (feederData) {
            sum += feederData[key] || 0;
          }
          return sum;
        }, 0);
      });

      console.log("Aggregated Feeder Data:", aggregated);
      setAggregatedData(aggregated);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchFeederData();
  }, []);

  // Map aggregated data to chart format
  const chartData = Object.entries(aggregatedData).map(
    ([category, value], index) => ({
      name: category,
      value,
      fill: ["#FF4500", "#FFD700", "#1E90FF"][index % 3], // Colors for categories
    })
  );

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  const handleClick = (e) => {
    if (e && e.activePayload) {
      const clickedData = e.activePayload[0]?.payload;
      setSelectedCategory(clickedData?.name || null);
    }
  };

  return (
    <Container>
      {error ? (
        <div style={{ color: "red" }}>Error: {error}</div>
      ) : (
        <Card>
          <RadialBarChart
            width={400}
            height={400}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="100%"
            barSize={20}
            data={chartData}
            startAngle={180}
            endAngle={0}
            onClick={handleClick}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, totalValue || 1]} // Prevent division by zero
              tick={false}
            />
            <RadialBar
              minAngle={15}
              clockWise
              dataKey="value"
              cornerRadius={10}
              background
            />
            <Tooltip />
          </RadialBarChart>
          <CenterText onClick={() => setSelectedCategory(null)}>
            {selectedCategory ? (
              <>
                {selectedCategory} <br />
                {chartData.find((d) => d.name === selectedCategory)?.value ||
                  0}{" "}
                kW
              </>
            ) : (
              <>Total: {totalValue.toLocaleString()} kW</>
            )}
          </CenterText>
        </Card>
      )}
    </Container>
  );
};

export default AMFgaugeStacked;
