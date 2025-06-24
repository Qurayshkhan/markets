import * as React from "react"

import { Box } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { useMediaQuery } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { FilterAltOutlined } from "@mui/icons-material"

import { Title } from "@components/Title"
import { Dialog } from "@components/Dialog"
import { IconButton } from "@ui/IconButton"
import { BackButton } from "@components/BackButton"

export const ActionHeader = ({
  title,
  children,
  withBackButton,
  responsiveHeader,
}: {
  title: string
  withBackButton?: boolean
  responsiveHeader?: boolean
  children?: React.ReactNode
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Box
      sx={(theme: Theme) => ({
        py: 2,
        width: "100%",
        height: "64px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Box
        sx={{
          gap: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {withBackButton && <BackButton />}
        <Title>{title}</Title>
      </Box>

      {isMobile && responsiveHeader ? (
        <Dialog
          closeButton
          title="Filters"
          trigger={({ toggleOpen }: { toggleOpen: () => void }) => (
            <IconButton
              tooltip="Filters"
              aria-label="filters"
              onClick={toggleOpen}
            >
              <FilterAltOutlined fontSize="inherit" />
            </IconButton>
          )}
          content={() => (
            <Box
              gap={2}
              display="flex"
              alignItems="center"
              flexDirection="column-reverse"
            >
              {children}
            </Box>
          )}
        />
      ) : (
        <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
          {children}
        </Box>
      )}
    </Box>
  )
}
