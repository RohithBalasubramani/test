import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import OverviewHeader from "../Components/Overview/OverViewHeader";
import ParentOverviewComponent from "../Components/RealTime/RealtimeOverview";
import BottomTimeSeries from "../Components/Dashboard/TimeseriesDash";
import RealTimeChart from "../Components/RealTime/EnergyOverview";

const Container = styled.div`
  display: flex;
  background: #f4f5f6;
  width: 100%;
  padding: 3vh;
  gap: 10px;
  max-width: 96vw;
`;

const SidebarComp = styled.div`
  flex: 1;
`;

const OutLetContainer = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
  gap: 1%;
  width: 70vw;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3vh;
`;

const Overview = () => {
  const location = useLocation(); // Get the location object
  const [key, setKey] = useState("");

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const derivedKey = pathSegments[pathSegments.length - 1] || "";
    console.log("pathname ", derivedKey);
    setKey(derivedKey);
  }, [location]);

  return (
    <Container>
      <SidebarComp>
        <Sidebar handleItemId={(itemId) => setKey(itemId)} />
      </SidebarComp>
      <OutLetContainer>
        <OverviewHeader apiKey={key} />
        <br />
        <br />
        <ChartContainer
          className="realtimeflex"
          style={{ gap: "10px", display: "flex" }}
        >
          <ParentOverviewComponent apiKey={key} />
        </ChartContainer>
        <RealTimeChart
          feeders={[
            {
              key: "P1_AMFS_Transformer1",
              label: "Transformer 1",
              color: "#FF6384",
            },
            {
              key: "P1_AMFS_Generator1",
              label: "Generator 1",
              color: "#36A2EB",
            },
            { key: "P1_AMFS_Outgoing1", label: "Outgoing 1", color: "#FFCE56" },
            {
              key: "P1_AMFS_Transformer2",
              label: "Transformer 2",
              color: "#4BC0C0",
            },
            {
              key: "P1_AMFS_Generator2",
              label: "Generator 2",
              color: "#9966FF",
            },
          ]}
          pollingInterval={5000} // 5 seconds
        />
        <br />
        <div style={{ width: "80vw" }}>
          <BottomTimeSeries />
        </div>
        <Outlet />
      </OutLetContainer>
    </Container>
  );
};

export default Overview;
