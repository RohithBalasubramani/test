import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import TimeBar from "../TRFF/TimePeriod";
import ToggleButtons from "./Togglesampling";
import DateRangeSelector from "./Daterangeselector";
import "./StackedBarDGEB.css";
import { sideBarTreeArray } from "../../sidebarInfotest";

const SankeyChart = ({
  data,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  timeperiod,
  setTimeperiod,
  dateRange,
  setDateRange,
  backgroundColors = [],
  topBar,
  parentName,
  parentName2,
  apiKey,
}) => {
  const [plotData, setPlotData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 🎨 Define colors to be used for nodes/links
   */
  const predefinedColors =
    backgroundColors.length > 0
      ? backgroundColors
      : [
          "#ED75A3",
          "#017EF3",
          "#FFC550",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FFCD56",
          "#C9CBCF",
        ];

  /**
   * 🏷 Helper: Add a node if it doesn't exist yet
   */
  const addNode = (label, depth) => {
    if (nodeMap[label] == null) {
      nodeMap[label] = {
        index: nodeList.length,
        label,
        depth,
      };
      nodeList.push(nodeMap[label]);
    } else {
      nodeMap[label].depth = Math.min(nodeMap[label].depth, depth);
    }
    return nodeMap[label].index;
  };

  /**
   * 🌳 DFS Through sidebarTree to build the Sankey structure
   */
  const traverseTree = (node, parentLabel, depth) => {
    const currentLabel = node.label || node.id;
    const currentNodeIndex = addNode(currentLabel, depth);

    if (parentLabel) {
      const parentIndex = nodeMap[parentLabel].index;
      linkList.push({
        source: parentIndex,
        target: currentNodeIndex,
        value: 100,
      });
    }

    if (node.apis) {
      node.apis.forEach((api) => {
        const apiKeyRaw = api.split("/api/")[1]?.replace(/\//g, "");
        const apiLabel = apiKeyRaw?.replace(/_/g, " ").toUpperCase() || "API";
        const apiIndex = addNode(apiLabel, depth + 1);

        linkList.push({
          source: currentNodeIndex,
          target: apiIndex,
          value: 100,
        });
      });
    }

    if (node.children) {
      node.children.forEach((child) =>
        traverseTree(child, currentLabel, depth + 1)
      );
    }
  };

  /**
   * 🚀 Main Effect to Build Sankey
   */
  let nodeList = [];
  let nodeMap = {};
  let linkList = [];

  useEffect(() => {
    if (!data) {
      setError("No data available");
      setLoading(false);
      return;
    }

    try {
      let rootNodes = [];

      if (topBar && !parentName && !parentName2) {
        rootNodes = sideBarTreeArray[topBar] || [];
      } else if (topBar && parentName && !parentName2) {
        const singleNode = sideBarTreeArray[topBar]?.find(
          (item) => item.id === parentName
        );
        rootNodes = singleNode ? [singleNode] : [];
      } else if (topBar && parentName && parentName2) {
        const parentNode = sideBarTreeArray[topBar]?.find(
          (item) => item.id === parentName
        );
        const childNode = parentNode?.children?.find(
          (child) => child.id === parentName2
        );
        rootNodes = childNode ? [childNode] : [];
      }

      rootNodes.forEach((rootNode) => {
        traverseTree(rootNode, null, 0);
      });

      const normalizedData =
        data?.["resampled data"]?.map((row) => {
          const newRow = {};
          Object.keys(row).forEach((k) => {
            newRow[k.toLowerCase()] = row[k];
          });
          return newRow;
        }) || [];

      linkList = linkList.map((lnk, index) => {
        const sourceLabel = nodeList[lnk.source].label;
        const targetLabel = nodeList[lnk.target].label;

        const sourceKey = sourceLabel.toLowerCase().replace(/ /g, "_");
        const targetKey = targetLabel.toLowerCase().replace(/ /g, "_");

        const realValue = normalizedData.reduce((sum, row) => {
          return sum + (row[sourceKey] || 0) + (row[targetKey] || 0);
        }, 0);

        return {
          ...lnk,
          value: realValue || 100,
          color: predefinedColors[index % predefinedColors.length],
        };
      });

      setPlotData([
        {
          type: "sankey",
          orientation: "h",
          arrangement: "snap",
          node: {
            pad: 20,
            thickness: 20,
            line: {
              color: "#888",
              width: 1,
            },
            label: nodeList.map((nd) => nd.label),
            color: nodeList.map(
              (_, i) => predefinedColors[i % predefinedColors.length]
            ),
          },
          link: {
            source: linkList.map((l) => l.source),
            target: linkList.map((l) => l.target),
            value: linkList.map((l) => l.value),
            color: linkList.map((l) => l.color),
          },
        },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [data, topBar, parentName, parentName2, apiKey]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="stacked-bar-container">
      <div className="card shadow mb-4">
        <div className="card-body">
          <Plot
            data={plotData}
            layout={{
              title: { text: "Sankey Diagram", font: { size: 24 } },
              margin: { l: 10, r: 10, t: 40, b: 40 },
            }}
            style={{ width: "100%", height: "600px", flex: 1 }}
            config={{ displayModeBar: false }}
          />
        </div>
      </div>
    </div>
  );
};

export default SankeyChart;
