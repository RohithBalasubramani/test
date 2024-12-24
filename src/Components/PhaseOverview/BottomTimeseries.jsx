import React, { useState, useEffect } from "react";
import StackedBarChart from "../Dashboard/StackedChart";
import StackedBarDGEB from "../Dashboard/StackTest";
import CostChart from "../Dashboard/CostChart";
import HorizontalChart from "../Dashboard/BarchartVertical";
import dayjs from "dayjs";
import { OverviewArray } from "../../phasedata";
import DataTable from "../TableDGEB";
import DonutChart from "../Dashboard/DonutDash";
import SankeyChart from "./Sankee";

// 📌 Extract Keys and Format Them Properly
const extractKeys = () => {
  return OverviewArray.flatMap(
    (item) =>
      item.apis?.map((api) => {
        const segments = api.split("/");
        const key = segments[segments.length - 2]; // Extract key
        return { key, label: key.replace(/_/g, " ").toUpperCase() };
      }) || []
  );
};

const BottomTimeSeries = () => {
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [timeperiod, setTimeperiod] = useState("H");
  const [dateRange, setDateRange] = useState("today");
  const [data, setData] = useState(null);

  // Extract keys as objects
  const fields = extractKeys();

  console.log("Extracted Fields:", fields);

  /**
   * 📊 Fetch Data
   */
  const fetchData = async (start, end, period) => {
    try {
      const response = await fetch(
        `http://14.96.26.26:8080/analytics/deltaconsolidated/?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate, timeperiod);
    }
  }, [startDate, endDate, timeperiod]);

  return (
    <div>
      {data && fields.length > 0 && (
        <>
          {/* 📊 Stacked Bar DGEB */}
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
            fields={fields} // Ensure fields are passed as objects
            backgroundColors={["#FF0000", "#00FF00", "#0000FF"]}
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
            fields={fields}
            backgroundColors={["#FF0000", "#00FF00", "#0000FF"]}
          />

          <div>
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
                fields={fields}
                backgroundColors={["#ED75A3", "#017EF3", "#FFC550"]}
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
                fields={fields}
              />
            </div>
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
              fields={fields}
            />

            <SankeyChart
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
          </div>
        </>
      )}
    </div>
  );
};

export default BottomTimeSeries;
