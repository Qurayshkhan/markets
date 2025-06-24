import React from "react";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import NavGroup from "./NavGroup";
import { NavLink } from "@utils/types";
import { useRouteLinks } from "@hooks/auth";

const CrancySidebarPadding = styled(Box)(({ theme }) => ({
  paddingLeft: "40px",
  paddingRight: "40px",
}));

const AdminMenuTitle = styled("h4")(({ theme }) => ({
  marginBottom: "10px",
  color: "#5d6a83",
  fontWeight: 400,
  fontSize: "14px",
  borderBottom: "1px solid #edf2f7",
  paddingBottom: "5px",
}));

const Navigation = ({ open }: { open?: boolean }) => {
  const { NavLinks } = useRouteLinks();

  const navGroups = NavLinks.map((item: NavLink) => {
    switch (item.type) {
      case "group":
        return (
          <CrancySidebarPadding
            key={item.label}
            className="admin-menu__one crancy-sidebar-padding"
            sx={{
              marginTop: "20px",
              paddingLeft: open ? "40px" : "10px",
              paddingRight: open ? "40px" : "20px",
            }}
          >
            {open && (
              <AdminMenuTitle className="admin-menu__title">
                {item.label}
              </AdminMenuTitle>
            )}
            <NavGroup item={item} open={open} />
          </CrancySidebarPadding>
        );
      default:
        return (
          <Typography
            variant="h6"
            color="error"
            align="center"
            key={item.label}
          >
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <>{navGroups}</>;
};

export default Navigation;
