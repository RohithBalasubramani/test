import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { VictoryPie, VictoryLabel } from "victory";
import { Launch } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";

// ──────────────────────────────────────────────────────────────────────────────
// Styled Components
// ──────────────────────────────────────────────────────────────────────────────
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vh;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  height: 10vh;
`;

const RatingContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  background: #f0f0f0;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
`;

const GaugeCont = styled.div`
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.div`
  font-weight: bold;
  color: #333;
  margin-right: 8px;
  text-align: center;
  margin-bottom: 2vh;
`;

const FigureText = styled.div`
  font-size: 14px;
  margin-top: -8vh;
  line-height: 1.2;
  text-align: center;
  span:first-child {
    font-weight: bold;
    font-size: 18px;
  }
`;

const KPIContainer = styled.div`
  background: #ffffff;
  width: 20vw;
  height: 59vh;
  min-width: 220px;
  padding: 2vh;
  box-shadow: 7px 2px 17px 0px #c7c7c71a, 29px 10px 31px 0px #c7c7c717,
    66px 22px 42px 0px #c7c7c70d;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
`;

// ──────────────────────────────────────────────────────────────────────────────
// Utility function: Returns multiplier for rated energy based on `period`
// ──────────────────────────────────────────────────────────────────────────────
function getMultiplier(period) {
  switch (period) {
    case "D": // Day
      return 24;
    case "W": // Week
      return 24 * 7;
    case "M": // Month (approx. 30 days)
      return 24 * 30;
    case "Y": // Year (approx. 365 days)
      return 24 * 365;
    default: // Hour or fallback
      return 1;
  }
}

/**
 * AMFgauge Component
 *    - Displays total usage vs. a maximum rating that depends on time `period`.
 *    - Marker adjusts dynamically with the period.
 *    - Center shows percentage, usage, and remaining capacity.
 */
const AMFgauge = ({ kpidata, feederRatings, period }) => {
  const [energy, setEnergy] = useState(0); // actual usage from API
  const baseRating = feederRatings?.energy || 50; // fallback if not provided
  const multiplier = getMultiplier(period);
  const maxRating = baseRating * multiplier; // max capacity for the given period
  const markerValue = 35 * multiplier; // Marker position dynamically scaled

  // Fetch data
  const fetchData = () => {
    try {
      if (
        kpidata &&
        kpidata["resampled data"] &&
        Array.isArray(kpidata["resampled data"])
      ) {
        const energyArray = kpidata["resampled data"].map(
          (item) => item["app_energy_export"] || 0
        );
        const sumOfEnergyArray = energyArray.reduce((acc, val) => acc + val, 0);
        setEnergy(sumOfEnergyArray);
      } else {
        setEnergy(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setEnergy(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [kpidata]);

  // Convert usage to a percentage for the gauge (cap at 100%)
  const usagePercentage = Math.min((energy / maxRating) * 100, 100);
  const remaining = maxRating - energy;

  return (
    <Container>
      <KPIContainer>
        <Title>Total Energy Usage</Title>
        <Top>
          {/* Ratings Section */}
          <RatingContainer>
            {feederRatings && (
              <>
                <div>Rated Energy: {feederRatings.energy} kWh /hr</div>
                <div>Voltage: {feederRatings.voltage} V</div>
                <div>Current: {feederRatings.current} A</div>
                <div>
                  Subsidized Limit: {markerValue}
                  {"kWh"}
                  {/* e.g., "D", "W", "M", "H" */}
                </div>
              </>
            )}
          </RatingContainer>

          {/* <IconButton
            aria-label="open-link"
            size="small"
            component={Link}
            to="/eb"
          >
            <Launch fontSize="inherit" />
          </IconButton> */}
        </Top>

        {/* Gauge */}
        <GaugeCont>
          <svg viewBox="0 0 400 400" width="300" height="300">
            {/* Main gauge using VictoryPie (2-slice approach) */}
            <VictoryPie
              standalone={false}
              innerRadius={140}
              radius={180}
              startAngle={-120}
              endAngle={120}
              data={[
                { x: "Usage", y: usagePercentage },
                { x: "Remaining", y: 100 - usagePercentage },
              ]}
              labels={() => null}
              colorScale={["#2E7D32", "#e0e0e0"]}
            />

            {/* Marker line (orange) */}
            <line
              x1="200"
              y1="200"
              x2={
                200 +
                180 *
                  Math.cos(
                    (180 - (markerValue / maxRating) * 180) * (Math.PI / 180)
                  )
              }
              y2={
                200 -
                180 *
                  Math.sin(
                    (180 - (markerValue / maxRating) * 180) * (Math.PI / 180)
                  )
              }
              stroke="orange"
              strokeWidth={3}
            />

            {/* Marker label ("35 kWh") */}
            <text
              x={
                200 +
                200 *
                  Math.cos(
                    (180 - (markerValue / maxRating) * 180) * (Math.PI / 180)
                  )
              }
              y={
                200 -
                200 *
                  Math.sin(
                    (180 - (markerValue / maxRating) * 180) * (Math.PI / 180)
                  )
              }
              fill="orange"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
            >
              {markerValue.toFixed(2)} kWh
            </text>

            {/* Center text (VictoryLabel) showing percentage and usage details */}
            <VictoryLabel
              textAnchor="middle"
              style={{ fontSize: 16, fontWeight: "bold" }}
              x={200}
              y={180}
              text={`Usage: ${usagePercentage.toFixed(1)}%`}
            />
            <VictoryLabel
              textAnchor="middle"
              style={{ fontSize: 14, fill: "#555" }}
              x={200}
              y={200}
              text={`Consumed: ${energy.toFixed(2)} kWh`}
            />
            <VictoryLabel
              textAnchor="middle"
              style={{ fontSize: 14, fill: "#999" }}
              x={200}
              y={220}
              text={`Remaining: ${remaining.toFixed(2)} kWh`}
            />
          </svg>
        </GaugeCont>

        {/* Usage text */}
        <FigureText>
          <span>{energy.toFixed(2)}</span> <span>kWh</span>
        </FigureText>
      </KPIContainer>
    </Container>
  );
};

export default AMFgauge;
