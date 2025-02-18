import React, { useEffect, useState } from "react";
import axios from "axios";
import { sideBarTreeArray } from "../../sidebarInfo2";
import RealTimeVoltageChart from "./VoltageChart";
import RealTimeChart from "./Composite";
import RealTimeCurrentChart from "./CurrentChart";
import styled from "styled-components";
import RealTimeLoader from "../LoadingScreens/RealTimeLoader";
import { httpClient } from "../../Services/HttpClient";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ParentOverviewComponent = ({
  apiKey,
  topBar,
  parentName,
  parentName2,
}) => {
  const [activeFeeder, setActiveFeeder] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [status, setStatus] = useState("Determining status...");
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!apiKey || !sideBarTreeArray[topBar] || !topBar) {
      console.error("Invalid or missing apiKey or topBar.");
      setError("Invalid or missing apiKey or topBar.");
      return;
    }

    // Find the API endpoint(s) dynamically based on apiKey and parents
    let apiEndpointsArray;
    if (parentName && !parentName2) {
      apiEndpointsArray = sideBarTreeArray[topBar]?.find(
        (item) => item.id === parentName
      );
      apiEndpointsArray = apiEndpointsArray?.children?.find(
        (child) => child.id === apiKey
      );
    } else if (parentName && parentName2) {
      apiEndpointsArray = sideBarTreeArray[topBar]?.find(
        (item) => item.id === parentName
      );
      apiEndpointsArray = apiEndpointsArray?.children?.find(
        (child) => child.id === parentName2
      );
      apiEndpointsArray = apiEndpointsArray?.children?.find(
        (child) => child.id === apiKey
      );
    } else if (!parentName && !parentName2) {
      apiEndpointsArray = sideBarTreeArray[topBar]?.find(
        (item) => item.id === apiKey
      );
    }

    const apiEndpoints = apiEndpointsArray?.apis || [];

    if (!apiEndpoints.length) {
      console.error("No API endpoints found for the provided configuration.");
      setError("No API endpoints configured.");
      return;
    }

    try {
      // Fetch data from all feeders
      const feederResponses = await Promise.all(
        apiEndpoints.map((endpoint) => httpClient.get(endpoint))
      );

      const feederData = feederResponses.map((response, index) => ({
        name: extractFeederName(apiEndpoints[index]),
        data: response.data["recent data"],
      }));

      console.log("feederdata", feederData);

      determineActiveFeeder(feederData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Unknown error occurred.");
    }
  };

  const extractFeederName = (url) => {
    // Extract the feeder name from the API URL (last part after the last "/")
    const parts = url.split("/");
    return parts[parts.length - 2] || "Unknown Feeder";
  };

  const determineActiveFeeder = (feederDataArray) => {
    let maxCurrent = 0;
    let activeFeeder = null;

    // Find the feeder with the highest current
    feederDataArray.forEach((feeder) => {
      const current = feeder.data?.avg_current || 0;
      if (current > maxCurrent) {
        maxCurrent = current;
        activeFeeder = feeder;
      }
    });

    if (activeFeeder) {
      setActiveFeeder(activeFeeder.name);
      setStatus(
        `Running on ${activeFeeder?.name?.toUpperCase()?.replaceAll("_", " ")}`
      );
      setRawData(activeFeeder.data);
    } else {
      setActiveFeeder(null);
      setStatus("No Active Feeder");
      setRawData(null);
    }
  };

  useEffect(() => {
    setError(null);
    setRawData(null);
    if (!apiKey) {
      console.error("apiKey is required but not provided.");
      setError("apiKey is required.");
      return;
    }

    fetchData(); // Initial fetch
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [apiKey, parentName, parentName2]);

  return (
    <div>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {/* <div style={{ margin: "10px 0", fontWeight: "bold" }}>
        Status: {status}
      </div> */}
      {rawData ? (
        <Container>
          <RealTimeChart rawData={rawData} />
          <RealTimeVoltageChart rawData={rawData} />
          <RealTimeCurrentChart rawData={rawData} />
        </Container>
      ) : (
        <RealTimeLoader />
      )}
    </div>
  );
};

export default ParentOverviewComponent;
