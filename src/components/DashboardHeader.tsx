import * as React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const HeaderContainer = styled("header")(({ theme }) => ({
  width: "100%",
  backgroundColor: "#fff",
  borderBottom: "1px solid #E6E8EC",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  "& .crancy-header": {
    width: "100%",
  },
  "& .crancy-header__inner": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 30px",
    minHeight: "80px",
  },
  "& .crancy-header__middle": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  "& .crancy-header__heading": {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  "& .crancy-header__title": {
    fontSize: "24px",
    fontWeight: 600,
    color: "#030229",
    margin: 0,
    lineHeight: 1.2,
  },
  "& .crancy-header__text": {
    fontSize: "14px",
    fontWeight: 400,
    color: "#5D6A83",
    margin: 0,
    lineHeight: 1.4,
  },
  "& .crancy-header__right": {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  "& .crancy-header__actions": {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  // Mobile styles
  [theme.breakpoints.down("md")]: {
    "& .crancy-header__inner": {
      padding: "16px 20px",
      minHeight: "70px",
    },
    "& .crancy-header__title": {
      fontSize: "20px",
    },
    "& .crancy-header__text": {
      fontSize: "13px",
    },
    "& .crancy-header__middle": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "12px",
    },
    "& .crancy-header__right": {
      width: "100%",
      justifyContent: "flex-end",
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& .crancy-header__inner": {
      padding: "12px 16px",
      minHeight: "60px",
    },
    "& .crancy-header__title": {
      fontSize: "18px",
    },
    "& .crancy-header__actions": {
      gap: "8px",
    },
  },
}));

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  actions,
}) => {
  return (
    <HeaderContainer>
      <div className="crancy-header">
        <div className="crancy-header__inner">
          <div className="crancy-header__middle">
            {/* Page Title Section */}
            <div className="crancy-header__heading">
              <h3 className="crancy-header__title">{title}</h3>
              <p className="crancy-header__text">
                {subtitle || "Let's check your store today"}
              </p>
            </div>

            {/* Right Section (Actions) */}
            <div className="crancy-header__right">
              <div className="crancy-header__actions">{actions}</div>
            </div>
          </div>
        </div>
      </div>
    </HeaderContainer>
  );
};
