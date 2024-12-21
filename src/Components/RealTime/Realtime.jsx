import React, { useEffect, useState } from "react";
import axios from "axios";
import { sideBarTreeArray } from "../../sidebarInfo2";
import RealTimeVoltageChart from "./VoltageChart";
import RealTimeChart from "./Composite";
import RealTimeCurrentChart from "./CurrentChart";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ParentRealTimeComponent = ({
  apiKey,
  topBar,
  parentName,
  parentName2,
}) => {
  const [rawData, setRawData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      if (apiKey && topBar) {
        let apiEndpointsArray = undefined;
        if (parentName && !parentName2) {
          apiEndpointsArray = sideBarTreeArray[topBar].find(
            (arr) => arr.id === parentName
          );
          apiEndpointsArray = apiEndpointsArray.children.find(
            (arr) => arr.id === apiKey
          );
        } else if (parentName && parentName2) {
          apiEndpointsArray = sideBarTreeArray[topBar].find(
            (arr) => arr.id === parentName
          );
          apiEndpointsArray = apiEndpointsArray.children.find(
            (arr) => arr.id === parentName2
          );
          apiEndpointsArray = apiEndpointsArray.children.find(
            (arr) => arr.id === apiKey
          );
          console.log("data", rawData);
        } else if (!parentName && !parentName2) {
          apiEndpointsArray = sideBarTreeArray[topBar].find(
            (arr) => arr.id === apiKey
          );
        }
        if (apiEndpointsArray) {
          const apiEndpoints = apiEndpointsArray.apis[0];
          if (apiEndpoints) {
            const response = await axios.get(apiEndpoints);
            setRawData(response.data);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Clear interval on unmount
  }, [apiKey]);

  return (
    <div>
      {error && <div>Error fetching data: {error}</div>}
      {rawData ? (
        <Container>
          {/* Pass rawData as props to the child components */}
          <RealTimeVoltageChart rawData={rawData} />
          <RealTimeChart rawData={rawData} />
          <RealTimeCurrentChart rawData={rawData} />
          {/* Add other components here */}
          {/* Example: <RealTimeCurrentChart rawData={rawData} /> */}
        </Container>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ParentRealTimeComponent;
