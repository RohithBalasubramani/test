import React, { useState, useEffect } from "react";
import { OverviewArray } from "../../phasedata";
import RealTimeChart from "./RealtimeEnergy"; // Your chart component
import RealTimeCurrentChart from "./RealtimeCurrent";
import VoltageChart from "./RealtimeVoltage";
import axios from "axios";

const ParentRealtime = () => {
  // Filter out "overview" so we only have AMF1a, AMF1b, AMF2a, AMF2b
  const amfOptions = OverviewArray.filter((item) => item.id !== "overview");

  // State for currently selected API & data
  const [selectedAPIs, setSelectedAPIs] = useState(
    amfOptions.map((item) => item.apis[0])
  );
  const [rawData, setRawData] = useState(null);

  const fetchData = async () => {
    try {
      const [amf1a, amf1b, amf2a, amf2b] = await Promise.all(
        selectedAPIs.map((api) => {
          return axios.get(api);
        })
      );
      // const response = await fetch(apiURL);
      // const result = await response.json();
      let rawData = {
        amf1a: amf1a.data["recent data"],
        amf1b: amf1b.data["recent data"],
        amf2a: amf2a.data["recent data"],
        amf2b: amf2b.data["recent data"],
      };
      setRawData(rawData || {});
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data every 5 seconds when the selected API changes
  useEffect(() => {
    if (!selectedAPIs) return;
    fetchData(); // Initial fetch

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedAPIs]);

  // Handler for switching AMF source
  // const handleRadioChange = (newAPI) => {
  //   setSelectedAPI(newAPI);
  //   setRawData(null); // Reset data to avoid mixing old and new
  // };

  // Intentionally trigger an error
  if (!selectedAPIs) {
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
        selectedAPI={selectedAPIs}
        //onRadioChange={handleRadioChange}
        rawData={rawData}
      />
      <VoltageChart
        amfOptions={amfOptions}
        selectedAPI={selectedAPIs}
        //onRadioChange={handleRadioChange}
        rawData={rawData}
      />
      <RealTimeCurrentChart
        amfOptions={amfOptions}
        selectedAPI={selectedAPIs}
        //onRadioChange={handleRadioChange}
        rawData={rawData}
      />
    </div>
  );
};

export default ParentRealtime;
