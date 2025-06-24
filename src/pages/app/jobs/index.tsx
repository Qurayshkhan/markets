import Head from "next/head";
import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import dayjs from "dayjs";

import { CircularProgress, Typography, Box, Grid } from "@mui/material";
import { styled as muiStyled } from "@mui/material/styles";
import {
  Email,
  Phone,
  Delete,
  Person,
  Circle,
  Receipt,
  Grid3x3,
  Assignment,
  Visibility,
  CreditCard,
  Description,
  AttachMoney,
  FileDownload,
  DirectionsCar,
  CalendarToday,
  FileDownloadOutlined,
  CalendarMonth,
} from "@mui/icons-material";

import { Button } from "@ui/Button";
import { Select } from "@ui/Select";
import { useApi } from "@hooks/useApi";
import { dateUtility } from "@utils/date";
import { IconButton } from "@ui/IconButton";
import { Dialog } from "@components/Dialog";
import { Confirm } from "@components/Confirm";
import { DrawerLayout } from "@layouts/Drawer";
import { useDebounce } from "@hooks/useDebounce";
import { endpoints, apiLimit } from "@utils/constants";
import { getOrgMetadata } from "@utils/browser-utility";
import { Autocomplete } from "@components/Autocomplete";
import { ToggleButtons } from "@components/ToggleButtons";
import { Job, Customer, Interval, DateRangeType } from "@utils/types";
import {
  getFullName,
  toTitleCase,
  getMediaName,
  downloadCSVFile,
  removeDuplicateRow,
  simpleFileDownload,
} from "@utils/common";
import { DashboardHeader } from "@components/DashboardHeader";
import { SearchInput } from "@ui/SearchInput";

