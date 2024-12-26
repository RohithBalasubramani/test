// generateRoutes.js
import React from "react";
import { Route, Navigate } from "react-router-dom";
import Overview from "./Pages/Overview";
import TestPage from "./Pages/TestPage";
import PhaseOverview from "./Pages/PhaseOverview";
import Inverter from "./Pages/Inverter";

const generateRoutes = (nodes, basePath = "") => {
  // 'nodes' is an array like [ {id: "overview1a", ...}, {id: "dg_1", ...}, ...]
  // 'basePath' might be "peppl_p1/amf1a"

  // Check if "overview1a" node exists
  const hasOverview = nodes.some((node) => node.label === "Overview");

  // Extract section name from basePath
  const sectionPathSegments = basePath.split("/");
  const sectionName = sectionPathSegments[sectionPathSegments.length - 1]; // e.g. "amf1a"

  const selectPage = (node) => {
    if (node.id.includes("overview") || node.children) {
      return <Overview apikey={node.id} sectionName={sectionName} />;
    } else if (node.id.toLowerCase().includes("inverter")) {
      return <Inverter apikey={node.id} sectionName={sectionName} />;
    } else {
      return <TestPage apikey={node.id} sectionName={sectionName} />;
    }
  };

  return (
    // <Route
    //   key={basePath}
    //   path={sectionName}
    //   element={<Overview apikey={sectionName} />}
    // >
    //   {/* If overview1a exists, redirect the index route to overview1a */}
    //   {hasOverview && (
    //     <Route index element={<Navigate to="overview1a" replace />} />
    //   )}
    <>
      {/* Create a route for each node, all using the Overview component */}
      {nodes.map((node) => {
        const childPath = `${basePath}/${node.id}`.replace(/\/+/g, "/");
        return (
          <React.Fragment>
            <Route
              key={childPath}
              index={node.id.includes("overview")}
              path={
                node.id.includes("overview")
                  ? `${sectionName}`
                  : `${sectionName}/${node.id}`
              }
              element={selectPage(node)}
            />
            {node.children &&
              node.children.length &&
              node.children.map((child) => {
                return (
                  <>
                    <Route
                      key={child.id}
                      index={child.id.toLowerCase().includes("overview")}
                      path={`${sectionName}/${node.id}/${child.id}`}
                      element={
                        child.id.toLowerCase().includes("overview") ||
                        child.children ? (
                          <Overview
                            apikey={child.id}
                            sectionName={sectionName}
                            parentName={node.id}
                          />
                        ) : (
                          <TestPage
                            apikey={child.id}
                            sectionName={sectionName}
                            parentName={node.id}
                          />
                        )
                      }
                    />
                    {child.children &&
                      child.children.map((ch) => {
                        return (
                          <Route
                            key={ch.id}
                            index={ch.id.toLowerCase().includes("overview")}
                            path={`${sectionName}/${node.id}/${child.id}/${ch.id}`}
                            element={
                              ch.id.toLowerCase().includes("overview") ? (
                                <Overview
                                  apikey={ch.id}
                                  sectionName={sectionName}
                                  parentName={node.id}
                                  parentName2={child.id}
                                />
                              ) : (
                                <TestPage
                                  apikey={ch.id}
                                  sectionName={sectionName}
                                  parentName={node.id}
                                  parentName2={child.id}
                                />
                              )
                            }
                          />
                        );
                      })}
                  </>
                );
              })}
          </React.Fragment>
        );
      })}
    </>
    // </Route>
  );
};

export default generateRoutes;
