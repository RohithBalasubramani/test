import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import TimeBar from "../TRFF/TimePeriod";
import ToggleButtons from "./Togglesampling";
import DateRangeSelector from "./Daterangeselector";
import "./StackedBarDGEB.css";

const MySankeyChart = ({
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
  sources = [
    { key: "P1_AMFS_Transformer2", label: "Transformer 2" },
    { key: "P1_AMFS_Generator2", label: "Generator 2" },
    { key: "P1_AMFS_Transformer3", label: "Transformer 3" },
  ],
  targets = [
    { key: "P1_AMFS_Outgoing2", label: "Outgoing 2" },
    { key: "P1_AMFS_APFC2", label: "APFC 2" },
  ],
}) => {
  const [plotData, setPlotData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const predefinedColors =
    backgroundColors.length > 0
      ? backgroundColors
      : [
          "rgba(237, 117, 163, 0.6)", // #ED75A3
          "rgba(1, 126, 243, 0.6)", // #017EF3
          "rgba(191, 114, 213, 0.6)", // #BF72D5
          "rgba(240, 151, 115, 0.6)", // #F09773
          "rgba(255, 197, 80, 0.6)", // #FFC550
          "rgba(67, 67, 67, 0.6)", // #434343
          "rgba(255, 77, 0, 0.6)", // #ff4d00
          "rgba(201, 203, 207, 0.6)", // #C9CBCF
        ];

  useEffect(() => {
    if (data && data["resampled data"]) {
      try {
        const resampledData = data["resampled data"];
        const chartNodes = [
          ...sources.map((source) => source.label),
          "Bus Bar",
          ...targets.map((target) => target.label),
        ];
        const links = [];

        const addLink = (sourceLabel, targetLabel, value, colorIndex) => {
          links.push({
            source: chartNodes.indexOf(sourceLabel),
            target: chartNodes.indexOf(targetLabel),
            value,
            color: predefinedColors[colorIndex % predefinedColors.length],
          });
        };

        // Energy flow from sources to the Bus Bar
        sources.forEach((source, index) => {
          const totalSourceValue = resampledData.reduce(
            (sum, item) => sum + (item[source.key] || 0),
            0
          );
          if (totalSourceValue > 0) {
            addLink(source.label, "Bus Bar", totalSourceValue, index);
          }
        });

        // Energy flow from Bus Bar to targets
        targets.forEach((target, index) => {
          const totalTargetValue = resampledData.reduce(
            (sum, item) => sum + (item[target.key] || 0),
            0
          );
          if (totalTargetValue > 0) {
            addLink(
              "Bus Bar",
              target.label,
              totalTargetValue,
              index + sources.length
            );
          }
        });

        setPlotData([
          {
            type: "sankey",
            orientation: "h",
            node: {
              pad: 20,
              thickness: 30,
              line: {
                color: "rgba(86, 48, 188, 0.8)",
                width: 1,
              },
              label: chartNodes,
              color: "rgba(86, 48, 188, 0.8)",
              hovertemplate:
                "Node: %{label}<br>Total Flow: %{value} kWh<extra></extra>",
            },
            link: {
              source: links.map((link) => link.source),
              target: links.map((link) => link.target),
              value: links.map((link) => link.value),
              color: links.map((link) => link.color),
              hovertemplate:
                "Flow: %{value} kWh<br>From: %{source.label} to %{target.label}<extra></extra>",
            },
          },
        ]);
      } catch (error) {
        console.error("Error processing data", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError("No resampled data available");
    }
  }, [data, sources, targets, backgroundColors]);

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
                font: {
                  size: 24,
                  color: "#000",
                },
              },
              font: {
                size: 14,
                color: "#000",
              },
              margin: { l: 10, r: 10, t: 40, b: 40 },
            }}
            config={{
              displayModeBar: false,
            }}
            style={{ width: "100%", height: "100%", borderRadius: "8px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default MySankeyChart;
