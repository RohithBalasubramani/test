import React, { useState, useEffect } from "react";
import StackedBarChart from "../Dashboard/StackedChart";

import HorizontalChart from "../Dashboard/BarchartVertical";
import dayjs from "dayjs";
import { OverviewArray } from "../../invdata";
import DataTable from "../TableDGEB";
import DonutChart from "../Dashboard/DonutDash";
import StackedBarDGEB from "../PhaseOverview/Stack";
import SankeyChart from "./Sankey";
import UserService from "../../Services/UserService";

// import StackedBarDGEB from "../Dashboard/StackChart";

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
        `https://neuract.org/analytics/deltaconsolidated/?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`,{
          headers: {
            "Authorization": `Bearer ${UserService.getToken()}`,
            "Content-Type": "application/json"
          }
        }
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
            backgroundColors={["#5630BC", "#8963EF", "#C4B1F7"]}
          />

          {/* <CostChart
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
            backgroundColors={["#5630BC", "#8963EF", "#C4B1F7"]}
          /> */}

          <div>
            <div style={{ display: "flex", gap: "5%" }}>
              <div style={{ width: "46%" }}>
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
                  backgroundColors={[
                    "#ED75A3",
                    "#017EF3",
                    "#FFC550",
                    "#4BC0C0",
                    "#9966FF",
                    "#ED75A3",
                    "#017EF3",
                    "#FFC550",
                    "#4BC0C0",
                    "#9966FF",
                  ]}
                />
              </div>
              <div style={{ width: "46%" }}>
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
                    "#ED75A3",
                    "#017EF3",
                    "#FFC550",
                    "#4BC0C0",
                    "#9966FF",
                  ]}
                  fields={fields}
                />
              </div>
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
                "#ED75A3",
                "#017EF3",
                "#FFC550",
                "#4BC0C0",
                "#9966FF",
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
              backgroundColors={[
                "#ED75A3",
                "#017EF3",
                "#FFC550",
                "#F09773",
                "#BF72D5",
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
          </div>
        </>
      )}
    </div>
  );
};

export default BottomTimeSeries;
