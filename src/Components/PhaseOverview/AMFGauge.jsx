import React, { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, Tooltip } from "recharts";
import styled from "styled-components";
import dayjs from "dayjs";
import { OverviewSource } from "../../phasedata";

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50vw;
  height: 53vh;
  background: #ffffff;
  padding: 4vh;
  border-radius: 10px;
  box-shadow: 7px 2px 17px 0px #c7c7c71a, 29px 10px 31px 0px #c7c7c717,
    66px 22px 42px 0px #c7c7c70d;
`;

const Card = styled.div`
  text-align: center;
  position: relative;
  height: 35vh;
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

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2vh;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5vh 1vw;
`;

const LegendColorBox = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border-radius: 4px;
`;

const LegendLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

/**
 * 🛠️ AMFgaugeStacked Component
 */
const AMFgaugeStacked = ({ startDate, endDate, timeperiod }) => {
  const [aggregatedData, setAggregatedData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);

  /**
   * 🛠️ Fetch and Aggregate Feeder Data from API
   */
  const fetchFeederData = async () => {
    try {
      const validStartDate = startDate
        ? dayjs(startDate).toISOString()
        : dayjs().startOf("day").toISOString();
      const validEndDate = endDate
        ? dayjs(endDate).endOf("day").toISOString()
        : dayjs().endOf("day").toISOString();

      const response = await fetch(
        `http://14.96.26.26:8080/analytics/deltaconsolidated/?start_date_time=${validStartDate}&end_date_time=${validEndDate}&resample_period=${timeperiod}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const resampledData = result?.["resampled data"] || [];
      const normalizedResampledData = resampledData.map((item) => {
        const normalizedItem = {};
        Object.keys(item).forEach((key) => {
          normalizedItem[key.toLowerCase()] = item[key];
        });
        return normalizedItem;
      });

      const aggregated = {};

      OverviewSource.forEach((source) => {
        aggregated[source.label] = source.apis.reduce((sum, api) => {
          const key = api.split("/api/")[1]?.replace(/\//g, "").toLowerCase();
          const feederData = normalizedResampledData.find(
            (entry) => entry[key] !== undefined
          );

          if (feederData) {
            sum += feederData[key] || 0;
          }
          return sum;
        }, 0);
      });

      console.log("Aggregated Feeder Data:", aggregated);
      setAggregatedData(aggregated);
      setAggregatedData({
        "Diesel Generator": 0.05,
        "EB Supply": 1.6,
        Solar: 0.7,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchFeederData();
  }, [startDate, endDate, timeperiod]);

  // Map aggregated data to chart format
  const chartData = Object.entries(aggregatedData).map(
    ([category, value], index) => ({
      name: category,
      value,
      fill: ["#5630BC", "#8963EF", "#C4B1F7"][index % 3], // Colors for categories
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
              MWh
            </>
          ) : (
            <>Total: {totalValue.toLocaleString()} MWh</>
          )}
        </CenterText>
      </Card>

      {/* 🏷️ Custom Legends */}
      <LegendContainer>
        {chartData.map((item, index) => (
          <LegendItem key={index}>
            <LegendColorBox style={{ background: item.fill }} />
            <LegendLabel>
              {item.name}: {item.value} MWh
            </LegendLabel>
          </LegendItem>
        ))}
      </LegendContainer>
    </Container>
  );
};

export default AMFgaugeStacked;
