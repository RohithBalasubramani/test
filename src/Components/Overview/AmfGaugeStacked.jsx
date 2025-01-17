import React, { useState } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, Tooltip } from "recharts";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 20vw;
  height: 46vh;
  background: #ffffff;
  padding: 4vh;
  border-radius: 4px;
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
  margin-bottom: 10px;
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

const CustomTooltipContainer = styled.div`
  background: #ffffff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const CustomTooltipLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #5630bc;
`;

const CustomTooltipValue = styled.div`
  font-size: 14px;
  color: #555;
`;

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: -8vh;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px;
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
 * Custom Tooltip for RadialBarChart
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <CustomTooltipContainer>
        <CustomTooltipLabel>{data.name}</CustomTooltipLabel>
        <CustomTooltipValue>
          Value: {data.value.toFixed(2)} kW
        </CustomTooltipValue>
      </CustomTooltipContainer>
    );
  }
  return null;
};

const AMFgaugeStacked = ({ feederData, setKpiKey }) => {
  const totalPowerArray = feederData
    ? Object.values(feederData).map(
        (item) => item["average data"]?.app_energy_export
      )
    : [];
  const totalPower = totalPowerArray.reduce(
    (acc, currentValue) => acc + currentValue,
    0
  );

  console.log("feederData", feederData);

  const [selectedFeeder, setSelectedFeeder] = useState(null);
  const color_array = [
    "#5630BC",
    "#8963EF",
    "#C4B1F7",
    "#FF4500",
    "#FFD700",
    "#1E90FF",
  ];

  // Prepare data for RadialBarChart
  const data = Object.entries(feederData).map(([key, item], index) => {
    const feederName = key.split("/").filter(Boolean).pop().split("_").pop();

    return {
      name: feederName.charAt(0).toUpperCase() + feederName.slice(1),
      value: item["average data"]?.app_energy_export || 0,
      fill: color_array[index % color_array.length],
    };
  });

  // Handle click event
  const handleClick = (e) => {
    if (e && e.activePayload) {
      const clickedData = e.activePayload[0].payload;
      console.log("clicked", clickedData);
      setSelectedFeeder(clickedData.name);
      setKpiKey(clickedData.name);
    }
  };

  return (
    <Container>
      <Card>
        {/* <Title>B AC Power Distribution</Title> */}
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
          onClick={handleClick}
        >
          <PolarAngleAxis type="number" domain={[0, totalPower]} tick={false} />
          <RadialBar
            minAngle={15}
            clockWise
            dataKey="value"
            cornerRadius={10}
            background
          />
          <Tooltip content={<CustomTooltip />} />
        </RadialBarChart>

        <CenterText onClick={() => setSelectedFeeder(null)}>
          {selectedFeeder ? (
            <>
              {selectedFeeder} <br />
              {(
                data.find((d) => d.name === selectedFeeder)?.value || 0
              ).toFixed(2)}{" "}
              kW
            </>
          ) : (
            <>Total: {(totalPower / 1000).toFixed(2)} MW</>
          )}
        </CenterText>

        <LegendContainer>
          {data.map((item, index) => (
            <LegendItem key={index}>
              <LegendColorBox style={{ background: item.fill }} />
              <LegendLabel>
                {item.name}: {item.value.toFixed(2)} kW
              </LegendLabel>
            </LegendItem>
          ))}
        </LegendContainer>
      </Card>
    </Container>
  );
};

export default AMFgaugeStacked;
