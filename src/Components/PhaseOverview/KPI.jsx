import { ArrowUpward } from "@mui/icons-material";
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

const KPI = ({ data, startDate, endDate, timeperiod }) => {
  const [kpiData, setKpiData] = useState({
    peakCurrent: 0,
    peakFeeder: "",
    totalConsumption: 0,
    totalCost: 0,
  });

  console.log("KPI data", data);

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

  const iconStyle = { fontSize: "2rem" };

  return (
    <>
      <Container>
        {/* 📊 Peak Current Card */}
        <div className="kpi-cont3">
          <div className="kpi-top">
            <div className="kpi-tit">Peak Current</div>

            <div style={{ display: "inline" }}>
              <span className="kpi-val">{kpiData.peakCurrent.toFixed(2)}</span>
              <span className="kpi-units"> A </span>
            </div>
            {/* <div className="kpi-subtext">Feeder: {kpiData.peakFeeder}</div> */}
          </div>
          <div className="kpi-bot">
            <span className="percentage-cont">
              <ArrowUpward sx={{ fontSize: "14px" }} />
              25%
            </span>
            <span className="percentage-span">More than last month</span>
          </div>
        </div>

        {/* 📊 Total Consumption Card */}
        {/* <div className="kpi-cont3">
          <div className="kpi-top">
            <div className="kpi-tit">Total Consumption</div>
            <div style={{ display: "inline" }}>
              <span className="kpi-val">
                {kpiData.totalConsumption.toFixed(2)}
              </span>
              <span className="kpi-units"> kWh </span>
            </div>
          </div>
          <div className="kpi-bot">
            <span className="percentage-cont">
              <ArrowUpward sx={{ fontSize: "14px" }} />
              20%
            </span>
            <span className="percentage-span">More than yesterday</span>
          </div>
        </div> */}
        {/* 💵 Total Energy Cost Card */}
        {/* <div className="kpi-cont3">
          <div className="kpi-top">
            <div className="kpi-tit">Total Energy Cost</div>
            <div style={{ display: "inline" }}>
              <span className="kpi-val">₹{kpiData.totalCost.toFixed(2)}</span>
              <span className="kpi-units"> INR </span>
            </div>
          </div>
          <div className="kpi-bot">
            <span className="percentage-cont">
              <ArrowUpward sx={{ fontSize: "14px" }} />
              15%
            </span>
            <span className="percentage-span">More than last month</span>
          </div>
        </div> */}

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
