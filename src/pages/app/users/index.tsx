import Head from "next/head";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";

import { Typography, Box, Grid, Avatar } from "@mui/material";
import { styled as muiStyled } from "@mui/material/styles";
import {
  Delete,
  Edit,
  Replay as ReplayIcon,
  MoreVert,
  PersonAdd,
  Group,
  Mail,
} from "@mui/icons-material";

import { Button } from "@ui/Button";
import { useApi } from "@hooks/useApi";
import { dateUtility } from "@utils/date";
import { IconButton } from "@ui/IconButton";
import { User, Invite } from "@utils/types";
import { Dialog } from "@components/Dialog";
import { Confirm } from "@components/Confirm";
import { DrawerLayout } from "@layouts/Drawer";
import { useAppContext } from "@contexts/index";
import { InviteUser, UpdateRole } from "@forms/users";
import { apiLimit, endpoints } from "@utils/constants";
import { DashboardHeader } from "@components/DashboardHeader";

const TabsContainer = muiStyled("div")(({ theme }) => ({
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

const UserCard = muiStyled("div")(({ theme }) => ({
  background: "#fff",
  borderRadius: "15px",
  boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.04)",
  padding: "30px",
  marginTop: "30px",
  position: "relative",
  transition: "all 0.3s ease",

  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0px 12px 50px rgba(0, 0, 0, 0.08)",
  },
}));

const UserToggle = muiStyled("div")(({ theme }) => ({
  position: "absolute",
  top: "20px",
  right: "20px",
  cursor: "pointer",

  "& .toggle-icon": {
    width: "20px",
    height: "20px",
    color: "#5D6A83",
    "&:hover": {
      color: "#194bfb",
    },
  },
}));

const UserHead = muiStyled("div")(({ theme }) => ({
  textAlign: "center",
  marginBottom: "25px",

  "& .user-avatar": {
    width: "80px",
    height: "80px",
    margin: "0 auto 15px",
    fontSize: "32px",
    backgroundColor: "#194bfb",
    color: "#fff",
  },

  "& .user-title": {
    fontSize: "20px",
    fontWeight: 600,
    color: "#030229",
    margin: "0 0 5px",
    lineHeight: 1.2,

    "& span": {
      display: "block",
      fontSize: "14px",
      fontWeight: 400,
      color: "#5D6A83",
      marginTop: "4px",
    },
  },

  "& .user-role": {
    fontSize: "14px",
    fontWeight: 400,
    color: "#5D6A83",
    display: "block",
    margin: "10px 0 8px",
  },

  "& .edit-role-badge": {
    fontSize: "14px",
    fontWeight: 500,
    color: "#194bfb",
    backgroundColor: "#E8EDFF",
    border: "none",
    padding: "6px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    textTransform: "none",
    minWidth: "120px",
    justifyContent: "center",
    height: "auto",
    marginTop: "5px",

    "&:hover": {
      backgroundColor: "#194bfb",
      color: "#fff",
    },

    "&.disabled": {
      backgroundColor: "#F5F7FB",
      color: "#9CA3B0",
      cursor: "not-allowed",
      "&:hover": {
        backgroundColor: "#F5F7FB",
        color: "#9CA3B0",
      },
    },
  },
}));

const UserInfo = muiStyled("div")(({ theme }) => ({
  marginBottom: "25px",

  "& .user-list": {
    listStyle: "none",
    margin: 0,
    padding: 0,

    "& li": {
      fontSize: "14px",
      color: "#5D6A83",
      marginBottom: "8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      "& strong": {
        color: "#030229",
        fontWeight: 500,
      },

      "& a": {
        color: "#194bfb",
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },
  },
}));

const LoadingState = muiStyled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "80px 20px",
  textAlign: "center",

  "& .loading-spinner": {
    width: "48px",
    height: "48px",
    border: "3px solid #F5F7FB",
    borderTopColor: "#194bfb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },

  "& .loading-text": {
    fontSize: "14px",
    color: "#5D6A83",
    fontWeight: 400,
  },

  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

const EmptyState = muiStyled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 20px",
  textAlign: "center",
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.04)",
  minHeight: "400px",

  "& .empty-icon": {
    width: "80px",
    height: "80px",
    marginBottom: "24px",
    backgroundColor: "#F5F7FB",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "& svg": {
      width: "40px",
      height: "40px",
      color: "#9CA3B0",
    },
  },

  "& .empty-title": {
    fontSize: "20px",
    fontWeight: 600,
    color: "#030229",
    marginBottom: "8px",
  },

  "& .empty-subtitle": {
    fontSize: "14px",
    fontWeight: 400,
    color: "#5D6A83",
    marginBottom: "24px",
    maxWidth: "400px",
  },

  "& .empty-action": {
    backgroundColor: "#194bfb",
    color: "#fff",
    padding: "10px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    border: "none",
    cursor: "pointer",
    textTransform: "none",

    "&:hover": {
      backgroundColor: "#0A3FE8",
    },
  },
}));

