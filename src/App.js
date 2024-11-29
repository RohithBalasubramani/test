import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import PhaseOverview from "./Pages/PhaseOverview";
import Dashboard from "./Pages/Dashboard";
import TestPage from "./Pages/TestPage";
import Header from "./Components/Header";
import Overview from "./Pages/Overview";
import Compare from "./Pages/Compare";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Header />
        <Routes>
          {/* Main Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Phase Overview */}
          <Route path="peppl_p1" element={<PhaseOverview />}>
            <Route path="amf1a">
              <Route path="overview1a" element={<Overview />} />
              <Route path="*" element={<TestPage />} />
              <Route
                path="cell_pcc_panel_1_incomer/Overview"
                element={<Overview />}
              />
            </Route>
            <Route path="amf1b/*" element={<TestPage />} />
          </Route>

          {/* Additional Phases */}
          <Route path="peppl_p2" element={<PhaseOverview />} />
          <Route path="peppl_p3" element={<PhaseOverview />} />

          <Route path="compare" element={<Compare />}></Route>
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
