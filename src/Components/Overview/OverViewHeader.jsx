import React, { useEffect, useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import TimeBar from "../TRFF/TimePeriod";
import AMFgaugeStacked from "./AmfGaugeStacked";
import KPI from "../KPI";
import WeatherWidget from "../Weather";
import { sideBarTreeArray } from "../../sidebarInfo2"; // Assuming this is your Treeview array
import OverviewTimeBar from "./OverviewTimeBar";
import Alerts from "../Dashboard/Alerts";
import DateRangeSelector from "../Dashboard/Daterangeselector";
import { CloudDownload } from "@mui/icons-material";
import ReportModal from "../Reports";
import OverviewGaugeLoader from "../LoadingScreens/OverviewGaugeLoader";

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
`;

const ContainerBox = styled.div`
  height: 57vh;
  overflow: hidden;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState(null);
  const [kpiKey, setKpiKey] = useState(0);

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
      setReportData(Object.values(results[0])[0]["resampled data"]);
      console.log("Fetched and Aggregated Data:", aggregatedData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    setData({});
    if (startDate && endDate && apiKey && sectionName) {
      fetchData(startDate, endDate, timeperiod);
    }
  }, [startDate, endDate, timeperiod, apiKey, sectionName]);

  const handleGenerateReportClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (formData) => {
    console.log("Report Data Submitted:", formData);
    // You can process or save the data here
  };

  return (
    <ContainerBox>
      <DashboardHeader>
        <DashboardTitle>Overview Page</DashboardTitle>
        <div
          style={{
            display: "flex",
            gap: "1vw",
            height: "min-content",
            width: "50vw",
            marginRight: "0",
            marginLeft: "auto",
            alignItems: "right",
          }}
        >
          <OverviewTimeBar
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            setTimeperiod={setTimeperiod}
            startDate={startDate}
            endDate={endDate}
          />
          <DateRangeSelector
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            setTimeperiod={setTimeperiod}
            startDate={startDate}
            endDate={endDate}
          />
          <button onClick={handleGenerateReportClick} className="emsbutton">
            <i className="emsbuttonicon">
              <CloudDownload />
            </i>
            <span>Generate Report</span>
          </button>
        </div>
      </DashboardHeader>
      <Container
        style={{ display: "flex", gap: "2%", maxHeight: "fit-content" }}
      >
        {Object.keys(data)?.length > 0 ? (
          <AMFgaugeStacked feederData={data} setKpiKey={setKpiKey} />
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : (
          <OverviewGaugeLoader />
        )}

        <KPI data={Object.values(data)[kpiKey]} />
        <Alerts />
      </Container>
      <ReportModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        timeperiod={timeperiod}
        setTimeperiod={setTimeperiod}
        dateRange={dateRange}
        setDateRange={setDateRange}
        data={reportData} // Pass the processed reportData directly
        filename="OverviewReport.xlsx"
      />
    </ContainerBox>
  );
};

export default OverviewHeader;