const UserActions = muiStyled("div")(({ theme }) => ({
  display: "flex",
  gap: "10px",
  justifyContent: "center",
  flexWrap: "wrap",

  "& .action-btn": {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 500,
    textTransform: "none",
    minWidth: "auto",
    height: "40px",
  },

  "& .delete-btn": {
    backgroundColor: "transparent",
    color: "#FF6B6B",
    border: "1px solid #FF6B6B",
    borderRadius: "4px",
    width: "100%",
    boxShadow: "none",

    "&:hover": {
      backgroundColor: "#FF6B6B",
      color: "#fff",
      borderColor: "#FF6B6B",
      boxShadow: "none",
    },

    "&:disabled": {
      backgroundColor: "transparent",
      color: "#9CA3B0",
      borderColor: "#E6E8EC",
      cursor: "not-allowed",
      "&:hover": {
        backgroundColor: "transparent",
        color: "#9CA3B0",
        borderColor: "#E6E8EC",
      },
    },
  },

  "& .resend-btn": {
    backgroundColor: "transparent",
    color: "#194bfb",
    border: "1px solid #194bfb",
    borderRadius: "4px",
    width: "100%",
    boxShadow: "none",

    "&:hover": {
      backgroundColor: "#194bfb",
      color: "#fff",
      borderColor: "#194bfb",
      boxShadow: "none",
    },
  },
}));

// Helper function to generate user initials
const getUserInitials = (firstName: string = "", lastName: string = "") => {
  const first = firstName?.charAt(0)?.toUpperCase() || "";
  const last = lastName?.charAt(0)?.toUpperCase() || "";
  return first + last || "?";
};

