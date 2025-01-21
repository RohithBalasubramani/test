import React, { useEffect, useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { OverviewArray } from "../../invdata";
import { OverviewInverter } from "../../invdata";
import TimeBar from "../TRFF/TimePeriod";
import OverviewTimeBar from "../Overview/OverviewTimeBar";
import WeatherWidget from "../Dashboard/Weather";

import DateRangeSelector from "../Dashboard/Daterangeselector";
import { CloudDownload } from "@mui/icons-material";
import ReportModal from "../Reports";
import AMFgaugeStacked from "./AMFGaugeOverview";
import Alerts from "../Dashboard/Alerts";
import KPI from "./KPIOverview";
// import AMFgaugeStacked from "../PhaseOverview/AMFGauge";

// Styled Components
const DashboardHeader = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: auto;
  padding-bottom: 1vh;
`;

const ContainerBox = styled.div`
  height: 70vh;
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
  height: 60vh;
`;

const OverviewHeader = () => {
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [timeperiod, setTimeperiod] = useState("H");
  const [dateRange, setDateRange] = useState("today");
  const [data, setData] = useState({});
  const [reportData, setReportData] = useState({});
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [period, setPeriod] = useState("D");

  const handleGenerateReportClick = () => {
    setIsModalOpen(true);
    const flattenedData = flattenDataForExport();
    setReportData(flattenedData);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (formData) => {
    console.log("Report Data Submitted:", formData);
    // You can process or save the data here
  };

  const flattenDataForExport = () => {
    if (!data || Object.keys(data).length === 0) {
      console.warn("No data available for export.");
      return [];
    }

    return Object.entries(data).flatMap(([api, apiData]) => {
      // 🟢 Resampled Data (if available)
      if (apiData?.["resampled data"]?.length > 0) {
        return apiData["resampled data"].map((entry) => {
          // Include all dynamic keys in each entry
          return {
            ...entry,
          };
        });
      }

      // 🟡 Recent Data (Fallback)
      if (apiData?.["recent data"]) {
        return {
          ...apiData["recent data"],
        };
      }

      // 🟠 Average Data (Fallback)
      if (apiData?.["average data"]) {
        return {
          ...apiData["average data"],
        };
      }

      return [];
    });
  };

  /**
   *
   * 🛠️ Fetch Data from APIs listed in `OverviewArray`
   */
  const fetchData = async (start, end, period) => {
    try {
      // Extract APIs from OverviewArray
      const apiEndpoints = OverviewArray.flatMap((item) => item.apis || []);

      if (apiEndpoints.length === 0) {
        throw new Error("No API endpoints found in OverviewArray.");
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
        return { [api]: result };
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

  /**
   * 🕒 Trigger Fetch on Time Change
   */
  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate, timeperiod);
    }
  }, [startDate, endDate, timeperiod]);

  /**
   * 📊 Prepare Feeder Data for `AMFgaugeStacked`
   */
  const prepareFeederData = () => {
    return Object.values(data).map((apiData, index) => ({
      name: `Feeder ${index + 1}`,
      value: apiData?.["average data"]?.app_energy_export || 0,
    }));
  };

  const feederData = prepareFeederData();

  return (
    <ContainerBox>
      {/* 📊 Header Section */}
      <DashboardHeader>
        <DashboardTitle>Peppl Inverters</DashboardTitle>
        <div
          style={{
            marginRight: 0,
            marginLeft: "auto",
            display: "flex",
            gap: "1vw",

            height: "5vh",
            width: "70vw",
            marginBottom: "2vh",
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
            setPeriod={setPeriod}
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

      {/* 📊 Widgets Section */}
      <Container
        style={{
          display: "flex",
          gap: "2%",
          maxHeight: "fit-content",
          width: "98%",
          overflow: "hidden",
        }}
      >
        <AMFgaugeStacked
          startDate={startDate}
          endDate={endDate}
          timeperiod={timeperiod}
        />

        {/* KPI & Weather Widgets */}
        <KPI data={Object.values(data)[2]} />
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
        data={reportData}
        filename="PEPPL(Overview).xlsx"
      />
    </ContainerBox>
  );
};

export default OverviewHeader;
