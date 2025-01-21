import { ArrowUpward, FlashOn, AccessTime } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs"; // Import dayjs library
import "../kpi.css";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vh;
`;

const KPI = ({ data }) => {
  const [kpiData, setKpiData] = useState({
    peakBAppPower: 0,
    peakBAppPowerTime: "",
    peakRAppPower: 0,
    peakRAppPowerTime: "",
    peakYAppPower: 0,
    peakYAppPowerTime: "",
  });

  console.log("data", data);

  console.log("KPI data", data);

  useEffect(() => {
    if (data && data["resampled data"]) {
      const resampled = data["resampled data"];

      let peakBAppPower = 0;
      let peakBAppPowerTime = "";
      let peakRAppPower = 0;
      let peakRAppPowerTime = "";
      let peakYAppPower = 0;
      let peakYAppPowerTime = "";

      resampled.forEach((item) => {
        if (item["b_app_power"] > peakBAppPower) {
          peakBAppPower = item["b_app_power"];
          peakBAppPowerTime = item["timestamp"];
        }
        if (item["r_app_power"] > peakRAppPower) {
          peakRAppPower = item["r_app_power"];
          peakRAppPowerTime = item["timestamp"];
        }
        if (item["y_app_power"] > peakYAppPower) {
          peakYAppPower = item["y_app_power"];
          peakYAppPowerTime = item["timestamp"];
        }
      });

      setKpiData({
        peakBAppPower,
        peakBAppPowerTime,
        peakRAppPower,
        peakRAppPowerTime,
        peakYAppPower,
        peakYAppPowerTime,
      });
    }
  }, [data]);

  // Format timestamp
  const formatTimestamp = (timestamp) =>
    timestamp
      ? dayjs(timestamp).format("D MMM YYYY, h:mm:ss A")
      : "No data available";

  return (
    <Container>
      {/* Peak B-Apparent Power */}
      <div className="kpi-contOverview">
        <div className="kpi-top">
          <div className="kpi-tit">Peak B-Apparent Power</div>
          <div>
            <span className="kpi-val">{kpiData.peakBAppPower.toFixed(2)}</span>
            <span className="kpi-units"> kVA </span>
          </div>
        </div>
        <div className="kpi-bot">
          <AccessTime sx={{ fontSize: "14px", marginRight: "5px" }} />
          <span className="percentage-span">
            Occurred at{" "}
            <strong>{formatTimestamp(kpiData.peakBAppPowerTime)}</strong>
          </span>
        </div>
      </div>

      {/* Peak R-Apparent Power */}
      <div className="kpi-contOverview">
        <div className="kpi-top">
          <div className="kpi-tit">Peak R-Apparent Power</div>
          <div>
            <span className="kpi-val">{kpiData.peakRAppPower.toFixed(2)}</span>
            <span className="kpi-units"> kVA </span>
          </div>
        </div>
        <div className="kpi-bot">
          <AccessTime sx={{ fontSize: "14px", marginRight: "5px" }} />
          <span className="percentage-span">
            Occurred at{" "}
            <strong>{formatTimestamp(kpiData.peakRAppPowerTime)}</strong>
          </span>
        </div>
      </div>

      {/* Peak Y-Apparent Power */}
      <div className="kpi-contOverview">
        <div className="kpi-top">
          <div className="kpi-tit">Peak Y-Apparent Power</div>
          <div>
            <span className="kpi-val">{kpiData.peakYAppPower.toFixed(2)}</span>
            <span className="kpi-units"> kVA </span>
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
            Occurred at{" "}
            <strong>{formatTimestamp(kpiData.peakYAppPowerTime)}</strong>
          </span>
        </div>
      </div>
    </Container>
  );
};

export default KPI;
