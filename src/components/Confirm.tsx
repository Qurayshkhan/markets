import { useState } from "react"

import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"

type ConfirmProps = {
  title: string
  message: string
  onClose?: () => void
  onConfirm: () => void
  trigger: (args: any) => void
}

export const Confirm = (props: ConfirmProps) => {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => setOpen(!open)

  return (
    <>
      {props.trigger({ toggleOpen })}
      <Dialog 
        open={open} 
        onClose={toggleOpen}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            border: "1px solid #e8edff",
            backgroundColor: "#ffffff",
            minWidth: "400px",
          },
        }}
      >
        <DialogTitle 
          id="confirm-dialog-title"
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#191b23",
            padding: "20px 24px 16px",
            borderBottom: "1px solid #e8edff",
          }}
        >
          {props.title}
        </DialogTitle>

        <DialogContent
          sx={{
            padding: "40px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "120px",
          }}
        >
          <DialogContentText 
            id={`confirm-${props.title}`}
            sx={{
              fontSize: "16px",
              color: "#191b23",
              lineHeight: 1.5,
              textAlign: "center",
              fontWeight: 400,
            }}
          >
            {props.message}
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            padding: "16px 24px 24px",
            gap: "12px",
            borderTop: "1px solid #e8edff",
          }}
        >
          <Button 
            onClick={toggleOpen}
            sx={{
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#5d6a83",
              border: "1px solid #e8edff",
              "&:hover": {
                backgroundColor: "rgba(25, 75, 251, 0.08)",
                borderColor: "#194bfb",
                color: "#194bfb",
              },
              transition: "all 0.3s ease",
            }}
          >
            Cancel
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={() => {
              props.onConfirm()
              toggleOpen()
            }}
            sx={{
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 500,
              backgroundColor: "#194bfb",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#1540d9",
                boxShadow: "none",
              },
              transition: "all 0.3s ease",
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
