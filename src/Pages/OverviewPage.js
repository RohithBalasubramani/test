import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import DashHeader from "../Components/DashHeader";
import OverviewHeader from "../Components/Overview/OverViewHeader";

const Container = styled.div`
  display: flex;
  background: #ffffff;
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
`;

const OverviewPage = () => {
  return (
    <>
      <Container>
        {/* <SidebarComp>
          <Sidebar handleItemId={handleItemIdChange} />
        </SidebarComp> */}
        {/* <OutLetContainer>
          <Outlet />
        </OutLetContainer> */}
        <OverviewHeader />
      </Container>
    </>
  );
};

export default OverviewPage;
