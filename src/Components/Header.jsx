import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import { NotificationsOutlined, Search } from "@mui/icons-material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useLocation, useNavigate } from "react-router-dom";
import AlertPanel from "./Alert";
import UserService from "../Services/UserService";

const TopbarContainer = styled.div`
  display: flex;
  height: 48px;
  padding: 0 24px;
  align-items: flex-end;
  background-color: #ffffff;
  padding-top: 0.7vh;
  padding-bottom: 0.7vh;
  width: auto;
  padding-right: 3vw;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 4px 8px;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #e2e2e2;
  background: #f5f6f7;
  width: 15vw;
  height: 3vh;
`;

const SearchInput = styled.input`
  font-family: "DM Sans";
  font-size: 12px;
  border: none;
  outline: none;
  background-color: #f5f6f7;
  width: 100%;
`;

const TopbarMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
`;

const AlertsButton = styled.button`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid #6b3ceb;
  background-color: transparent;
  font-size: 14px;
  cursor: pointer;
  color: #6b3ceb;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
`;

const Logo = styled.div`
  font-family: "DM sans", sans-serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  text-transform: uppercase;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: #4f6ef7;
  }
`;

const Header = () => {
  const [isAlertPanelOpen, setAlertPanelOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState("/");

  const handleAlertButtonClick = () => {
    setAlertPanelOpen(!isAlertPanelOpen);
  };

  useEffect(() => {
    setValue("/" + location.pathname.split("/")[1]);
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  const handleSearchClick = () => {
    navigate("/ai");
  };

  // Avatar menu handlers
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    UserService.doLogout(); // Clear tokens and redirect to login
    handleMenuClose();
  };

  return (
    <>
      <TopbarContainer>
        <div style={{ display: "flex", alignItems: "center", gap: "5vw" }}>
          <Logo>NEURACT</Logo>
          <InputContainer>
            <SearchInput
              type="text"
              placeholder="Want to know your Industry better? Ask our AI..."
            />
            <IconButton onClick={handleSearchClick}>
              <Search />
            </IconButton>
          </InputContainer>
        </div>
        <Tabs
          sx={{ marginTop: "2vh", verticalAlign: "bottom", gap: "0.5vw" }}
          value={value}
          onChange={handleChange}
        >
          <Tab label="Dashboard" value={"/"} />
          <Tab label="PEPPL(P1)" value={"/peppl_p1"} />
          <Tab label="PEIPL(P2)" value={"/peipl_p2"} />
          <Tab label="PEPPL(P3)" value={"/peppl_p3"} />
          <Tab label="HT" value={"/ht"} />
          <Tab label="Inverters" value={"/inverter"} />
          <Tab label="Comparisons" value={"/compare"} />
        </Tabs>
        <TopbarMenu>
          <IconButton onClick={handleAlertButtonClick}>
            <Badge
              badgeContent={3}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#5630BC",
                  color: "white",
                },
              }}
            >
              <AlertsButton>
                <NotificationsOutlined fontSize="small" />
                Alerts
              </AlertsButton>
            </Badge>
          </IconButton>
          <IconButton onClick={handleAvatarClick}>
            <UserAvatar>DN</UserAvatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleLogout}>
              <ExitToAppIcon style={{ marginRight: "8px" }} />
              Logout
            </MenuItem>
          </Menu>
        </TopbarMenu>
      </TopbarContainer>
      <AlertPanel isOpen={isAlertPanelOpen} onClose={handleAlertButtonClick} />
    </>
  );
};

export default Header;
