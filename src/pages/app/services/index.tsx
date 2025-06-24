import Head from "next/head";
import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";

import { Box, CircularProgress } from "@mui/material";
import { styled as muiStyled } from "@mui/material/styles";
import { Edit } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import { RestartAlt } from "@mui/icons-material";
import { Visibility } from "@mui/icons-material";

import { Service } from "@utils/types";
import { useApi } from "@hooks/useApi";
import { Button } from "@ui/Button";
import { Dialog } from "@components/Dialog";
import { endpoints, apiLimit } from "@utils/constants";
import { Confirm } from "@components/Confirm";
import { DrawerLayout } from "@layouts/Drawer";
import { IconButton } from "@ui/IconButton";
import { CreateService, EditService } from "@forms/services";
import { DashboardHeader } from "@components/DashboardHeader";

const ServiceTabsContainer = muiStyled("div")(({ theme }) => ({
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

export default function Services() {
  const [api] = useApi();
  const router = useRouter();

  const [tab, setTab] = useState<number>(0);
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inactiveItems, setInactiveItems] = useState<Service[]>([]);

  const [statusLoading, setStateLoading] = useState<boolean>(false);
  const [inactiveLoading, setInactiveLoading] = useState<boolean>(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6); // Set default to match first option in select
  const [totalData, setTotalData] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);
  const [inactiveLimit, setInactiveLimit] = useState(6); // Set default to match first option in select
  const [inactiveTotalData, setInactiveTotalData] = useState(1);

  useEffect(() => {
    fetchItems();
    fetchInactiveItems();
    // eslint-disable-next-line
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const response = await api({
        uri: endpoints.services,
      });

      setItems(response?.data || []);
      setTotalData(response?.data?.length || 0);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInactiveItems = async () => {
    try {
      setInactiveLoading(true);

      const response = await api({
        uri: `${endpoints.services}?status=inactive`,
      });

      setInactiveItems(response?.data || []);
      setInactiveTotalData(response?.data?.length || 0);
    } catch (error) {
      console.error("Error fetching inactive services:", error);
    } finally {
      setInactiveLoading(false);
    }
  };

  // Client-side pagination logic
  const getPaginatedItems = (
    items: Service[],
    currentPage: number,
    currentLimit: number
  ) => {
    const startIndex = (currentPage - 1) * currentLimit;
    const endIndex = startIndex + currentLimit;
    return items.slice(startIndex, endIndex);
  };

  const paginatedActiveItems = getPaginatedItems(items, page, limit);
  const paginatedInactiveItems = getPaginatedItems(
    inactiveItems,
    inactivePage,
    inactiveLimit
  );

  const changeStatus = async (_id: string, status: "active" | "inactive") => {
    try {
      setStateLoading(true);

      await api({
        method: "PUT",
        uri: `${endpoints.servicesStatus}/${_id}`,
        body: JSON.stringify({ status }),
      });

      // Refresh both lists to reflect changes with pagination
      fetchItems();
      fetchInactiveItems();
    } catch (error: any) {
    } finally {
      setStateLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Services - Six Wraps</title>
      </Head>

      <DrawerLayout>
        <DashboardHeader
          title="Services"
          subtitle="Manage your service offerings and pricing"
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
              <ServiceTabsContainer
                sx={{
                  marginRight: "16px",
                  "@media (max-width: 960px)": {
                    marginRight: 0,
                    width: "100%",
                  },
                }}
              >
                <button
                  className={`tab-item ${tab === 0 ? "active" : ""}`}
                  onClick={() => setTab(0)}
                  type="button"
                >
                  Active
                </button>
                <button
                  className={`tab-item ${tab === 1 ? "active" : ""}`}
                  onClick={() => setTab(1)}
                  type="button"
                >
                  Inactive
                </button>
              </ServiceTabsContainer>
              <Dialog
                title="Create Service"
                trigger={({ toggleOpen }: { toggleOpen: () => void }) => (
                  <Button
                    size="small"
                    color="primary"
                    onClick={toggleOpen}
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
                    Create Service
                  </Button>
                )}
                content={({ onClose }: { onClose: () => void }) => (
                  <CreateService
                    onClose={onClose}
                    onSubmit={() => {
                      fetchItems();
                    }}
                  />
                )}
              />
            </Box>
            <table
              id="crancy-table__main"
              className="crancy-table__main crancy-table__main-v3"
            >
              <thead className="crancy-table__head">
                <tr>
                  <th
                    className="crancy-table__column-1 crancy-table__h1"
                    style={{ width: "30% !important" }}
                  >
                    <div className="crancy-wc__checkbox">
                      <span>Service Name</span>
                    </div>
                  </th>
                  <th
                    className="crancy-table__column-2 crancy-table__h2"
                    style={{ width: "30%" }}
                  >
                    Subservices
                  </th>
                  <th
                    className="crancy-table__column-3 crancy-table__h3"
                    style={{ width: "40%" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="crancy-table__body">
                {(tab === 0 ? loading : inactiveLoading) ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <CircularProgress />
                    </td>
                  </tr>
                ) : (tab === 0 ? paginatedActiveItems : paginatedInactiveItems)
                    .length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      No services found
                    </td>
                  </tr>
                ) : (
                  (tab === 0
                    ? paginatedActiveItems
                    : paginatedInactiveItems
                  ).map((service: any, index: number) => (
                    <tr key={service._id}>
                      <td className="crancy-table__column-1 crancy-table__data-1">
                        <div className="crancy-table__customer">
                          <div className="crancy-wc__checkbox">
                            <div
                              className="crancy-table__customer-img"
                              onClick={() => {
                                router.push({
                                  pathname: "/app/services/[id]",
                                  query: { id: service._id },
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
                              <h4 className="crancy-table__product-title">
                                {service.name}
                              </h4>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="crancy-table__column-2 crancy-table__data-2">
                        <h4 className="crancy-table__product-title">
                          {service.subServices.length}
                        </h4>
                      </td>
                      <td className="crancy-table__column-3 crancy-table__data-3">
                        <div
                          className="crancy-table__actions"
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                          }}
                        >
                          <button
                            onClick={() => {
                              router.push({
                                pathname: "/app/services/[id]",
                                query: { id: service._id },
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
                            title="View Service"
                          >
                            <Visibility
                              style={{
                                fontSize: "16px",
                                color: "#fff",
                              }}
                            />
                          </button>

                          {tab === 0 ? (
                            <>
                              <Dialog
                                title="Edit Service"
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
                                    title="Edit Service"
                                  >
                                    <Edit
                                      style={{
                                        fontSize: "16px",
                                        color: "#fff",
                                      }}
                                    />
                                  </button>
                                )}
                                content={({
                                  onClose,
                                }: {
                                  onClose: () => void;
                                }) => (
                                  <EditService
                                    value={service}
                                    onClose={onClose}
                                    onSubmit={() => {
                                      fetchItems();
                                    }}
                                  />
                                )}
                              />

                              <Confirm
                                title="Deactivate Service"
                                onConfirm={() =>
                                  changeStatus(service._id, "inactive")
                                }
                                message="Are you sure you want to deactivate this service?"
                                trigger={({
                                  toggleOpen,
                                }: {
                                  toggleOpen: () => void;
                                }) => (
                                  <button
                                    onClick={toggleOpen}
                                    disabled={statusLoading}
                                    style={{
                                      background: statusLoading
                                        ? "#ccc"
                                        : "#e74c3c",
                                      border: "none",
                                      borderRadius: "4px",
                                      padding: "6px",
                                      cursor: statusLoading
                                        ? "not-allowed"
                                        : "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    title="Deactivate Service"
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
                            </>
                          ) : (
                            <Confirm
                              title="Reactivate Service"
                              onConfirm={() =>
                                changeStatus(service._id, "active")
                              }
                              message="Are you sure you want to reactivate this service?"
                              trigger={({
                                toggleOpen,
                              }: {
                                toggleOpen: () => void;
                              }) => (
                                <button
                                  onClick={toggleOpen}
                                  disabled={statusLoading}
                                  style={{
                                    background: statusLoading
                                      ? "#ccc"
                                      : "#f39c12",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "6px",
                                    cursor: statusLoading
                                      ? "not-allowed"
                                      : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  title="Reactivate Service"
                                >
                                  <RestartAlt
                                    style={{
                                      fontSize: "16px",
                                      color: "#fff",
                                    }}
                                  />
                                </button>
                              )}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination with show result */}
            {(tab === 0 ? !loading : !inactiveLoading) && (
              <Box className="crancy-table-bottom">
                <Box className="dataTables_length">
                  <label>
                    Show result:{" "}
                    <select
                      value={tab === 0 ? limit : inactiveLimit}
                      onChange={(e) => {
                        const newLimit = Number(e.target.value);
                        if (tab === 0) {
                          setLimit(newLimit);
                          setPage(1);
                        } else {
                          setInactiveLimit(newLimit);
                          setInactivePage(1);
                        }
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
                        (tab === 0 ? page : inactivePage) === 1
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (tab === 0) {
                            if (page > 1) setPage(page - 1);
                          } else {
                            if (inactivePage > 1)
                              setInactivePage(inactivePage - 1);
                          }
                        }}
                        className="page-link"
                      >
                        <i className="fas fa-angle-left"></i>
                      </a>
                    </li>
                    {(() => {
                      const currentPage = tab === 0 ? page : inactivePage;
                      const currentTotalData =
                        tab === 0 ? totalData : inactiveTotalData;
                      const currentLimit = tab === 0 ? limit : inactiveLimit;
                      const totalPages = Math.max(
                        1,
                        Math.ceil(currentTotalData / currentLimit)
                      );
                      const pageNumbers = [];
                      const maxPagesToShow = 5;
                      const halfRange = Math.floor(maxPagesToShow / 2);

                      let startPage = Math.max(1, currentPage - halfRange);
                      let endPage = Math.min(
                        totalPages,
                        currentPage + halfRange
                      );

                      // Adjust if we're near the beginning
                      if (currentPage <= halfRange) {
                        endPage = Math.min(totalPages, maxPagesToShow);
                      }

                      // Adjust if we're near the end
                      if (currentPage > totalPages - halfRange) {
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
                                if (tab === 0) {
                                  setPage(1);
                                } else {
                                  setInactivePage(1);
                                }
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
                              currentPage === i ? "active" : ""
                            }`}
                          >
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (tab === 0) {
                                  setPage(i);
                                } else {
                                  setInactivePage(i);
                                }
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
                                if (tab === 0) {
                                  setPage(totalPages);
                                } else {
                                  setInactivePage(totalPages);
                                }
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
                        (tab === 0 ? page : inactivePage) ===
                          Math.ceil(
                            (tab === 0 ? totalData : inactiveTotalData) /
                              (tab === 0 ? limit : inactiveLimit)
                          ) || (tab === 0 ? totalData : inactiveTotalData) === 0
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (tab === 0) {
                            if (page < Math.ceil(totalData / limit))
                              setPage(page + 1);
                          } else {
                            if (
                              inactivePage <
                              Math.ceil(inactiveTotalData / inactiveLimit)
                            )
                              setInactivePage(inactivePage + 1);
                          }
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
