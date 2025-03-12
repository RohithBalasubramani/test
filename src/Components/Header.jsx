import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Avatar, Badge, IconButton, Tab, Tabs } from "@mui/material";
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
  flex-shrink: 0;
  /* Make sure the container allows dropdown visibility */
  overflow-y: visible;
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

const TopbarItem = styled.div`
  margin-left: 20px;
  display: flex;
  align-items: center;
  position: relative;
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

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const SearchBarContainer = styled.div`
  display: flex;
  padding: 8px var(--py-0, 0px);
  align-items: center;
  gap: 5vw;
  margin-top: auto;
  margin-bottom: auto;
`;

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
`;

/* --- CUSTOM DROPDOWN MENU STYLES (instead of MUI Menu) --- */
const DropdownMenu = styled.div`
  position: absolute;
  top: 45px;
  right: 0;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px 0;
  z-index: 3000;
  min-width: 100px;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  color: #697483;
  &:hover {
    background-color: #f5f7fa;
  }
`;

const Header = () => {
  const [isAlertPanelOpen, setAlertPanelOpen] = useState(false);
  const [value, setValue] = useState("/");
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle for logout dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setValue("/" + location.pathname.split("/")[1]);
  }, [location]);

  const handleAlertButtonClick = () => {
    setAlertPanelOpen(!isAlertPanelOpen);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  const handleSearchClick = () => {
    navigate("/ai");
  };

  // Toggle the dropdown menu when the avatar is clicked
  const handleAvatarClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Logout handler
  const handleLogout = () => {
    console.log("Logout clicked");
    // Close the dropdown first
    setIsDropdownOpen(false);
    setTimeout(() => {
      console.log("Executing UserService.doLogout()");
      UserService.doLogout();
    }, 100);
  };

  // Close the dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        </SearchBarContainer>

        <TabsContainer>
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
            <Tab label="Comparisions" value={"/compare"} />
          </Tabs>
        </TabsContainer>

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
          </TopbarItem>

          {/* Avatar with custom dropdown */}
          <TopbarItem ref={dropdownRef}>
            <IconButton onClick={handleAvatarClick}>
              <UserAvatar>DN</UserAvatar>
            </IconButton>
            {isDropdownOpen && (
              <DropdownMenu>
                <DropdownItem onClick={handleLogout}>
                  <ExitToAppIcon style={{ marginRight: "8px" }} />
                  Logout
                </DropdownItem>
              </DropdownMenu>
            )}
          </TopbarItem>
        </TopbarMenu>
      </TopbarContainer>

      {/* Alert Panel */}
      <AlertPanel isOpen={isAlertPanelOpen} onClose={handleAlertButtonClick} />
    </>
  );
};

export default Header;
