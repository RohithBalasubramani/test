import React, { useState, useEffect } from "react";
import StackedBarDGEB from "./StackTest";
import DonutChart from "./DonutDash";
import DataTable from "../TableDGEB";
import CostChart from "./CostChart";
import { sideBarTreeArray } from "../../sidebarInfo2";
import dayjs from "dayjs";
import HorizontalChart from "./BarchartVertical";
import StackedBarChart from "./StackedChart";
import MySankeyChart from "../Sankee";
import SankeyChart from "./Sankee";
import HorizontalHeatmapChart from "../Overview/TopConsuming";

const BottomTimeSeries = ({ apiKey, topBar, parentName, parentName2 }) => {
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [timeperiod, setTimeperiod] = useState("H");
  const [dateRange, setDateRange] = useState("today");
  const [data, setData] = useState(null);
  const [fieldsStacked, setFieldsStacked] = useState([]);
  const [fieldsDonut, setFieldsDonut] = useState([]);

  /**
   * 🛠️ Extract Feeder Fields Based on Hierarchy for DonutChart
   */
  // useEffect(() => {
  //   const extractFieldsFromTree = () => {
  //     let apiEndpoints = [];
  //     let links = [];

  //     if (topBar && !parentName && !parentName2) {
  //       // ✅ TopBar only: Get all children excluding 'overview'
  //       const topBarNode = sideBarTreeArray[topBar];
  //       if (topBarNode) {
  //         topBarNode.forEach((child) => {
  //           if (child.id !== "overview" && child.apis) {
  //             apiEndpoints.push(...child.apis);
  //           }
  //           // if (child.children) {
  //           //   child.children.forEach((subChild) => {
  //           //     if (subChild.apis) apiEndpoints.push(...subChild.apis);
  //           //   });
  //           // }
  //         });
  //       }
  //     } else if (topBar && parentName && !parentName2) {
  //       // ✅ TopBar + ParentName: Get all APIs from children of parentName
  //       const parentNode = sideBarTreeArray[topBar]?.find(
  //         (item) => item.id === parentName
  //       );

  //       if (parentNode?.children) {
  //         parentNode.children.forEach((child) => {
  //           if (child.apis) apiEndpoints.push(...child.apis);
  //           if (child.children) {
  //             child.children.forEach((subChild) => {
  //               if (subChild.apis) apiEndpoints.push(...subChild.apis);
  //             });
  //           }
  //         });
  //       }
  //     } else if (topBar && parentName && parentName2) {
  //       // ✅ TopBar + ParentName + ParentName2: Get APIs from specific child
  //       const parentNode = sideBarTreeArray[topBar]?.find(
  //         (item) => item.id === parentName
  //       );
  //       const childNode = parentNode?.children?.find(
  //         (child) => child.id === parentName2
  //       );

  //       if (childNode?.apis) {
  //         apiEndpoints.push(...childNode.apis);
  //       }
  //     }

  //     // Map to { key, label } format
  //     const newFields = apiEndpoints.map((api) => {
  //       const key = api.split("/api/")[1]?.replace(/\//g, "");
  //       const label = key?.replace(/_/g, " ").toUpperCase();
  //       return { key, label };
  //     });

  //     console.log("Extracted Donut Fields:", newFields);
  //     setFieldsDonut(newFields);
  //   };

  //   extractFieldsFromTree();
  // }, [apiKey, topBar, parentName, parentName2]);

  /**
   * 🛠️ Extract Stacked Chart Fields Separately
   */
  useEffect(() => {
    const determineStackedFields = () => {
      let apiEndpointsArray;

      if (parentName && !parentName2) {
        apiEndpointsArray = sideBarTreeArray[topBar]?.find(
          (item) => item.id === parentName
        );
        apiEndpointsArray = apiEndpointsArray?.children?.find(
          (child) => child.id === apiKey
        );
      } else if (parentName && parentName2) {
        apiEndpointsArray = sideBarTreeArray[topBar]?.find(
          (item) => item.id === parentName
        );
        apiEndpointsArray = apiEndpointsArray?.children?.find(
          (child) => child.id === parentName2
        );
        apiEndpointsArray = apiEndpointsArray?.children?.find(
          (child) => child.id === apiKey
        );
      } else if (!parentName && !parentName2) {
        apiEndpointsArray = sideBarTreeArray[topBar]?.find(
          (item) => item.id === apiKey
        );
      }

      // Map to { key, label } format
      const apiEndpointsDonut = apiEndpointsArray?.feeder_apis || [];
      const newFieldsDonut = apiEndpointsDonut.map((api) => {
        const key = api.split("/api/")[1]?.replace(/\//g, "");
        const label = key?.replace(/_/g, " ");
        return { key, label };
      });

      console.log("Extracted Donut Fields:", newFieldsDonut);
      setFieldsDonut(newFieldsDonut);

      const apiEndpoints = apiEndpointsArray?.apis || [];
      const newFields = apiEndpoints.map((api) => {
        const key = api.split("/api/")[1]?.replace(/\//g, "");
        const label = key?.replace(/_/g, " ");
        return { key, label };
      });

      console.log("Extracted Stacked Fields:", newFields);
      setFieldsStacked(newFields);
    };

    determineStackedFields();
  }, [apiKey, topBar, parentName, parentName2]);

  /**
   * 📊 Fetch Data
   */
  const fetchData = async (start, end, period) => {
    try {
      const response = await fetch(
        `https://neuract.org/analytics/deltaconsolidated/?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`
      );
      const result = await response.json();
      console.log("results raw", result);
      setData(result);
      console.log("overview data", data);
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
      {fieldsStacked.length > 0 && data && (
        <>
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
            fields={fieldsStacked}
            backgroundColors={["#5630BC", "#8963EF", "#C4B1F7", "#dbcffe"]}
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
            fields={fieldsStacked}
            backgroundColors={["#5630BC", "#8963EF", "#C4B1F7"]}
          />
        </>
      )}
      {fieldsDonut.length > 0 && data && (
        <>
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
                fields={fieldsDonut}
                backgroundColors={[
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
                ]}
                fields={fieldsDonut}
              />
            </div>
          </div>
          {/* <HorizontalHeatmapChart data={data} fields={fieldsDonut} /> */}
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
            fields={fieldsDonut}
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
              "#4BC0C0",
              "#9966FF",
            ]}
            topBar={topBar}
            parentName={parentName}
            parentName2={parentName2}
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
