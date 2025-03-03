import React, { useState, useEffect } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TimeBar from "./TRFF/TimePeriod"; // Ensure this path is correct
import DonutChart from "./DonutDash";
import StackedBarChart from "./StackedChart";
import PowerOutageChart from "./Powercuts";
import StackedBarDGEB from "./StackTest";
import MySankeyChart from "./Sankee";
import EnergyComp from "./EnergyPage";
import WeatherWidget from "./Alerts";
import dayjs from "dayjs";
import VerticalChart from "./BarchartVertical";
import CostChart from "./CostChart";
import CombinedChart from "./Combine";
import DataTable from "./TableDGEB";
import VoltageHistorical from "./VoltageHist";
import CurrentHistorical from "./CurrentHist";
import PowerfactorAndFreqHistorical from "./PowerFactorAndFreqHist";
import sidbarInfo from "../sidbarInfo";
import { sideBarTreeArray } from "../sidebarInfo2";
import HistoricalLoader from "./LoadingScreens/HistoricalLoader";
import AreaChartPowerEnergy from "./PowerArea";
import UserService from "../Services/UserService";

const BottomTimeSeries = ({ apiKey, topBar, parentName, parentName2 }) => {
  // Initialize state with default values
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [timeperiod, setTimeperiod] = useState("H");
  const [dateRange, setDateRange] = useState("today");
  const [data, setData] = useState(null);

  // Function to fetch data
  const fetchData = async (start, end, period) => {
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
        } else if (!parentName && !parentName2) {
          apiEndpointsArray = sideBarTreeArray[topBar].find(
            (arr) => arr.id === apiKey
          );
        }
        if (apiEndpointsArray) {
          const apiEndPoint = apiEndpointsArray.apis[0];
          if (apiEndPoint) {
            const response = await fetch(
              `${apiEndPoint}?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`,
              {
                headers: {
                  Authorization: `Bearer ${UserService.getToken()}`,
                  "Content-Type": "application/json",
                },
              }
            );
            const result = await response.json();
            setData(result);
            console.log("datatimedash", result);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data on initial render and whenever startDate, endDate, or timeperiod changes
  useEffect(() => {
    setData(null);
    if (startDate && endDate) {
      fetchData(startDate, endDate, timeperiod);
    }
  }, [startDate, endDate, timeperiod, apiKey]);

  // Handle time period change
  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setTimeperiod(newAlignment);
    }
  };

  // Define color palette for charts
  const backgroundColors = [
    "#ED75A3",
    "#017EF3",
    "#BF72D5",
    "#F09773",
    "#FFC550",
    "#434343",
    "#ff4d00",
    "#C9CBCF",
  ];

  const backgroundColorsWithOpacity = [
    "rgba(237, 117, 163, 0.8)", // #ED75A3
    "rgba(1, 126, 243, 0.8)", // #017EF3
    "rgba(191, 114, 213, 0.8)", // #BF72D5
    "rgba(240, 151, 115, 0.8)", // #F09773
    "rgba(255, 197, 80, 0.8)", // #FFC550
    "rgba(67, 67, 67, 0.8)", // #434343
    "rgba(255, 77, 0, 0.8)", // #ff4d00
    "rgba(201, 203, 207, 0.8)", // #C9CBCF
  ];

  const backgroundColors2 = [
    "#ED75A3",
    "#017EF3",

    "#434343",
    "#ff4d00",
    "#C9CBCF",
    "#BF72D5",
    "#FFC550",
    "#F09773",
  ];

  const bgsource = ["#5630BC", "#8963EF", "#C4B1F7"];

  return (
    <div>
      {/* <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDateTimePicker
            orientation="landscape"
            label="Start Date-Time"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <MobileDateTimePicker
            orientation="landscape"
            label="End Date-Time"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
        </LocalizationProvider>
      </div> */}

      {data ? (
        <>
          <div>
            <StackedBarDGEB
              data={data}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              timeperiod={timeperiod}
              setTimeperiod={setTimeperiod}
              dateRange={dateRange}
              setDateRange={setDateRange}
              backgroundColors={bgsource}
            />
            <CostChart
              data={data}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              timeperiod={timeperiod}
              setTimeperiod={setTimeperiod}
              dateRange={dateRange}
              setDateRange={setDateRange}
              backgroundColors={bgsource}
            />
            <AreaChartPowerEnergy
              data={data}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              timeperiod={timeperiod}
              setTimeperiod={setTimeperiod}
              dateRange={dateRange}
              setDateRange={setDateRange}
              backgroundColors={bgsource}
            />
            <VoltageHistorical
              data={data}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              timeperiod={timeperiod}
              setTimeperiod={setTimeperiod}
              dateRange={dateRange}
              setDateRange={setDateRange}
              backgroundColors={bgsource}
            />
            <CurrentHistorical
              data={data}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              timeperiod={timeperiod}
              setTimeperiod={setTimeperiod}
              dateRange={dateRange}
              setDateRange={setDateRange}
              backgroundColors={bgsource}
            />
            <PowerfactorAndFreqHistorical
              data={data}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              timeperiod={timeperiod}
              setTimeperiod={setTimeperiod}
              dateRange={dateRange}
              setDateRange={setDateRange}
              backgroundColors={bgsource}
            />
          </div>
          <div style={{ marginTop: "5vh" }}>
            {data && (
              <DataTable
                tablesData={data["resampled data"]} // Pass the correct data subset
                orderBy=""
                order="asc"
                handleRequestSort={() => {}}
                sortedData={data["resampled data"]} // Ensure sorted data is correct
                rowsPerPage={10}
                handleChangePage={() => {}}
                handleChangeRowsPerPage={() => {}}
                selectedEndpoint="Your API Endpoint"
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                timeperiod={timeperiod}
                setTimeperiod={setTimeperiod}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            )}
          </div>
        </>
      ) : (
        <HistoricalLoader />
      )}
    </div>
  );
};

export default BottomTimeSeries;
