import * as React from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";

import { drawerWidth } from "@utils/constants";

import Header from "./Header";
import Navigation from "./Navigation";
import { UserMenu } from "@components/UserMenu";
import { SwitchOrganization } from "@forms/profile";

// Styled Components for exact HTML replica
const AdminMenu = styled(Box)(({ theme }) => ({
  background: "#fff",
  height: "100%",
  scrollbarWidth: "none",
  overflow: "scroll",
  transition: "all 0.3s ease",
  borderRight: "1px solid #e8edff",
  display: "flex",
  flexDirection: "column",
  "&::-webkit-scrollbar": {
    display: "none",
  },
}));

const CrancySidebarPadding = styled(Box)(({ theme }) => ({
  paddingLeft: "10px",
  paddingRight: "40px",
}));

const SupportCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#194bfb",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  padding: "0px 15px 20px",
  borderRadius: "10px",
  textAlign: "center",
  marginTop: "75px",
  backgroundImage: 'url("/img/support-bg.png")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
}));

const SupportCardTitle = styled("h4")(({ theme }) => ({
  fontWeight: 600,
  color: "#fff",
  fontSize: "18px",
  paddingTop: "20px",
  margin: 0,
}));

const SupportCardText = styled("p")(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 400,
  color: "#fff",
  lineHeight: "20px",
  margin: "10px 0 0",
}));

export default function DrawerLayout({
  open,
  isMobile,
  triggerDrawer,
}: Readonly<{
  open: boolean;
  isMobile: boolean;
  triggerDrawer: () => void;
}>) {
  const closedDrawerWidth = 80;

  return (
    <Drawer
      open={isMobile ? open : true}
      anchor="left"
      onClose={triggerDrawer}
      variant={isMobile ? "temporary" : "persistent"}
      sx={{
        flexShrink: 0,
        width: isMobile
          ? open
            ? drawerWidth
            : 0
          : open
          ? drawerWidth
          : closedDrawerWidth,
        overflow: open ? "hidden" : "visible",
        "& .MuiDrawer-paper": {
          p: 0,
          width: isMobile
            ? drawerWidth
            : open
            ? drawerWidth
            : closedDrawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#fff",
          borderRight: "none",
          transition: "width 0.3s ease",
          overflow: open ? "hidden" : "visible",
        },
      }}
    >
      <AdminMenu className="admin-menu" sx={{ position: "relative" }}>
        {/* Logo Section */}
        <CrancySidebarPadding
          className="logo crancy-sidebar-padding pd-right-0"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "100px",
            borderBottom: "1px solid #e8edff",
            paddingLeft: open ? "40px" : "30px",
            paddingRight: open ? "10px" : "0px",
            position: "relative",
            overflow: open ? "hidden" : "visible",
          }}
        >
          <Header open={open} />
          {/* Close Button - only show when sidebar is open */}
          {open && (
            <Box
              sx={{
                position: "absolute",
                right: "-4px",
                cursor: "pointer",
                width: "20px",
                height: "32px",
                borderRadius: "6px",
                backgroundColor: "#194bfb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(25, 75, 251, 0.3)",
                "&:hover": {
                  backgroundColor: "#1540d9",
                },
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
              className={`crancy__sicon close-icon ${open ? "open" : ""}`}
              onClick={triggerDrawer}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
          )}
        </CrancySidebarPadding>

        {/* Main Menu */}
        <Box className="admin-menu__one" sx={{ paddingBottom: "25px" }}>
          <Navigation open={open} />
        </Box>

        {/* Bottom Section */}
        <Box
          sx={{
            marginTop: "auto",
            paddingBottom: "40px",
            paddingLeft: open ? "40px" : "10px",
            paddingRight: open ? "40px" : "20px",
          }}
        >
          {open && (
            <Box sx={{ mb: 2 }}>
              <SwitchOrganization />
            </Box>
          )}

          <Box
            sx={{
              pt: 2,
              borderTop: "1px solid #e8edff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60px",
            }}
          >
            <UserMenu />
          </Box>
        </Box>
      </AdminMenu>
    </Drawer>
  );
}
