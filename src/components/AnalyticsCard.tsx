import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartConfiguration,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Styled components
const CrancyEcomCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.04)",
}));

const CrancyEcomCardHeading = styled(Box)(({ theme }) => ({
  padding: "10px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid #e8edff",
}));

const CrancyEcomCardIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  "& .icon-wrapper": {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#e8edff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& img": {
    width: "20px",
    height: "20px",
  },
  "& .MuiSvgIcon-root": {
    width: "20px",
    height: "20px",
    color: "#194bfb",
  },
}));

const CrancyEcomCardTitle = styled("h4")(({ theme }) => ({
  margin: 0,
  fontSize: "20px",
  fontWeight: 700,
  color: "#191b23",
}));

const CrancyEcomCardContent = styled(Box)(({ theme }) => ({
  padding: "25px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const CrancyEcomCardAmount = styled("h3")(({ theme }) => ({
  fontSize: "28px",
  fontWeight: 700,
  margin: 0,
  color: "#191b23",
}));

const CrancyEcomCardAdesc = styled("p")(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 400,
  margin: "8px 0 0 0",
  color: "#5d6a83",
  "& .crancy-gcolor": {
    color: "#22c55e",
  },
  "& .crancy-rcolor": {
    color: "#eb5757",
  },
}));

const CrancyProgressCardAuthors = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const CrancyTasksingleGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  "& .MuiAvatarGroup-root": {
    flexDirection: "row-reverse",
  },
  "& .MuiAvatar-root": {
    width: "24px",
    height: "24px",
    fontSize: "10px",
    border: "1.5px solid #fff",
    marginLeft: "-8px",
    backgroundColor: "#194bfb",
  },
  "& .MuiAvatarGroup-avatar": {
    backgroundColor: "#5d6a83",
    fontSize: "10px",
  },
}));

const CrancyEcomCardChart = styled(Box)(({ theme }) => ({
  minWidth: "125px",
  minHeight: "46px",
  maxWidth: "125px",
  maxHeight: "46px",
  "& canvas": {
    display: "block",
    boxSizing: "border-box",
    height: "46px",
    width: "125px",
  },
}));

// Icon mapping
const getIconComponent = (iconType: string) => {
  switch (iconType) {
    case "income":
      return <MonetizationOnIcon />;
    case "order":
      return <ShoppingCartIcon />;
    case "sale":
      return <TrendingFlatIcon />;
    case "impressions":
      return <VisibilityIcon />;
    default:
      return <MonetizationOnIcon />;
  }
};

export const AnalyticsCard = ({
  icon,
  iconType = "income",
  title,
  count,
  percentage,
  isLoss,
  authors,
  chartId,
  chartData = [10, 15, 8, 20, 12, 18, 25, 15, 22, 28],
}: {
  icon?: string;
  iconType?: string;
  title?: string;
  count?: string;
  percentage?: number;
  isLoss?: boolean;
  authors?: { img?: string; name?: string }[];
  chartId?: string;
  chartData?: number[];
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        // Destroy existing chart if it exists
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        const config: ChartConfiguration = {
          type: "line",
          data: {
            labels: chartData.map((_, index) => `${index + 1}`),
            datasets: [
              {
                data: chartData,
                borderColor: isLoss ? "#eb5757" : "#22c55e",
                backgroundColor: `${isLoss ? "#eb5757" : "#22c55e"}20`,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 0,
                pointBackgroundColor: "transparent",
                pointBorderColor: "transparent",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            scales: {
              x: {
                display: false,
              },
              y: {
                display: false,
              },
            },
            elements: {
              point: {
                radius: 0,
              },
            },
          },
        };

        chartInstanceRef.current = new ChartJS(ctx, config);
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData, isLoss]);

  return (
    <CrancyEcomCard>
      <CrancyEcomCardHeading>
        <CrancyEcomCardIcon>
          <Box className="icon-wrapper">
            {icon ? <img src={icon} alt={title} /> : getIconComponent(iconType)}
          </Box>
          <CrancyEcomCardTitle>{title}</CrancyEcomCardTitle>
        </CrancyEcomCardIcon>
        <CrancyProgressCardAuthors>
          <CrancyTasksingleGroup className="crancy-tasksingle__group crancy-tasksingle__group--authors">
            <AvatarGroup max={3}>
              {authors?.map((author, index) => (
                <Avatar key={index} src={author.img} alt={author.name} />
              ))}
            </AvatarGroup>
          </CrancyTasksingleGroup>
        </CrancyProgressCardAuthors>
      </CrancyEcomCardHeading>
      <CrancyEcomCardContent>
        <Box className="crancy-ecom-card__camount">
          <CrancyEcomCardAmount>{count || "0"}</CrancyEcomCardAmount>
          <CrancyEcomCardAdesc>
            <span className={isLoss ? "crancy-rcolor" : "crancy-gcolor"}>
              {isLoss ? "- " : "+ "}
              {percentage}%
            </span>{" "}
            from last week
          </CrancyEcomCardAdesc>
        </Box>
        <CrancyEcomCardChart>
          <canvas ref={chartRef} id={chartId} width={125} height={46} />
        </CrancyEcomCardChart>
      </CrancyEcomCardContent>
    </CrancyEcomCard>
  );
};
