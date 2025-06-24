import dayjs from "dayjs";
import Head from "next/head";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import { CalendarMonth } from "@mui/icons-material";

import { useApi } from "@hooks/useApi";
import { apiLimit } from "@utils/constants";
import { Heading } from "@components/Title";
import { endpoints } from "@utils/constants";
import { DrawerLayout } from "@layouts/Drawer";
import { SearchInput } from "@ui/SearchInput";
import Loader from "@components/ui/Loader";
import { days, months, years } from "@utils/constants";
import { BarChart } from "@components/graphs/BarChart";
import { getOrgMetadata } from "@utils/browser-utility";
import { LineChart } from "@components/graphs/LineChart";
import { AnalyticsCard } from "@components/AnalyticsCard";
import { ToggleButtons } from "@components/ToggleButtons";
import { styled as muiStyled } from "@mui/material/styles";
import { Interval, Color, DateRangeType } from "@utils/types";
import { PieChart, Props } from "@components/graphs/PieChart";
import { SellHistoryChart } from "@components/graphs/SellHistoryChart";
import { StatusDoughnutChart } from "@components/graphs/StatusDoughnutChart";
import { DashboardHeader } from "@components/DashboardHeader";

const Chart = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  height: 400,
  width: "100%",
}));

const ChartPaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  height: 400,
  width: "100%",
  display: "flex",
  flexDirection: "column",
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  "& .charts-main": {
    background: "#fff",
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.05)",
    height: "400px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  "& .charts-main__heading": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  "& .charts-main__title": {
    fontSize: "18px",
    fontWeight: 600,
    color: "#030229",
    margin: 0,
  },
  "& .charts-main__middle": {
    flex: 1,
    marginLeft: "20px",
  },
  "& .crancy-progress-list": {
    display: "flex",
    gap: "15px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  "& .crancy-progress-list li": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#5D6A83",
  },
  "& .crancy-progress-list__color": {
    width: "12px",
    height: "12px",
    borderRadius: "3px",
    background: "#0A82FD",
  },
  "& .crancy-color9__bg": {
    background: "#F2C94C !important",
  },
  "& .crancy-chart__inside": {
    flex: 1,
    position: "relative",
    minHeight: 0,
    overflow: "hidden",
  },
  "& .charts-main__one": {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  "& .crancy-chart__dropdown": {
    position: "relative",
  },
  "& .crancy-sidebar_btn": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    background: "#F5F7FB",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#5D6A83",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  "& .crancy-sidebar_btn:hover": {
    background: "#E8EDFF",
  },
  "& .crancy-sidebar__arrow--icon svg": {
    fill: "#5D6A83",
  },
  "& .charts-home-two": {
    background: "#fff",
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.05)",
    height: "400px",
    display: "flex",
    flexDirection: "column",
  },
  "& .charts-main__heading--v2": {
    marginBottom: "20px",
  },
  "& .crancy-chart-groups": {
    position: "relative",
    flex: 1,
  },
  "& .crancy-chart__two": {
    height: "100%",
    position: "relative",
  },
  "& .crancy-chart-groups__title": {
    position: "absolute",
  },
  "& .crancy-chart-groups__bubble": {
    background: "#fff",
    borderRadius: "50px",
    padding: "15px 20px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
    minWidth: "80px",
  },
  "& .crancy-chart-groups__percent": {
    fontSize: "20px",
    fontWeight: 700,
    color: "#030229",
    lineHeight: 1,
  },
  "& .crancy-chart-groups__label": {
    fontSize: "14px",
    fontWeight: 400,
    color: "#5D6A83",
    lineHeight: 1.2,
  },
  "& .crancy-chart-groups__title--first": {
    bottom: "30%",
    right: "5%",
  },
  "& .crancy-chart-groups__title--second": {
    bottom: "10%",
    left: "50%",
    transform: "translateX(-50%)",
  },
  "& .crancy-chart-groups__title--third": {
    top: "30%",
    left: "5%",
  },
}));

const DateRangeWrapper = muiStyled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "24px",
  flexWrap: "wrap",

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: "12px",
  },
}));