export default function Users() {
  const [api] = useApi();
  const { state } = useAppContext();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6); // Set default to match first option in select
  const [totalData, setTotalData] = useState(1);

  const [tab, setTab] = useState<number>(0);
  const [items, setItems] = useState<User[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [invitesLoading, setInvitesLoading] = useState<boolean>(true);
  const [removeUserLoading, setRemoveUserLoading] = useState<boolean>(false);
  const [inviteDeleteLoading, setInviteDeleteLoading] =
    useState<boolean>(false);
  const [inviteResendLoading, setInviteResendLoading] =
    useState<boolean>(false);

  useEffect(() => {
    fetchItems();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchInvites();

    // eslint-disable-next-line
  }, [page, limit]);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const response = await api({
        uri: endpoints.franchiseUsers,
      });

      setItems(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchInvites = async () => {
    try {
      setInvitesLoading(true);

      const response = await api({
        uri: `${endpoints.invites}?page=${page}&limit=${limit}`,
      });

      setInvites(response?.data);
      setTotalData(response?.pagination?.totalData ?? 1);
    } catch (error) {
    } finally {
      setInvitesLoading(false);
    }
  };

  const deleteInvite = async (token: string) => {
    try {
      setInviteDeleteLoading(true);

      await api({
        method: "DELETE",
        uri: `${endpoints.invites}/${token}`,
        message: "Invite deleted successfully",
      });

      setInvites((s) => s.filter((e: Invite) => e.token !== token));
    } catch (error: any) {
    } finally {
      setInviteDeleteLoading(false);
    }
  };

  const removeUser = async (_id: string) => {
    try {
      setRemoveUserLoading(true);

      await api({
        method: "DELETE",
        message: "User removed successfully",
        uri: `${endpoints.franchiseUsers}/${_id}`,
      });

      setItems((s) => s.filter((e: User) => e._id !== _id));
    } catch (error: any) {
    } finally {
      setRemoveUserLoading(false);
    }
  };

  const resendInvite = async (token: string) => {
    try {
      setInviteResendLoading(true);

      await api({
        method: "PUT",
        message: "Invite resent",
        uri: `${endpoints.invites}/${token}`,
      });
    } catch (error: any) {
    } finally {
      setInviteResendLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Users - Six Wraps</title>
      </Head>

      <DrawerLayout>
        <DashboardHeader
          title="Users"
          subtitle="Manage team members and permissions"
        />

        <Box sx={{ padding: 3 }}>
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
            <TabsContainer
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
                Users
              </button>
              <button
                className={`tab-item ${tab === 1 ? "active" : ""}`}
                onClick={() => setTab(1)}
                type="button"
              >
                Invites
              </button>
            </TabsContainer>
            <Dialog
              title="Invite User"
              trigger={({
                toggleOpen,
              }: Readonly<{ toggleOpen: () => void }>) => (
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
                  Invite User
                </Button>
              )}
              content={({ onClose }: Readonly<{ onClose: () => void }>) => (
                <InviteUser
                  onClose={onClose}
                  onSubmit={(value) => {
                    setInvites((s) => [...s, value]);
                  }}
                />
              )}
            />
          </Box>

          {tab === 0 ? (
            // Users Cards
            <Grid container spacing={3}>
              {loading ? (
                <Grid item xs={12}>
                  <LoadingState>
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading team members...</p>
                  </LoadingState>
                </Grid>
              ) : items.length === 0 ? (
                <Grid item xs={12}>
                  <EmptyState>
                    <div className="empty-icon">
                      <Group />
                    </div>
                    <h3 className="empty-title">No Team Members Yet</h3>
                    <p className="empty-subtitle">
                      Start building your team by inviting members to
                      collaborate on your projects.
                    </p>
                    <Dialog
                      title="Invite User"
                      trigger={({
                        toggleOpen,
                      }: Readonly<{ toggleOpen: () => void }>) => (
                        <button
                          className="empty-action"
                          onClick={toggleOpen}
                          type="button"
                        >
                          <PersonAdd sx={{ fontSize: "18px", mr: 1 }} />
                          Invite First Member
                        </button>
                      )}
                      content={({
                        onClose,
                      }: Readonly<{ onClose: () => void }>) => (
                        <InviteUser
                          onClose={onClose}
                          onSubmit={(value) => {
                            setInvites((s) => [...s, value]);
                          }}
                        />
                      )}
                    />
                  </EmptyState>
                </Grid>
              ) : (
                items.map((user, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
                    <UserCard>
                      <UserHead>
                        <Avatar className="user-avatar">
                          {getUserInitials(user.firstName, user.lastName)}
                        </Avatar>
                        <h4 className="user-title">
                          {`${user.firstName || ""} ${
                            user.lastName || ""
                          }`.trim() || "Unknown User"}
                        </h4>
                        <p className="user-role">
                          {user.role?.toUpperCase() || "USER"}
                        </p>
                        {user.email !== state.auth.user.email ? (
                          <Dialog
                            title="Edit User Role"
                            trigger={({
                              toggleOpen,
                            }: Readonly<{ toggleOpen: () => void }>) => (
                              <button
                                className="edit-role-badge"
                                onClick={toggleOpen}
                                type="button"
                              >
                                <Edit sx={{ fontSize: "12px" }} />
                                Edit Role
                              </button>
                            )}
                            content={({
                              onClose,
                            }: Readonly<{ onClose: () => void }>) => (
                              <UpdateRole
                                value={user}
                                onClose={onClose}
                                onSubmit={(value) => {
                                  let rows = [...items];
                                  let index = rows.findIndex(
                                    (e) => e._id === user._id
                                  );
                                  rows[index] = {
                                    ...rows[index],
                                    ...value,
                                  };
                                  setItems(rows);
                                }}
                              />
                            )}
                          />
                        ) : (
                          <button
                            className="edit-role-badge disabled"
                            type="button"
                            disabled
                          >
                            <Edit sx={{ fontSize: "12px" }} />
                            Edit Role
                          </button>
                        )}
                      </UserHead>

                      <UserInfo>
                        <ul className="user-list">
                          <li>
                            <strong>Email:</strong>
                            <a href={`mailto:${user.email}`}>{user.email}</a>
                          </li>
                          <li>
                            <strong>Phone:</strong>
                            <span>{user.phone || "N/A"}</span>
                          </li>
                          <li>
                            <strong>Last Login:</strong>
                            <span>
                              {dateUtility.formatDate(
                                user.lastLogin?.timestamp
                              ) || "Never"}
                            </span>
                          </li>
                        </ul>
                      </UserInfo>

                      <UserActions>
                        {user.email !== state.auth.user.email ? (
                          <Confirm
                            title="Delete User"
                            onConfirm={() => removeUser(user._id)}
                            message="Are you sure you want to delete this user?"
                            trigger={({
                              toggleOpen,
                            }: Readonly<{ toggleOpen: () => void }>) => (
                              <Button
                                className="action-btn delete-btn"
                                onClick={toggleOpen}
                                startIcon={<Delete />}
                                disabled={removeUserLoading}
                              >
                                {removeUserLoading ? "Deleting..." : "Delete"}
                              </Button>
                            )}
                          />
                        ) : (
                          <Button
                            className="action-btn delete-btn"
                            startIcon={<Delete />}
                            disabled={true}
                          >
                            Delete
                          </Button>
                        )}
                      </UserActions>
                    </UserCard>
                  </Grid>
                ))
              )}
            </Grid>
          ) : (
            // Invites Cards
            <Grid container spacing={3}>
              {invitesLoading ? (
                <Grid item xs={12}>
                  <LoadingState>
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading invitations...</p>
                  </LoadingState>
                </Grid>
              ) : invites.length === 0 ? (
                <Grid item xs={12}>
                  <EmptyState>
                    <div className="empty-icon">
                      <Mail />
                    </div>
                    <h3 className="empty-title">No Pending Invitations</h3>
                    <p className="empty-subtitle">
                      All invitations have been accepted or there are no pending
                      invites. Invite new team members to collaborate.
                    </p>
                    <Dialog
                      title="Invite User"
                      trigger={({
                        toggleOpen,
                      }: Readonly<{ toggleOpen: () => void }>) => (
                        <button
                          className="empty-action"
                          onClick={toggleOpen}
                          type="button"
                        >
                          <PersonAdd sx={{ fontSize: "18px", mr: 1 }} />
                          Send New Invite
                        </button>
                      )}
                      content={({
                        onClose,
                      }: Readonly<{ onClose: () => void }>) => (
                        <InviteUser
                          onClose={onClose}
                          onSubmit={(value) => {
                            setInvites((s) => [...s, value]);
                          }}
                        />
                      )}
                    />
                  </EmptyState>
                </Grid>
              ) : (
                invites.map((invite, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={invite.token}>
                    <UserCard>
                      <UserToggle>
                        <MoreVert className="toggle-icon" />
                      </UserToggle>

                      <UserHead>
                        <Avatar className="user-avatar">
                          {getUserInitials(invite.firstName, invite.lastName)}
                        </Avatar>
                        <h4 className="user-title">
                          {`${invite.firstName || ""} ${
                            invite.lastName || ""
                          }`.trim() || "Unknown User"}
                          <span>Pending Invitation</span>
                        </h4>
                        <p className="user-role">INVITED</p>
                      </UserHead>

                      <UserInfo>
                        <ul className="user-list">
                          <li>
                            <strong>Email:</strong>
                            <a href={`mailto:${invite.email}`}>
                              {invite.email}
                            </a>
                          </li>
                        </ul>
                      </UserInfo>

                      <UserActions>
                        <Button
                          className="action-btn resend-btn"
                          onClick={() => resendInvite(invite.token)}
                          startIcon={<ReplayIcon />}
                          disabled={inviteResendLoading}
                        >
                          {inviteResendLoading ? "Resending..." : "Resend"}
                        </Button>

                        <Confirm
                          title="Delete Invite"
                          onConfirm={() => deleteInvite(invite.token)}
                          message="Are you sure you want to delete this invite?"
                          trigger={({
                            toggleOpen,
                          }: Readonly<{ toggleOpen: () => void }>) => (
                            <Button
                              className="action-btn delete-btn"
                              onClick={toggleOpen}
                              startIcon={<Delete />}
                              disabled={inviteDeleteLoading}
                            >
                              {inviteDeleteLoading ? "Deleting..." : "Delete"}
                            </Button>
                          )}
                        />
                      </UserActions>
                    </UserCard>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </Box>
      </DrawerLayout>
    </>
  );
}
