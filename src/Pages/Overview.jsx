import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import styled from "styled-components";
import OverviewHeader from "../Components/Overview/OverViewHeader";
import ParentOverviewComponent from "../Components/RealTime/RealtimeOverview";
import BottomTimeSeries from "../Components/Dashboard/TimeseriesDash.jsx";
import RealTimeChart from "../Components/RealTime/EnergyOverview";
import { sideBarTreeArray } from "../sidebarInfo2";

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

const Overview = ({ apikey, sectionName, parentName, parentName2 }) => {
  const location = useLocation();
  const [key, setKey] = useState(apikey || "");
  const [topBar, setTopBar] = useState(sectionName || "");
  const [feeders, setFeeders] = useState([]);

  console.log("API Key", key);

  // Derive API Key from URL if not provided
  useEffect(() => {
    if (!apikey) {
      const pathSegments = location.pathname.split("/");
      const derivedKey = pathSegments[pathSegments.length - 1] || "";
      console.log("Derived key from pathname: ", derivedKey);
      setKey(derivedKey);
    }
  }, [location, apikey]);

  // Dynamically generate feeders based on sectionName and parentName(s)
  useEffect(() => {
    let apiEndpointsArray;

    if (parentName && !parentName2) {
      apiEndpointsArray = sideBarTreeArray[sectionName]?.find(
        (item) => item.id === parentName
      );
      apiEndpointsArray = apiEndpointsArray?.children?.find(
        (child) => child.id === key
      );
    } else if (parentName && parentName2) {
      apiEndpointsArray = sideBarTreeArray[sectionName]?.find(
        (item) => item.id === parentName
      );
      apiEndpointsArray = apiEndpointsArray?.children?.find(
        (child) => child.id === parentName2
      );
      apiEndpointsArray = apiEndpointsArray?.children?.find(
        (child) => child.id === key
      );
    } else if (!parentName && !parentName2) {
      apiEndpointsArray = sideBarTreeArray[sectionName]?.find(
        (item) => item.id === key
      );
    }

    // Map the apis to feeders
    if (apiEndpointsArray?.apis) {
      const mappedFeeders = apiEndpointsArray.apis.map((api, index) => {
        const feederKey = api.split("/").slice(-2, -1)[0]; // Extract feeder key from API URL
        return {
          key: feederKey,
          label: feederKey.replace(/_/g, " ").toUpperCase(),
          color: `hsl(${index * 60}, 70%, 50%)`, // Generate unique colors
        };
      });
      setFeeders(mappedFeeders);
    }
  }, [key, sectionName, parentName, parentName2]);

  return (
    <Container>
      <SidebarComp>
        <Sidebar handleItemId={(itemId) => setKey(itemId)} />
      </SidebarComp>
      <OutLetContainer>
        <OverviewHeader
          apiKey={key}
          sectionName={sectionName}
          parentName={parentName}
          parentName2={parentName2}
        />
        <br />
        <br />
        <div className="emstit">
          <span className="emstitle">Real - Time Consumption</span>
          <span className="emsspan">Status: Running EB power</span>
        </div>
        <ChartContainer
          className="realtimeflex"
          style={{ gap: "10px", display: "flex" }}
        >
          <ParentOverviewComponent
            apiKey={key}
            topBar={sectionName}
            parentName={parentName}
            parentName2={parentName2}
          />
        </ChartContainer>

        <div className="emstit">
          <span className="emstitle">Energy Consumption History</span>
          <span className="emsspan">
            Access and analyze historical energy consumption trends to identify
            patterns and areas for improvement.
          </span>
        </div>
        <RealTimeChart feeders={feeders} pollingInterval={5000} />
        <br />
        <div style={{ width: "80vw" }}>
          <BottomTimeSeries
            apiKey={key}
            topBar={sectionName}
            parentName={parentName}
            parentName2={parentName2}
          />
        </div>
      </OutLetContainer>
    </Container>
  );
};

export default Overview;
