import React, { useState, useEffect } from "react";
import HorizontalHeatmapChart from "./TopConsuming";
import { sideBarTreeArray } from "../../sidebarInfo2";
import dayjs from "dayjs";

const BottomHeatMap = ({
  apiKey,
  topBar,
  parentName,
  parentName2,
  backgroundColors,
}) => {
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [timeperiod, setTimeperiod] = useState("H");
  const [data, setData] = useState(null);
  const [fieldsDonut, setFieldsDonut] = useState([]);

  /**
   * Extract Fields for Donut Chart
   */
  useEffect(() => {
    const determineFieldsDonut = () => {
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

      const apiEndpointsDonut = apiEndpointsArray?.feeder_apis || [];
      const newFieldsDonut = apiEndpointsDonut.map((api) => {
        const key = api.split("/api/")[1]?.replace(/\//g, "");
        const label = key?.replace(/_/g, " ");
        return { key, label };
      });

      console.log("Extracted Donut Fields:", newFieldsDonut);
      setFieldsDonut(newFieldsDonut);
    };

    determineFieldsDonut();
  }, [apiKey, topBar, parentName, parentName2]);

  /**
   * Fetch Data
   */
  const fetchData = async (start, end, period) => {
    try {
      const response = await fetch(
        `https://neuract.org/analytics/deltaconsolidated/?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`
      );
      const result = await response.json();
      console.log("Fetched Data:", result);
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
      {fieldsDonut.length > 0 && data && (
        <HorizontalHeatmapChart
          data={data}
          fields={fieldsDonut}
          backgroundColors={["#5630BC", "#8963EF", "#C4B1F7", "#dbcffe"]}
        />
      )}
    </div>
  );
};

export default BottomHeatMap;
