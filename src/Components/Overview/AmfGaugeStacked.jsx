import React, { useState } from "react";
import { RadialBarChart, RadialBar, Legend, PolarAngleAxis } from "recharts";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 50vw;
  height: 30vh;
  background: #ffffff;
  padding: 4vh;

  box-shadow: 7px 2px 17px 0px #c7c7c71a, 29px 10px 31px 0px #c7c7c717,
    66px 22px 42px 0px #c7c7c70d;
`;

const Card = styled.div`
  text-align: center;
  position: relative;
`;

const Title = styled.div`
  font-weight: bold;
  color: #333;
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

const AMFgaugeStacked = ({ feeder1Power, feeder2Power, feeder3Power }) => {
  const totalPower = feeder1Power + feeder2Power + feeder3Power;

  const [selectedFeeder, setSelectedFeeder] = useState(null);

  // Prepare data for RadialBarChart
  const data = [
    { name: "Feeder 1", value: feeder1Power, fill: "#FF4500" },
    { name: "Feeder 2", value: feeder2Power, fill: "#FFD700" },
    { name: "Feeder 3", value: feeder3Power, fill: "#1E90FF" },
  ];

  // Handle click event
  const handleClick = (e) => {
    if (e && e.activePayload) {
      const clickedData = e.activePayload[0].payload;
      setSelectedFeeder(clickedData.name);
    }
  };

  return (
    <Container>
      <Card>
        <CenterText>
          <Title>B AC Power Distribution</Title>
          <RadialBarChart
            width={300}
            height={300}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="100%"
            barSize={20}
            data={data}
            startAngle={180}
            endAngle={0}
            onClick={handleClick} // Attach the event handler
          >
            <PolarAngleAxis
              type="number"
              domain={[0, totalPower]}
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
            <Legend
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
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
        </CenterText>
      </Card>
    </Container>
  );
};

export default AMFgaugeStacked;
