import React, { useState } from "react";
import TopBar from "../Components/TopBar";
import ParentRealtime from "../Components/PhaseOverview/ParentRealTime";
import BottomTimeSeries from "../Components/PhaseOverview/BottomTimeseries";
import OverviewHeader from "../Components/PhaseOverview/PhaseHeader";
import styled from "styled-components";
import PowerOutageChart from "../Components/Powercuts";

const Container = styled.div`
  background-color: #ffffff;
  padding: 5vh;
`;

const PhaseOverviewPage = () => {
  const [realTimePower, setRealTimePower] = useState(0);
  return (
    <Container>
      <div>
        {/* FULLL PHASE OVERVEIW */}
        <OverviewHeader realTimePower={realTimePower} />
        <div>
          <div className="emstit">
            <span className="emstitle">Real - Time Consumption</span>
            <span className="emsspan">Status: Running EB power</span>
          </div>
          <ParentRealtime setRealTimePower={setRealTimePower} />
          <br />
          <div className="emstit">
            <span className="emstitle">Energy Consumption History</span>
            <span className="emsspan">
              Access and analyze historical energy consumption trends to
              identify patterns and areas for improvement.
            </span>
          </div>
          {/* <PowerOutageChart /> */}
          <BottomTimeSeries />
        </div>
      </div>
    </Container>
  );
};

export default PhaseOverviewPage;
