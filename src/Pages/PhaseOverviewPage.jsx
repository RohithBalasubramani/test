import React from "react";
import TopBar from "../Components/TopBar";
import ParentRealtime from "../Components/PhaseOverview/ParentRealTime";
import BottomTimeSeries from "../Components/PhaseOverview/BottomTimeseries";
import OverviewHeader from "../Components/PhaseOverview/PhaseHeader";

const PhaseOverviewPage = () => {
  return (
    <div>
      <div>
        {/* FULLL PHASE OVERVEIW */}
        <OverviewHeader />
        <div>
          <ParentRealtime />
          <br />
          <BottomTimeSeries />
        </div>
      </div>
    </div>
  );
};

export default PhaseOverviewPage;
