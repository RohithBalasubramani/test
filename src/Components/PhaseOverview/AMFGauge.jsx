import React, { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, Tooltip } from "recharts";
import styled from "styled-components";
import dayjs from "dayjs";
import { OverviewSource } from "../../phasedata";

// ──────────────────────────────────────────────────────────────────────────────
// Styled Components
// ──────────────────────────────────────────────────────────────────────────────
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
 *
 * Props:
 *  - startDate  : user-selected or default start date/time
 *  - endDate    : user-selected or default end date/time
 *  - timeperiod : resampling period (e.g., "5min", "15min", "1H")
 */
const AMFgaugeStacked = ({ startDate, endDate, timeperiod }) => {
  const [aggregatedData, setAggregatedData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);

  /**
   * 🛠️ Fetch and Aggregate Feeder Data from API, using "resampled data"
   */
  const fetchFeederData = async () => {
    try {
      // 1. Validate or fallback to entire day
      const validStartDate = startDate
        ? dayjs(startDate).toISOString()
        : dayjs().startOf("day").toISOString();

      const validEndDate = endDate
        ? dayjs(endDate).endOf("day").toISOString()
        : dayjs().endOf("day").toISOString();

      // 2. Call the delta consolidated endpoint
      const url = `https://neuract.org/analytics/deltaconsolidated/?start_date_time=${validStartDate}&end_date_time=${validEndDate}&resample_period=${timeperiod}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // 3. Extract "resampled data" and normalize keys to lowercase
      const resampledData = result?.["resampled data"] || [];
      const normalizedResampledData = resampledData.map((row) => {
        const normalizedRow = {};
        Object.keys(row).forEach((key) => {
          normalizedRow[key.toLowerCase()] = row[key];
        });
        return normalizedRow;
      });

      // 4. For each label in OverviewSource, sum the relevant columns
      //    across the entire "resampled data" array
      const aggregated = {};

      OverviewSource.forEach((source) => {
        let totalForSource = 0;

        source.apis.forEach((api) => {
          // Extract column from API URL
          const segments = api.split("/");
          const col = segments[segments.length - 2]?.toLowerCase();

          // Sum across ALL rows in normalizedResampledData
          normalizedResampledData.forEach((row) => {
            if (row[col] !== undefined) {
              let value = Number(row[col]) || 0;

              // 🚀 Divide Solar values by 1000
              if (source.label === "Solar") {
                value = value / 1000;
              }

              totalForSource += value;
            }
          });
        });

        aggregated[source.label] = totalForSource;
      });

      console.log("Aggregated Feeder Data:", aggregated);
      setAggregatedData(aggregated);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────────
  //   useEffect: Run fetchFeederData whenever date/timeperiod changes
  // ──────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchFeederData();
    // eslint-disable-next-line
  }, [startDate, endDate, timeperiod]);

  // ──────────────────────────────────────────────────────────────────────────────
  //   Prepare Chart Data
  // ──────────────────────────────────────────────────────────────────────────────
  const chartData = Object.entries(aggregatedData).map(
    ([category, value], i) => {
      return {
        name: category,
        value,
        fill: ["#5630BC", "#8963EF", "#C4B1F7"][i % 3],
      };
    }
  );

  // Sum all categories to define the domain for radial chart
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  // When user clicks on a portion of the chart
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
            domain={[0, totalValue || 1]}
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

      <LegendContainer>
        {chartData.map((item, index) => (
          <LegendItem key={index}>
            <LegendColorBox style={{ background: item.fill }} />
            <LegendLabel>
              {item.name}: {item.value.toFixed(2)} MWh
            </LegendLabel>
          </LegendItem>
        ))}
      </LegendContainer>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}
    </Container>
  );
};

export default AMFgaugeStacked;