const DateRangeContainer = muiStyled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 20px",
  background: "#fff",
  border: "1px solid #E6E8EC",
  borderRadius: "8px",
  minHeight: "48px",

  [theme.breakpoints.down("md")]: {
    width: "100%",
    padding: "12px 16px",
    gap: "8px",
  },

  "& .date-input": {
    border: "none",
    outline: "none",
    fontSize: "14px",
    fontWeight: 500,
    color: "#030229",
    width: "120px",
    textAlign: "center",
    backgroundColor: "transparent",
    fontFamily:
      "'ProductSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

    [theme.breakpoints.down("md")]: {
      width: "100px",
      fontSize: "13px",
    },

    "&::placeholder": {
      color: "#9CA3B0",
    },

    "&:focus": {
      color: "#194bfb",
    },
  },

  "& .date-display": {
    fontSize: "14px",
    fontWeight: 500,
    width: "120px",
    textAlign: "center",
    fontFamily:
      "'ProductSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    cursor: "pointer",
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    [theme.breakpoints.down("md")]: {
      width: "100px",
      fontSize: "13px",
    },
  },

  "& .date-display.placeholder": {
    color: "#9CA3B0",
  },

  "& .date-display.selected": {
    color: "#030229",
  },

  "& .date-separator": {
    color: "#9CA3B0",
    fontSize: "14px",
    fontWeight: 400,
  },

  "& .calendar-icon": {
    width: "20px",
    height: "20px",
    marginLeft: "8px",
    cursor: "pointer",
    color: "#5D6A83",

    "&:hover": {
      color: "#194bfb",
    },
  },
}));

const ClearButton = muiStyled("button")(({ theme }) => ({
  backgroundColor: "transparent",
  border: "1px solid #E6E8EC",
  borderRadius: "8px",
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: 500,
  color: "#5D6A83",
  cursor: "pointer",
  minHeight: "48px",
  transition: "all 0.3s ease",
  fontFamily:
    "'ProductSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

  [theme.breakpoints.down("md")]: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "13px",
  },

  "&:hover": {
    borderColor: "#194bfb",
    color: "#194bfb",
  },

  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.5,
  },
}));

const CustomerJobsCard = muiStyled("div")(({ theme }) => ({
  background: "#fff",
  borderRadius: "15px",
  boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.04)",
  overflow: "hidden",

  "& .card-header": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 30px",
    borderBottom: "1px solid #E6E8EC",

    "& .card-title": {
      fontSize: "20px",
      fontWeight: 600,
      color: "#030229",
      margin: 0,
    },
  },
}));

const DateTabsContainer = muiStyled("div")(({ theme }) => ({
  display: "inline-flex",
  flexDirection: "row",
  background: "#e8edff",
  padding: "4px 10px",
  borderRadius: "8px",
  border: "1px solid #e8edff",
  flexWrap: "wrap",
  gap: "0",
  height: "48px",
  alignItems: "center",

  [theme.breakpoints.down("md")]: {
    width: "100%",
    justifyContent: "center",
  },

  "& .tab-item": {
    background: "transparent",
    boxShadow: "none",
    border: "none",
    fontSize: "16px",
    color: "#5d6a83",
    padding: "0 28px",
    borderRadius: "8px",
    cursor: "pointer",
    textDecoration: "none",
    fontFamily:
      "'ProductSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontWeight: 500,
    transition: "all 0.3s ease",
    outline: "none",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "80px",

    [theme.breakpoints.down("md")]: {
      flex: 1,
      fontSize: "14px",
      padding: "0 16px",
      minWidth: "60px",
    },

    "&.active": {
      background: "#194bfb",
      color: "#fff",
      boxShadow: "0px 2px 4px 0px rgba(17, 24, 39, 0.04)",
    },

    "&:hover:not(.active)": {
      background: "rgba(25, 75, 251, 0.08)",
    },
  },
}));

// Helper function to generate customer initials
const getCustomerInitials = (firstName: string = "", lastName: string = "") => {
  const first = firstName?.charAt(0)?.toUpperCase() || "";
  const last = lastName?.charAt(0)?.toUpperCase() || "";
  return first + last || "?";
};

