import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import styled from "styled-components";
import { useLocation, Outlet } from "react-router-dom";
import DashHeader from "../Components/DashHeader";
import BottomTimeSeries from "../Components/TimeseriesDash";
import ParentRealTimeComponent from "../Components/RealTime/Realtime";

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
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3vh;
`;

const TestPage = ({ apikey, sectionName, parentName, parentName2 }) => {
  const location = useLocation();
  const [key, setKey] = useState(apikey || "");
  const [topBar, setTopBar] = useState(sectionName || "");

  // useEffect(() => {
  //   if (!apikey) {
  //     const pathSegments = location.pathname.split("/");
  //     const derivedKey = pathSegments[pathSegments.length - 1] || "";
  //     setKey(derivedKey);
  //   }
  // }, [location, apikey]);

  // const handleItemIdChange = (itemId, topBarSelection) => {
  //   setKey(itemId);
  //   console.log("Selected Item ID:", itemId);
  // };

  return (
    <>
      <OutLetContainer>
        <DashHeader
          apikey={key}
          topBar={topBar}
          parentName={parentName}
          parentName2={parentName2}
        />
        <div className="emstit">
          <span className="emstitle">Real - Time Consumption</span>
          <span className="emsspan">Status: Running EB power</span>
        </div>
        <ChartContainer
          className="realtimeflex"
          style={{ gap: "10px", display: "flex" }}
        >
          <ParentRealTimeComponent
            apiKey={key}
            topBar={topBar}
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
        <div style={{ width: "80vw" }}>
          <BottomTimeSeries
            apiKey={key}
            topBar={topBar}
            parentName={parentName}
            parentName2={parentName2}
          />
        </div>
        <Outlet />
      </OutLetContainer>
    </>
  );
};

export default TestPage;
