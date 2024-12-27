// src/Pages/IndiLayout.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import styled from "styled-components";
import { Outlet, useLocation } from "react-router-dom";

const Container = styled.div`
  display: flex;
  background: #f4f5f6;
  width: 100%;
  padding: 3vh;
  gap: 10px;
  max-width: 96vw;
`;

const SidebarComp = styled.div`
  flex: 1;
`;

const OutLetContainer = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
  gap: 1%;
  width: 70vw;
`;

function IndiLayout({ apikey = "" }) {
  const location = useLocation();
  const [key, setKey] = useState(apikey || "");

  useEffect(() => {
    if (!apikey) {
      const pathSegments = location.pathname.split("/");
      const derivedKey = pathSegments[pathSegments.length - 1] || "";
      setKey(derivedKey);
    }
  }, [location, key]);

  const handleItemIdChange = (itemId, topBarSelection) => {
    setKey(itemId);
    console.log("Selected Item ID:", itemId);
  };
  return (
    <Container>
      <SidebarComp>
        <Sidebar handleItemId={handleItemIdChange} />
      </SidebarComp>
      <OutLetContainer>
        <Outlet />
      </OutLetContainer>
    </Container>
  );
}

export default IndiLayout;
