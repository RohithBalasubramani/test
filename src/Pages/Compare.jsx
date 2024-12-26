import React, { useEffect, useState } from "react";
import AMFgauge from "../Components/AmfGauge"; // second gauge remains
import AMFgaugeStacked from "../Components/PhaseOverview/AMFGauge"; // new stacked gauge
import PowerFactorGauge from "../Components/CompareScreenComp/PowerFactor";
import FrequencyComponent from "../Components/CompareScreenComp/Frequency";
import styled from "styled-components";
import RealTimeChart from "../Components/CompareScreenComp/Composite";
import RealTimeCurrentChart from "../Components/CompareScreenComp/CurrentChart";
import RealTimeVoltageChart from "../Components/CompareScreenComp/VoltageChart";
import dayjs from "dayjs";
import sidbarInfo from "../sidbarInfo";
import StackedBarDGEB from "../Components/CompareScreenComp/StackTest";
import CostChart from "../Components/CompareScreenComp/CostChart";
import VoltageHistorical from "../Components/CompareScreenComp/VoltageHist";
import CurrentHistorical from "../Components/CompareScreenComp/CurrentHist";
import PowerfactorAndFreqHistorical from "../Components/CompareScreenComp/PowerFactorAndFreqHist";
import { sideBarTreeArray } from "../sidebarInfo2";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getFeederNode } from "../dfs";
import StackedPowerFactorGauge from "../Components/CompareScreenComp/StackedPoweFactor";
import DataTable from "../Components/CompareScreenComp/Table";
import KPI from "../Components/CompareScreenComp/KPI";

// =============== Styled Components ===============
const Container = styled.div`
  padding: 5vh;
`;

const Seperator = styled.div`
  border-left: 3px solid gray;
`;
const KPIContainer = styled.div`
  display: flex;
  gap: 2vw;
  justify-content: center;
`;
const RealTimeChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3vh;
  margin-left: 1vw;
  margin-right: 1vw;
`;
const CompareContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3vh;
  padding: 5vh;
`;
const HistoricalDataContainer = styled.div`
  margin-left: 1vw;
  margin-right: 1vw;
`;
const TitleContainer = styled.div`
  /* margin-left: 23vw; */
  display: flex;
  /* gap: 50vw; */
  margin-left: 1vw;
  margin-right: 1vw;
`;
const SelectContainer = styled.div`
  /* margin-left: 23vw; */
  display: flex;
  /* gap: 50vw; */

  justify-content: space-between;
  gap: auto;
`;

// ✅ Styled FormControl
const StyledFormControl = styled(FormControl)`
  && {
    min-width: 170px;
    margin: 1vw;
    background: #f9fafc;
    border-radius: 8px;
    border: 1px solid #ccc;
    &:hover {
      border-color: #8963ef;
    }
    .MuiInputBase-root {
      border-radius: 8px;
      padding: 5px 10px;
      color: #333;
    }
    .MuiInputBase-root::before {
      border-bottom: none !important;
    }
    .MuiInputBase-root::after {
      border-bottom: none !important;
    }
    .MuiSelect-icon {
      color: #8963ef;
    }
    .Mui-focused {
      border-color: #5630bc !important;
    }
  }
`;

// ✅ Styled InputLabel
const StyledInputLabel = styled(InputLabel)`
  && {
    color: #5630bc;
    font-weight: bold;
    margin-left: 8px;
    font-size: 14px;
  }
`;

// ✅ Styled MenuItem
const StyledMenuItem = styled(MenuItem)`
  && {
    font-size: 14px;
    color: #333;
    &:hover {
      background: #f0f4ff;
      color: #5630bc;
    }
    &.Mui-selected {
      background: #e9e4ff;
      color: #5630bc;
    }
  }
`;

const TableSection = styled.div`
  margin-top: 2vh;
`;

