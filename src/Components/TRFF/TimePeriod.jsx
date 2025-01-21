import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/system";
import dayjs from "dayjs";

// Styled components using Material-UI's styled API
const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  borderRadius: "8px", // Rounded corners
  overflow: "hidden", // Prevents borders from bleeding
  border: "1px solid #EAECF0", // Custom border color
  width: "28vw",
  "& .MuiToggleButton-root": {
    color: "#808080", // Custom text color
    fontFamily: "DM Sans", // Custom font family
    fontSize: "12px", // Custom font size
    fontStyle: "normal", // Normal font style
    fontWeight: 400, // Custom font weight
    lineHeight: "16px", // Custom line height
    width: "14vw",
    textTransform: "none", // Prevents text from being capitalized
    "&.Mui-selected": {
      backgroundColor: "#EAECF0", // Custom selected background color
      color: "#242F3E", // Custom selected text color
      "&:hover": {
        backgroundColor: "#D8DCE1", // Custom hover background color
      },
    },
    "&:not(:last-child)": {
      borderRight: "1px solid #EAECF0", // Custom border for non-last-child
    },
  },
});

const TimeBar = ({
  dateRange,
  setStartDate,
  setDateRange,
  setEndDate,
  setTimeperiod,
  setPeriod,
}) => {
  const updateDateRange = (range) => {
    setDateRange(range);
    const today = dayjs();

    let defaultTimePeriod = "H"; // Default time period

    switch (range) {
      case "lastHour":
        setStartDate(today.subtract(1, "hour").startOf("minute")); // Last hour start
        setEndDate(today); // Current timestamp
        defaultTimePeriod = "M"; // Resampling period in minutes
        setPeriod("H");
        break;
      case "today":
        setStartDate(today.startOf("day")); // Start of the day
        setEndDate(today); // Current timestamp
        defaultTimePeriod = "H"; // Hourly resampling
        setPeriod("D");
        break;
      case "lastWeek":
        setStartDate(today.subtract(7, "day").startOf("day")); // 7 days ago
        setEndDate(today); // Current timestamp
        defaultTimePeriod = "D"; // Daily resampling
        setPeriod("W");
        break;
      case "lastMonth":
        setStartDate(today.subtract(1, "month").startOf("day")); // Start of last month
        setEndDate(today); // Current timestamp
        defaultTimePeriod = "D"; // Daily resampling
        setPeriod("M");
        break;
      case "lastYear":
        setStartDate(today.subtract(1, "year").startOf("day")); // Start of last year
        setEndDate(today); // Current timestamp
        defaultTimePeriod = "W"; // Weekly resampling
        setPeriod("Y");

        break;
      default:
        setStartDate(today.startOf("day")); // Start of the day
        setEndDate(today); // Current timestamp
        defaultTimePeriod = "D"; // Default to daily resampling
        setPeriod("D");

        break;
    }

    setTimeperiod(defaultTimePeriod);
  };

  return (
    <StyledToggleButtonGroup
      value={dateRange}
      exclusive
      onChange={(e, newRange) => {
        if (newRange !== null) {
          updateDateRange(newRange);
        }
      }}
      aria-label="Date Range"
      size="small"
    >
      <ToggleButton value="lastHour" aria-label="Last Hour">
        Last Hour
      </ToggleButton>
      <ToggleButton value="today" aria-label="Today">
        Today
      </ToggleButton>
      <ToggleButton value="lastWeek" aria-label="Last Week">
        Last Week
      </ToggleButton>
      <ToggleButton value="lastMonth" aria-label="Last Month">
        Last Month
      </ToggleButton>
      <ToggleButton value="lastYear" aria-label="Last Year">
        Last Year
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
};

export default TimeBar;
