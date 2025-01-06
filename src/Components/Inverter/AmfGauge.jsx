import { Gauge, gaugeClasses } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { ArrowUpward, Launch } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";

// Styled components for layout and styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vh;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GaugeCont = styled.div`
  margin-left: auto;
  margin-right: auto;
`;

const Card = styled.div`
  background: #ffffff;
  height: 32vh;
  width: 20vw;
  padding: 16px 0px 0px 0px;
  padding: 3vh;
  box-shadow: 7px 2px 17px 0px #c7c7c71a, 29px 10px 31px 0px #c7c7c717,
    66px 22px 42px 0px #c7c7c70d;
  text-align: center;
  position: relative;
`;

const Title = styled.div`
  font-weight: bold;
  color: #333;
`;

const AMFgauge = ({ kpidata }) => {
  const [ebUsage, setEbUsage] = useState(0);
  const [dgUsage, setDgUsage] = useState(0);
  const [ebTot, setEbtot] = useState(0);
  const [dgTot, setDgTot] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [voltage, setVoltage] = useState(0);

  const fetchData = async () => {
    try {
      if (kpidata && kpidata["resampled data"]) {
        const energyArray = kpidata["resampled data"].map(
          (item) => item["total_energy"]
        );
        const voltageArray = kpidata["resampled data"].map((item) =>
          Math.max(item["ry_voltage"], item["yb_voltage"], item["br_voltage"])
        );
        const sumOfEnergyArray = energyArray.reduce(
          (acc, currentValue) => acc + currentValue,
          0
        );
        const peakVoltage = Math.max(...voltageArray);
        setVoltage(peakVoltage);
        setEnergy(sumOfEnergyArray);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // const interval = setInterval(fetchData, 5000); // Update every 5 seconds
    // return () => clearInterval(interval);
  }, [kpidata]);

  return (
    <Container>
      {/* EB Usage Card */}
      <div className="kpi-cont">
        <div className="kpi-top">
          <Top>
            <Title>Total EB Usage</Title>
            <IconButton
              aria-label="open-link"
              size="small"
              component={Link}
              to="/eb"
            >
              <Launch fontSize="inherit" />
            </IconButton>
          </Top>
          <GaugeCont>
            <Gauge
              width={95}
              height={95}
              startAngle={-130}
              endAngle={130}
              innerRadius="75%"
              outerRadius="110%"
              value={energy}
              text={({ value }) => ``}
              cornerRadius="50%"
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: "14px", // Adjust the font size here
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: "#2E7D32",
                },
              }}
              valueMax={energy * 1.33}
            />
            <div className="figuretext">
              <span>{energy.toLocaleString()}</span>
              <span> kWh </span>
            </div>
          </GaugeCont>
        </div>
      </div>

      <div className="kpi-cont">
        <div className="kpi-top">
          <div className="kpi-tit">Peak Voltage</div>
          <div style={{ display: "inline" }}>
            <span className="kpi-val"> {voltage?.toFixed(2)} </span>
            <span className="kpi-units"> V </span>
          </div>
        </div>
        <div className="kpi-bot">
          <span className="percentage-cont">
            <ArrowUpward sx={{ fontSize: "14px" }} />
            25%
          </span>
          <span className="percentage-span">More than last month</span>
        </div>
      </div>

      {/* DG Usage Card */}
      {/* <div className="kpi-cont">
        <div className="kpi-top">
          <Top>
            <Title>Total DG Usage</Title>
            <IconButton
              aria-label="open-link"
              size="small"
              component={Link}
              to="/dg1"
            >
              <Launch fontSize="inherit" />
            </IconButton>
          </Top>
          <GaugeCont>
            <Gauge
              width={95}
              height={95}
              startAngle={-130}
              endAngle={130}
              innerRadius="75%"
              outerRadius="110%"
              value={dgUsage}
              text={({ value }) => `${value.toFixed(2)} ${" %"}`}
              cornerRadius="50%"
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: "14px", // Adjust the font size here
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: "#ffd900",
                },
              }}
            />
            <div className="figuretext">
              <span>{dgTot.toLocaleString()}</span>
              <span> kWh </span>
            </div>
          </GaugeCont>
        </div>
      </div> */}
      {/* <PowerFactorGauge /> */}
    </Container>
  );
};

export default AMFgauge;
