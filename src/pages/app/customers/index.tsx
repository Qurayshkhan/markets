import Head from "next/head";
import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";

import { Box, CircularProgress } from "@mui/material";
import { Edit, Visibility, FileDownloadOutlined } from "@mui/icons-material";

import { SearchInput } from "@ui/SearchInput";
import { Button } from "@ui/Button";
import { useApi } from "@hooks/useApi";
import { Customer } from "@utils/types";
import { Dialog } from "@components/Dialog";
import { IconButton } from "@ui/IconButton";
import { DrawerLayout } from "@layouts/Drawer";
import { EditCustomer } from "@forms/customers";
import { useDebounce } from "@hooks/useDebounce";
import { apiLimit, endpoints } from "@utils/constants";
import { downloadCSVFile, getFullName } from "@utils/common";
import { DashboardHeader } from "@components/DashboardHeader";

export default function Customers() {
  const [api] = useApi();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6); // Set default to match first option in select
  const [totalData, setTotalData] = useState(1);

  const [query, setQuery] = useState<string>("");
  const [items, setItems] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const debouncedValue = useDebounce(query);

  useEffect(() => {
    fetchItems();

    // eslint-disable-next-line
  }, [page, limit, debouncedValue]);

  useEffect(() => {
    setPage(1);
  }, [debouncedValue]);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const response = await api({
        uri: `${endpoints.customers}?page=${page}&limit=${limit}&search=${debouncedValue}`,
      });

      const res = response?.data.map((e: Customer) => ({
        ...e,
        name: `${e.firstName || ""} ${e.lastName ?? ""}`,
      }));

      setItems(res);
      setTotalData(response?.pagination?.totalData ?? 1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async () => {
    try {
      setDownloadLoading(true);

      const response = await api({
        uri: `${endpoints.customers}?sort=name&limit=1000`,
      });

      const data = response?.data.map((e: Customer) => ({
        ...e,
        franchise: e.franchise.name || "",
        organization: e.organization.name || "",
      }));

      const headers = [
        {
          key: "firstName",
          label: "First Name",
        },
        {
          key: "lastName",
          label: "Last Name",
        },
        {
          key: "email",
          label: "Email",
        },
        {
          key: "phone",
          label: "Phone",
        },
        {
          key: "organization",
          label: "Organization",
        },
        {
          key: "franchise",
          label: "Franchise",
        },
        {
          key: "totalJobs",
          label: "Total Jobs",
        },
      ];

      downloadCSVFile(data, headers, "customers.csv");
    } catch (error) {
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Customers - Six Wraps</title>
      </Head>

      <DrawerLayout>
        <DashboardHeader
          title="Customers"
          subtitle="View and manage your customer database"
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
                  flex: 1,
                  "@media (max-width: 960px)": {
                    marginRight: 0,
                    width: "100%",
                  },
                }}
              >
                <SearchInput
                  value={query}
                  placeholder="Search customers..."
                  onChange={(value) => setQuery(value)}
                  className="crancy-header__form--customer"
                />
              </Box>
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
                  "@media (max-width: 960px)": {
                    width: "100%",
                    minWidth: "auto",
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
              className="crancy-table__main crancy-table__main-v3"
            >
              <thead className="crancy-table__head">
                <tr>
                  <th
                    className="crancy-table__column-1 crancy-table__h1"
                    style={{ width: "25%", textAlign: "left" }}
                  >
                    Customer Name
                  </th>
                  <th
                    className="crancy-table__column-2 crancy-table__h2"
                    style={{ width: "25%", textAlign: "left" }}
                  >
                    Email
                  </th>
                  <th
                    className="crancy-table__column-3 crancy-table__h3"
                    style={{ width: "20%", textAlign: "left" }}
                  >
                    Phone
                  </th>
                  <th
                    className="crancy-table__column-4 crancy-table__h4"
                    style={{ width: "15%", textAlign: "center" }}
                  >
                    Total Jobs
                  </th>
                  <th
                    className="crancy-table__column-5 crancy-table__h5"
                    style={{ width: "15%", textAlign: "center" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="crancy-table__body">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <CircularProgress />
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      No customers found
                    </td>
                  </tr>
                ) : (
                  items.map((customer: any) => (
                    <tr key={customer._id}>
                      <td className="crancy-table__column-1 crancy-table__data-1">
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
                              {getFullName(customer)
                                .split(" ")
                                .map((n: any) => n[0])
                                .join("")}
                            </div>
                            <h4 
                              className="crancy-table__product-title"
                              onClick={() => {
                                router.push({
                                  pathname: "/app/jobs",
                                  query: { customer: getFullName(customer) },
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
                              {getFullName(customer)}
                            </h4>
                          </div>
                        </div>
                      </td>
                      <td className="crancy-table__column-2 crancy-table__data-2">
                        <h4 className="crancy-table__product-title">
                          {customer.email}
                        </h4>
                      </td>
                      <td className="crancy-table__column-3 crancy-table__data-3">
                        <h4 className="crancy-table__product-title">
                          {customer.phone}
                        </h4>
                      </td>
                      <td className="crancy-table__column-4 crancy-table__data-4">
                        <h4 className="crancy-table__product-title">
                          {customer.totalJobs}
                        </h4>
                      </td>
                      <td className="crancy-table__column-5 crancy-table__data-5">
                        <div
                          className="crancy-table__actions"
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => {
                              router.push({
                                pathname: "/app/jobs",
                                query: { customer: getFullName(customer) },
                              });
                            }}
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
                            title="View Jobs"
                          >
                            <Visibility
                              style={{
                                fontSize: "16px",
                                color: "#fff",
                              }}
                            />
                          </button>

                          <Dialog
                            title="Edit Customer"
                            trigger={({
                              toggleOpen,
                            }: {
                              toggleOpen: () => void;
                            }) => (
                              <button
                                onClick={toggleOpen}
                                style={{
                                  background: "#194bfb",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "6px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                title="Edit Customer"
                              >
                                <Edit
                                  style={{
                                    fontSize: "16px",
                                    color: "#fff",
                                  }}
                                />
                              </button>
                            )}
                            content={({ onClose }: { onClose: () => void }) => (
                              <EditCustomer
                                value={customer}
                                onClose={onClose}
                                onSubmit={(value) => {
                                  let rows = [...items];
                                  let index = rows.findIndex(
                                    (e) => e._id === customer._id
                                  );
                                  rows[index] = value;
                                  rows[index].totalJobs = customer.totalJobs;
                                  setItems(rows);
                                }}
                              />
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
                        Math.ceil(totalData / limit)
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
                        page === Math.ceil(totalData / limit) || totalData === 0
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < Math.ceil(totalData / limit))
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
