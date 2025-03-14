// App.js
import React, { useEffect } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import PhaseOverview from "./Pages/PhaseOverview";
import Dashboard from "./Pages/Dashboard";
import TestPage from "./Pages/TestPage";
import Header from "./Components/Header";
import Overview from "./Pages/Overview";
import Compare from "./Pages/Compare";
import { sideBarTreeArray } from "./sidebarInfo2";
import generateRoutes from "./generateRoutes.js";
import PhaseOverviewPage from "./Pages/PhaseOverviewPage.jsx";
import Inverter from "./Pages/Inverter.jsx";
import IndiLayout from "./Pages/IndiLayout.jsx";
import ComingSoon from "./Pages/Empty.jsx";
import AI from "./Pages/AI.jsx";
import UserService from "./Services/UserService.js";
// import LoginPage from "./Pages/LoginPage"; // Ensure this component exists

function App() {
  // Ensure the URL starts with the correct basename.
  useEffect(() => {
    if (!window.location.pathname.startsWith("/premier")) {
      window.location.replace("/premier/");
    }
  }, []);

  // Check if the user is logged in. If not, redirect to login.
  // useEffect(() => {
  //   if (!UserService.isLoggedIn()) {
  //     window.location.replace("/premier/login");
  //   }
  // }, []);

  return (
    <div className="App">
      <BrowserRouter basename="/premier">
        <Header />
        <Routes>
          {/* Public Login Page */}
          {/* <Route path="/login" element={<LoginPage />} /> */}

          {/* Protected Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/ai" element={<AI />} />

          <Route path="/peppl_p1" element={<PhaseOverview />}>
            <Route index element={<PhaseOverviewPage />} />
            <Route path="" element={<IndiLayout />}>
              {Object.keys(sideBarTreeArray).map((section) =>
                generateRoutes(sideBarTreeArray[section], `peppl_p1/${section}`)
              )}
            </Route>
          </Route>

          {/* Additional Routes */}
          <Route path="/peipl_p2" element={<ComingSoon />} />
          <Route path="/peppl_p3" element={<ComingSoon />} />
          <Route path="/ht" element={<ComingSoon />} />
          <Route path="/inverter" element={<Inverter />} />
          <Route path="/report" element={<ComingSoon />} />
          <Route path="/compare" element={<Compare />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