const DateRangeWrapper = muiStyled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
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
  width: "fit-content",

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
    padding: "0 24px",
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
    minWidth: "70px",

    [theme.breakpoints.down("md")]: {
      flex: 1,
      fontSize: "14px",
      padding: "0 12px",
      minWidth: "50px",
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

export default function Jobs() {
  const [api] = useApi();
  const router = useRouter();
  const metadata = getOrgMetadata();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6); // Set default to match first option in select
  const [totalData, setTotalData] = useState(1);
  const [totalFilteredData, setTotalFilteredData] = useState(1);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

  const [items, setItems] = useState<Job[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [interval, setInterval] = useState<Interval | "">("");
  const [dateRange, setDateRange] = useState<DateRangeType>([null, null]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [customers, setCustomers] = useState<string[]>([]);
  const [customerQuery, setCustomerQuery] = useState<string>("");
  const [customersLoading, setCustomersLoading] = useState<boolean>(false);
  const debouncedValue = useDebounce(customerQuery);

  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, [
    status,
    page,
    limit,
    interval,
    router.query,
    dateRange,
    sortField,
  ]);

  useEffect(() => {
    setPage(1);
  }, [debouncedValue]);

  // Handle search term changes - fetch all data when searching, paginated when not
  useEffect(() => {
    fetchItems();
  }, [searchTerm]);

  // Trigger re-render when sort changes (client-side sorting)
  useEffect(() => {
    // Force component to re-render when sort parameters change
  }, [sortField, sortDirection]);

  // Set search term when customer query param changes (from external navigation only)
  useEffect(() => {
    if (router.query.customer && router.query.customer !== searchTerm) {
      setSearchTerm(router.query.customer as string);
      setPage(1); // Reset to first page when customer filter changes
    }
  }, [router.query.customer]);

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

  const fetchItems = async () => {
    try {
      setLoading(true);

      let uri = `${endpoints.jobs}?status=${status}&interval=${interval}`;

      // If sorting or searching - get all jobs (no pagination) for client-side operations
      // Customer filtering should always use server-side pagination
      const needsAllData = sortField || searchTerm;

      if (router.query.customer) {
        setCustomerQuery(router.query.customer as string);
        uri += `&customer=${encodeURIComponent(
          router.query.customer as string
        )}`;
      }

      if (!needsAllData) {
        // Normal pagination only when no sorting/searching/customer filtering
        uri += `&page=${page}&limit=${limit}`;
      }

      if (dateRange[0] && dateRange[1]) {
        uri += `&startDate=${dateUtility.formatDate(
          dateRange[0],
          "YYYY-MM-DD"
        )}&endDate=${dateUtility.formatDate(dateRange[1], "YYYY-MM-DD")}`;
      }

      const response = await api({ uri });

      let data = response?.data || [];

      if (needsAllData) {
        // Store all data for client-side filtering/sorting/pagination
        setItems(data);
        setTotalData(data.length);
      } else {
        // Normal server-side pagination
        setItems(data);
        setTotalData(response?.pagination?.totalData ?? 1);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (_id: string) => {
    try {
      setActionLoading(true);

      await api({
        method: "DELETE",
        uri: `${endpoints.jobs}/${_id}`,
        message: "Job archived successfully",
      });

      await fetchItems();
    } catch (error: any) {
    } finally {
      setActionLoading(false);
    }
  };

  const sendInvoice = async (_id: string) => {
    try {
      setActionLoading(true);

      await api({
        method: "POST",
        message: "Invoice sent successfully",
        uri: `${endpoints.jobs}/${_id}/invoice`,
      });
    } catch (error: any) {
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedValue) searchCustomers();
    else setCustomers([]);

    // eslint-disable-next-line
  }, [debouncedValue]);

  const searchCustomers = async () => {
    try {
      setCustomersLoading(true);

      const response = await api({
        uri: `${endpoints.customersSearch}?search=${debouncedValue}`,
      });

      setCustomers(response?.data.map((e: Customer) => getFullName(e)));
    } catch (error) {
    } finally {
      setCustomersLoading(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "checked in":
        return "crancy-table__status--checked-in";
      case "in progress":
        return "crancy-table__status--in-progress";
      case "completed":
        return "crancy-table__status--completed";
      case "delivered":
        return "crancy-table__status--delivered";
      case "paid":
        return "crancy-table__status--paid";
      case "pending":
      case "unpaid":
        return "crancy-table__status--unpaid";
      case "cancelled":
      case "archived":
        return "crancy-table__status--delete";
      default:
        return "crancy-table__status--default";
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginLeft: "8px", opacity: 0.5 }}
        >
          <path d="M6 2L8 4H4L6 2Z" fill="#5D6A83" />
          <path d="M6 10L4 8H8L6 10Z" fill="#5D6A83" />
        </svg>
      );
    }

    return sortDirection === "asc" ? (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginLeft: "8px" }}
      >
        <path d="M6 2L8 4H4L6 2Z" fill="#194BFB" />
      </svg>
    ) : (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginLeft: "8px" }}
      >
        <path d="M6 10L4 8H8L6 10Z" fill="#194BFB" />
      </svg>
    );
  };

  // Filter, sort, and paginate items based on search term and sort parameters
  const filteredItems = useMemo(() => {
    let filtered = items;
    const needsAllData = sortField || searchTerm;

    // Apply search filter
    if (searchTerm) {
      filtered = items.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (item as any)?.jobId?.toLowerCase().includes(searchLower) ||
          getFullName(item.customer).toLowerCase().includes(searchLower) ||
          item.services?.some((s) =>
            s.name?.toLowerCase().includes(searchLower)
          )
        );
      });
    }

    // Apply sorting
    if (sortField && filtered.length > 0) {
      filtered = [...filtered].sort((a: any, b: any) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Handle nested properties
        if (sortField === "customer") {
          aValue = getFullName(a.customer);
          bValue = getFullName(b.customer);
        } else if (sortField === "services") {
          aValue = removeDuplicateRow(
            a.services.map((e: any) => e.parentId?.name || e.name)
          ).join(", ");
          bValue = removeDuplicateRow(
            b.services.map((e: any) => e.parentId?.name || e.name)
          ).join(", ");
        }

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    // Update total filtered data count for pagination
    if (needsAllData) {
      setTotalFilteredData(filtered.length);
    } else {
      setTotalFilteredData(totalData);
    }

    // Always apply pagination (client-side or server-side)
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filtered.slice(startIndex, endIndex);
  }, [
    items,
    searchTerm,
    sortField,
    sortDirection,
    page,
    limit,
    router.query.customer,
    totalData,
  ]);

  const downloadFile = async () => {
    try {
      setDownloadLoading(true);

      const headers = [
        {
          key: "jobId",
          label: "Job ID",
        },
        {
          key: "customer",
          label: "Customer",
        },
        {
          key: "services",
          label: "Services",
        },
        {
          key: "paymentType",
          label: "Payment Type",
        },
        {
          key: "paymentAmount",
          label: "Price",
        },
        {
          key: "status",
          label: "Status",
        },
        {
          label: "Due At",
          key: "estimatedCompletionDate",
        },
      ];

      const data = items.map((e: any) => {
        if (metadata) {
          const status = metadata.statuses.find(
            (s: any) => s.value === e.status
          );
          e.status = status.label || e.status;
        }

        return {
          ...e,
          customer: getFullName(e.customer),
          services: removeDuplicateRow(
            e.services.map((e: any) => e.parentId?.name || e.name)
          ).join(", "),
          paymentType: toTitleCase(e.paymentType),
          estimatedCompletionDate: dateUtility.formatDate(
            e.estimatedCompletionDate
          ),
        };
      });

      downloadCSVFile(data, headers, `jobs-${Date.now()}.csv`);
    } catch (error) {
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Jobs - Six Wraps</title>
      </Head>

      <DrawerLayout>
        <DashboardHeader
          title="Jobs"
          subtitle="Manage and track all your service jobs"
        />

        <Box sx={{ padding: 3 }}>
          <div className="crancy-table crancy-table--v3">
            <Box
              className="crancy-customer-filter"
              sx={{
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                "@media (max-width: 960px)": {
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: "12px",
                },
              }}
            >
              <Box
                className="crancy-customer-filter__single crancy-customer-filter__single--csearch"
                sx={{
                  marginRight: "16px",
                  flex: "1 1 600px",
                  minWidth: "400px",
                  maxWidth: "800px",
                  "@media (max-width: 1200px)": {
                    flex: "1 1 500px",
                    minWidth: "350px",
                  },
                  "@media (max-width: 960px)": {
                    marginRight: 0,
                    width: "100%",
                    minWidth: "auto",
                    flex: "1 1 auto",
                    order: 1,
                  },
                }}
              >
                <SearchInput
                  value={searchTerm}
                  placeholder="Search by job ID, customer name..."
                  onChange={useCallback((value) => {
                    setSearchTerm(value);
                    // Clear customer filter if search is cleared
                    if (!value && router.query.customer) {
                      router.push("/app/jobs", undefined, { shallow: true });
                    }
                  }, [router])}
                  className="crancy-header__form--customer"
                />
              </Box>
              <Box
                sx={{
                  "@media (max-width: 960px)": {
                    width: "100%",
                    order: 2,
                  },
                }}
              >
                <Select
                  size="small"
                  value={status}
                  label="Status"
                  options={[
                    { value: "", label: "All" },
                    ...(metadata ? getOrgMetadata().statuses : []),
                  ]}
                  onChange={(event: any) => {
                    setStatus(event.target.value as string);
                  }}
                />
              </Box>
              <DateRangeWrapper
                sx={{
                  "@media (max-width: 960px)": { order: 3, width: "100%" },
                }}
              >
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
              <DateTabsContainer
                sx={{
                  "@media (max-width: 960px)": { order: 5, width: "100%" },
                }}
              >
                <button
                  className={`tab-item ${interval === "" ? "active" : ""}`}
                  onClick={() => setInterval("")}
                  type="button"
                >
                  All
                </button>
                <button
                  className={`tab-item ${interval === "day" ? "active" : ""}`}
                  onClick={() => setInterval("day")}
                  type="button"
                >
                  Day
                </button>
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
              </DateTabsContainer>
              <Button
                size="small"
                color="primary"
                aria-label="export"
                onClick={downloadFile}
                loading={downloadLoading}
                startIcon={<FileDownloadOutlined fontSize="inherit" />}
                sx={{
                  minWidth: "140px",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  height: "48px",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderRadius: "8px",
                  textTransform: "none",
                  boxShadow: "none",
                  backgroundColor: "#194bfb",
                  marginLeft: "16px",
                  "@media (max-width: 960px)": {
                    width: "100%",
                    marginLeft: 0,
                    minWidth: "auto",
                    order: 6,
                  },
                  "&:hover": {
                    boxShadow: "none",
                    backgroundColor: "#0A3FE8",
                  },
                }}
              >
                Export to CSV
              </Button>
            </Box>
            <table
              id="crancy-table__main"
              className="crancy-table__main crancy-table__main-v3 crancy-table__jobs"
            >
              <thead className="crancy-table__head">
                <tr>
                  <th className="crancy-table__column-1 crancy-table__h1">
                    <div className="crancy-wc__checkbox">
                      <span
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          color: "#030229",
                        }}
                        onClick={() => handleSort("jobId")}
                      >
                        Job ID {getSortIcon("jobId")}
                      </span>
                    </div>
                  </th>
                  <th
                    className="crancy-table__column-2 crancy-table__h2"
                    style={{ width: "15%", cursor: "pointer" }}
                    onClick={() => handleSort("customer")}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      Customer {getSortIcon("customer")}
                    </span>
                  </th>
                  <th
                    className="crancy-table__column-3 crancy-table__h3"
                    style={{ width: "20%", cursor: "pointer" }}
                    onClick={() => handleSort("services")}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      Services {getSortIcon("services")}
                    </span>
                  </th>
                  <th
                    className="crancy-table__column-4 crancy-table__h4"
                    style={{ width: "13%", cursor: "pointer" }}
                    onClick={() => handleSort("paymentType")}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      Payment Type {getSortIcon("paymentType")}
                    </span>
                  </th>
                  <th
                    className="crancy-table__column-5 crancy-table__h5"
                    style={{ width: "10%", cursor: "pointer" }}
                    onClick={() => handleSort("paymentAmount")}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      Price {getSortIcon("paymentAmount")}
                    </span>
                  </th>
                  <th
                    className="crancy-table__column-6 crancy-table__h6"
                    style={{ width: "12%", cursor: "pointer" }}
                    onClick={() => handleSort("status")}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      Status {getSortIcon("status")}
                    </span>
                  </th>
                  <th
                    className="crancy-table__column-7 crancy-table__h7"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("estimatedCompletionDate")}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      Due Date {getSortIcon("estimatedCompletionDate")}
                    </span>
                  </th>
                  <th
                    className="crancy-table__column-8 crancy-table__h8"
                    style={{ width: "10%" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="crancy-table__body">
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <CircularProgress />
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      No jobs found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((job: any) => (
                    <tr key={job._id}>
                      <td className="crancy-table__column-1 crancy-table__data-1">
                        <div className="crancy-wc__checkbox">
                          <span style={{ color: "#030229" }}>{job.jobId}</span>
                        </div>
                      </td>
                      <td className="crancy-table__column-2 crancy-table__data-2">
                        <div className="crancy-table__customer">
                          <div className="crancy-table__customer-img">
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "#e8edff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: "#194bfb",
                                minWidth: "40px",
                                minHeight: "40px",
                              }}
                            >
                              {getFullName(job.customer)
                                .split(" ")
                                .map((n: any) => n[0])
                                .join("")}
                            </div>
                            <h4 
                              className="crancy-table__product-title"
                              onClick={() => {
                                router.push({
                                  pathname: "/app/jobs",
                                  query: { customer: getFullName(job.customer) },
                                });
                              }}
                              style={{
                                cursor: "pointer",
                                transition: "opacity 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = "0.8";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = "1";
                              }}
                            >
                              {getFullName(job.customer)}
                            </h4>
                          </div>
                        </div>
                      </td>
                      <td className="crancy-table__column-3 crancy-table__data-3">
                        <h4 className="crancy-table__product-title">
                          {removeDuplicateRow(
                            job.services.map(
                              (e: any) => e.parentId?.name || e.name
                            )
                          ).join(", ")}
                        </h4>
                      </td>
                      <td className="crancy-table__column-4 crancy-table__data-4">
                        <h4 className="crancy-table__product-title">
                          {toTitleCase(job.paymentType)}
                        </h4>
                      </td>
                      <td className="crancy-table__column-5 crancy-table__data-5">
                        <h4 className="crancy-table__product-title">
                          ${job.paymentAmount}
                        </h4>
                      </td>
                      <td className="crancy-table__column-6 crancy-table__data-6">
                        <div
                          className={`crancy-table__status ${getStatusClass(
                            job.status
                          )}`}
                          style={{
                            backgroundColor: (() => {
                              switch (job.status?.toLowerCase()) {
                                case "checked in":
                                  return "#FFF3CD";
                                case "in_progress":
                                  return "#FFF9C4";
                                case "completed":
                                  return "#D4EDDA";
                                case "delivered":
                                  return "#CCE5FF";
                                case "paid":
                                  return "#D1ECF1";
                                case "pending":
                                  return "#FFE5E5";
                                case "unpaid":
                                  return "#FFEAA7";
                                case "cancelled":
                                case "archived":
                                  return "#F8D7DA";
                                default:
                                  return "#F5F5F5";
                              }
                            })(),
                            color: (() => {
                              switch (job.status?.toLowerCase()) {
                                case "checked in":
                                  return "#856404";
                                case "in progress":
                                  return "#827717";
                                case "completed":
                                  return "#155724";
                                case "delivered":
                                  return "#004085";
                                case "paid":
                                  return "#0C5460";
                                case "pending":
                                  return "#B71C1C";
                                case "unpaid":
                                  return "#F57C00";
                                case "cancelled":
                                case "archived":
                                  return "#721C24";
                                default:
                                  return "#666666";
                              }
                            })(),
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "14px",
                            fontWeight: 500,
                            display: "inline-block",
                            minWidth: "100px",
                            textAlign: "center",
                          }}
                        >
                          {metadata
                            ? metadata.statuses.find(
                                (e: any) => e.value === job.status
                              )?.label || job.status
                            : job.status}
                        </div>
                      </td>
                      <td className="crancy-table__column-7 crancy-table__data-7">
                        <h4 className="crancy-table__product-title">
                          {dateUtility.formatDate(job.estimatedCompletionDate)}
                        </h4>
                      </td>
                      <td className="crancy-table__column-8 crancy-table__data-8">
                        <div
                          className="crancy-table__actions"
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                          }}
                        >
                          <Dialog
                            title=""
                            closeButton
                            maxWidth="lg"
                            content={() => <JobDetails id={job._id} />}
                            trigger={({
                              toggleOpen,
                            }: {
                              toggleOpen: () => void;
                            }) => (
                              <button
                                onClick={toggleOpen}
                                style={{
                                  background: "#27ae60",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "6px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                title="View Job"
                              >
                                <Visibility
                                  style={{
                                    fontSize: "16px",
                                    color: "#fff",
                                  }}
                                />
                              </button>
                            )}
                          />
                          <Confirm
                            title="Send Invoice"
                            onConfirm={() => sendInvoice(job._id)}
                            message="Kindly confirm to send the invoice of this job?"
                            trigger={({
                              toggleOpen,
                            }: {
                              toggleOpen: () => void;
                            }) => (
                              <button
                                onClick={toggleOpen}
                                disabled={actionLoading}
                                style={{
                                  background: "#194bfb",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "6px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  opacity: actionLoading ? 0.6 : 1,
                                }}
                                title="Send Invoice"
                              >
                                <Receipt
                                  style={{
                                    fontSize: "16px",
                                    color: "#fff",
                                  }}
                                />
                              </button>
                            )}
                          />

                          <Confirm
                            title="Archive Job"
                            onConfirm={() => deleteItem(job._id)}
                            message="Are you sure you want to archive this job?"
                            trigger={({
                              toggleOpen,
                            }: {
                              toggleOpen: () => void;
                            }) => (
                              <button
                                onClick={toggleOpen}
                                disabled={actionLoading}
                                style={{
                                  background: "#ef5da8",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "6px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  opacity: actionLoading ? 0.6 : 1,
                                }}
                                title="Archive Job"
                              >
                                <Delete
                                  style={{
                                    fontSize: "16px",
                                    color: "#fff",
                                  }}
                                />
                              </button>
                            )}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination with show result */}
            {!loading && (
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
                      const totalPages = Math.max(
                        1,
                        Math.ceil(totalFilteredData / limit)
                      );
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
                        startPage = Math.max(
                          1,
                          totalPages - maxPagesToShow + 1
                        );
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
                          <li
                            key={totalPages}
                            className="paginate_button page-item"
                          >
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
                        page === Math.ceil(totalFilteredData / limit) ||
                        totalFilteredData === 0
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < Math.ceil(totalFilteredData / limit))
                            setPage(page + 1);
                        }}
                        className="page-link"
                      >
                        <i className="fas fa-angle-right"></i>
                      </a>
                    </li>
                  </ul>
                </Box>
              </Box>
            )}
          </div>
        </Box>
      </DrawerLayout>
    </>
  );
}

