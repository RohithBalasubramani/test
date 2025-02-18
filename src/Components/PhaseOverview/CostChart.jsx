import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import {
  LinearProgress,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { BorderColorOutlined } from "@mui/icons-material";
import dayjs from "dayjs";
import { OverviewSource } from "../../phasedata";
import UserService from "../../Services/UserService"

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 29vw;
  height: 50vh;
  background: #ffffff;
  padding: 4vh;
  border-radius: 10px;
  box-shadow: 7px 2px 17px 0px #c7c7c71a, 29px 10px 31px 0px #c7c7c717,
    66px 22px 42px 0px #c7c7c70d;
  position: relative;
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin: 2vh 0;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1vh;
`;

const ErrorText = styled.div`
  color: red;
  margin-top: 1vh;
`;

const TotalLabel = styled.div`
  position: absolute;
  bottom: 5%;
  right: 5%;
  font-weight: bold;
  font-size: 1.2rem;
`;

/**
 * CostChart Component
 *
 * Props:
 *  - startDate  : user-selected or default start date/time
 *  - endDate    : user-selected or default end date/time
 *  - timeperiod : resampling period (e.g., "5min", "15min", "1H")
 */
const CostChart = ({ startDate, endDate, timeperiod }) => {
  const [aggregatedData, setAggregatedData] = useState({});
  const [error, setError] = useState(null);

  // State for unit prices
  const [unitPrices, setUnitPrices] = useState({
    Solar: 10,
    "EB Supply": 10,
    "Diesel Generator": 10,
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch and aggregate feeder data
  const fetchFeederData = async () => {
    try {
      const validStartDate = startDate
        ? dayjs(startDate).toISOString()
        : dayjs().startOf("day").toISOString();
      const validEndDate = endDate
        ? dayjs(endDate).endOf("day").toISOString()
        : dayjs().endOf("day").toISOString();

      const url = `https://neuract.org/analytics/deltaconsolidated/?start_date_time=${validStartDate}&end_date_time=${validEndDate}&resample_period=${timeperiod}`;
      const response = await fetch(url,{
        headers: {
          "Authorization": `Bearer ${UserService.getToken()}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const resampledData = result?.["resampled data"] || [];
      const normalizedResampledData = resampledData.map((row) => {
        const normalizedRow = {};
        Object.keys(row).forEach((key) => {
          normalizedRow[key.toLowerCase()] = row[key];
        });
        return normalizedRow;
      });

      const aggregated = {};
      OverviewSource.forEach((source) => {
        let totalForSource = 0;

        source.apis.forEach((api) => {
          const segments = api.split("/");
          const col = segments[segments.length - 2]?.toLowerCase();

          normalizedResampledData.forEach((row) => {
            if (row[col] !== undefined) {
              let value = Number(row[col]) || 0;
              if (source.label === "Solar") {
                value = value / 1000;
              }
              totalForSource += value;
            }
          });
        });

        aggregated[source.label] = totalForSource;
      });

      setAggregatedData(aggregated);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchFeederData();
  }, [startDate, endDate, timeperiod]);

  // Dynamically calculate total cost and percentages
  const totalValue = useMemo(
    () => Object.values(aggregatedData).reduce((sum, value) => sum + value, 0),
    [aggregatedData]
  );

  const totalCost = useMemo(
    () =>
      (aggregatedData["EB Supply"] || 0) * unitPrices["EB Supply"] +
      (aggregatedData["Diesel Generator"] || 0) *
        unitPrices["Diesel Generator"] -
      (aggregatedData["Solar"] || 0) * unitPrices["Solar"],
    [aggregatedData, unitPrices]
  );

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleUnitPriceChange = (key, value) => {
    setUnitPrices((prev) => ({
      ...prev,
      [key]: isNaN(value) ? 0 : parseFloat(value),
    }));
  };

  const handleSave = () => {
    console.log("Updated Unit Prices:", unitPrices);
    setDialogOpen(false);
  };

  return (
    <Container>
      <div
        className="stat-title"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Cost</Typography>
        <div
          className="edit-button"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "1vw",
          }}
        >
          <Typography variant="body2">
            1 Unit Prices - {unitPrices.Solar} Rs (Solar),{" "}
            {unitPrices["EB Supply"]} Rs (EB), {unitPrices["Diesel Generator"]}{" "}
            Rs (DG)
          </Typography>
          <IconButton size="small" onClick={handleDialogOpen}>
            <BorderColorOutlined />
          </IconButton>
        </div>
      </div>

      <ProgressContainer>
        {Object.entries(aggregatedData).map(([category, value], index) => (
          <Box key={index} mb={2}>
            <LabelRow>
              <Typography variant="body1">{category}</Typography>
              <Typography variant="body1">
                ₹ {(value * (unitPrices[category] || 0)).toFixed(2)} (
                {((value / totalValue) * 100).toFixed(1)}%)
              </Typography>
            </LabelRow>
            <LinearProgress
              variant="determinate"
              value={(value / totalValue) * 100}
              sx={{
                height: 10,
                borderRadius: 5,
                background: "#E0E0E0",
                "& .MuiLinearProgress-bar": {
                  background: ["#5630BC", "#8963EF", "#C4B1F7"][index % 3],
                },
              }}
            />
          </Box>
        ))}
      </ProgressContainer>

      <Dialog
        sx={{ width: "25vw", display: "flex", margin: "auto" }}
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>Update Energy Unit Prices</DialogTitle>
        <DialogContent>
          <TextField
            label="Solar Unit Price"
            type="number"
            fullWidth
            margin="normal"
            value={unitPrices.Solar}
            onChange={(e) => handleUnitPriceChange("Solar", e.target.value)}
          />
          <TextField
            label="EB Unit Price"
            type="number"
            fullWidth
            margin="normal"
            value={unitPrices["EB Supply"]}
            onChange={(e) => handleUnitPriceChange("EB Supply", e.target.value)}
          />
          <TextField
            label="Generator Unit Price"
            type="number"
            fullWidth
            margin="normal"
            value={unitPrices["Diesel Generator"]}
            onChange={(e) =>
              handleUnitPriceChange("Diesel Generator", e.target.value)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            sx={{
              background: "#ffffff",
              color: "#1B2533",
              border: "1px solid #C1C7D1",
            }}
          >
            Cancel
          </Button>
          <Button
            sx={{ background: "#6036D4", color: "#ffffff" }}
            onClick={handleSave}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {error && <ErrorText>Error: {error}</ErrorText>}

      <TotalLabel>Total: ₹ {totalCost.toFixed(2)}</TotalLabel>
    </Container>
  );
};

export default CostChart;
