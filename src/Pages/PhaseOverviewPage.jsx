import React from "react";
import TopBar from "../Components/TopBar";
import ParentRealtime from "../Components/PhaseOverview/ParentRealTime";
import BottomTimeSeries from "../Components/PhaseOverview/BottomTimeseries";
import OverviewHeader from "../Components/PhaseOverview/PhaseHeader";
import styled from "styled-components";

const Container = styled.div`
  background-color: #ffffff;
  padding: 5vh;
`;

const PhaseOverviewPage = () => {
  return (
    <Container>
      <div>
        {/* FULLL PHASE OVERVEIW */}
        <OverviewHeader />
        <div>
          <div className="emstit">
            <span className="emstitle">Real - Time Consumption</span>
            <span className="emsspan">Status: Running EB power</span>
          </div>
          <ParentRealtime />
          <br />
          <div className="emstit">
            <span className="emstitle">Energy Consumption History</span>
            <span className="emsspan">
              Access and analyze historical energy consumption trends to
              identify patterns and areas for improvement.
            </span>
          </div>
          <BottomTimeSeries />
        </div>
      </div>
    </Container>
  );
};

export default PhaseOverviewPage;
