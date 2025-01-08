import React from "react";
import OverviewHeader from "../Components/Inverter/OverviewHeaderInv";
import ParentRealtime from "../Components/Inverter/ParentRealtime";
import BottomTimeSeries from "../Components/Inverter/BottomTimeSeries";

const InverterOverview = () => {
  return (
    <div>
      <OverviewHeader />
      <br />
      <div className="emstit">
        <span className="emstitle">Real - Time Consumption</span>
        {/* <span className="emsspan">Status: Running EB power</span> */}

        <ParentRealtime />
        <div className="emstit">
          <span className="emstitle">Energy Consumption History</span>
          <span className="emsspan">
            Access and analyze historical energy consumption trends to identify
            patterns and areas for improvement.
          </span>
        </div>
        <BottomTimeSeries />
      </div>
    </div>
  );
};

export default InverterOverview;
