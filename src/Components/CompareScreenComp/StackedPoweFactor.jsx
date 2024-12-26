import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GaugeChart from "react-gauge-chart";

// Styled Components for Consistent Card Design
const Container = styled.div`
  display: flex;
  gap: 2vw;
  margin-bottom: 2vh;
`;

const Card = styled.div`
  background: #ffffff;
  height: 32vh;
  width: 20vw;
  padding: 3vh;
  box-shadow: 7px 2px 17px 0px #c7c7c71a, 29px 10px 31px 0px #c7c7c717,
    66px 22px 42px 0px #c7c7c70d;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h6`
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const GaugeCont = styled.div`
  margin-left: auto;
  margin-right: auto;
`;

const Legend = styled.div`
  margin-top: 1vh;
  display: flex;
  justify-content: space-around;
  font-size: 12px;
  color: #555;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5vw;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

// Utility Function to Get Colors
const getColor = (value) => {
  if (value >= 95) return "#55BF3B"; // Good (Green)
  if (value >= 85) return "#DDDF0D"; // Average (Yellow)
  return "#DF5353"; // Bad (Red)
};

// Main Component
const StackedPowerFactorGauge = ({ feeders }) => {
  const [powerFactorValues, setPowerFactorValues] = useState([]);

  useEffect(() => {
    // Map feeder data into percentage format
    const mappedFeeders = feeders.map((feeder) => ({
      name: feeder.name,
      value: feeder.value / 100, // Convert percentage to decimal for GaugeChart
      color: getColor(feeder.value),
    }));
    setPowerFactorValues(mappedFeeders);
  }, [feeders]);

  // Calculate Total for Scaling
  const totalValue = powerFactorValues.reduce(
    (sum, feeder) => sum + feeder.value,
    0
  );

  return (
    <Card>
      <Top>
        <Title>Power Factor</Title>
      </Top>

      <GaugeCont>
        <GaugeChart
          id="stacked-power-factor-gauge"
          nrOfLevels={powerFactorValues.length}
          arcsLength={powerFactorValues.map((feeder) => feeder.value)}
          colors={powerFactorValues.map((feeder) => feeder.color)}
          arcWidth={0.3}
          percent={totalValue}
          textColor="#333333"
          needleColor="gray"
          needleBaseColor="gray"
          formatTextValue={() => ""}
          style={{ width: "150px" }}
        />
      </GaugeCont>

      <Legend>
        {powerFactorValues.map((feeder, index) => (
          <LegendItem key={index}>
            <LegendColor color={feeder.color} />
            {feeder.name}: {(feeder.value * 100).toFixed(0)}%
          </LegendItem>
        ))}
      </Legend>
    </Card>
  );
};

export default StackedPowerFactorGauge;
