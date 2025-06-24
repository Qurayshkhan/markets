import * as React from "react"
import { useRouter } from "next/router"

import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"

import { useAppContext } from "@contexts/index"

const CrancyLogo = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "4px",
  cursor: "pointer",
}))

const CrancySicon = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  backgroundColor: "#194bfb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#1540d9",
  },
  "& svg": {
    transition: "transform 0.3s ease",
  },
  "&.open svg": {
    transform: "rotate(180deg)",
  },
}))

export default function Header({ open }: { open?: boolean }) {
  const { state } = useAppContext()
  const router = useRouter()

  const handleLogoClick = () => {
    router.push("/app")
  }

  return (
    <CrancyLogo className="crancy-logo" onClick={handleLogoClick}>
      {open ? (
        <>
          <Typography
            sx={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#191b23",
              fontFamily: "'ProductSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              lineHeight: 1,
            }}
          >
            SixWraps
          </Typography>
          {state.auth.user?.role && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: "#5d6a83",
                fontSize: "12px",
                fontWeight: 500,
                textTransform: "capitalize",
                marginTop: "-2px",
              }}
            >
              {state.auth.user.role}
            </Typography>
          )}
        </>
      ) : (
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#191b23",
            fontFamily: "'ProductSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          S
        </Typography>
      )}
    </CrancyLogo>
  )
}
