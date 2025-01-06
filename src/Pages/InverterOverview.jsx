import React from "react";
import OverviewHeader from "../Components/Inverter/OverviewHeaderInv";
import ParentRealtime from "../Components/Inverter/ParentRealtime";

const InverterOverview = () => {
  return (
    <div>
      <OverviewHeader />
      <br />
      <div className="emstit">
        <span className="emstitle">Real - Time Consumption</span>
        <span className="emsspan">Status: Running EB power</span>

        <ParentRealtime />
      </div>
    </div>
  );
};

export default InverterOverview;
