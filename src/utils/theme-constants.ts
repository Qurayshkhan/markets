export const themeColors = {
  primary: {
    main: "#194bfb",
    hover: "#194bfb",
  },
  text: {
    primary: "#191b23",
    secondary: "#5d6a83",
    muted: "#85878b",
    placeholder: "rgba(57, 62, 70, 0.2)",
    inputText: "#191b23",
  },
  background: {
    default: "#ffffff",
    paper: "#fafafa",
    dark: "#191b23",
    input: "#fafafa",
  },
  border: {
    default: "transparent",
    hover: "#194bfb",
    light: "#eeeff2",
    checkbox: "#cbd5e0",
  },
} as const

export const themeDimensions = {
  input: {
    height: "56px",
    borderRadius: "10px",
    paddingX: "20px",
    paddingRight: "50px",
    paddingY: "5px",
  },
  button: {
    height: "55px",
    borderRadius: "10px",
  },
  checkbox: {
    size: "20px",
  },
  icon: {
    right: "29px",
    marginTop: "-12px",
  },
} as const

export const themeSpacing = {
  formGroup: "25px",
  formTitle: "20px",
  logoBottom: "20px",
  buttonTop: "30px",
  footerTop: "15px",
} as const

export const themeFonts = {
  family: "'ProductSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  title: {
    size: "32px",
    weight: 600,
  },
  logo: {
    size: "36px",
    weight: 700,
  },
  body: {
    size: "16px",
    weight: 400,
  },
  small: {
    size: "14px",
    weight: 400,
  },
} as const