import React, { useEffect, useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import TimeBar from "../TRFF/TimePeriod";
import AMFgaugeStacked from "./AmfGaugeStacked";
import KPI from "../KPI";
import WeatherWidget from "../Weather";
import { sideBarTreeArray } from "../../sidebarInfo2"; // Assuming this is your Treeview array
import OverviewTimeBar from "./OverviewTimeBar";

const DashboardHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const DashboardTitle = styled.div`
  color: var(--Gray---Typography-800, #1b2533);
  font-family: "DM Sans";
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  display: flex;
  width: 50%;
  flex-direction: column;
  align-items: flex-start;
`;

const Container = styled.div`
  height: 30vh;
`;

const OverviewHeader = ({ apiKey, sectionName, parentName, parentName2 }) => {
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [timeperiod, setTimeperiod] = useState("H");
  const [dateRange, setDateRange] = useState("today");
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  const fetchData = async (start, end, period) => {
    try {
      let apiEndpointsArray;

      if (parentName && !parentName2) {
        apiEndpointsArray = sideBarTreeArray[sectionName]?.find(
          (item) => item.id === parentName
        );
        apiEndpointsArray = apiEndpointsArray?.children?.find(
          (child) => child.id === apiKey
        );
      } else if (parentName && parentName2) {
        apiEndpointsArray = sideBarTreeArray[sectionName]?.find(
          (item) => item.id === parentName
        );
        apiEndpointsArray = apiEndpointsArray?.children?.find(
          (child) => child.id === parentName2
        );
        apiEndpointsArray = apiEndpointsArray?.children?.find(
          (child) => child.id === apiKey
        );
      } else if (!parentName && !parentName2) {
        apiEndpointsArray = sideBarTreeArray[sectionName]?.find(
          (item) => item.id === apiKey
        );
      }

      const apiEndpoints = apiEndpointsArray?.apis || [];

      if (apiEndpoints.length === 0) {
        throw new Error("No API endpoints found.");
      }

      // Fetch data from all APIs concurrently
      const fetchPromises = apiEndpoints.map(async (api) => {
        const response = await fetch(
          `${api}?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch from ${api}: ${response.statusText}`
          );
        }

        const result = await response.json();
        return { [api]: result }; // Return data keyed by the API URL
      });

      const results = await Promise.all(fetchPromises);

      // Combine all results into a single object
      const aggregatedData = results.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );

      setData(aggregatedData);
      console.log("Fetched and Aggregated Data:", aggregatedData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (startDate && endDate && apiKey && sectionName) {
      fetchData(startDate, endDate, timeperiod);
    }
  }, [startDate, endDate, timeperiod, apiKey, sectionName]);

  return (
    <div>
      <DashboardHeader>
        <DashboardTitle>Dashboard</DashboardTitle>
        <OverviewTimeBar
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          dateRange={dateRange}
          setDateRange={setDateRange}
          setTimeperiod={setTimeperiod}
          startDate={startDate}
          endDate={endDate}
        />
      </DashboardHeader>
      <Container
        style={{ display: "flex", gap: "2%", maxHeight: "fit-content" }}
      >
        {Object.keys(data)?.length >= 3 ? (
          <AMFgaugeStacked
            feeder1Power={
              Object.values(data)[0]?.["average data"]?.app_energy_export || 0
            }
            feeder2Power={
              Object.values(data)[1]?.["average data"]?.app_energy_export || 0
            }
            feeder3Power={
              Object.values(data)[2]?.["average data"]?.app_energy_export || 0
            }
          />
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : (
          <div>Loading...</div>
        )}

        <KPI data={Object.values(data)[2]} />
        <WeatherWidget />
      </Container>
    </div>
  );
};

export default OverviewHeader;
