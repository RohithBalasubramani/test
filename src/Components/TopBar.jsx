// Components/TopBar.js
import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { sideBarTreeArray } from "../sidebarInfo2"; // Adjust import path as needed

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sections = Object.keys(sideBarTreeArray); // e.g., ['amf1a', 'amf1b', 'pcc3', 'pcc4']

  useEffect(() => {
    if(location.pathname.split('/').length < 4){
      setValue("/" + location.pathname.split('/')[1])
    } else {
      setValue(location.pathname.split('/')[2])
    }
  }, [location])

  const [value, setValue] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if(sections.indexOf(newValue) < 0){
      navigate(newValue)
      return
    }
    if(newValue === "inverter"){
      navigate(`/peppl_p1/${newValue}/overview_inverter`)
    } else {
      navigate(`/peppl_p1/${newValue}/overview`);
    }
  };

  return (
    <div className="overview-tabs">
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {/* Overview Tab */}
        <Tab value="/peppl_p1" label="Overview" />

        {sections.map((section, index) => (
          <Tab
            key={section}
            value={section}
            label={section.toUpperCase().replace(/_/g, " ")}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default TopBar;
