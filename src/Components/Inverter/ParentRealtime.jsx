import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { OverviewArray } from "../../invdata";
import RealTimeChart from "./RealtimeEnergy"; // Imported Chart Component
import UserService from "../../Services/UserService";

const ParentRealtime = () => {
  const [selectedAPI, setSelectedAPI] = useState(OverviewArray[0]?.id || "");
  const [rawData, setRawData] = useState(null); // Will store single object { timestamp, value }

  const [startDate] = useState(dayjs().subtract(1, "hour")); // Default: past 1 hour
  const [endDate] = useState(dayjs()); // Default: current time

  // ─────────────────────────────────────────────
  //  fetchData: Grabs ONLY the "recent data" and
  //  sums relevant columns based on selectedAPI
  // ─────────────────────────────────────────────
  const fetchData = async (start, end, period, selectedOption) => {
    try {
      const url = `https://neuract.org/analytics/deltaconsolidated/?
        start_date_time=${start.toISOString()}&
        end_date_time=${end.toISOString()}&
        resample_period=${period}`;
      const response = await fetch(url.replace(/\s/g, ""),{
        headers: {
          "Authorization": `Bearer ${UserService.getToken()}`,
          "Content-Type": "application/json"
        }
      }); // Remove any whitespace
      const result = await response.json();

      console.log("Full API Response:", result);

      // 1. Extract "recent data" safely
      const recentData = result["recent data"];
      if (!recentData || typeof recentData !== "object") {
        console.error(
          "No valid 'recent data' object found in the API response."
        );
        setRawData(null);
        return;
      }
      console.log("Recent Data:", recentData);

      // 2. Convert keys in recentData to lowercase
      const recentDataLowercase = {};
      Object.keys(recentData).forEach((origKey) => {
        recentDataLowercase[origKey.toLowerCase()] = recentData[origKey];
      });

      // 3. Extract relevant columns from the selected API
      const relevantColumns =
        OverviewArray.find((option) => option.id === selectedOption)?.apis.map(
          (api) => {
            const segments = api.split("/");
            return segments[segments.length - 2]?.toLowerCase();
          }
        ) || [];

      console.log("Relevant Columns (lowercase):", relevantColumns);

      // 4. Aggregate the sum of all relevant columns
      let sum = 0;
      relevantColumns.forEach((col) => {
        if (recentDataLowercase[col] !== undefined) {
          sum += Number(recentDataLowercase[col]) || 0;
        }
      });
      console.log("Aggregated Sum for selected API:", sum);

      // 5. Create a single data object with a unique timestamp
      //    Use the server timestamp if available, else use dayjs() for "now"
      const aggregatedDataPoint = {
        timestamp: recentData.timestamp || dayjs().toISOString(),
        value: sum,
      };

      // 6. Update rawData as a single object
      setRawData(aggregatedDataPoint);
    } catch (error) {
      console.error("Error fetching data:", error);
      setRawData(null);
    }
  };

  // ─────────────────────────────────────────────
  //  useEffect: Fetch data on mount & every 5s,
  //  depends on selectedAPI
  // ─────────────────────────────────────────────
  useEffect(() => {
    // Initial Fetch
    fetchData(startDate, endDate, "5min", selectedAPI);

    // Re-fetch data every 5 seconds
    const interval = setInterval(() => {
      fetchData(startDate, endDate, "5min", selectedAPI);
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [selectedAPI]); // Rerun fetch if selectedAPI changes

  // Handle radio button changes for selecting different APIs
  const handleRadioChange = (newAPI) => {
    setSelectedAPI(newAPI);
    setRawData(null); // Clear old data to avoid mixing
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
      {/* Pass rawData, selectedAPI, and radio callback to the chart component */}
      <RealTimeChart
        rawData={rawData}
        amfOptions={OverviewArray}
        selectedAPI={selectedAPI}
        onRadioChange={handleRadioChange}
      />
    </div>
  );
};

export default ParentRealtime;
