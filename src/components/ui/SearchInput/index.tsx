import React from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: (e: React.FormEvent) => void;
  size?: "small" | "medium";
  className?: string;
}

const SearchContainer = styled(Box)<{ size?: "small" | "medium" }>(
  ({ theme, size }) => ({
    "&.crancy-header__form": {
      "& .crancy-header__form-inner": {
        width: "315px",
        display: "flex",
        alignItems: "center",
        background: "#f5faff",
        borderRadius: "8px",
        padding: "0 15px",
        border: "1px solid transparent",
        position: "relative",
        height: "48px",

        "&:hover": {
          backgroundColor: "transparent",
          borderColor: "#f5faff",
        },
      },

      "& .search-btn": {
        color: "#9AA2B1",
        position: "relative",
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        height: "20px",
        width: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "12px",
        transition: "color 0.3s ease",
        flexShrink: 0,

        "&:hover": {
          color: "#5D6A83",
        },

        "& svg": {
          width: "20px",
          height: "20px",
        },

        "& svg circle, & svg path": {
          stroke: "currentColor",
        },
      },

      "& input": {
        background: "transparent",
        padding: 0,
        fontSize: "16px",
        border: "none",
        outline: "none",
        fontWeight: 400,
        color: "#030229",
        flex: 1,
        fontFamily:
          "'ProductSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        lineHeight: "20px",
        minHeight: "20px",
        height: "20px",

        "&::placeholder": {
          color: "#5d6a83",
          opacity: 1,
        },

        "&::-webkit-input-placeholder": {
          color: "#5d6a83",
          opacity: 1,
        },

        "&::-moz-placeholder": {
          color: "#5d6a83",
          opacity: 1,
        },

        "&:-ms-input-placeholder": {
          color: "#5d6a83",
          opacity: 1,
        },
      },

      "& .crancy-header__command": {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        color: "#a9a9aa",
        fontWeight: 400,
        marginLeft: "12px",
        textDecoration: "none",
        flexShrink: 0,

        "&:hover": {
          color: "#5d6a83",
        },

        "& svg": {
          width: "18px",
          height: "18px",
        },
      },
    },

    // Responsive styles
    "@media only screen and (max-width: 768px)": {
      "&.crancy-header__form .crancy-header__form-inner": {
        width: "270px",
        maxWidth: "100%",
      },
    },

    "@media only screen and (min-width: 768px) and (max-width: 1278px)": {
      "&.crancy-header__form .crancy-header__form-inner": {
        width: "175px",
      },
    },
  })
);

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  onSubmit,
  size = "medium",
  className,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <SearchContainer
      size={size}
      className={`crancy-header__form ${className || ""}`}
    >
      <form className="crancy-header__form-inner" onSubmit={handleSubmit}>
        <button className="search-btn" type="submit">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="9.78639"
              cy="9.78614"
              r="8.23951"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.5176 15.9448L18.7479 19.1668"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <input
          name="s"
          value={value}
          type="text"
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </form>
    </SearchContainer>
  );
};
