import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import WarningIcon from "@mui/icons-material/Warning"; // Default icon
import ErrorIcon from "@mui/icons-material/Error"; // Critical
import ReportProblemIcon from "@mui/icons-material/ReportProblem"; // High
import InfoIcon from "@mui/icons-material/Info"; // Medium
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Low
import UserService from "../Services/UserService";

// Styled components
const AlertsWidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2vh;
  height: auto;
  width: 100%;
`;

const AlertsContainer = styled.div`
  border-radius: 4px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 10px;
  color: var(--Gray---Typography-500, #445164);
  font-family: "DM Sans";
  font-size: 16px;
  line-height: 24px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const AlertItem = styled.div`
  display: flex;
  align-items: center;
  padding: 9px;
  border-bottom: 1px solid #eee;
  width: 95%;
  justify-content: flex-start;
  &:last-child {
    border-bottom: none;
  }
`;

const AlertIconContainer = styled.div`
  margin-right: 10px;
  padding: 5px;
  border-radius: 16px;
  background-color: ${(props) => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AlertText = styled.div`
  color: #000;
  font-family: "DM Sans";
  font-size: 14px;
  line-height: 20px;
`;

const AlertDate = styled.div`
  color: var(--Gray-500, #98a2b3);
  font-family: "DM Sans";
  font-size: 12px;
  line-height: 16px;
`;

const AlertTitle = styled.div`
  font-weight: bold;
  margin-top: 4px;
`;

// Function to return the correct icon and color for severity levels
const AlertSeverityIcon = ({ severity }) => {
  let IconComponent = WarningIcon;
  let bgColor = "#ccc"; // Default color (gray)

  switch (severity?.toLowerCase()) {
    case "low":
      IconComponent = CheckCircleIcon;
      bgColor = "#4CAF50"; // Green
      break;
    case "medium":
      IconComponent = InfoIcon;
      bgColor = "#FFC107"; // Yellow
      break;
    case "high":
      IconComponent = ReportProblemIcon;
      bgColor = "#FF9800"; // Orange
      break;
    case "critical":
      IconComponent = ErrorIcon;
      bgColor = "#F44336"; // Red
      break;
    default:
      IconComponent = WarningIcon;
      bgColor = "#FF9800"; // Default gray
  }

  return (
    <AlertIconContainer bgColor={bgColor}>
      <IconComponent style={{ color: "#fff" }} />
    </AlertIconContainer>
  );
};

const AlertsWidget = () => {
  const [alerts, setAlerts] = useState([]);
  const location = useLocation();

  // Extract last part of URL as feeder name
  const feederName = location.pathname.split("/").pop().toLowerCase();

  const fetchAlerts = async () => {
    try {
      if (feederName) {
        const apiUrl = `https://neuract.org/alerts/api/?feeder_name=${feederName}`;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${UserService.getToken()}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        const recentAlerts = Array.isArray(result) ? result.slice(0, 5) : [];
        setAlerts(recentAlerts);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [feederName]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AlertsWidgetContainer>
      {/* <h3>{feederName.toUpperCase()} Alerts</h3> */}
      <AlertsContainer>
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <AlertItem key={index}>
              <AlertSeverityIcon severity={alert.severity} />
              <AlertText>
                <AlertDate>{formatDate(alert.alert_datetime)}</AlertDate>
                <AlertTitle>{alert.alert_type}</AlertTitle>
                <div>Status: {alert.status}</div>
              </AlertText>
            </AlertItem>
          ))
        ) : (
          <div>No alerts available</div>
        )}
      </AlertsContainer>
    </AlertsWidgetContainer>
  );
};

export default AlertsWidget;
