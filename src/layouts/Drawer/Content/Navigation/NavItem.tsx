import { useRouter } from "next/router";
import React from "react";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import { NavLink } from "@utils/types";

const StyledListItem = styled("li")(({ theme }) => ({
  position: "relative",
  transition: "all 0.3s ease",
  "&.active a": {
    color: "#194bfb",
    "& .crancy-menu-icon": {
      color: "#194bfb",
    },
    "& .menu-bar__name": {
      color: "#194bfb",
    },
  },
}));

const StyledLink = styled("a")(({ theme }) => ({
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "22px",
  color: "#191b23",
  padding: "14px 0px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  textDecoration: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#194bfb",
    "& .crancy-menu-icon": {
      color: "#194bfb",
    },
    "& .menu-bar__name": {
      color: "#194bfb",
    },
  },
  "&.collapsed": {
    color: "#191b23",
  },
}));

const MenuBarText = styled("span")(({ theme }) => ({
  position: "relative",
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "12px",
}));

const MenuBarName = styled("span")(({ theme }) => ({
  position: "relative",
  top: "0px",
  display: "flex",
  alignItems: "center",
  fontSize: "18px",
  fontWeight: 400,
}));

const CrancyMenuIcon = styled("span")(({ theme }) => ({
  marginRight: "1px",
  padding: 0,
  borderRadius: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  color: "#191b23",
  minWidth: "30px",
  height: "24px",
  "& .crancy-svg-icon": {
    width: "24px",
    stroke: "currentColor",
    minHeight: "22px",
    "& path": {
      stroke: "currentColor",
      strokeWidth: "1.5",
    },
  },
}));

const NavItem = ({ item, open }: { item: NavLink; open?: boolean }) => {
  const router = useRouter();

  const Icon = item.icon;
  const isExternal = item.href?.startsWith("http");
  const isSelected = item.href
    ? item.exact
      ? router.asPath === item.href
      : router.asPath.startsWith(item.href)
    : false;

  const itemHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.href) {
      if (isExternal) {
        window.open(item.href, "_blank");
      } else {
        router.push(item.href);
      }
    }
  };

  return (
    <StyledListItem className={isSelected ? "active" : ""}>
      <StyledLink
        href={item.href || "#!"}
        onClick={itemHandler}
        className="collapsed"
        title={!open ? item.label : undefined}
        sx={{
          justifyContent: open ? "space-between" : "center",
          padding: open ? "14px 0px" : "14px",
        }}
      >
        <MenuBarText className="menu-bar__text">
          {Icon && (
            <CrancyMenuIcon
              className="crancy-menu-icon crancy-svg-icon__v1"
              sx={{
                marginRight: open ? "1px" : 0,
                "& svg": {
                  width: "26px",
                  height: "24px",
                  "& path": {
                    stroke: isSelected ? "#436CFF" : "#191b23",
                    strokeWidth: "1.5",
                    fill: "none",
                  },
                },
              }}
            >
              {Icon}
            </CrancyMenuIcon>
          )}
          {open && (
            <MenuBarName className="menu-bar__name">{item.label}</MenuBarName>
          )}
        </MenuBarText>
      </StyledLink>
    </StyledListItem>
  );
};

export default NavItem;
