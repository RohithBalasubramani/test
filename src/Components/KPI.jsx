import {
  BatteryChargingFull,
  BarChart,
  TrendingUp,
  Warning,
  ArrowUpward,
  AccessTime,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import "./kpi.css";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2%;
`;

const KPI = ({ data }) => {
  const [kpiData, setKpiData] = useState({
    actpow: 0,
    total: 0,
    efficiency: 0,
    pendingAlerts: 18,
    monthlyConsumption: 0,
    todayConsumption: 0,
    energyCost: 0,
    peakCurrent: 0,
    peakPower: 0,
    peakVoltage: 0, // New field for peak voltage
  });

  console.log("KPI data", data);

  useEffect(() => {
    if (data && data["results"] && data["today"]) {
      const resampled = data["resampled data"];

      let peakCurrentDetails = { value: 0, line: "", time: "" };
      let peakPowerDetails = { value: 0, line: "", time: "" };
      let peakVoltageDetails = { value: 0, line: "", time: "" };

      // Calculate peak current, power, and voltage and track details
      resampled.forEach((item) => {
        const currents = [
          { value: item["r_current"], line: "R Current" },
          { value: item["y_current"], line: "Y Current" },
          { value: item["b_current"], line: "B Current" },
        ];
        const maxCurrent = currents.reduce((prev, curr) =>
          curr.value > prev.value ? curr : prev
        );

        if (maxCurrent.value > peakCurrentDetails.value) {
          peakCurrentDetails = {
            value: maxCurrent.value,
            line: maxCurrent.line,
            time: item.timestamp,
          };
        }

        const powers = [
          { value: item["r_ac_power"], line: "R Power" },
          { value: item["y_ac_power"], line: "Y Power" },
          { value: item["b_ac_power"], line: "B Power" },
        ];
        const maxPower = powers.reduce((prev, curr) =>
          curr.value > prev.value ? curr : prev
        );

        if (maxPower.value > peakPowerDetails.value) {
          peakPowerDetails = {
            value: maxPower.value,
            line: maxPower.line,
            time: item.timestamp,
          };
        }

        const voltages = [
          { value: item["ry_voltage"], line: "RY Voltage" },
          { value: item["yb_voltage"], line: "YB Voltage" },
          { value: item["br_voltage"], line: "BR Voltage" },
        ];
        const maxVoltage = voltages.reduce((prev, curr) =>
          curr.value > prev.value ? curr : prev
        );

        if (maxVoltage.value > peakVoltageDetails.value) {
          peakVoltageDetails = {
            value: maxVoltage.value,
            line: maxVoltage.line,
            time: item.timestamp,
          };
        }
      });

      setKpiData({
        peakCurrent: peakCurrentDetails,
        peakPower: peakPowerDetails,
        peakVoltage: peakVoltageDetails,
        efficiency: 78, // Example value
        pendingAlerts: 18, // Example value
      });
    }
  }, [data]);

  // Render logic
  return (
    <Container>
      {/* Peak Current Card */}
      <div className="kpi-contPage">
        <div className="kpi-top">
          <div className="kpi-tit">Peak Current</div>
          <div style={{ display: "inline" }}>
            <span className="kpi-val">
              {kpiData.peakCurrent?.value
                ? kpiData.peakCurrent.value.toFixed(2)
                : "N/A"}
            </span>
            <span className="kpi-units"> A </span>
          </div>
        </div>
        <div className="kpi-bot">
          <AccessTime
            sx={{
              fontSize: "14px",
              marginRight: "5px",
              alignItems: "center",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          />
          <span className="percentage-span">
            Occurred on:{" "}
            <strong>
              {kpiData.peakCurrent?.time
                ? new Date(kpiData.peakCurrent.time).toLocaleString()
                : "N/A"}
            </strong>
            <br />
            <span>
              Line: <strong>{kpiData.peakCurrent?.line || "N/A"} </strong>
            </span>
          </span>
        </div>
      </div>

      {/* Peak Power Card */}
      <div className="kpi-contPage">
        <div className="kpi-top">
          <div className="kpi-tit">Peak Power</div>
          <div style={{ display: "inline" }}>
            <span className="kpi-val">
              {kpiData.peakPower?.value
                ? kpiData.peakPower.value.toFixed(2)
                : "N/A"}
            </span>
            <span className="kpi-units"> kWh </span>
          </div>
        </div>
        <div className="kpi-bot">
          <AccessTime
            sx={{
              fontSize: "14px",
              marginRight: "5px",
              alignItems: "center",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          />
          <span className="percentage-span">
            Occurred on:{" "}
            <strong>
              {kpiData.peakPower?.time
                ? new Date(kpiData.peakPower.time).toLocaleString()
                : "N/A"}
            </strong>
            <br />
            <span>
              Line: <strong>{kpiData.peakPower?.line || "N/A"} </strong>
            </span>
          </span>
        </div>
      </div>

      {/* Peak Voltage Card */}
      <div className="kpi-contPage">
        <div className="kpi-top">
          <div className="kpi-tit">Peak Voltage</div>
          <div style={{ display: "inline" }}>
            <span className="kpi-val">
              {kpiData.peakVoltage?.value
                ? kpiData.peakVoltage.value.toFixed(2)
                : "N/A"}
            </span>
            <span className="kpi-units"> V </span>
          </div>
        </div>
        <div className="kpi-bot">
          <AccessTime
            sx={{
              fontSize: "14px",
              marginRight: "5px",
              alignItems: "center",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          />
          <span className="percentage-span">
            Occurred on:{" "}
            <strong>
              {kpiData.peakVoltage?.time
                ? new Date(kpiData.peakVoltage.time).toLocaleString()
                : "N/A"}
            </strong>
            <br />
            <span>
              Line: <strong>{kpiData.peakVoltage?.line || "N/A"} </strong>
            </span>
          </span>
        </div>
      </div>
    </Container>
  );
};

export default KPI;
