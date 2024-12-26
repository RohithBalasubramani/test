import React, { useState, useEffect } from "react";
import { OverviewArray } from "../../phasedata";
import RealTimeChart from "./RealtimeEnergy"; // Your chart component
import RealTimeCurrentChart from "./RealtimeCurrent";
import VoltageChart from "./RealtimeVoltage";

const ParentRealtime = () => {
  // Filter out "overview" so we only have AMF1a, AMF1b, AMF2a, AMF2b
  const amfOptions = OverviewArray.filter((item) => item.id !== "overview");

  // State for currently selected API & data
  const [selectedAPI, setSelectedAPI] = useState(amfOptions[0]?.apis[0]);
  const [rawData, setRawData] = useState(null);

  const fetchData = async (apiURL) => {
    try {
      const response = await fetch(apiURL);
      const result = await response.json();
      setRawData(result["recent data"] || {});
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data every 5 seconds when the selected API changes
  useEffect(() => {
    if (!selectedAPI) return;
    fetchData(selectedAPI); // Initial fetch

    const interval = setInterval(() => {
      fetchData(selectedAPI);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedAPI]);

  // Handler for switching AMF source
  const handleRadioChange = (newAPI) => {
    setSelectedAPI(newAPI);
    setRawData(null); // Reset data to avoid mixing old and new
  };

  // Intentionally trigger an error
  if (!selectedAPI) {
    throw new Error("Uncaught Error: selectedAPI is undefined!");
  }

  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "2vh",
      }}
    >
      <RealTimeChart
        amfOptions={amfOptions}
        selectedAPI={selectedAPI}
        onRadioChange={handleRadioChange}
        rawData={rawData}
      />
      <RealTimeCurrentChart
        amfOptions={amfOptions}
        selectedAPI={selectedAPI}
        onRadioChange={handleRadioChange}
        rawData={rawData}
      />
      <VoltageChart
        amfOptions={amfOptions}
        selectedAPI={selectedAPI}
        onRadioChange={handleRadioChange}
        rawData={rawData}
      />
    </div>
  );
};

export default ParentRealtime;
