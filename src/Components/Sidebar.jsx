// Sidebar.js
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SidebarTree from "./SidebarTree";
import { sideBarTreeArray } from "../sidebarInfo2"; // Correct named import
import { useLocation } from "react-router-dom";

const Container = styled.div`
  height: 100vh;
  border-radius: 8px;
  background: var(--Neutral-White, #fff);
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #000000;
  text-align: left;
  padding: 2vh;
`;

const Paragraph = styled.p`
  color: #000;
  font-feature-settings: "liga" off, "clig" off;

  /* Paragraph/text-xs/[R] */
  font-family: "DM Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`;

const Sidebar = ({ handleItemId }) => {
  const [key, setKey] = useState("");
  const [topBarSelection, setTopBarSelection] = useState("");
  const location = useLocation();

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    // Ensure that the path has at least 3 segments
    if (pathSegments.length >= 3) {
      setTopBarSelection(pathSegments[2]);
    } else if(pathSegments.length === 2 && pathSegments[1] === 'inverter'){
      setTopBarSelection('inverters')
    } else {
      setTopBarSelection(""); // Reset if not enough segments
    }
  }, [location]);

  const handleItemIdChange = (itemId) => {
    handleItemId(itemId, topBarSelection);
  };

  return (
    <Container>
      {topBarSelection && sideBarTreeArray[topBarSelection] ? ( // Add check for existence
        <SidebarTree
          treeArray={sideBarTreeArray[topBarSelection]}
          topBarSelection={topBarSelection}
          handleItemIdChange={handleItemIdChange}
        />
      ) : (
        <Paragraph>No Data Available for the Selected Section</Paragraph> // Fallback UI
      )}
    </Container>
  );
};

export default Sidebar;
