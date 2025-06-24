import * as React from "react"

import { MenuItem } from "@mui/material"
import { InputLabel } from "@mui/material"
import { FormControl } from "@mui/material"
import { Select as MuiSelect } from "@mui/material"
import { SelectChangeEvent } from "@mui/material/Select"
import { styled } from "@mui/material/styles"

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  
  "& .MuiInputLabel-root": {
    display: "none",
  },
  
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    height: "48px",
    border: "1px solid #e8edff",
    transition: "all 0.3s ease",
    
    "&:hover": {
      backgroundColor: "#ffffff",
      borderColor: "#194bfb",
    },
    
    "& fieldset": {
      border: "none",
    },
    
    "&:hover fieldset": {
      border: "none",
    },
    
    "&.Mui-focused fieldset": {
      border: "none",
    },
    
    "&.Mui-focused": {
      borderColor: "#194bfb",
      boxShadow: "0 0 0 2px rgba(25, 75, 251, 0.08)",
    },
  },
  
  "& .MuiSelect-select": {
    padding: "0 15px",
    display: "flex",
    alignItems: "center",
    height: "48px",
    fontSize: "14px",
    color: "#191b23",
    fontWeight: 500,
    fontFamily: "'ProductSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  
  "& .MuiSelect-icon": {
    color: "#5d6a83",
    right: "15px",
    fontSize: "20px",
    transition: "color 0.3s ease",
  },
  
  "&:hover .MuiSelect-icon": {
    color: "#194bfb",
  },
}))

type SelectOption = {
  value: string
  label: string
}

export const Select = ({
  id,
  name,
  size,
  value,
  label,
  required,
  onChange,
  placeholder,
  options = [],
  disabled = false,
  fullWidth = false,
  defaultValue = "",
}: {
  id?: string
  name?: string
  value?: string
  label?: string
  required?: boolean
  disabled?: boolean
  fullWidth?: boolean
  placeholder?: string
  defaultValue?: string
  size?: "medium" | "small"
  onChange?: (event: SelectChangeEvent) => void
  options: SelectOption[] | (() => SelectOption[])
}) => {
  return (
    <StyledFormControl
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <MuiSelect
        id={id}
        name={name}
        value={value}
        label={label}
        required={required}
        onChange={onChange}
        defaultValue={defaultValue}
        displayEmpty
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e8edff",
              backgroundColor: "#ffffff",
              marginTop: "8px",
              maxHeight: "300px",
              "& .MuiMenuItem-root": {
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#191b23",
                borderRadius: "8px",
                margin: "4px 8px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(25, 75, 251, 0.08)",
                  color: "#194bfb",
                },
                "&.Mui-selected": {
                  backgroundColor: "#194bfb",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#1540d9",
                  },
                },
              },
            },
          },
        }}
        renderValue={(selected) => {
          if (!selected) {
            return <span style={{ color: '#5d6a83' }}>{placeholder || label || 'Select'}</span>;
          }
          const selectedOption = (typeof options === "function" ? options() : options).find(opt => opt.value === selected);
          return selectedOption?.label || selected;
        }}
      >
        {placeholder && <MenuItem value={""}>{placeholder}</MenuItem>}
        {(typeof options === "function" ? options() : options).map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </StyledFormControl>
  )
}
