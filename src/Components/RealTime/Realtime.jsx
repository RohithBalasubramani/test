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

const ParentRealTimeComponent = ({ apiKey }) => {
  const [rawData, setRawData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      if (sidbarInfo.apiUrls[apiKey]?.apiUrl) {
        const response = await axios.get(sidbarInfo.apiUrls[apiKey]?.apiUrl);
        setRawData(response.data);
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
