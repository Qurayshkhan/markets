export default function Button(theme) {
  const disabledStyle = {
    "&.Mui-disabled": {
      backgroundColor: theme.palette.grey[200],
    },
  }

  return {
    MuiButton: {
      // defaultProps: {
      //   disableElevation: true,
      // },
      styleOverrides: {
        root: {
          fontWeight: 400,
          borderRadius: theme.shape.borderRadius,
          textTransform: "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minHeight: "48px",
        },
        sizeSmall: {
          minHeight: "48px",
          height: "48px",
        },
        sizeMedium: {
          minHeight: "56px", 
          height: "56px",
        },
        contained: {
          ...disabledStyle,
        },
        outlined: {
          // ...disabledStyle,
        },
      },
    },
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          borderRadius: theme.shape.borderRadius,
          textTransform: "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minHeight: "48px",
        },
        sizeSmall: {
          minHeight: "48px",
          height: "48px",
        },
        sizeMedium: {
          minHeight: "56px", 
          height: "56px",
        },
      },
    },
  }
}
