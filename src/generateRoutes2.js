import React from "react";
import { Route } from "react-router-dom";
import Overview from "./Pages/Overview";
import TestPage from "./Pages/TestPage";

const generateRoutes = (nodes, basePath = "") => {
  if (!nodes || nodes.length === 0) return null;

  return nodes.map((node) => {
    const childPath = `${basePath}/${node.id}`.replace(/\/+/g, "/"); // Ensure valid paths

    return (
      <React.Fragment>
        <Route
          path={node.id}
          element={
            node.id.toLowerCase().includes("overview") ? (
              <Overview apikey={node.id} />
            ) : (
              <TestPage apikey={node.id} />
            )
          }
        />

        {node.children &&
          node.children.length > 0 &&
          node.children.map((child) => (
            <Route
              key={child.id}
              path={
                child.id.toLowerCase().includes("overview")
                  ? `${node.id}/${child.id}`
                  : `${childPath}/${child.id}`
              }
              element={
                child.id.includes("overview") ? (
                  <Overview apikey={child.id} />
                ) : (
                  <TestPage apikey={child.id} />
                )
              }
            />
          ))}
      </React.Fragment>
    );
  });
};

export default generateRoutes;
