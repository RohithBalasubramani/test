import React, { useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  PolarAngleAxis,
  Tooltip,
} from "recharts";
import styled from "styled-components";

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

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: #333;
  margin-bottom: 1rem;
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

// Main Component
const AMFgaugeStacked = ({ feeders }) => {
  const totalPower = feeders.reduce((sum, feeder) => sum + feeder.value, 0);
  const [selectedFeeder, setSelectedFeeder] = useState(null);

  // Default colors for feeders
  const defaultColors = [
    "#FF4500",
    "#FFD700",
    "#1E90FF",
    "#32CD32",
    "#FF69B4",
    "#8A2BE2",
    "#00CED1",
  ];

  // Map feeders with colors dynamically
  const data = feeders.map((feeder, index) => ({
    name: feeder.name,
    value: feeder.value,
    fill: defaultColors[index % defaultColors.length],
  }));

  // Handle Click Event on Chart
  const handleClick = (e) => {
    if (e && e.activePayload) {
      const clickedData = e.activePayload[0]?.payload;
      setSelectedFeeder(clickedData?.name || null);
    }
  };

  return (
    <Container>
      {/* <Title>B AC Power Distribution</Title> */}
      <Card>
        <RadialBarChart
          width={400}
          height={400}
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="100%"
          barSize={20}
          data={data}
          startAngle={180}
          endAngle={0}
          onClick={handleClick}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, totalPower || 1]} // Avoid division by 0
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            minAngle={15}
            clockWise
            dataKey="value"
            cornerRadius={10}
            background
          />
          {/* <Legend
            iconSize={10}
            layout="horizontal"
            verticalAlign="bottom"
            align="center"

          /> */}
          <Tooltip />
        </RadialBarChart>
        <CenterText onClick={() => setSelectedFeeder(null)}>
          {selectedFeeder ? (
            <>
              {selectedFeeder} <br />
              {data.find((d) => d.name === selectedFeeder)?.value || 0} kW
            </>
          ) : (
            <>Total: {totalPower.toLocaleString()} kW</>
          )}
        </CenterText>
      </Card>
    </Container>
  );
};

export default AMFgaugeStacked;
