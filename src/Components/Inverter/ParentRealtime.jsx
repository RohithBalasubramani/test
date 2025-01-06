import React, { useState, useEffect } from "react";
import RealTimeChart from "./RealtimeEnergy"; // Chart Component
import dayjs from "dayjs";
import { OverviewArray } from "../../invdata";

// Extract relevant columns from API paths
const extractRelevantColumns = () => {
  return OverviewArray.flatMap(
    (item) =>
      item.apis?.map((api) => {
        const segments = api.split("/");
        const key = segments[segments.length - 1] || api; // Extract last segment as key
        return { key, label: key.replace(/_/g, " ").toUpperCase() };
      }) || []
  );
};

const ParentRealtime = () => {
  const [selectedAPI, setSelectedAPI] = useState(OverviewArray[0].id); // Default to first option
  const [rawData, setRawData] = useState(null);
  const [startDate] = useState(dayjs().subtract(1, "hour")); // Default to past 1 hour
  const [endDate] = useState(dayjs()); // Default to current time

  // Fetch aggregated data from consolidated API
  const fetchData = async (start, end, period, selectedOption) => {
    try {
      const response = await fetch(
        `http://14.96.26.26:8080/analytics/deltaconsolidated/?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`
      );
      const result = await response.json();

      // Extract relevant columns dynamically
      const relevantColumns =
        OverviewArray.find((option) => option.id === selectedOption)?.apis.map(
          (api) => api.split("/").pop()
        ) || [];

      const aggregatedData = result.reduce((acc, item) => {
        let sum = 0;
        relevantColumns.forEach((col) => {
          sum += item[col] || 0;
        });
        acc.push({ timestamp: item.timestamp, value: sum });
        return acc;
      }, []);

      setRawData(aggregatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate, "5min", selectedAPI); // Default 5-minute resampling

    const interval = setInterval(() => {
      fetchData(startDate, endDate, "5min", selectedAPI);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedAPI]);

  const handleRadioChange = (newAPI) => {
    setSelectedAPI(newAPI);
    setRawData(null); // Reset data to prevent old data mixing
  };

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
        amfOptions={OverviewArray}
        selectedAPI={selectedAPI}
        onRadioChange={handleRadioChange}
        rawData={rawData}
      />
    </div>
  );
};

export default ParentRealtime;
