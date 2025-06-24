import { useState, useEffect, useCallback } from "react";
import Router from "next/router";

import {
  Box,
  List,
  Grid,
  Switch,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemButton,
  LinearProgress,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { Add, DarkMode, LightMode } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import { Alert } from "@ui/Alert";
import { Input } from "@ui/Input";
import { Button } from "@ui/Button";
import { useApi } from "@hooks/useApi";
import { Dialog } from "@components/Dialog";
import { IconButton } from "@ui/IconButton";
import { endpoints } from "@utils/constants";
import { useFetchMetadata } from "@hooks/auth";
import { useAppContext, AuthTypes } from "@contexts/index";
import { MetadataStatusTexts, MetadataStatus } from "@utils/types";
import { getOrgMetadata, setOrgMetadata } from "@utils/browser-utility";
import {
  themeColors,
  themeDimensions,
  themeSpacing,
  themeFonts,
} from "@utils/theme-constants";

// Styled button - smaller and outline style
const StyledSwitchButton = styled("button")(({ theme }) => ({
  width: "100%",
  color: themeColors.primary.main,
  border: `1px solid ${themeColors.primary.main}`,
  fontSize: "14px",
  fontWeight: 400,
  background: "transparent",
  borderRadius: "8px",
  minHeight: "40px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  fontFamily: themeFonts.family,
  "&:hover": {
    background: themeColors.primary.main,
    color: "#fff",
  },
  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
}));

export function UpdateProfile() {
  const [api] = useApi();
  const { state, dispatch } = useAppContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string | undefined>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string | undefined>("");

  useEffect(() => {
    setFirstName(state.auth.user.firstName);
    setLastName(state.auth.user.lastName);
    setEmail(state.auth.user.email);
    setPhone(state.auth.user.phone);
  }, [state.auth.user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      setError(null);
      setLoading(true);

      if (!firstName || !email) {
        setError("Please fill the required fields");
        return;
      }

      const body = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
      };

      const response = await api({
        method: "PUT",
        uri: endpoints.profile,
        body: JSON.stringify(body),
        message: "Profile updated successfully",
      });

      dispatch({
        type: AuthTypes.SET_USER,
        payload: { user: response?.data },
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        noValidate
        component="form"
        sx={{ width: "100%" }}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <Input
              required
              fullWidth
              id="firstName"
              name="firstName"
              value={firstName}
              label="First Name"
              placeholder="Enter first name"
              autoComplete="given-name"
              onChange={(event) => setFirstName(event.target.value)}
            />
          </Grid>
          <Grid item sm={6}>
            <Input
              fullWidth
              id="lastName"
              name="lastName"
              value={lastName}
              label="Last Name"
              placeholder="Enter last name"
              autoComplete="family-name"
              onChange={(event) => setLastName(event.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              required
              fullWidth
              id="email"
              name="email"
              value={email}
              type="email"
              autoComplete="email"
              label="Email Address"
              placeholder="Enter email address"
              onChange={(event) => setEmail(event.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              fullWidth
              id="phone"
              name="phone"
              label="Phone"
              value={phone}
              type="tel"
              autoComplete="phone"
              placeholder="Enter phone number"
              onChange={(event) => setPhone(event.target.value)}
            />
          </Grid>
        </Grid>

        <Alert type="error" message={error} />

        <Box
          sx={{
            pt: 2,
            gap: 2,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="submit"
            loading={loading}
            variant="contained"
            sx={{
              backgroundColor: "#194bfb",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "none",
              boxShadow: "none",
              minWidth: "100px",
              "&:hover": {
                backgroundColor: "#0A3FE8",
                boxShadow: "none",
              },
              "&:disabled": {
                backgroundColor: "#9CA3B0",
                color: "#fff",
              },
            }}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export function UpdatePassword() {
  const [api] = useApi();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [password, setPassword] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      setError(null);
      setLoading(true);

      if (!password || !oldPassword) {
        setError("Please fill all fields");
        return;
      }

      const body = {
        oldPassword: oldPassword,
        password: password,
      };

      await api({
        method: "PATCH",
        uri: endpoints.profile,
        body: JSON.stringify(body),
        message: "Password updated successfully",
      });

      setPassword("");
      setOldPassword("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        noValidate
        component="form"
        sx={{ width: "100%" }}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={3}>
          <Grid item sm={6}>
            <Input
              required
              fullWidth
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={oldPassword}
              label="Current Password"
              autoComplete="current-password"
              placeholder="Enter current password"
              onChange={(event) => setOldPassword(event.target.value)}
            />
          </Grid>
          <Grid item sm={6}>
            <Input
              required
              fullWidth
              id="password"
              type="password"
              name="password"
              value={password}
              label="New Password"
              placeholder="Enter new password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </Grid>
        </Grid>

        <Alert type="error" message={error} />

        <Box
          sx={{
            pt: 2,
            gap: 2,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="submit"
            loading={loading}
            variant="contained"
            sx={{
              backgroundColor: "#194bfb",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "none",
              boxShadow: "none",
              minWidth: "100px",
              "&:hover": {
                backgroundColor: "#0A3FE8",
                boxShadow: "none",
              },
              "&:disabled": {
                backgroundColor: "#9CA3B0",
                color: "#fff",
              },
            }}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export function UpdateMessagesSettings({
  onClose,
  onCreate,
}: Readonly<{
  onClose?: () => void;
  onCreate?: (args: any) => void;
}>) {
  const [api] = useApi();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sendMessages, setSendMessages] = useState<boolean>(true);

  useEffect(() => {
    const metadata = getOrgMetadata();
    setSendMessages(metadata?.sendMessages === true);
  }, []);

  const handleSubmit = async (value: boolean) => {
    try {
      setError(null);
      setLoading(true);

      const body = {
        sendMessages: value,
      };

      const response = await api({
        method: "PUT",
        uri: endpoints.settings,
        body: JSON.stringify(body),
        message: "Successfully updated settings",
      });

      setOrgMetadata(response?.data);
      setSendMessages(value);

      onCreate?.(response?.data);
      onClose?.();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        mb: 2,
        mt: 1,
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Box
        sx={{
          gap: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Switch
          disabled={loading}
          name="sendMessages"
          checked={sendMessages}
          onChange={({ target: { checked } }) => handleSubmit(checked)}
          inputProps={{
            "aria-label": sendMessages ? "SMS OFF" : "SMS ON",
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#030229",
            }}
          >
            SMS -{" "}
            <Typography
              component="span"
              sx={{
                color: sendMessages ? "#194bfb" : "#5D6A83",
                fontWeight: 500,
              }}
            >
              ON
            </Typography>
            /
            <Typography
              component="span"
              sx={{
                color: sendMessages ? "#5D6A83" : "#194bfb",
                fontWeight: 500,
              }}
            >
              OFF
            </Typography>
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: "12px",
              color: "#5D6A83",
              marginTop: "2px",
            }}
          >
            {sendMessages ? "(Enabled)" : "(Disabled)"}
          </Typography>
        </Box>
      </Box>

      <Alert type="error" message={error} />
    </Box>
  );
}

export function UpdateMessages({
  onClose,
  onCreate,
}: Readonly<{
  onClose?: () => void;
  onCreate?: (args: any) => void;
}>) {
  const [api] = useApi();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = useState<string>("");
  const [jobInvoiceNote, setJobInvoiceNote] = useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [promotionalMessage, setPromotionalMessage] = useState<string>("");

  useEffect(() => {
    const metadata = getOrgMetadata();
    metadata?.reviewMessage && setReviewMessage(metadata.reviewMessage);
    metadata?.jobInvoiceNote && setJobInvoiceNote(metadata.jobInvoiceNote);
    metadata?.feedbackMessage && setFeedbackMessage(metadata.feedbackMessage);
    metadata?.promotionalMessage &&
      setPromotionalMessage(metadata.promotionalMessage);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      setError(null);
      setLoading(true);

      const data = new FormData(event.currentTarget);

      const body = {
        reviewMessage: data.get("reviewMessage"),
        jobInvoiceNote: data.get("jobInvoiceNote"),
        feedbackMessage: data.get("feedbackMessage"),
        promotionalMessage: data.get("promotionalMessage"),
      };

      const response = await api({
        method: "PUT",
        body: JSON.stringify(body),
        uri: endpoints.legalMessages,
        message: "Successfully updated messages",
      });

      setOrgMetadata(response?.data);

      onCreate?.(response?.data);
      onClose?.();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      noValidate
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "100%", mt: 1 }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Input
            fullWidth
            multiline
            minRows={3}
            maxRows={3}
            id="promotionalMessage"
            name="promotionalMessage"
            value={promotionalMessage}
            placeholder="Enter promotional message"
            label={`Promotional Message (${promotionalMessage.length}/160)`}
            onChange={({ target: { value } }) => setPromotionalMessage(value)}
            inputProps={{ maxLength: 160 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            fullWidth
            multiline
            minRows={3}
            maxRows={3}
            id="reviewMessage"
            name="reviewMessage"
            value={reviewMessage}
            placeholder="Enter review message"
            label={`Review Message (${reviewMessage.length}/160)`}
            onChange={({ target: { value } }) => setReviewMessage(value)}
            inputProps={{ maxLength: 160 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            fullWidth
            multiline
            minRows={3}
            maxRows={3}
            id="feedbackMessage"
            name="feedbackMessage"
            value={feedbackMessage}
            placeholder="Enter feedback message"
            label={`Feedback Message (${feedbackMessage.length}/160)`}
            onChange={({ target: { value } }) => setFeedbackMessage(value)}
            inputProps={{ maxLength: 160 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            fullWidth
            multiline
            minRows={3}
            maxRows={3}
            id="jobInvoiceNote"
            name="jobInvoiceNote"
            value={jobInvoiceNote}
            placeholder="Enter invoice message"
            label={`Invoice Message (${jobInvoiceNote.length}/160)`}
            onChange={({ target: { value } }) => setJobInvoiceNote(value)}
            inputProps={{ maxLength: 160 }}
          />
        </Grid>
      </Grid>

      <Alert type="error" message={error} />

      <Box
        sx={{
          mt: 1,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="submit"
          loading={loading}
          variant="contained"
          sx={{
            backgroundColor: "#194bfb",
            color: "#fff",
            padding: "10px 24px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "none",
            minWidth: "100px",
            "&:hover": {
              backgroundColor: "#0A3FE8",
              boxShadow: "none",
            },
            "&:disabled": {
              backgroundColor: "#9CA3B0",
              color: "#fff",
            },
          }}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
}

export function UpdateStatusTexts({
  onClose,
  onCreate,
}: Readonly<{
  onClose?: () => void;
  onCreate?: (args: any) => void;
}>) {
  const [api] = useApi();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<MetadataStatus[]>([]);
  const [statusTexts, setStatusTexts] = useState<MetadataStatusTexts[]>([]);

  useEffect(() => {
    const metadata = getOrgMetadata();
    metadata?.statuses && setStatuses(metadata.statuses);
    metadata?.statusTexts && setStatusTexts(metadata.statusTexts);
  }, []);

  const getStatusText = (status: string) => {
    let statusText = statuses.find((e: any) => e.value === status);
    return statusText?.label ?? status;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      setError(null);
      setLoading(true);

      const body = {
        statusTexts: statusTexts.map((e: any) => ({
          text: e.text,
          status: e.status,
        })),
      };

      const response = await api({
        method: "PUT",
        uri: endpoints.statusTexts,
        body: JSON.stringify(body),
        message: "Successfully updated messages",
      });

      setOrgMetadata(response?.data);

      onCreate?.(response?.data);
      onClose?.();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      noValidate
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "100%", mt: 1 }}
    >
      <Grid container spacing={2}>
        {statusTexts.map((statusText, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Input
              fullWidth
              multiline
              minRows={3}
              maxRows={3}
              id={statusText.status}
              value={statusText.text}
              name={statusText.status}
              placeholder={`Enter ${getStatusText(
                statusText.status
              ).toLowerCase()} message`}
              label={`${getStatusText(statusText.status)} (${
                statusText.text.length
              }/160)`}
              onChange={({ target: { value } }) => {
                const newStatusTexts = [...statusTexts];
                newStatusTexts[index].text = value;
                setStatusTexts(newStatusTexts);
              }}
              inputProps={{ maxLength: 160 }}
            />
          </Grid>
        ))}
      </Grid>

      <Alert type="error" message={error} />

      <Box
        sx={{
          mt: 1,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="submit"
          loading={loading}
          variant="contained"
          sx={{
            backgroundColor: "#194bfb",
            color: "#fff",
            padding: "10px 24px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "none",
            minWidth: "100px",
            "&:hover": {
              backgroundColor: "#0A3FE8",
              boxShadow: "none",
            },
            "&:disabled": {
              backgroundColor: "#9CA3B0",
              color: "#fff",
            },
          }}
        >
          Update
        </Button>
      </Box>

      {/* <Timeline
        options={statusTexts.map((statusText: any) => {
          return {
            label: getStatusText(statusText.status),
            ...statusText,
          }
        })}
        action={(status: any) => (
          <Dialog
            title="Edit Message"
            trigger={({ toggleOpen }: { toggleOpen: () => void }) => (
              <IconButton
                size="small"
                aria-label="edit"
                onClick={toggleOpen}
                tooltip="Edit Message"
              >
                <Edit fontSize="inherit" />
              </IconButton>
            )}
            content={({ onClose }: { onClose: () => void }) => (
              <EditStatusMessage
                value={status.text}
                name={status.status}
                onClose={onClose}
                onSubmit={(value) => {
                  const newStatusTexts = [...statusTexts]
                  const index = newStatusTexts.findIndex(
                    (e: any) => e.status === status.status
                  )
                  newStatusTexts[index].text = value
                  setStatusTexts(newStatusTexts)
                }}
              />
            )}
          />
        )}
      /> */}
    </Box>
  );
}

export function CreateFranchise({
  onClose,
}: Readonly<{
  onClose?: () => void;
}>) {
  const [api] = useApi();
  const { dispatch } = useAppContext();
  const { fetchMetadata } = useFetchMetadata();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      setError(null);
      setLoading(true);

      const data = new FormData(event.currentTarget);

      const body = {
        name: data.get("name"),
      };

      const response = await api({
        method: "POST",
        uri: endpoints.franchises,
        body: JSON.stringify(body),
      });

      dispatch({
        type: AuthTypes.LOGIN,
        payload: response?.data,
      });

      console.log("fetch metadata 3 called");
      // Fetch Metadata
      await fetchMetadata();

      onClose?.();
      Router.reload();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Input
              autoComplete="franchise-name"
              name="name"
              required
              fullWidth
              id="name"
              label="Name"
              placeholder="Enter franchise name"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                gap: 2,
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={onClose}
                variant="outlined"
                sx={{
                  color: "#5D6A83",
                  borderColor: "#E6E8EC",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#194bfb",
                    color: "#194bfb",
                    backgroundColor: "rgba(25, 75, 251, 0.08)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                variant="contained"
                sx={{
                  backgroundColor: "#194bfb",
                  color: "#fff",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "none",
                  boxShadow: "none",
                  minWidth: "100px",
                  "&:hover": {
                    backgroundColor: "#0A3FE8",
                    boxShadow: "none",
                  },
                  "&:disabled": {
                    backgroundColor: "#9CA3B0",
                    color: "#fff",
                  },
                }}
              >
                Create
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Alert type="error" message={error} />
      </Box>
    </Box>
  );
}

export function SwitchOrganization() {
  const [api] = useApi();
  const { state, dispatch } = useAppContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [organization, setOrganization] = useState<any>(null);

  const selectOrganization = useCallback(
    (organizationId: string) => {
      setOrganization(
        state?.auth?.user?.organizations?.find(
          (e: any) => e._id === organizationId
        )
      );
    },
    [state?.auth?.user?.organizations]
  );

  useEffect(() => {
    selectOrganization(state?.auth?.user?.organizationId);
    // eslint-disable-next-line
  }, [state?.auth?.user?.organizationId]);

  const handleSubmit = async (organizationId: string, franchiseId: string) => {
    try {
      setLoading(true);

      const response = await api({
        method: "GET",
        uri: endpoints.switchOrganization
          .replace(":organizationId", organizationId)
          .replace(":franchiseId", franchiseId),
      });

      dispatch({
        type: AuthTypes.LOGIN,
        payload: response?.data,
      });

      Router.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      closeButton
      maxWidth="lg"
      title="Switch Location"
      trigger={({ toggleOpen }: Readonly<{ toggleOpen: () => void }>) => (
        <StyledSwitchButton onClick={toggleOpen}>
          {`${organization?.name} - Switch`}
        </StyledSwitchButton>
      )}
      content={() => (
        <>
          {loading && <LinearProgress sx={{ mb: 1 }} />}

          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "24px",
              marginTop: "10px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
              border: "1px solid #E6E8EC",
              minHeight: "500px",
            }}
          >
            <Box
              sx={{
                gap: 4,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              {/* Organizations Section */}
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    marginBottom: "32px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#030229",
                      marginBottom: "6px",
                    }}
                  >
                    Businesses
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#5D6A83",
                      marginBottom: "16px",
                    }}
                  >
                    Select a business to view its locations
                  </Typography>
                </Box>

                <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                  {state?.auth?.user?.organizations?.map((org: any) => (
                    <Box
                      key={org._id}
                      onClick={() => selectOrganization(org._id)}
                      sx={{
                        padding: "16px 20px",
                        borderRadius: "10px",
                        marginBottom: "12px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        backgroundColor:
                          organization?._id === org?._id
                            ? "#194bfb"
                            : "transparent",
                        border: "1px solid",
                        borderColor:
                          organization?._id === org?._id
                            ? "#194bfb"
                            : "#F1F3F9",
                        boxShadow:
                          organization?._id === org?._id
                            ? "0px 4px 12px rgba(25, 75, 251, 0.15)"
                            : "none",
                        transform:
                          organization?._id === org?._id
                            ? "translateY(-1px)"
                            : "none",
                        "&:hover": {
                          backgroundColor:
                            organization?._id === org?._id
                              ? "#0A3FE8"
                              : "#F8F9FB",
                          borderColor:
                            organization?._id === org?._id
                              ? "#0A3FE8"
                              : "#E6E8EC",
                          transform: "translateY(-2px)",
                          boxShadow:
                            organization?._id === org?._id
                              ? "0px 6px 16px rgba(25, 75, 251, 0.2)"
                              : "0px 2px 8px rgba(0, 0, 0, 0.08)",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "15px",
                          fontWeight: 600,
                          color:
                            organization?._id === org?._id
                              ? "#ffffff !important"
                              : "#030229",
                          lineHeight: 1.3,
                        }}
                      >
                        {org.name}
                      </Typography>
                      {organization?._id === org?._id && (
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#ffffff !important",
                            opacity: 0.9,
                            marginTop: "6px",
                            fontWeight: 500,
                          }}
                        >
                          ✓ Selected
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>

                {/* Add Location Button */}
                <Dialog
                  title="Create Location"
                  trigger={({ toggleOpen }: { toggleOpen: () => void }) => (
                    <StyledSwitchButton
                      onClick={toggleOpen}
                      style={{
                        marginTop: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Add style={{ fontSize: "16px" }} />
                      Create Location
                    </StyledSwitchButton>
                  )}
                  content={({ onClose }: { onClose: () => void }) => (
                    <CreateFranchise onClose={onClose} />
                  )}
                />
              </Box>

              {/* Locations Section */}
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    marginBottom: "32px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#030229",
                      marginBottom: "6px",
                    }}
                  >
                    Locations
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#5D6A83",
                      marginBottom: "16px",
                    }}
                  >
                    Switch to a different location
                  </Typography>
                </Box>

                <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                  {organization?.franchises?.length > 0 ? (
                    organization.franchises.map((franchise: any) => (
                      <Box
                        key={franchise._id}
                        onClick={() =>
                          franchise._id !== state?.auth?.user?.franchiseId &&
                          handleSubmit(organization._id, franchise._id)
                        }
                        sx={{
                          padding: "16px 20px",
                          borderRadius: "10px",
                          marginBottom: "12px",
                          marginTop: "2px",
                          cursor:
                            franchise._id === state?.auth?.user?.franchiseId
                              ? "default"
                              : "pointer",
                          transition: "all 0.3s ease",
                          backgroundColor:
                            franchise._id === state?.auth?.user?.franchiseId
                              ? "#F0F4FF"
                              : "transparent",
                          border: "1px solid",
                          borderColor:
                            franchise._id === state?.auth?.user?.franchiseId
                              ? "#194bfb"
                              : "#F1F3F9",
                          boxShadow:
                            franchise._id === state?.auth?.user?.franchiseId
                              ? "0px 3px 10px rgba(25, 75, 251, 0.1)"
                              : "none",
                          transform:
                            franchise._id === state?.auth?.user?.franchiseId
                              ? "translateY(-1px)"
                              : "none",
                          "&:hover": {
                            backgroundColor:
                              franchise._id === state?.auth?.user?.franchiseId
                                ? "#F0F4FF"
                                : "#F8F9FB",
                            borderColor:
                              franchise._id === state?.auth?.user?.franchiseId
                                ? "#194bfb"
                                : "#E6E8EC",
                            transform:
                              franchise._id === state?.auth?.user?.franchiseId
                                ? "translateY(-1px)"
                                : "translateY(-2px)",
                            boxShadow:
                              franchise._id === state?.auth?.user?.franchiseId
                                ? "0px 3px 10px rgba(25, 75, 251, 0.1)"
                                : "0px 2px 8px rgba(0, 0, 0, 0.08)",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight:
                              franchise._id === state?.auth?.user?.franchiseId
                                ? 600
                                : 500,
                            color:
                              franchise._id === state?.auth?.user?.franchiseId
                                ? "#194bfb"
                                : "#030229",
                            lineHeight: 1.3,
                          }}
                        >
                          {franchise.name}
                        </Typography>
                        {franchise._id === state?.auth?.user?.franchiseId && (
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#194bfb",
                              marginTop: "6px",
                              fontWeight: 500,
                            }}
                          >
                            ⚡ Current Location
                          </Typography>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Box
                      sx={{
                        textAlign: "center",
                        padding: "40px 20px",
                        color: "#5D6A83",
                      }}
                    >
                      <Typography
                        sx={{ fontSize: "14px", marginBottom: "8px" }}
                      >
                        No locations available
                      </Typography>
                      <Typography sx={{ fontSize: "12px" }}>
                        Select a business to view its locations
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
    />
  );
}

export function SwitchTheme() {
  const [api] = useApi();
  const { state, dispatch } = useAppContext();

  const handleSubmit = useCallback(async () => {
    try {
      const theme = state.auth.theme === "light" ? "dark" : "light";

      dispatch({ type: AuthTypes.TRIGGER_THEME, payload: { theme } });

      if (!state.auth.isAuth) return;

      await api({
        method: "PUT",
        uri: endpoints.profileTheme,
        body: JSON.stringify({ theme }),
      });
    } catch (error: any) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.auth.theme]);

  return (
    <IconButton color="primary" tooltip="Toggle Theme" onClick={handleSubmit}>
      {state.auth.theme === "light" ? (
        <DarkMode fontSize="small" />
      ) : (
        <LightMode fontSize="small" />
      )}
    </IconButton>
  );
}

const EditStatusMessage = ({
  name,
  value,
  onClose,
  onSubmit,
}: {
  name: string;
  value: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
}) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit?.(event.currentTarget[name].value);
    onClose?.();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        noValidate
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "100%", mt: 1 }}
      >
        <Input
          fullWidth
          multiline
          id={name}
          minRows={3}
          maxRows={3}
          name={name}
          defaultValue={value}
          placeholder={`Enter ${name.toLowerCase()} message`}
          label={`${name} (${value.length}/160)`}
          inputProps={{ maxLength: 160 }}
        />

        <Box
          sx={{
            pt: 2,
            gap: 2,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={onClose} variant="text">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Done
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