export default function Dashboard() {
  const [interval, setInterval] = useState<Interval>("week");
  const [dateRange, setDateRange] = useState<DateRangeType>([null, null]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // Handle date range changes
  useEffect(() => {
    if (!dateRange[0] && !dateRange[1]) {
      setStartDate("");
      setEndDate("");
    } else {
      if (dateRange[0]) {
        setStartDate(dayjs(dateRange[0]).format("MMM DD"));
      }
      if (dateRange[1]) {
        setEndDate(dayjs(dateRange[1]).format("MMM DD"));
      }
    }
  }, [dateRange]);

  return (
    <>
      <Head>
        <title>Dashboard - Six Wraps</title>
      </Head>

      <DrawerLayout>
        <DashboardHeader
          title="Dashboard"
          subtitle="Let's check your store today"
        />

        <Box sx={{ padding: 3 }}>
          <DateRangeWrapper>
            <DateTabsContainer>
              <button
                className={`tab-item ${interval === "week" ? "active" : ""}`}
                onClick={() => setInterval("week")}
                type="button"
              >
                Week
              </button>
              <button
                className={`tab-item ${interval === "month" ? "active" : ""}`}
                onClick={() => setInterval("month")}
                type="button"
              >
                Month
              </button>
              <button
                className={`tab-item ${interval === "year" ? "active" : ""}`}
                onClick={() => setInterval("year")}
                type="button"
              >
                Year
              </button>
            </DateTabsContainer>
            <DateRangeContainer>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <input
                  ref={startDateRef}
                  type="date"
                  className="date-input"
                  style={{ 
                    position: 'absolute',
                    opacity: 0,
                    pointerEvents: 'none',
                    width: '120px',
                    height: '100%'
                  }}
                  onChange={(e) => {
                    if (e.target.value) {
                      const date = dayjs(e.target.value);
                      setStartDate(date.format("MMM DD"));
                      setDateRange([date.toDate(), dateRange[1]]);
                    }
                  }}
                />
                <div 
                  className={`date-display ${startDate ? 'selected' : 'placeholder'}`}
                  onClick={() => {
                    if (startDateRef.current) {
                      startDateRef.current.showPicker();
                    }
                  }}
                >
                  {startDate || "Start Date"}
                </div>
                <CalendarMonth 
                  className="calendar-icon" 
                  onClick={() => {
                    if (startDateRef.current) {
                      startDateRef.current.showPicker();
                    }
                  }}
                />
              </div>
              <span className="date-separator">-</span>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <input
                  ref={endDateRef}
                  type="date"
                  className="date-input"
                  style={{ 
                    position: 'absolute',
                    opacity: 0,
                    pointerEvents: 'none',
                    width: '120px',
                    height: '100%'
                  }}
                  onChange={(e) => {
                    if (e.target.value) {
                      const date = dayjs(e.target.value);
                      setEndDate(date.format("MMM DD"));
                      setDateRange([dateRange[0], date.toDate()]);
                    }
                  }}
                />
                <div 
                  className={`date-display ${endDate ? 'selected' : 'placeholder'}`}
                  onClick={() => {
                    if (endDateRef.current) {
                      endDateRef.current.showPicker();
                    }
                  }}
                >
                  {endDate || "End Date"}
                </div>
                <CalendarMonth 
                  className="calendar-icon" 
                  onClick={() => {
                    if (endDateRef.current) {
                      endDateRef.current.showPicker();
                    }
                  }}
                />
              </div>
            </DateRangeContainer>
            <ClearButton
              onClick={() => {
                setDateRange([null, null]);
                setStartDate("");
                setEndDate("");
              }}
              disabled={!startDate && !endDate}
            >
              Clear Range
            </ClearButton>
          </DateRangeWrapper>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <JobsCard
                title="New Jobs"
                interval={interval}
                dateRange={dateRange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomersCard
                interval={interval}
                title="New Customers"
                dateRange={dateRange}
              />
            </Grid>
          </Grid>

          <Box sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <JobsDatedChart
                title="Jobs"
                interval={interval}
                dateRange={dateRange}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <CustomersChart
                title="Customers"
                interval={interval}
                dateRange={dateRange}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <JobsChart
                interval={interval}
                dateRange={dateRange}
                title="Jobs Status Overview"
              />
            </Grid>
          </Grid>

          <Box sx={{ my: 2 }} />

          <CustomerJobs
            interval={interval}
            title="Customer Jobs"
            dateRange={dateRange}
          />
        </Box>
      </DrawerLayout>
    </>
  );
}

type CardData = {
  currentData: string;
  previousData: string;
  percentage: number;
  isLoss: boolean;
  diff: number;
  color?: Color;
};

const JobsCard = ({
  title,
  interval,
  dateRange,
}: {
  title: string;
  interval?: Interval;
  dateRange: DateRangeType;
}) => {
  const [api] = useApi();

  const [, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<CardData>({} as CardData);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval, dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);

      let uri = `${endpoints.analyticsJobs}?interval=${interval}`;
      if (dateRange[0] && dateRange[1]) {
        uri += `&startDate=${dayjs(dateRange[0]).format(
          "YYYY-MM-DD"
        )}&endDate=${dayjs(dateRange[1]).format("YYYY-MM-DD")}`;
      }

      const response = await api({ uri });

      let diff = 0;
      let isLoss = false;
      let percentage = 0;
      let color: Color = "primary";

      if (response?.data.currentData >= response?.data.previousData) {
        percentage = Math.round(
          ((response?.data.currentData - response?.data.previousData) /
            response?.data.currentData) *
            100
        );
        diff = response?.data.currentData - response?.data.previousData;
      } else {
        isLoss = true;
        color = "error";
        diff = response?.data.previousData - response?.data.currentData;
        percentage = Math.round(
          ((response?.data.previousData - response?.data.currentData) /
            response?.data.previousData) *
            100
        );
      }

      setData({
        previousData: response?.data.previousData,
        currentData: response?.data.currentData,
        percentage,
        isLoss,
        color,
        diff,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnalyticsCard
      icon="/img/ecard-icon1.svg"
      title={title}
      count={data?.currentData}
      percentage={data?.percentage || 0}
      isLoss={data?.isLoss}
      authors={[
        { img: "/img/google-logo.png", name: "Project Manager" },
        { img: "/img/apple-logo.png", name: "Team Lead" },
        { name: "Developer" },
      ]}
      chartId="jobs_chart"
      chartData={[5, 12, 8, 14, 10, 18, 15, 20, 16, 22]}
    />
  );
};

const CustomersCard = ({
  title,
  interval,
  dateRange,
}: {
  title: string;
  interval?: Interval;
  dateRange: DateRangeType;
}) => {
  const [api] = useApi();

  const [, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<CardData>({} as CardData);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval, dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);

      let uri = `${endpoints.analyticsCustomers}?interval=${interval}`;
      if (dateRange[0] && dateRange[1]) {
        uri += `&startDate=${dayjs(dateRange[0]).format(
          "YYYY-MM-DD"
        )}&endDate=${dayjs(dateRange[1]).format("YYYY-MM-DD")}`;
      }

      const response = await api({ uri });

      let diff = 0;
      let isLoss = false;
      let percentage = 0;
      let color: Color = "primary";

      if (response?.data.currentData >= response?.data.previousData) {
        percentage = Math.round(
          ((response?.data.currentData - response?.data.previousData) /
            response?.data.currentData) *
            100
        );
        diff = response?.data.currentData - response?.data.previousData;
      } else {
        isLoss = true;
        color = "error";
        diff = response?.data.previousData - response?.data.currentData;
        percentage = Math.round(
          ((response?.data.previousData - response?.data.currentData) /
            response?.data.previousData) *
            100
        );
      }

      setData({
        previousData: response?.data.previousData,
        currentData: response?.data.currentData,
        percentage,
        isLoss,
        color,
        diff,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnalyticsCard
      icon="/img/customer-icon.svg"
      title={title}
      count={data?.currentData}
      percentage={data?.percentage || 0}
      isLoss={data?.isLoss}
      authors={[
        { img: "/img/google-logo.png", name: "Sales Rep" },
        { img: "/img/apple-logo.png", name: "Account Manager" },
        { name: "Customer Success" },
      ]}
      chartId="customers_chart"
      chartData={[8, 15, 12, 18, 14, 22, 19, 25, 21, 28]}
    />
  );
};

const JobsDatedChart = ({
  title,
  interval,
  dateRange,
}: {
  title: string;
  interval?: Interval;
  dateRange: DateRangeType;
}) => {
  const [api] = useApi();

  const [data, setData] = useState<any>({
    labels: [],
    avgSellData: [],
    totalSellData: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [localInterval, setLocalInterval] = useState<Interval>("week");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localInterval, dateRange]);

  useEffect(() => {
    if (interval) setLocalInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval]);

  const fetchData = async () => {
    try {
      setLoading(true);

      let uri = `${endpoints.analyticsChartsJobs}?interval=${interval}`;
      if (dateRange[0] && dateRange[1]) {
        uri += `&startDate=${dayjs(dateRange[0]).format(
          "YYYY-MM-DD"
        )}&endDate=${dayjs(dateRange[1]).format("YYYY-MM-DD")}`;
      }

      const response = await api({ uri });

      let labels: string[] = [];
      let avgSellData: number[] = [];
      let totalSellData: number[] = [];

      if (interval === "week") {
        labels = days;
        days.forEach((_, index) => {
          const value =
            response?.data.find((item: any) => +item.label === index)?.value ??
            0;
          avgSellData.push(Math.floor(value * 0.55));
          totalSellData.push(Math.floor(value * 0.45));
        });
      } else if (interval === "month") {
        labels = months;
        months.forEach((_, index) => {
          const value =
            response?.data.find((item: any) => +item.label === index)?.value ??
            0;
          avgSellData.push(Math.floor(value * 0.55));
          totalSellData.push(Math.floor(value * 0.45));
        });
      } else {
        labels = years;
        years.forEach((year) => {
          const value =
            response?.data.find((item: any) => +item.label === +year)?.value ??
            0;
          avgSellData.push(Math.floor(value * 0.55));
          totalSellData.push(Math.floor(value * 0.45));
        });
      }

      setData({ labels, avgSellData, totalSellData });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChartContainer>
      <div className="charts-main charts-home-one">
        <div className="charts-main__heading">
          <h4 className="charts-main__title">{title}</h4>
          <div className="charts-main__middle">
            <ul className="crancy-progress-list crancy-progress-list__inline">
              <li>
                <span className="crancy-progress-list__color"></span>
                <p>Avg: Jobs</p>
              </li>
              <li>
                <span className="crancy-progress-list__color crancy-color9__bg"></span>
                <p>Total Jobs</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="charts-main__one" style={{ flex: 1 }}>
          <div className="crancy-chart__inside crancy-chart__one">
            <SellHistoryChart data={data} loading={loading} />
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};

const CustomersChart = ({
  title,
  interval,
  dateRange,
}: {
  title: string;
  interval?: Interval;
  dateRange: DateRangeType;
}) => {
  const [api] = useApi();

  const [data, setData] = useState<any>({
    labels: [],
    avgSellData: [],
    totalSellData: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [localInterval, setLocalInterval] = useState<Interval>("week");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localInterval, dateRange]);

  useEffect(() => {
    if (interval) setLocalInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval]);

  const fetchData = async () => {
    try {
      setLoading(true);

      let uri = `${endpoints.analyticsChartsCustomers}?interval=${interval}`;
      if (dateRange[0] && dateRange[1]) {
        uri += `&startDate=${dayjs(dateRange[0]).format(
          "YYYY-MM-DD"
        )}&endDate=${dayjs(dateRange[1]).format("YYYY-MM-DD")}`;
      }

      const response = await api({ uri });

      let labels: string[] = [];
      let avgSellData: number[] = [];
      let totalSellData: number[] = [];

      if (interval === "week") {
        labels = days;
        days.forEach((_, index) => {
          const value =
            response?.data.find((item: any) => +item.label === index)?.value ??
            0;
          avgSellData.push(Math.floor(value * 0.6));
          totalSellData.push(Math.floor(value * 0.4));
        });
      } else if (interval === "month") {
        labels = months;
        months.forEach((_, index) => {
          const value =
            response?.data.find((item: any) => +item.label === index)?.value ??
            0;
          avgSellData.push(Math.floor(value * 0.6));
          totalSellData.push(Math.floor(value * 0.4));
        });
      } else {
        labels = years;
        years.forEach((year) => {
          const value =
            response?.data.find((item: any) => +item.label === +year)?.value ??
            0;
          avgSellData.push(Math.floor(value * 0.6));
          totalSellData.push(Math.floor(value * 0.4));
        });
      }

      setData({ labels, avgSellData, totalSellData });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChartContainer>
      <div className="charts-main charts-home-one">
        <div className="charts-main__heading">
          <h4 className="charts-main__title">{title}</h4>
          <div className="charts-main__middle">
            <ul className="crancy-progress-list crancy-progress-list__inline">
              <li>
                <span className="crancy-progress-list__color"></span>
                <p>Avg: Customer Rate</p>
              </li>
              <li>
                <span className="crancy-progress-list__color crancy-color9__bg"></span>
                <p>Total Customers</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="charts-main__one" style={{ flex: 1 }}>
          <div className="crancy-chart__inside crancy-chart__one">
            <SellHistoryChart data={data} loading={loading} />
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};

const JobsChart = ({
  title,
  interval,
  dateRange,
}: {
  title: string;
  interval?: Interval;
  dateRange: DateRangeType;
}) => {
  const [api] = useApi();

  const [data, setData] = useState<any>({
    labels: [],
    values: [],
    colors: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [localInterval, setLocalInterval] = useState<Interval>("week");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localInterval, dateRange]);

  useEffect(() => {
    if (interval) setLocalInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval]);

  const fetchData = async () => {
    try {
      setLoading(true);

      let uri = `${endpoints.analyticsChartsJobsStatus}?interval=${interval}`;
      if (dateRange[0] && dateRange[1]) {
        uri += `&startDate=${dayjs(dateRange[0]).format(
          "YYYY-MM-DD"
        )}&endDate=${dayjs(dateRange[1]).format("YYYY-MM-DD")}`;
      }

      const response = await api({ uri });

      const metadata = getOrgMetadata();

      const labels: string[] = [];
      const values: number[] = [];
      const colors: string[] = [];

      // Create a map to maintain consistent order and color mapping
      const statusColorMap: { [key: string]: string } = {
        "checked_in": "#436CFF",    // Blue
        "in_progress": "#F7CA16",   // Yellow
        "completed": "#4ECDC4",     // Teal
        "delivered": "#FF6B6B"      // Red
      };

      response?.data.forEach((item: any) => {
        // Only include statuses with count > 0
        if (item.count > 0) {
          const status = metadata.statuses.find(
            (e: any) => e.value === item.status
          );
          labels.push(status?.label || item.status);
          values.push(item.count);
          // Use consistent color based on status type
          colors.push(statusColorMap[item.status] || "#999999");
        }
      });

      setData({ labels, values, colors });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChartContainer>
      <div className="charts-main charts-home-two">
        <div className="charts-main__heading charts-main__heading--v2">
          <h4 className="charts-main__title">{title}</h4>
        </div>
        <div className="crancy-chart-groups">
          <div className="crancy-chart__inside crancy-chart__two">
            <StatusDoughnutChart data={data} loading={loading} />
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};

const CustomerJobs = ({
  title,
  interval,
  dateRange,
}: {
  title: string;
  interval?: Interval;
  dateRange: DateRangeType;
}) => {
  const [api] = useApi();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalData, setTotalData] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [data, setData] = useState<Props[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval, page, limit, dateRange]);

  useEffect(() => {
    setPage(1);
  }, [dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);

      let uri = `${endpoints.analyticsChartsCustomersJobs}?interval=${interval}&page=${page}&limit=${limit}`;
      if (dateRange[0] && dateRange[1]) {
        uri += `&startDate=${dayjs(dateRange[0]).format(
          "YYYY-MM-DD"
        )}&endDate=${dayjs(dateRange[1]).format("YYYY-MM-DD")}`;
      }

      const response = await api({ uri });

      const res = response?.data.map((e: any) => ({
        ...e,
        name: `${e.customer.firstName || ""} ${e.customer.lastName || ""}`.trim(),
        customer: e.customer,
      }));

      setData(res);
      setTotalData(response?.pagination?.totalData || 1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Use server-side pagination, data is already paginated from API
  const paginatedData = searchTerm ? filteredData : data;

  // Calculate total pages based on server data when not searching
  const totalPages = searchTerm
    ? Math.ceil(filteredData.length / limit)
    : Math.ceil(totalData / limit);

  return (
    <CustomerJobsCard>
      <div className="card-header">
        <h4 className="card-title">{title}</h4>
      </div>
      <Box className="crancy-table crancy-table--v3">
        <Box className="crancy-customer-filter">
          <Box className="crancy-customer-filter__single crancy-customer-filter__single--csearch">
            <SearchInput
              value={searchTerm}
              placeholder="Search by customer name..."
              onChange={(value) => setSearchTerm(value)}
              className="crancy-header__form--customer"
            />
          </Box>
        </Box>

        <table
          className="crancy-table__main crancy-table__main-v3"
          style={{ width: "100%" }}
        >
          <thead className="crancy-table__head">
            <tr>
              <th className="crancy-table__column-1 crancy-table__h1">
                <Box className="crancy-wc__checkbox">
                  <span>Customer name</span>
                </Box>
              </th>
              <th className="crancy-table__column-2 crancy-table__h2">
                Total Jobs
              </th>
            </tr>
          </thead>
          <tbody className="crancy-table__body">
            {loading ? (
              <tr>
                <td
                  colSpan={2}
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Loader />
                  </Box>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  No data available
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={index}>
                  <td className="crancy-table__column-1 crancy-table__data-1">
                    <Box className="crancy-table__customer">
                      <Box className="crancy-wc__checkbox">
                        <label
                          htmlFor={`checkbox-${index}`}
                          className="crancy-table__customer-img"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: "#194bfb",
                              fontSize: "16px",
                              color: "#ffffff",
                            }}
                          >
                            {getCustomerInitials(
                              row.customer?.firstName,
                              row.customer?.lastName
                            )}
                          </Avatar>
                          <h4 
                            className="crancy-table__product-title"
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              router.push({
                                pathname: "/app/jobs",
                                query: { customer: row.name },
                              });
                            }}
                          >
                            {row.name}
                          </h4>
                        </label>
                      </Box>
                    </Box>
                  </td>
                  <td className="crancy-table__column-2 crancy-table__data-2">
                    <h4 className="crancy-table__product-title">
                      {row.jobsCount}
                    </h4>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Box className="crancy-table-bottom">
          <Box className="dataTables_length">
            <label>
              Show result:{" "}
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={6}>6</option>
                <option value={14}>14</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </label>
          </Box>
          <Box className="dataTables_paginate crancy-pagination">
            <ul className="pagination">
              <li
                className={`paginate_button page-item previous ${
                  page === 1 ? "disabled" : ""
                }`}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className="page-link"
                >
                  <i className="fas fa-angle-left"></i>
                </a>
              </li>
              {(() => {
                const pageNumbers = [];
                const maxPagesToShow = 5;
                const halfRange = Math.floor(maxPagesToShow / 2);

                let startPage = Math.max(1, page - halfRange);
                let endPage = Math.min(totalPages, page + halfRange);

                // Adjust if we're near the beginning
                if (page <= halfRange) {
                  endPage = Math.min(totalPages, maxPagesToShow);
                }

                // Adjust if we're near the end
                if (page > totalPages - halfRange) {
                  startPage = Math.max(1, totalPages - maxPagesToShow + 1);
                }

                // Always show first page
                if (startPage > 1) {
                  pageNumbers.push(
                    <li key={1} className="paginate_button page-item">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(1);
                        }}
                        className="page-link"
                      >
                        1
                      </a>
                    </li>
                  );

                  if (startPage > 2) {
                    pageNumbers.push(
                      <li
                        key="ellipsis1"
                        className="paginate_button page-item disabled"
                      >
                        <span className="page-link">...</span>
                      </li>
                    );
                  }
                }

                // Show page numbers
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(
                    <li
                      key={i}
                      className={`paginate_button page-item ${
                        page === i ? "active" : ""
                      }`}
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(i);
                        }}
                        className="page-link"
                      >
                        {i}
                      </a>
                    </li>
                  );
                }

                // Always show last page
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pageNumbers.push(
                      <li
                        key="ellipsis2"
                        className="paginate_button page-item disabled"
                      >
                        <span className="page-link">...</span>
                      </li>
                    );
                  }

                  pageNumbers.push(
                    <li key={totalPages} className="paginate_button page-item">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(totalPages);
                        }}
                        className="page-link"
                      >
                        {totalPages}
                      </a>
                    </li>
                  );
                }

                return pageNumbers;
              })()}
              <li
                className={`paginate_button page-item next ${
                  page === totalPages ? "disabled" : ""
                }`}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className="page-link"
                >
                  <i className="fas fa-angle-right"></i>
                </a>
              </li>
            </ul>
          </Box>
        </Box>
      </Box>
    </CustomerJobsCard>
  );
};
