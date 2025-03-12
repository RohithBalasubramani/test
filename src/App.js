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

function App() {
  console.log("sideBarTreeArray:", sideBarTreeArray); // Debugging line
  console.log("auth token", UserService.getToken());

  useEffect(() => {
    // If the URL doesn't start with the expected basename, redirect there.
    if (!window.location.pathname.startsWith("/premier")) {
      window.location.replace("/premier/");
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter basename="/premier">
        <Header />
        <Routes>
          {/* Public Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/ai" element={<PrivateRoute element={<AI />} />} />

          <Route
            path="/peppl_p1"
            element={<PrivateRoute element={<PhaseOverview />} />}
          >
            <Route index element={<PhaseOverviewPage />} />
            <Route path="" element={<IndiLayout />}>
              {Object.keys(sideBarTreeArray).map((section) =>
                generateRoutes(sideBarTreeArray[section], `peppl_p1/${section}`)
              )}
            </Route>
          </Route>

          {/* Additional Routes */}
          <Route
            path="/peipl_p2"
            element={<PrivateRoute element={<ComingSoon />} />}
          />
          <Route
            path="/peppl_p3"
            element={<PrivateRoute element={<ComingSoon />} />}
          />
          <Route
            path="/ht"
            element={<PrivateRoute element={<ComingSoon />} />}
          />
          <Route
            path="/inverter"
            element={<PrivateRoute element={<Inverter />} />}
          />
          <Route
            path="/report"
            element={<PrivateRoute element={<ComingSoon />} />}
          />
          <Route
            path="/compare"
            element={<PrivateRoute element={<Compare />} />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
