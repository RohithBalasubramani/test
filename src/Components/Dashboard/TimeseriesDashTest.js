import React, { useState, useEffect } from "react";
import StackedBarDGEB from "./StackTest";
import DonutChart from "./DonutDash";
import DataTable from "../TableDGEB";
import CostChart from "./CostChart";
import HorizontalChart from "./BarchartVertical";
import StackedBarChart from "./StackedChart";
import MySankeyChart from "./Sankee";
import { sideBarTreeArray } from "../../sidebarInfo2";
import dayjs from "dayjs";

const BottomTimeSeries = ({ apiKey, topBar, parentName, parentName2 }) => {
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [timeperiod, setTimeperiod] = useState("H");
  const [dateRange, setDateRange] = useState("today");
  const [data, setData] = useState(null);
  const [fieldsStacked, setFieldsStacked] = useState([]);
  const [fieldsDonut, setFieldsDonut] = useState([]);
  const [sankeyNodes, setSankeyNodes] = useState([]);
  const [sankeyLinks, setSankeyLinks] = useState([]);

  /**
   * 🛠️ Extract Feeder Fields for DonutChart & SankeyChart
   */
  useEffect(() => {
    const extractFieldsFromTree = () => {
      let apiEndpoints = [];
      let nodes = [];
      let links = [];

      const addLinks = (parentIndex, children) => {
        children.forEach((child) => {
          if (child.apis) {
            child.apis.forEach((api) => {
              const key = api.split("/api/")[1]?.replace(/\//g, "");
              const label = key?.replace(/_/g, " ").toUpperCase();
              const childIndex = nodes.length;

              nodes.push({ key, label });
              links.push({
                source: parentIndex,
                target: childIndex,
                value: 100,
              });
            });
          }
          if (child.children) {
            const parentIdx = nodes.length;
            nodes.push({ key: child.id, label: child.label });
            addLinks(parentIdx, child.children);
          }
        });
      };

      if (topBar && !parentName && !parentName2) {
        const topBarNode = sideBarTreeArray[topBar];
        if (topBarNode) {
          topBarNode.forEach((child, index) => {
            if (child.id !== "overview") {
              nodes.push({ key: child.id, label: child.label });
              if (child.apis) {
                child.apis.forEach((api) => {
                  const key = api.split("/api/")[1]?.replace(/\//g, "");
                  const label = key?.replace(/_/g, " ").toUpperCase();
                  nodes.push({ key, label });
                  links.push({
                    source: index,
                    target: nodes.length - 1,
                    value: 100,
                  });
                });
              }
              if (child.children) {
                addLinks(index, child.children);
              }
            }
          });
        }
      } else if (topBar && parentName && !parentName2) {
        const parentNode = sideBarTreeArray[topBar]?.find(
          (item) => item.id === parentName
        );
        if (parentNode?.children) {
          parentNode.children.forEach((child, index) => {
            nodes.push({ key: child.id, label: child.label });
            if (child.apis) {
              child.apis.forEach((api) => {
                const key = api.split("/api/")[1]?.replace(/\//g, "");
                const label = key?.replace(/_/g, " ").toUpperCase();
                nodes.push({ key, label });
                links.push({
                  source: index,
                  target: nodes.length - 1,
                  value: 100,
                });
              });
            }
            if (child.children) {
              addLinks(index, child.children);
            }
          });
        }
      }

      const newFields = nodes.map((node) => ({
        key: node.key,
        label: node.label,
      }));

      setFieldsDonut(newFields);
      setSankeyNodes(newFields);
      setSankeyLinks(links);
    };

    extractFieldsFromTree();
  }, [apiKey, topBar, parentName, parentName2]);

  /**
   * 🛠️ Extract Feeder Fields for StackedBarDGEB
   */
  useEffect(() => {
    const determineStackedFields = () => {
      let apiEndpointsArray;

      if (parentName && !parentName2) {
        apiEndpointsArray = sideBarTreeArray[topBar]?.find(
          (item) => item.id === parentName
        );
        apiEndpointsArray = apiEndpointsArray?.children?.find(
          (child) => child.id === apiKey
        );
      } else if (parentName && parentName2) {
        apiEndpointsArray = sideBarTreeArray[topBar]?.find(
          (item) => item.id === parentName
        );
        apiEndpointsArray = apiEndpointsArray?.children?.find(
          (child) => child.id === parentName2
        );
        apiEndpointsArray = apiEndpointsArray?.children?.find(
          (child) => child.id === apiKey
        );
      } else if (!parentName && !parentName2) {
        apiEndpointsArray = sideBarTreeArray[topBar]?.find(
          (item) => item.id === apiKey
        );
      }

      const apiEndpoints = apiEndpointsArray?.apis || [];
      const newFields = apiEndpoints.map((api) => {
        const key = api.split("/api/")[1]?.replace(/\//g, "");
        const label = key?.replace(/_/g, " ");
        return { key, label };
      });

      setFieldsStacked(newFields);
    };

    determineStackedFields();
  }, [apiKey, topBar, parentName, parentName2]);

  return (
    <div>
      {fieldsStacked.length > 0 && data && (
        <>
          <StackedBarDGEB data={data} fields={fieldsStacked} />
          <CostChart data={data} fields={fieldsStacked} />
        </>
      )}

      {fieldsDonut.length > 0 && data && (
        <>
          <DonutChart data={data} fields={fieldsDonut} />
          <HorizontalChart data={data} fields={fieldsDonut} />
          <StackedBarChart data={data} fields={fieldsDonut} />
        </>
      )}

      {sankeyNodes.length > 0 && sankeyLinks.length > 0 && data && (
        <MySankeyChart
          data={data}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          timeperiod={timeperiod}
          setTimeperiod={setTimeperiod}
          dateRange={dateRange}
          setDateRange={setDateRange}
          backgroundColors={["#ED75A3", "#017EF3", "#FFC550"]}
          nodes={sankeyNodes}
          predefinedLinks={sankeyLinks}
        />
      )}
    </div>
  );
};

export default BottomTimeSeries;
