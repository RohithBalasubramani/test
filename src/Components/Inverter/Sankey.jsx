import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import dayjs from "dayjs";
import "../Dashboard/StackedBarDGEB.css";
import { sideBarTreeArray } from "../../sidebarInfotest";
import TimeBar from "../TRFF/TimePeriod";
import ToggleButtons from "../Togglesampling";
import DateRangeSelector from "../Dashboard/Daterangeselector";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { styled } from "@mui/system";
/**
 * Extract the second-last segment from the URL
 */
// --- Styled Radio Components ---
const StyledRadioGroup = styled(RadioGroup)({
  display: "flex",
  gap: "16px",
  flexDirection: "row",
  marginBottom: "16px",
});

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  border: "1px solid #EAECF0",
  borderRadius: "8px",
  margin: "0",
  padding: "1vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  backgroundColor: "#FFFFFF",
  "& .MuiFormControlLabel-label": {
    fontFamily: "DM Sans",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "16px",
    color: "#445164",
  },
  "& .MuiRadio-root": {
    padding: "0 8px",
    color: "#445164",
  },
  "& .MuiRadio-root.Mui-checked": {
    color: "#4E46B4",
  },
  "&:hover": {
    backgroundColor: "#F3F4F6",
  },
}));

const extractApiKey = (url) => {
  const segments = url.split("/");
  if (segments.length >= 2) {
    return segments[segments.length - 2];
  }
  return "UNKNOWN_API";
};

const defaultColors = [
  "#ED75A3",
  "#017EF3",
  "#FFC550",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FFCD56",
  "#C9CBCF",
];

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
}) => {
  const [plotData, setPlotData] = useState([]);
  const [selectedRoot, setSelectedRoot] = useState("inverter"); // Default selection
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = backgroundColors.length > 0 ? backgroundColors : defaultColors;

  let nodeList = [];
  let nodeMap = {};
  let linkList = [];

  /**
   * Add a node to nodeList if it doesn't exist yet. Return its index.
   */
  const addNode = (label) => {
    if (!nodeMap[label]) {
      nodeMap[label] = {
        index: nodeList.length,
        label,
      };
      nodeList.push(nodeMap[label]);
    }
    return nodeMap[label].index;
  };

  /**
   * Add a link between two labels.
   */
  const addLink = (sourceLabel, targetLabel, value = 100) => {
    const sourceIndex = addNode(sourceLabel);
    const targetIndex = addNode(targetLabel);
    linkList.push({
      source: sourceIndex,
      target: targetIndex,
      value,
    });
  };

  /**
   * Recursive function to build node & link structure.
   */
  const traverseChildren = (parentLabel, node) => {
    const currentLabel = node.label || node.id || "Unknown";
    addLink(parentLabel, currentLabel);

    if (node.apis && node.apis.length > 0) {
      node.apis.forEach((apiUrl) => {
        const key = extractApiKey(apiUrl);
        const apiLabel = key.replace(/_/g, " ").toUpperCase();
        addLink(currentLabel, apiLabel);
      });
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        traverseChildren(currentLabel, child);
      });
    }
  };

  /**
   * Build Sankey Data
   */
  const buildSankeyData = (filterKey = "all") => {
    nodeList = [];
    nodeMap = {};
    linkList = [];

    try {
      Object.entries(sideBarTreeArray).forEach(([rootKey, childArray]) => {
        if (filterKey !== "all" && rootKey !== filterKey) return;

        const rootLabel = rootKey.toUpperCase();
        addNode(rootLabel);

        if (Array.isArray(childArray) && childArray.length > 0) {
          childArray.forEach((childNode) => {
            traverseChildren(rootLabel, childNode);
          });
        }
      });

      const normalizedData =
        data["resampled data"]?.map((row) => {
          const copy = {};
          Object.keys(row).forEach((k) => {
            copy[k.toLowerCase()] = row[k];
          });
          return copy;
        }) || [];

      linkList = linkList.map((link, idx) => {
        const sourceLabel = nodeList[link.source].label;
        const targetLabel = nodeList[link.target].label;

        const sourceKey = sourceLabel.toLowerCase().replace(/ /g, "_");
        const targetKey = targetLabel.toLowerCase().replace(/ /g, "_");

        const realValue = normalizedData.reduce((acc, row) => {
          return acc + (row[sourceKey] || 0) + (row[targetKey] || 0);
        }, 0);

        return {
          ...link,
          value: realValue > 0 ? realValue : 100,
          color: colors[idx % colors.length],
        };
      });

      setPlotData([
        {
          type: "sankey",
          orientation: "h",
          node: {
            pad: 15,
            thickness: 20,
            line: { color: "#333", width: 1 },
            label: nodeList.map((n) => n.label),
            color: nodeList.map((_, i) => colors[i % colors.length]),
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
      console.error("Sankey Generation Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data) {
      setError("No data available for Sankey.");
      setLoading(false);
      return;
    }

    buildSankeyData(selectedRoot);
  }, [data, selectedRoot]);

  if (loading) return <div>Loading Sankey...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

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

          {/* <RadioGroup
            row
            value={selectedRoot}
            onChange={(e) => setSelectedRoot(e.target.value)}
            style={{ margin: "20px 0", gap: "1vw" }}
          >
            <StyledFormControlLabel
              value="all"
              control={<Radio />}
              label="All Nodes"
            />
            {Object.keys(sideBarTreeArray).map((rootKey) => (
              <StyledFormControlLabel
                key={rootKey}
                value={rootKey}
                control={<Radio />}
                label={rootKey.toUpperCase()}
              />
            ))}
          </RadioGroup> */}

          <Plot
            data={plotData}
            layout={{
              title: { text: "Energy Flow Chart", font: { size: 18 } },
              margin: { l: 20, r: 20, t: 40, b: 20 },
            }}
            config={{ displayModeBar: false }}
            style={{ width: "100%", height: "600px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default SankeyChart;
