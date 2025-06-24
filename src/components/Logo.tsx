import * as React from "react"

import Typography from "@mui/material/Typography"

import Link from "@components/Link"

export const Logo = () => {
  return (
    <Link
      href="/"
      sx={{
        textDecoration: "none",
        color: "text.primary",
        "&:hover": { textDecoration: "none" },
      }}
    >
      <Typography variant="h5">
        Six Wraps
      </Typography>
    </Link>
  )
}
