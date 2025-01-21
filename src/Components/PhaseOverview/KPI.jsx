import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import "../kpi.css";
import styled from "styled-components";
import AMFgaugeLinear from "./CostChart";

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2%;
`;

const PercentageCont = styled.span`
  color: ${(props) => (props.isIncrease ? " #137a5f" : "#ff0000")};
  border-radius: 50px;
  background: ${(props) =>
    props.isIncrease
      ? " var(--Success-50, #e8f5f1);"
      : "var(--Failure-50, #fde1e1);"};
  font-family: DM Sans;
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  text-align: left;
  padding: 0.5vh;
`;

const KPI = ({ data, startDate, endDate, timeperiod, realTimePower }) => {
  const [kpiData, setKpiData] = useState({
    peakCurrent: 0,
    peakFeeder: "",
    totalConsumption: 0,
    totalCost: 0,
  });
  const [previousPower, setPreviousPower] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [isIncrease, setIsIncrease] = useState(true);

  useEffect(() => {
    if (data && data["resampled data"]) {
      const resampled = data["resampled data"];

      // 🟢 Peak Current Across All Feeders
      const feederCurrents = resampled.map((item) => {
        return {
          feeder: item["feeder"] || "Unknown Feeder",
          current: Math.max(
            item["r_current"] || 0,
            item["y_current"] || 0,
            item["b_current"] || 0
          ),
        };
      });

      const { feeder: peakFeeder, current: peakCurrent } =
        feederCurrents.reduce(
          (max, feeder) => (feeder.current > max.current ? feeder : max),
          { feeder: "None", current: 0 }
        );

      // 🟢 Total Consumption (Sum of app_energy_export)
      const totalConsumption = resampled.reduce(
        (sum, item) => sum + (item["app_energy_export"] || 0),
        0
      );

      // 🟢 Total Cost (₹10 per unit of app_energy_export)
      const totalCost = totalConsumption * 10;

      setKpiData({
        peakCurrent,
        peakFeeder,
        totalConsumption,
        totalCost,
      });
    }
  }, [data]);

  useEffect(() => {
    if (previousPower !== 0) {
      const difference = realTimePower - previousPower;
      const percentage = ((difference / previousPower) * 100).toFixed(2);
      setPercentageChange(Math.abs(percentage));
      setIsIncrease(difference > 0);
    }
    setPreviousPower(realTimePower);
  }, [realTimePower]);

  return (
    <>
      <Container>
        {/* 📊 Peak Current Card */}
        <div className="kpi-cont3">
          <div className="kpi-top">
            <div className="kpi-tit">Power</div>

            <div style={{ display: "inline" }}>
              <span className="kpi-val">{realTimePower.toFixed(2)}</span>
              <span className="kpi-units"> kW </span>
            </div>
          </div>
          <div className="kpi-bot">
            <PercentageCont isIncrease={isIncrease}>
              {isIncrease ? (
                <ArrowUpward sx={{ fontSize: "14px" }} />
              ) : (
                <ArrowDownward sx={{ fontSize: "14px" }} />
              )}
              {percentageChange}%
            </PercentageCont>
            <span className="percentage-span">
              {isIncrease ? "More than last minute" : "Less than last minute"}
            </span>
          </div>
        </div>

        <AMFgaugeLinear
          startDate={startDate}
          endDate={endDate}
          timeperiod={timeperiod}
        />
      </Container>
    </>
  );
};

export default KPI;
