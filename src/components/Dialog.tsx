import * as React from "react"
import { useState } from "react"

import { SxProps, Theme } from "@mui/material/styles"
import { Close as CloseIcon } from "@mui/icons-material"
import { Dialog as MuiDialog, DialogContent, DialogTitle } from "@mui/material"

import { IconButton } from "@ui/IconButton"
import { useWindowResize } from "@hooks/useWindowResize"

interface DialogProps {
  title: string
  sx?: SxProps<Theme>
  onClose?: () => void
  closeButton?: boolean
  trigger: (args: any) => void
  content: (args: any) => React.ReactNode
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
}

export const Dialog = ({
  sx,
  title,
  onClose,
  trigger,
  content,
  maxWidth,
  closeButton,
}: DialogProps) => {
  const [width] = useWindowResize()
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    setOpen(!open)
    if (open && onClose) {
      onClose()
    }
  }

  return (
    <>
      {trigger({ toggleOpen })}
      <MuiDialog
        sx={{
          ...sx,
          "& .MuiDialog-paper": {
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            border: "1px solid #e8edff",
            backgroundColor: "#ffffff",
            minWidth: "500px",
            maxWidth: "90vw",
            ...(sx?.["& .MuiDialog-paper"] || {}),
          },
        }}
        open={open}
        onClose={toggleOpen}
        maxWidth={maxWidth || "sm"}
      >
        <DialogTitle 
          id={`dialog-${title}`}
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#191b23",
            padding: "20px 24px 16px",
            borderBottom: title ? "1px solid #e8edff" : "none",
          }}
        >
          {title}{" "}
          {closeButton ? (
            <IconButton
              aria-label="close"
              onClick={toggleOpen}
              sx={{
                top: 12,
                right: 12,
                position: "absolute",
                padding: "8px",
                borderRadius: "8px",
                color: "#5d6a83",
                "&:hover": {
                  backgroundColor: "rgba(25, 75, 251, 0.08)",
                  color: "#194bfb",
                },
                transition: "all 0.3s ease",
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>

        <DialogContent
          // Shouldn't overflow when screen is small
          sx={(theme: Theme) => ({
            width:
              theme.breakpoints.values.xs > width
                ? width - +theme.spacing(8).replace("px", "")
                : "auto",
            padding: "24px",
            color: "#191b23",
            "& .MuiTypography-root": {
              color: "#191b23",
            },
            "& .MuiIconButton-root": {
              color: "#5d6a83",
              "&:hover": {
                backgroundColor: "rgba(25, 75, 251, 0.08)",
                color: "#194bfb",
              },
            },
          })}
        >
          {typeof content === "function"
            ? content({ onClose: toggleOpen })
            : content}
        </DialogContent>
      </MuiDialog>
    </>
  )
}