const JobDetails = ({ id }: { id: string }) => {
  const [api] = useApi();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await api({ uri: `${endpoints.jobs}/${id}` });
      setJob(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const data = useMemo(
    () => [
      {
        title: "Job Details",
        values: [
          {
            heading: "Job ID",
            description: job?.jobId,
            icon: <Grid3x3 />,
          },
          {
            heading: "Job Creation Date",
            description: dateUtility.formatDate(job?.createdAt),
            icon: <CalendarToday />,
          },
          {
            heading: "Job Completion Date",
            description: dateUtility.formatDate(job?.estimatedCompletionDate),
            icon: <CalendarToday />,
          },
          {
            heading: "Services",
            description: job?.services
              .map((e: any) =>
                e.parentId ? `${e.parentId.name} | ${e.name}` : e.name
              )
              .join(", "),
            icon: <DirectionsCar />,
          },
          {
            heading: "Job Status",
            description: toTitleCase(job?.status),
            icon: <Circle />,
          },
          {
            heading: "Payment Type",
            description: toTitleCase(job?.paymentType),
            icon: <CreditCard />,
          },
          {
            heading: "Amount",
            description: job?.paymentAmount,
            icon: <AttachMoney />,
          },
          {
            heading: "Note",
            description: job?.description,
            icon: <Description />,
          },
        ],
      },
      {
        title: "Customer Information",
        values: [
          {
            heading: "Full Name",
            description: getFullName(job?.customer),
            icon: <Person />,
          },
          {
            heading: "Email Address",
            description: job?.customer?.email,
            icon: <Email />,
          },
          {
            heading: "Phone Number",
            description: job?.customer?.phone,
            icon: <Phone />,
          },
          ...(job?.customerSign?.url
            ? [
                {
                  type: "media",
                  heading: "Signature",
                  icon: <Assignment />,
                  description: getMediaName(job?.customerSign?.key),
                  download: () =>
                    simpleFileDownload(
                      job?.customerSign?.url,
                      job?.customerSign?.key
                    ),
                },
              ]
            : []),
        ],
      },
      {
        title: "Vehicle Information",
        values: [
          {
            heading: "Make",
            description: job?.vehicle?.make,
            icon: <DirectionsCar />,
          },
          {
            heading: "Model",
            description: job?.vehicle?.model,
            icon: <DirectionsCar />,
          },
          {
            heading: "Color",
            description: job?.vehicle?.color,
            icon: <DirectionsCar />,
          },
          {
            heading: "Year",
            description: job?.vehicle?.year,
            icon: <DirectionsCar />,
          },
          {
            icon: <DirectionsCar />,
            heading: "License Plate #",
            description:
              job?.vehicle?.licenseNumber ||
              getMediaName(job?.vehicle?.licenseNumberImage?.key),
            type: job?.vehicle?.licenseNumberImage ? "media" : "text",
            download: () =>
              simpleFileDownload(
                job?.vehicle?.licenseNumberImage?.url,
                job?.vehicle?.licenseNumberImage?.key
              ),
          },
          {
            heading: "VIN #",
            icon: <DirectionsCar />,
            description:
              job?.vehicle?.vinNumber ||
              getMediaName(job?.vehicle?.vinNumberImage?.key),
            type: job?.vehicle?.vinNumberImage ? "media" : "text",
            download: () =>
              simpleFileDownload(
                job?.vehicle?.vinNumberImage?.url,
                job?.vehicle?.vinNumberImage?.key
              ),
          },
        ],
      },
      {
        title: "Media",
        values: [
          ...(job?.images?.map((e: any) => ({
            type: "media",
            heading: "Image",
            description: getMediaName(e.key),
            icon: <FileDownload fontSize="small" />,
            download: () => simpleFileDownload(e.url, e.key),
          })) || []),
          ...(job?.videos?.map((e: any) => ({
            type: "media",
            heading: "Video",
            description: getMediaName(e.key),
            icon: <FileDownload fontSize="small" />,
            download: () => simpleFileDownload(e.url, e.key),
          })) || []),
        ],
      },
    ],
    [job]
  );

  return (
    <Box
      sx={{
        width: "min(max(50vw, 1000px), calc(100vw - 80px))",
        margin: "0 auto",
        maxWidth: "100%",
        "@media (max-width: 768px)": {
          width: "calc(100vw - 40px)",
          maxWidth: "calc(100vw - 40px)",
        },
        "@media (max-width: 360px)": {
          width: "calc(100vw - 20px)",
          maxWidth: "calc(100vw - 20px)",
          margin: "0 10px",
        },
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={40} sx={{ color: "#194bfb" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {data.map((section: any) => (
            <Box
              key={section.title}
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e8edff",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <Box
                sx={{
                  padding: "20px 24px",
                  backgroundColor: "#f8f9ff",
                  borderBottom: "1px solid #e8edff",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#191b23",
                    margin: 0,
                  }}
                >
                  {section.title}
                </Typography>
              </Box>
              <Box sx={{ padding: "8px" }}>
                {section.values.map((item: any, index: number) => (
                  <Box
                    key={item.heading}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      borderRadius: "8px",
                      margin: "4px 8px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(25, 75, 251, 0.04)",
                      },
                      ...(index < section.values.length - 1 && {
                        borderBottom: "1px solid #f0f0f0",
                      }),
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flex: "0 0 40%",
                      }}
                    >
                      <Box
                        sx={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          backgroundColor: "#e8edff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#194bfb",
                          flexShrink: 0,
                        }}
                      >
                        {React.cloneElement(item.icon, {
                          style: { fontSize: "18px" },
                        })}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#5d6a83",
                          lineHeight: 1.4,
                        }}
                      >
                        {item.heading}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, textAlign: "right" }}>
                      {item.type === "media" ? (
                        <Box
                          onClick={item.download}
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                            padding: "6px 12px",
                            backgroundColor: "#194bfb",
                            color: "#ffffff",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: "#1540d9",
                              transform: "translateY(-1px)",
                            },
                          }}
                        >
                          <FileDownload sx={{ fontSize: "16px" }} />
                          {item.description || "Download"}
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#191b23",
                            lineHeight: 1.4,
                            wordBreak: "break-word",
                          }}
                        >
                          {item.description || "—"}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
