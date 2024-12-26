import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";
import styled from "styled-components";
import FilterListIcon from "@mui/icons-material/FilterList";

// ================== Styled Components ==================
const StyledTableContainer = styled(TableContainer)`
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const StyledTableHeader = styled(TableCell)`
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: #445164;
  background-color: #d6dae1;
  white-space: nowrap;
  padding: 16px 24px;
`;

const StyledTableCell = styled(TableCell)`
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #445164;
  padding: 16px 24px;
  background-color: #fff;
`;

const FilterButton = styled.button`
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  color: #444;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 1vh;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  z-index: 999;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const CheckboxLabel = styled.label`
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  margin-left: 8px;
  color: #444;
`;

const DataTable = ({ tablesData, rowsPerPage }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});

  // Initialize visibleColumns once data is available
  useEffect(() => {
    if (tablesData?.length > 0) {
      const firstRow = tablesData[0];
      const columns = Object.keys(firstRow);
      const initialColumns = {};
      columns.forEach((col) => {
        initialColumns[col] = true; // show all columns by default
      });
      setVisibleColumns(initialColumns);
      setSortColumn("timestamp"); // default sort col if needed
    }
  }, [tablesData]);

  // Safe Access
  const safeData = Array.isArray(tablesData) ? tablesData : [];

  const handleSortRequest = (col) => {
    const isAsc = sortColumn === col && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(col);
  };

  // Toggle filter dropdown
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  // Show/hide columns
  const handleColumnVisibilityChange = (col) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [col]: !prev[col],
    }));
  };

  // Filter out columns
  const filteredRows = safeData.map((row) => {
    const filteredRow = {};
    for (const [key, value] of Object.entries(row)) {
      if (visibleColumns[key]) {
        filteredRow[key] = value;
      }
    }
    return filteredRow;
  });

  // Sort Rows
  const sortedRows = [...filteredRows].sort((a, b) => {
    const valA = a[sortColumn];
    const valB = b[sortColumn];
    if (valA === valB) return 0;

    // convert to string for safe compare
    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
    // fallback string comparison
    return sortOrder === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  return (
    <>
      <div style={{ position: "relative", marginBottom: "1vh" }}>
        <FilterButton onClick={toggleFilter}>
          <FilterListIcon />
          <span style={{ marginLeft: 4 }}>Filter Columns</span>
        </FilterButton>
        <DropdownContent show={showFilter}>
          {safeData[0] &&
            Object.keys(safeData[0]).map((col) => (
              <CheckboxContainer key={col}>
                <input
                  type="checkbox"
                  checked={visibleColumns[col] || false}
                  onChange={() => handleColumnVisibilityChange(col)}
                />
                <CheckboxLabel>{col}</CheckboxLabel>
              </CheckboxContainer>
            ))}
        </DropdownContent>
      </div>

      {safeData.length === 0 ? (
        <div>No data available</div>
      ) : (
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(safeData[0] || {}).map((header) => {
                  if (!visibleColumns[header]) return null;
                  return (
                    <StyledTableHeader key={header}>
                      <TableSortLabel
                        active={sortColumn === header}
                        direction={sortOrder}
                        onClick={() => handleSortRequest(header)}
                      >
                        {header}
                      </TableSortLabel>
                    </StyledTableHeader>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.slice(0, rowsPerPage).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.keys(row).map((col) => {
                    if (!visibleColumns[col]) return null;
                    return (
                      <StyledTableCell key={col}>
                        {row[col] ?? "-"}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}
    </>
  );
};

export default DataTable;
