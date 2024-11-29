import React, { useEffect, useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import TimeBar from "../TRFF/TimePeriod";
import AMFgaugeStacked from "./AmfGaugeStacked";
import KPI from "../KPI";
import WeatherWidget from "../Weather";
import sidbarInfo from "../../sidbarInfo";

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

const OverviewHeader = ({ apiKey }) => {
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [timeperiod, setTimeperiod] = useState("H");
  const [dateRange, setDateRange] = useState("today");
  const [data, setData] = useState({});

  console.log("api key", apiKey);

  // Extract API URLs dynamically based on the given apiKey
  const apiEndpointsArray = sidbarInfo.apiUrls[apiKey]?.apiUrl || [];
  const apiEndpoints = apiEndpointsArray.length > 0 ? apiEndpointsArray[0] : {};
  console.log("API Endpoints", apiEndpoints);

  const fetchData = async (start, end, period) => {
    try {
      const fetchPromises = Object.keys(apiEndpoints).map(async (key) => {
        const response = await fetch(
          `${
            apiEndpoints[key]
          }?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching ${key}: ${response.statusText}`);
        }
        const result = await response.json();
        return { [key]: result };
      });

      const results = await Promise.all(fetchPromises);
      const aggregatedData = results.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
      setData(aggregatedData);

      console.log("Fetched Data:", aggregatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate && apiKey) {
      fetchData(startDate, endDate, timeperiod);
    }
  }, [startDate, endDate, timeperiod, apiKey]);

  return (
    <div>
      <DashboardHeader>
        <DashboardTitle>Dashboard</DashboardTitle>
        <TimeBar
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
        {data.p1_amfs_Solar &&
        data.p1_amfs_transformer2 &&
        data.p1_amfs_generator2 ? (
          <AMFgaugeStacked
            feeder1Power={data.p1_amfs_Solar["recent data"]?.b_ac_power || 0}
            feeder2Power={
              data.p1_amfs_transformer2["recent data"]?.b_ac_power || 0
            }
            feeder3Power={
              data.p1_amfs_generator2["recent data"]?.b_ac_power || 0
            }
          />
        ) : (
          <div>Loading...</div>
        )}
        <KPI data={data} />
        <WeatherWidget />
      </Container>
    </div>
  );
};

export default OverviewHeader;
