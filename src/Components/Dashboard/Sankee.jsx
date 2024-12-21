import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import TimeBar from "../TRFF/TimePeriod";
import ToggleButtons from "./Togglesampling";
import DateRangeSelector from "./Daterangeselector";
import "./StackedBarDGEB.css";
import { sideBarTreeArray } from "../../sidebarInfo2";

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
      // If node already exists but we found a deeper depth, keep the minimum depth
      nodeMap[label].depth = Math.min(nodeMap[label].depth, depth);
    }
    return nodeMap[label].index;
  };

  /**
   * 🌳 DFS Through sidebarTree to build the Sankey structure
   */
  const traverseTree = (node, parentLabel, depth) => {
    // Current node label
    const currentLabel = node.label || node.id;
    const currentNodeIndex = addNode(currentLabel, depth);

    // If there's a valid parent, create link from parent -> current
    if (parentLabel) {
      const parentIndex = nodeMap[parentLabel].index;
      linkList.push({
        source: parentIndex,
        target: currentNodeIndex,
        // We'll set a default "100" or any placeholder. Later you can refine with real data.
        value: 100,
      });
    }

    // If this node has apis, each API becomes a child node
    if (node.apis) {
      node.apis.forEach((api) => {
        // Example: "http://14.96.26.26:8080/api/p1_amfs_apfc1/"
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

    // Recursively traverse children
    if (node.children) {
      node.children.forEach((child) =>
        traverseTree(child, currentLabel, depth + 1)
      );
    }
  };

  /**
   * 🚀 Main Effect to Build Sankey
   */
  let nodeList = []; // Array of node objects { index, label, depth }
  let nodeMap = {}; // { [label]: { index, label, depth } }
  let linkList = [];

  useEffect(() => {
    if (!data) {
      setError("No data available");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Identify the root node(s) to traverse based on your props
      let rootNodes = [];

      if (topBar && !parentName && !parentName2) {
        // e.g. amf1a is topBar => sideBarTreeArray["amf1a"] is an array
        rootNodes = sideBarTreeArray[topBar] || [];
      } else if (topBar && parentName && !parentName2) {
        // Find single item with id == parentName
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

      // 2️⃣ Traverse the nodes to build up nodeList & linkList
      rootNodes.forEach((rootNode) => {
        traverseTree(rootNode, null, 0);
      });

      // 3️⃣ Map your real data from "resampled data" to the link values
      const normalizedData =
        data?.["resampled data"]?.map((row) => {
          const newRow = {};
          Object.keys(row).forEach((k) => {
            newRow[k.toLowerCase()] = row[k];
          });
          return newRow;
        }) || [];

      // 4️⃣ For each link, compute or adjust the "value" based on data
      linkList = linkList.map((lnk, index) => {
        const sourceLabel = nodeList[lnk.source].label;
        const targetLabel = nodeList[lnk.target].label;

        // Example: sum up any relevant data fields
        // This is purely an example. Adjust as needed:
        const sourceKey = sourceLabel.toLowerCase().replace(/ /g, "_");
        const targetKey = targetLabel.toLowerCase().replace(/ /g, "_");

        const realValue = normalizedData.reduce((sum, row) => {
          // If you want to combine them:
          return sum + (row[sourceKey] || 0) + (row[targetKey] || 0);
        }, 0);

        return {
          ...lnk,
          value: realValue || 100, // Fallback if no data
          color: predefinedColors[index % predefinedColors.length],
        };
      });

      // 5️⃣ (Optional) Calculate X and Y positions for a depth-based layout
      //     - The deeper a node is, the further to the right (higher X).
      //     - We'll group nodes by depth and spread them vertically (Y).
      const maxDepth = Math.max(...nodeList.map((n) => n.depth));
      const depthMap = {}; // { depthLevel: [nodeIndices...] }
      nodeList.forEach((nodeObj) => {
        if (!depthMap[nodeObj.depth]) {
          depthMap[nodeObj.depth] = [];
        }
        depthMap[nodeObj.depth].push(nodeObj.index);
      });

      // We'll place them in increments:
      // x = nodeObj.depth / maxDepth
      // y = assigned by order within that depth
      const totalNodes = nodeList.length;
      const xArr = new Array(totalNodes).fill(0);
      const yArr = new Array(totalNodes).fill(0);

      Object.keys(depthMap).forEach((depthStr) => {
        const d = parseInt(depthStr, 10);
        const indexesAtDepth = depthMap[d];
        // e.g. if depth=0 => x=0, depth=1 => x=0.2, etc.
        const xVal = maxDepth === 0 ? 0.1 : d / (maxDepth + 1);

        // Spread them vertically
        indexesAtDepth.forEach((idx, i) => {
          // normalized range 0..1
          const yVal = (i + 1) / (indexesAtDepth.length + 1);
          xArr[idx] = xVal;
          yArr[idx] = yVal;
        });
      });

      // 6️⃣ Build final plot data
      setPlotData([
        {
          type: "sankey",
          orientation: "h",
          arrangement: "snap", // or "fixed" to respect x/y
          node: {
            pad: 20,
            thickness: 20,
            line: {
              color: "#888",
              width: 1,
            },
            label: nodeList.map((nd) => nd.label),
            color: nodeList.map((nd, i) => {
              // If you want each node to have a consistent color
              return predefinedColors[i % predefinedColors.length];
            }),
            x: xArr, // manually specified x positions
            y: yArr, // manually specified y positions
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

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="stacked-bar-container">
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row">
            <div className="title">Energy Flow Chart [kWh]</div>
            <div className="controls">
              <TimeBar
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                dateRange={dateRange}
                setDateRange={setDateRange}
                setTimeperiod={setTimeperiod}
                startDate={startDate}
                endDate={endDate}
              />
              <DateRangeSelector
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              />
            </div>
          </div>
          <div className="row">
            <ToggleButtons
              dateRange={dateRange}
              timeperiod={timeperiod}
              setTimeperiod={setTimeperiod}
            />
          </div>

          <Plot
            data={plotData}
            layout={{
              title: {
                text: "Sankey Diagram",
                font: { size: 24, color: "#000" },
              },
              font: { size: 14, color: "#000" },
              margin: { l: 10, r: 10, t: 40, b: 40 },
            }}
            config={{ displayModeBar: false }}
            style={{ width: "100%", height: "600px", borderRadius: "8px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default SankeyChart;
