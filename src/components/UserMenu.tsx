import React from "react";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import { Theme, styled } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Avatar from "@mui/material/Avatar";

import { MenuLink } from "@utils/types";
import { useRouteLinks } from "@hooks/auth";
import { drawerWidth } from "@utils/constants";
import { useAppContext } from "@contexts/index";

// Styled components matching Zomur theme
const ProfileButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  width: "48px",
  height: "48px",
  backgroundColor: "#194bfb",
  "&:hover": {
    backgroundColor: "#1540d9",
    transform: "scale(1.05)",
  },
  transition: "all 0.3s ease",
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: "48px",
  height: "48px",
  borderRadius: "10px",
  backgroundColor: "#194bfb",
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: 600,
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiMenu-paper": {
    marginTop: "8px",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e8edff",
    minWidth: "200px",
    backgroundColor: "#ffffff",
    color: "#191b23",
  },
}));

export const UserMenu = ({
  position = "bottom",
}: {
  position?: "bottom" | "top";
}) => {
  const router = useRouter();
  const { MenuLinks } = useRouteLinks();
  const { state } = useAppContext();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const closeUserMenu = () => setAnchorElUser(null);

  // Get user initials for avatar
  const getUserInitials = () => {
    const firstName = state?.auth?.user?.firstName || "";
    const lastName = state?.auth?.user?.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  return (
    <Box>
      <ProfileButton onClick={openUserMenu}>
        <ProfileAvatar>{getUserInitials()}</ProfileAvatar>
      </ProfileButton>
      <StyledMenu
        keepMounted
        id="user-menu"
        anchorEl={anchorElUser}
        onClose={closeUserMenu}
        open={Boolean(anchorElUser)}
        anchorOrigin={
          position === "top"
            ? { vertical: "top", horizontal: "center" }
            : {
                vertical: "bottom",
                horizontal: "right",
              }
        }
        transformOrigin={
          position === "top"
            ? { vertical: "bottom", horizontal: "center" }
            : {
                vertical: "top",
                horizontal: "right",
              }
        }
      >
        {MenuLinks.map((item: MenuLink) => (
          <MenuItem
            key={item.label}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              }
              if (item.href) {
                router.push(item.href);
              }
              closeUserMenu();
            }}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: "8px",
              margin: "4px 8px",
              "&:hover": {
                backgroundColor: "rgba(25, 75, 251, 0.08)",
              },
            }}
          >
            {item.icon && (
              <ListItemIcon
                sx={{
                  color: "#5d6a83",
                  minWidth: "36px",
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}

            <ListItemText
              primary={item.label}
              disableTypography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#191b23",
              }}
            />
          </MenuItem>
        ))}
      </StyledMenu>
    </Box>
  );
};
