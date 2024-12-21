// Components/TopBar.js
import React, { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { sideBarTreeArray } from "../sidebarInfo2"; // Adjust import path as needed

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sections = Object.keys(sideBarTreeArray); // e.g., ['amf1a', 'amf1b', 'pcc3', 'pcc4']
  const allTabs = ["/peppl_p1", ...sections.map((sec) => `/peppl_p1/${sec}`)];

  const currentValue =
    allTabs.find((path) => location.pathname.startsWith(path)) || "/peppl_p1";
  const [value, setValue] = useState(currentValue);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
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
            value={`/peppl_p1/${section}/`}
            label={section.toUpperCase().replace(/_/g, " ")}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default TopBar;
