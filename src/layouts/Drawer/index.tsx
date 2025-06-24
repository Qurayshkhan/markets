import * as React from "react";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Menu from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, Theme, useTheme } from "@mui/material/styles";

import { drawerWidth } from "@utils/constants";
import { ActionHeader } from "@components/ActionHeader";

import Drawer from "./Content";

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isMobile",
})<{
  open?: boolean;
  isMobile?: boolean;
}>(({ theme, open, isMobile }) => {
  const closedDrawerWidth = 80;
  return {
    padding: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    overflow: "hidden",
    flexDirection: "column",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: isMobile ? `-${drawerWidth}px` : `-${closedDrawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    ...(!isMobile &&
      !open && {
        marginLeft: 0,
      }),
  };
});

const Children = styled("div")<{ sx?: any }>(({ theme, sx }) => ({
  overflow: "auto",
  padding: theme.spacing(3),
  backgroundColor: "#f5f6fa",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  /* width */
  "&::-webkit-scrollbar": {
    width: 5,
    backgroundColor: "transparent",
  },
  /* Track */
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  /* Thumb */
  "&::-webkit-scrollbar-thumb": {
    borderRadius: 8,
    backgroundColor: "#babac0",
  },
  /* Thumb:hover */
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#babac0",
  },
  /* Button (top and bottom of the scrollbar) */
  "&::-webkit-scrollbar-button": {
    display: "none",
  },
  ...(sx && typeof sx === 'object' ? sx : {}),
}));

export const DrawerLayout = ({
  title,
  actions,
  children,
  withBackButton,
  responsiveHeader,
}: {
  title?: string;
  withBackButton?: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
  responsiveHeader?: boolean;
}) => {
  const theme = useTheme();

  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery(
    `(max-width:${theme.breakpoints.values.md}px)`
  );

  const triggerDrawer = () => setOpen((s) => !s);

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  return (
    <Box
      sx={(theme: Theme) => ({
        width: "100vw",
        height: "100vh",
        display: "flex",
        overflow: "visible",
        backgroundColor: "#f5f6fa",
      })}
    >
      <Drawer open={open} isMobile={isMobile} triggerDrawer={triggerDrawer} />

      {/* Collapse button positioned outside drawer when closed */}
      {!open && !isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: "36px", // Align with logo section
            left: "72px", // Position outside the closed sidebar (80px width - 12px)
            zIndex: 1100, // Higher than DashboardHeader (1000)
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
            transform: "rotate(180deg)",
          }}
          onClick={triggerDrawer}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginLeft: -8 }}
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
      )}

      <Main open={open || isMobile} isMobile={isMobile}>
        {title && (
          <Box sx={{ px: 2 }}>
            <ActionHeader
              title={title}
              withBackButton={withBackButton}
              responsiveHeader={responsiveHeader}
            >
              {actions}
            </ActionHeader>
          </Box>
        )}
        <Children sx={{ padding: title ? undefined : 0 }}>{children}</Children>
      </Main>

      {isMobile && (
        <Box
          sx={(theme: Theme) => ({
            position: "fixed",
            bottom: theme.spacing(2),
            right: theme.spacing(2.6),
          })}
        >
          <Fab color="primary" onClick={triggerDrawer} size="medium">
            <Menu />
          </Fab>
        </Box>
      )}
    </Box>
  );
};
