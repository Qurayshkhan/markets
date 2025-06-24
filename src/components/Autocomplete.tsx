import { TextField, Autocomplete as MAutocomplete } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledAutocomplete = styled(MAutocomplete)(({ theme }) => ({
  width: "315px",
  position: "relative",
  
  "& .MuiOutlinedInput-root": {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f5faff",
    borderRadius: "8px",
    height: "48px",
    paddingRight: "15px !important",
    paddingLeft: "15px !important",
    position: "relative",
    border: "1px solid transparent",
    transition: "all 0.3s ease",
    
    "&:hover": {
      backgroundColor: "transparent",
      borderColor: "#f5faff",
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
    
    "& .MuiAutocomplete-input": {
      padding: "0 !important",
      height: "20px",
      lineHeight: "20px",
      fontSize: "16px",
      color: "#030229",
      fontWeight: 400,
      fontFamily: "'ProductSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      
      "&::placeholder": {
        color: "#5d6a83",
        opacity: 1,
      },
    },
  },
  
  "& .MuiInputLabel-root": {
    display: "none",
  },
  
  "& .MuiAutocomplete-clearIndicator": {
    color: "#a9a9aa",
    padding: "4px",
    marginRight: "4px",
    
    "&:hover": {
      color: "#5d6a83",
      backgroundColor: "transparent",
    },
    
    "& svg": {
      fontSize: "18px",
    },
  },
  
  "& .MuiIconButton-root": {
    padding: "4px",
  },
  
  "& .MuiAutocomplete-popupIndicator": {
    position: "relative",
    color: "#a9a9aa",
    background: "transparent",
    padding: "4px",
    transition: "color 0.3s ease",
    
    "&:hover": {
      backgroundColor: "transparent",
      color: "#5d6a83",
    },
    
    "& svg": {
      fontSize: "20px",
    },
  },
  
  "& .MuiAutocomplete-endAdornment": {
    position: "relative",
    right: "0",
    top: "50%",
    transform: "translateY(-50%)",
    height: "auto",
    paddingRight: "0",
  },
  
  "& .MuiAutocomplete-popper": {
    "& .MuiPaper-root": {
      marginTop: "4px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
    },
  },
  
  // Responsive styles
  "@media only screen and (max-width: 768px)": {
    width: "270px",
    maxWidth: "100%",
  },
  
  "@media only screen and (min-width: 768px) and (max-width: 1278px)": {
    width: "175px",
  },
}))

export interface OptionObject {
  readonly key: string
  readonly value: string
  [key: string]: any
}

export const AutocompleteObject = ({
  value,
  label,
  loading,
  options,
  onChange,
  inputValue,
  onInputChange,
}: {
  label?: string
  loading: boolean
  inputValue?: string
  value: OptionObject | null
  onChange: (value: any) => void
  onInputChange: (e: any) => void
  options: ReadonlyArray<OptionObject>
}) => {
  return (
    <StyledAutocomplete
      value={value}
      options={options}
      loading={loading}
      inputValue={inputValue}
      loadingText="Loading..."
      id="search-autocomplete"
      getOptionLabel={(option) => option.value}
      onChange={(event, newValue) => onChange(newValue)}
      onInputChange={(event, newValue) => onInputChange(newValue)}
      isOptionEqualToValue={(option, value) => option.key === value.key}
      renderInput={(params) => (
        <TextField 
          {...params} 
          size="small" 
          placeholder={label || "Search"}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: '12px', flexShrink: 0 }}
                >
                  <circle
                    cx="9.78639"
                    cy="9.78614"
                    r="8.23951"
                    stroke="#9AA2B1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.5176 15.9448L18.7479 19.1668"
                    stroke="#9AA2B1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}

export const Autocomplete = ({
  value,
  label,
  loading,
  options,
  onChange,
  inputValue,
  onInputChange,
}: {
  label?: string
  value?: string
  loading: boolean
  inputValue?: string
  onChange: (value: any) => void
  options: ReadonlyArray<string>
  onInputChange: (e: any) => void
}) => {
  return (
    <StyledAutocomplete
      value={value}
      options={options}
      loading={loading}
      inputValue={inputValue}
      loadingText="Loading..."
      id="search-autocomplete"
      noOptionsText="Search..."
      getOptionLabel={(option) => option}
      onChange={(event, newValue) => onChange(newValue)}
      isOptionEqualToValue={(option, value) => option === value}
      onInputChange={(event, newValue) => onInputChange(newValue)}
      renderInput={(params) => (
        <TextField 
          {...params} 
          size="small" 
          placeholder={label || "Search Customer"}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: '12px', flexShrink: 0 }}
                >
                  <circle
                    cx="9.78639"
                    cy="9.78614"
                    r="8.23951"
                    stroke="#9AA2B1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.5176 15.9448L18.7479 19.1668"
                    stroke="#9AA2B1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
