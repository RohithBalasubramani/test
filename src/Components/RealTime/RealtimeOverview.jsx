import React, { useEffect, useState } from "react";
import axios from "axios";
import sidbarInfo from "../../sidbarInfo";
import RealTimeVoltageChart from "./VoltageChart";
import RealTimeChart from "./Composite";
import RealTimeCurrentChart from "./CurrentChart";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ParentOverviewComponent = ({ apiKey }) => {
  const [activeEndpoint, setActiveEndpoint] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [status, setStatus] = useState("Determining status...");
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!apiKey || !sidbarInfo.apiUrls[apiKey]) {
      console.error("Invalid or missing apiKey.");
      setError("Invalid or missing apiKey.");
      return;
    }

    const apiEndpointsArray = sidbarInfo.apiUrls[apiKey]?.apiUrl || [];
    const apiEndpoints =
      apiEndpointsArray.length > 0 ? apiEndpointsArray[0] : {};

    if (!apiEndpoints || Object.keys(apiEndpoints).length === 0) {
      console.error("No API endpoints found for the provided apiKey.");
      setError("No API endpoints configured.");
      return;
    }

    try {
      if (!activeEndpoint) {
        // Fetch both endpoints to determine the active source
        const [transformerResponse, generatorResponse] = await Promise.all([
          axios.get(apiEndpoints["p1_amfs_transformer2"]),
          axios.get(apiEndpoints["p1_amfs_generator2"]),
        ]);

        const transformerData = transformerResponse.data["recent data"];
        const generatorData = generatorResponse.data["recent data"];

        determineActiveSource(transformerData, generatorData, apiEndpoints);
      } else {
        // Fetch only the active source's endpoint
        const response = await axios.get(activeEndpoint);
        setRawData(response.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Unknown error occurred.");
    }
  };

  const determineActiveSource = (
    transformerData,
    generatorData,
    apiEndpoints
  ) => {
    const transformerCurrent = transformerData?.avg_current || 0;
    const generatorCurrent = generatorData?.avg_current || 0;

    let currentStatus = "No Power";
    let endpoint = null;

    if (transformerCurrent > generatorCurrent && transformerCurrent > 0) {
      currentStatus = "Running on EB";
      endpoint = apiEndpoints["p1_amfs_transformer2"];
    } else if (generatorCurrent > transformerCurrent && generatorCurrent > 0) {
      currentStatus = "Running on DG";
      endpoint = apiEndpoints["p1_amfs_generator2"];
    }

    setStatus(currentStatus);
    setActiveEndpoint(endpoint);
    setRawData(
      endpoint === apiEndpoints["p1_amfs_transformer2"]
        ? transformerData
        : generatorData
    );
  };

  useEffect(() => {
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
  }, [apiKey, activeEndpoint]);

  return (
    <div>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <div style={{ margin: "10px 0", fontWeight: "bold" }}>
        Status: {status}
      </div>
      {rawData ? (
        <Container>
          <RealTimeVoltageChart rawData={rawData} />
          <RealTimeChart rawData={rawData} />
          <RealTimeCurrentChart rawData={rawData} />
        </Container>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ParentOverviewComponent;
