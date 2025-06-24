import * as React from "react"
import { useEffect, useState, forwardRef } from "react"

import { TextField, TextFieldProps } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { styled } from "@mui/material/styles"

import { IconButton } from "@ui/IconButton"

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root": {
    fontSize: "14px",
    fontWeight: 500,
    color: "#5d6a83",
    fontFamily: "'ProductSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: "#ffffff",
    padding: "0 8px",
    marginLeft: "-4px",
    transform: "translate(14px, -9px) scale(0.75)",
    "&.Mui-focused": {
      color: "#194bfb",
    },
    "&.MuiInputLabel-shrink": {
      transform: "translate(14px, -9px) scale(0.75)",
    },
  },
  
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    minHeight: "48px",
    border: "1px solid #e8edff",
    transition: "all 0.3s ease",
    
    "&:hover": {
      backgroundColor: "#ffffff",
      borderColor: "#194bfb",
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    },
    
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      borderColor: "#194bfb",
      boxShadow: "0 0 0 2px rgba(25, 75, 251, 0.08)",
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    },
    
    "&.Mui-error": {
      borderColor: "#f44336",
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    },
  },
  
  "& .MuiOutlinedInput-input": {
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 400,
    color: "#191b23",
    fontFamily: "'ProductSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    lineHeight: "20px",
    height: "20px",
    
    "&::placeholder": {
      color: "#5d6a83",
      opacity: 1,
    },
  },
  
  "& .MuiFormHelperText-root": {
    fontSize: "12px",
    color: "#5d6a83",
    marginTop: "6px",
    fontFamily: "'ProductSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    
    "&.Mui-error": {
      color: "#f44336",
    },
  },
}));

// eslint-disable-next-line react/display-name
export const Input = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ children, ...props }, ref) => {
    const [show, setShow] = useState(true)

    useEffect(() => {
      if (props.type === "password") setShow(false)
    }, [props.type])

    const toggleShow = () => setShow(!show)

    return (
      <StyledTextField
        ref={ref}
        variant="outlined"
        InputProps={{
          ...props.InputProps,
          endAdornment: props.type === "password" && (
            <IconButton
              edge="end"
              onClick={toggleShow}
              onMouseDown={toggleShow}
              tooltip={show ? "Hide" : "Show"}
              aria-label="toggle password visibility"
              sx={{
                color: "#5d6a83",
                "&:hover": {
                  color: "#194bfb",
                  backgroundColor: "rgba(25, 75, 251, 0.08)",
                },
              }}
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
        {...props}
        type={show ? "text" : "password"}
      >
        {children}
      </StyledTextField>
    )
  }
)
