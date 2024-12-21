import React, { useState, useEffect } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TimeBar from "../TRFF/TimePeriod"; // Ensure this path is correct
import DonutChart from "./DonutDash";
import StackedBarChart from "./StackedChart";
import PowerOutageChart from "./Powercuts";
import StackedBarDGEB from "./StackTest";
import MySankeyChart from "./Sankee";
import EnergyComp from "./EnergyPage";
import WeatherWidget from "./Weather";
import dayjs from "dayjs";

import CostChart from "./CostChart";
import CombinedChart from "./Combine";
import DataTable from "../TableDGEB";
import HorizontalChart from "./BarchartVertical";

const BottomTimeSeries = () => {
  // Initialize state with default values
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [timeperiod, setTimeperiod] = useState("H");
  const [dateRange, setDateRange] = useState("today");
  const [data, setData] = useState(null);

  // Function to fetch data
  const fetchData = async (start, end, period) => {
    try {
      const response = await fetch(
        `http://14.96.26.26:8080/analytics/deltaconsolidated/?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`
      );
      const result = await response.json();
      setData(result);
      console.log("datatimedash", result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data on initial render and whenever startDate, endDate, or timeperiod changes
  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate, timeperiod);
    }
  }, [startDate, endDate, timeperiod]);

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

      {data && (
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
              backgroundColors={["#FF0000", "#00FF00", "#0000FF"]}
              fields={[
                { key: "P1_AMFS_Transformer1", label: "Transformer 1" },
                { key: "P1_AMFS_Generator1", label: "Generator 1" },
                { key: "P1_AMFS_Outgoing1", label: "Outgoing 1" },
              ]}
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
              backgroundColors={["#FF0000", "#00FF00", "#0000FF"]}
              fields={[
                { key: "P1_AMFS_Transformer1", label: "Transformer 1" },
                { key: "P1_AMFS_Generator1", label: "Generator 1" },
                { key: "P1_AMFS_Outgoing1", label: "Outgoing 1" },
              ]}
            />

            <div
              style={{
                display: "flex",
                maxWidth: "75vw",
                gap: "3vw",
                height: "40vh",
              }}
            >
              <div style={{ width: "50%" }}>
                <DonutChart
                  data={data}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  timeperiod={timeperiod}
                  setTimeperiod={setTimeperiod}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  backgroundColors={[
                    "#ED75A3",
                    "#017EF3",
                    "#FFC550",
                    "#4BC0C0",
                    "#9966FF",
                  ]}
                  fields={[
                    { key: "P1_AMFS_Transformer2", label: "Transformer 2" },
                    { key: "P1_AMFS_Generator2", label: "Generator 2" },
                    { key: "P1_AMFS_Outgoing2", label: "Outgoing 2" },
                    { key: "P1_AMFS_APFC2", label: "APFC 2" },
                    { key: "P1_AMFS_Transformer3", label: "Transformer 3" },
                  ]}
                />
              </div>
              <div style={{ width: "50%" }}>
                <HorizontalChart
                  data={data}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  timeperiod={timeperiod}
                  setTimeperiod={setTimeperiod}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  backgroundColors={[
                    "#ED75A3",
                    "#017EF3",
                    "#FFC550",
                    "#4BC0C0",
                    "#9966FF",
                  ]}
                  fields={[
                    { key: "P1_AMFS_Transformer2", label: "Transformer 2" },
                    { key: "P1_AMFS_Generator2", label: "Generator 2" },
                    { key: "P1_AMFS_Outgoing2", label: "Outgoing 2" },
                    { key: "P1_AMFS_APFC2", label: "APFC 2" },
                    { key: "P1_AMFS_Transformer3", label: "Transformer 3" },
                  ]}
                />
              </div>
            </div>
          </div>
          {/* 
          <Powercut
            timeperiod={timeperiod}
            startDate={startDate}
            endDate={endDate}
          /> 
          */}
          <StackedBarChart
            data={data}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            timeperiod={timeperiod}
            setTimeperiod={setTimeperiod}
            dateRange={dateRange}
            setDateRange={setDateRange}
            backgroundColors={[
              "#ED75A3",
              "#017EF3",
              "#FFC550",
              "#F09773",
              "#BF72D5",
            ]}
            fields={[
              { key: "P1_AMFS_Transformer2", label: "Transformer 2" },
              { key: "P1_AMFS_Generator2", label: "Generator 2" },
              { key: "P1_AMFS_Outgoing2", label: "Outgoing 2" },
              { key: "P1_AMFS_APFC2", label: "APFC 2" },
              { key: "P1_AMFS_Transformer3", label: "Transformer 3" },
            ]}
          />

          <div>
            {/* <div className="row">
              <div style={{ width: "35vw" }}>
                <EnergyComp
                  data={data}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  timeperiod={timeperiod}
                  setTimeperiod={setTimeperiod}
                />
              </div>
              <div style={{ width: "35vw" }}>
                <PowerOutageChart />
              </div>
            </div> */}
          </div>

          <MySankeyChart
            data={data}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            timeperiod={timeperiod}
            setTimeperiod={setTimeperiod}
            dateRange={dateRange}
            setDateRange={setDateRange}
            backgroundColors={["#ED75A3", "#017EF3", "#FFC550"]}
            nodes={[
              "P1_AMFS_Transformer2",
              "P1_AMFS_Generator2",
              "P1_AMFS_Outgoing2",
              "P1_AMFS_APFC2",
              "P1_AMFS_Transformer3",
            ]}
            predefinedLinks={[
              { source: 0, target: 5, value: 100 },
              { source: 1, target: 5, value: 150 },
            ]}
          />

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
      )}
    </div>
  );
};

export default BottomTimeSeries;
