import React, { useEffect, useState } from "react";
import AMFgauge from "../Components/AmfGauge";
import KPI from "../Components/KPI";
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
  margin-left: 1vw;
  margin-right: 1vw;
  justify-content: center;
  gap: 50vw;
`;

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

  // Function to fetch data
  const fetchData = async (start, end, period) => {
    try {
      if(firstFeeder && secondFeeder){
        let firstFeederNode = getFeederNode(firstFeeder, sideBarTreeArray)
        let secondFeederNode = getFeederNode(secondFeeder, sideBarTreeArray)
        if(firstFeederNode?.length && secondFeederNode?.length){
          let firstFeederURL = firstFeederNode[0].apis[0]
          let secondFeederURL = secondFeederNode[0].apis[0]
          if(firstFeederURL && secondFeederURL){
            const [firstFeederResponse, secondFeederResponse] = await Promise.all([
              axios.get(
                `${
                  firstFeederURL
                }?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`
              ),
              axios.get(
                `${
                  secondFeederURL
                }?start_date_time=${start.toISOString()}&end_date_time=${end.toISOString()}&resample_period=${period}`
              ),
            ]);
            setFirstFeederURL(firstFeederURL)
            setSecondFeederURL(secondFeederURL)
            setFirstFeederData(firstFeederResponse.data);
            setSecondFeederData(secondFeederResponse.data);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    let arr = [];
    Object.values(sideBarTreeArray).forEach((section) => {
      section.forEach((sec) => {
        if (!sec.id.toLowerCase().includes("overview") && !sec.children) {
          arr.push({
            id: sec.id,
            label: sec.label,
          });
        }
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

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate, timeperiod);
    }
  }, [startDate, endDate, timeperiod, firstFeeder, secondFeeder]);

  const bgsource = ["#5630BC", "#8963EF", "#C4B1F7"];

  const handleChangeFeederOne = (event) => {
    setFirstFeeder(event.target.value);
  };

  const handleChangeFeederTwo = (event) => {
    setSecondFeeder(event.target.value);
  };

  return (
    <CompareContainer>
      <SelectContainer>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 170 }}>
          <InputLabel id="demo-simple-select-label">First Feeder</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={firstFeeder}
            label="Age"
            onChange={handleChangeFeederOne}
          >
            {feederArray.map((feeder) => (
              <MenuItem value={feeder.id}>{feeder.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 170 }}>
          <InputLabel id="demo-simple-select-label-1">Second Feeder</InputLabel>
          <Select
            labelId="demo-simple-select-label-1"
            id="demo-simple-select"
            value={secondFeeder}
            label="Age"
            onChange={handleChangeFeederTwo}
          >
            {feederArray.map((feeder) => (
              <MenuItem value={feeder.id}>{feeder.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </SelectContainer>
      {/* <TitleContainer>
        <div style={{ margin: "auto" }}>{firstFeeder}</div>
        <div style={{ margin: "auto" }}>{secondFeeder}</div>
      </TitleContainer> */}
      <KPIContainer>
        <AMFgauge />
        <KPI data={firstFeederData} />
        <div>
          <PowerFactorGauge apikey={firstFeederURL} />
          <FrequencyComponent apikey={firstFeederURL} />
        </div>
        <Seperator></Seperator>
        <AMFgauge />
        <KPI data={secondFeederData} />
        <div>
          <PowerFactorGauge apikey={secondFeederURL} />
          <FrequencyComponent apikey={secondFeederURL} />
        </div>
      </KPIContainer>
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
      </HistoricalDataContainer>
    </CompareContainer>
  );
};

export default Compare;