// =============== Main Compare Component ===============
const Compare = ({ apikey, key }) => {
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [timeperiod, setTimeperiod] = useState("H");
  const [dateRange, setDateRange] = useState("today");
  const [firstFeederData, setFirstFeederData] = useState();
  const [secondFeederData, setSecondFeederData] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [firstFeeder, setFirstFeeder] = useState("");
  const [secondFeeder, setSecondFeeder] = useState("");
  const [feederArray, setFeederArray] = useState([]);
  const [firstFeederURL, setFirstFeederURL] = useState("");
  const [secondFeederURL, setSecondFeederURL] = useState("");
  const [tableData, setTableData] = useState([]);

  // =============== Prepare Data for AMFgaugeStacked ===============
  // We'll convert the first and second feeder's `app_energy_export` from resampled data
  // into an array that AMFgaugeStacked expects: [{ name: "FeederName", value: number }, ...]
  const prepareFeederGaugeData = (firstData, secondData) => {
    const feeders = [];

    // Safely check if resampled data is an array to avoid reduce() errors
    if (Array.isArray(firstData?.["resampled data"])) {
      const totalAppExport = firstData["resampled data"].reduce(
        (sum, item) => sum + (item?.app_energy_export || 0),
        0
      );
      feeders.push({
        name: "First Feeder",
        value: totalAppExport,
      });
    }

    if (Array.isArray(secondData?.["resampled data"])) {
      const totalAppExport = secondData["resampled data"].reduce(
        (sum, item) => sum + (item?.app_energy_export || 0),
        0
      );
      feeders.push({
        name: "Second Feeder",
        value: totalAppExport,
      });
    }

    return feeders;
  };

  const feedersData = prepareFeederGaugeData(firstFeederData, secondFeederData);

  // =============== Fetch Feeder Data ===============
  const fetchData = async (start, end, period) => {
    try {
      if (firstFeeder && secondFeeder) {
        let firstFeederNode = getFeederNode(firstFeeder, sideBarTreeArray);
        let secondFeederNode = getFeederNode(secondFeeder, sideBarTreeArray);

        if (firstFeederNode?.length && secondFeederNode?.length) {
          let firstFeederURL = firstFeederNode[0].apis[0];
          let secondFeederURL = secondFeederNode[0].apis[0];

          if (firstFeederURL && secondFeederURL) {
            const [firstFeederResponse, secondFeederResponse] =
              await Promise.all([
                axios.get(
                  `${firstFeederURL}?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`
                ),
                axios.get(
                  `${secondFeederURL}?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`
                ),
              ]);

            setFirstFeederURL(firstFeederURL);
            setSecondFeederURL(secondFeederURL);
            setFirstFeederData(firstFeederResponse.data);
            setSecondFeederData(secondFeederResponse.data);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // =============== Load Feeder Select Options ===============
  useEffect(() => {
    let arr = [];
    // Building an array of feeders from sideBarTreeArray
    Object.values(sideBarTreeArray).forEach((section) => {
      section.forEach((sec) => {
        // push if no "overview" in ID, no children
        if (!sec.id.toLowerCase().includes("overview") && !sec.children) {
          arr.push({
            id: sec.id,
            label: sec.label,
          });
        }
        // if children exist
        if (sec.children) {
          sec.children.forEach((child) => {
            if (
              !child.id.toLowerCase().includes("overview") &&
              !child.children
            ) {
              arr.push({
                id: child.id,
                label: child.label,
              });
            }
            // if deeper children exist
            if (child.children) {
              child.children.forEach((ch) => {
                if (!ch.id.toLowerCase().includes("overview")) {
                  arr.push({
                    id: ch.id,
                    label: ch.label,
                  });
                }
              });
            }
          });
        }
      });
    });
    setFeederArray(arr);
  }, []);

  // =============== Trigger Data Fetch Whenever Inputs Change ===============
  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate, timeperiod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, timeperiod, firstFeeder, secondFeeder]);

  // =============== Color Source for Graphs ===============
  const bgsource = ["#5630BC", "#8963EF", "#C4B1F7"];

  // =============== Handlers for Feeder Selection ===============
  const handleChangeFeederOne = (event) => {
    setFirstFeeder(event.target.value);
  };
  const handleChangeFeederTwo = (event) => {
    setSecondFeeder(event.target.value);
  };

  // Prepare Power Factor Data
  const preparePowerFactorData = (firstFeederData, secondFeederData) => {
    const feeders = [];

    if (firstFeederData?.["recent data"]) {
      feeders.push({
        name: "First Feeder",
        value: Math.floor(
          firstFeederData["recent data"].avg_power_factor * 100
        ),
      });
    }

    if (secondFeederData?.["recent data"]) {
      feeders.push({
        name: "Second Feeder",
        value: Math.floor(
          secondFeederData["recent data"].avg_power_factor * 100
        ),
      });
    }

    return feeders;
  };

  const powerFactorData = preparePowerFactorData(
    firstFeederData,
    secondFeederData
  );

  // useEffect(() => {
  //   const mergedData = firstFeederData.map((item, index) => ({
  //     timestamp: item.timestamp || "-",
  //     "Feeder1 - app_energy_export": item.app_energy_export || "-",
  //     "Feeder1 - avg_current": item.avg_current || "-",
  //     "Feeder2 - app_energy_export":
  //       secondFeederData[index]?.app_energy_export || "-",
  //     "Feeder2 - avg_current": secondFeederData[index]?.avg_current || "-",
  //   }));

  //   setTableData(mergedData);
  // }, [firstFeederData, secondFeederData]);

  function mergeFeederData(
    feeder1Array = [],
    feeder2Array = [],
    feeder1Name = "Feeder1",
    feeder2Name = "Feeder2"
  ) {
    const maxLen = Math.max(feeder1Array.length, feeder2Array.length);
    const merged = [];

    for (let i = 0; i < maxLen; i++) {
      const item1 = feeder1Array[i] || {};
      const item2 = feeder2Array[i] || {};

      const row = {};

      row.timestamp = item1.timestamp || item2.timestamp || "-";

      Object.entries(item1).forEach(([key, value]) => {
        if (key !== "id") {
          row[`${feeder1Name} - ${key}`] = value ?? "-";
        }
      });

      // Merge feeder2 keys
      Object.entries(item2).forEach(([key, value]) => {
        if (key !== "id") {
          row[`${feeder2Name} - ${key}`] = value ?? "-";
        }
      });

      merged.push(row);
    }
    return merged;
  }

  useEffect(() => {
    const merged = mergeFeederData(
      firstFeederData,
      secondFeederData,
      "Feeder1",
      "Feeder2"
    );
    setTableData(merged);
  }, [firstFeederData, secondFeederData]);

  return (
    <CompareContainer>
      <SelectContainer>
        <StyledFormControl style={{ marginLeft: 0 }} variant="standard">
          <StyledInputLabel>First Feeder</StyledInputLabel>
          <Select
            value={firstFeeder}
            onChange={(e) => setFirstFeeder(e.target.value)}
          >
            {feederArray.map((feeder) => (
              <StyledMenuItem key={feeder.id} value={feeder.id}>
                {feeder.label}
              </StyledMenuItem>
            ))}
          </Select>
        </StyledFormControl>

        <StyledFormControl variant="standard">
          <StyledInputLabel>Second Feeder</StyledInputLabel>
          <Select
            value={secondFeeder}
            onChange={(e) => setSecondFeeder(e.target.value)}
          >
            {feederArray.map((feeder) => (
              <StyledMenuItem key={feeder.id} value={feeder.id}>
                {feeder.label}
              </StyledMenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </SelectContainer>

      <KPIContainer>
        <AMFgaugeStacked feeders={feedersData} />
        <div>
          <KPI data={firstFeederData} />
          {/* KPI for second Feeder */}
          <KPI data={secondFeederData} />
        </div>
      </KPIContainer>

      <div className="emstit">
        <span className="emstitle">Real - Time Consumption</span>
        <span className="emsspan">Comparision of feeders in real-time </span>
      </div>

      <RealTimeChartContainer>
        <RealTimeChart
          firstFeederApiKey={firstFeederURL}
          secondFeederApiKey={secondFeederURL}
        />
        <RealTimeCurrentChart
          firstFeederApiKey={firstFeederURL}
          secondFeederApiKey={secondFeederURL}
        />
        <RealTimeVoltageChart
          firstFeederApiKey={firstFeederURL}
          secondFeederApiKey={secondFeederURL}
        />
      </RealTimeChartContainer>

      {/* =============== Historical Data & Charts =============== */}

      <div className="emstit">
        <span className="emstitle">Energy Consumption History</span>
        <span className="emsspan">
          Compare while accessing and analyzing historical energy consumption
          trends to identify patterns and areas for improvement.
        </span>
      </div>
      <HistoricalDataContainer>
        <StackedBarDGEB
          data={firstFeederData}
          firstFeeder={firstFeeder}
          secondFeeder={secondFeeder}
          secondFeederData={secondFeederData}
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
          data={firstFeederData}
          firstFeeder={firstFeeder}
          secondFeeder={secondFeeder}
          secondFeederData={secondFeederData}
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
          data={firstFeederData}
          secondFeederData={secondFeederData}
          firstFeeder={firstFeeder}
          secondFeeder={secondFeeder}
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
          data={firstFeederData}
          secondFeederData={secondFeederData}
          firstFeeder={firstFeeder}
          secondFeeder={secondFeeder}
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
          data={firstFeederData}
          secondFeederData={secondFeederData}
          firstFeeder={firstFeeder}
          secondFeeder={secondFeeder}
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

        <TableSection>
          <DataTable
            tablesData={tableData}
            rowsPerPage={10}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            timeperiod={timeperiod}
            setTimeperiod={setTimeperiod}
            dateRange="custom"
            setDateRange={() => {}}
          />
        </TableSection>
      </HistoricalDataContainer>
    </CompareContainer>
  );
};

export default Compare;
