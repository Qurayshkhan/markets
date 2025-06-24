import { useState } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";

import { Box, Grid, Typography, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import { Input } from "@ui/Input";
import { Alert } from "@ui/Alert";
import { Button } from "@ui/Button";
import Link from "@components/Link";
import { useApi } from "@hooks/useApi";
import { endpoints } from "@utils/constants";
import { useFetchMetadata } from "@hooks/auth";
import { AuthTypes, useAppContext } from "@contexts/index";
import {
  themeColors,
  themeDimensions,
  themeSpacing,
  themeFonts,
} from "@utils/theme-constants";
import { fontWeight } from "@mui/system";

// Styled Components
const FormTitle = styled(Typography)(({ theme }) => ({
  fontSize: themeFonts.title.size,
  fontWeight: themeFonts.title.weight,
  marginBottom: themeSpacing.formTitle,
  color: themeColors.text.primary,
  lineHeight: 1.2,
  fontFamily: themeFonts.family,
}));

const FormGroup = styled(Box)(({ theme }) => ({
  marginTop: themeSpacing.formGroup,
  position: "relative",
  "&:first-of-type": {
    marginTop: 0,
  },
}));

const StyledInput = styled("input")(({ theme }) => ({
  width: "100%",
  height: themeDimensions.input.height,
  padding: `${themeDimensions.input.paddingY} ${themeDimensions.input.paddingRight} ${themeDimensions.input.paddingY} ${themeDimensions.input.paddingX}`,
  background: themeColors.background.input,
  borderRadius: themeDimensions.input.borderRadius,
  border: `1px solid ${themeColors.border.default}`,
  color: `${themeColors.text.inputText} !important`,
  fontSize: themeFonts.body.size,
  outline: "none",
  transition: "all 0.3s ease",
  fontFamily: themeFonts.family,
  "&:hover": {
    borderColor: themeColors.border.hover,
  },
  "&:focus": {
    borderColor: themeColors.border.hover,
  },
  "&::placeholder": {
    color: "#191b23 !important",
  },
}));

const PasswordToggle = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: themeDimensions.icon.right,
  top: "50%",
  color: themeColors.text.muted,
  transition: "all 0.3s ease",
  cursor: "pointer",
  lineHeight: "initial",
  marginTop: themeDimensions.icon.marginTop,
  padding: "0",
  "&:hover": {
    backgroundColor: "transparent",
    color: themeColors.primary.main,
  },
}));

const CheckboxWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: themeSpacing.formGroup,
}));

const HiddenCheckbox = styled("input")({
  position: "absolute",
  opacity: 0,
  cursor: "pointer",
  height: 0,
  width: 0,
});

const CustomCheckbox = styled(Box)(
  ({ theme, checked }: { theme?: any; checked: boolean }) => ({
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    minWidth: "20px",
    height: "20px",
    background: checked ? themeColors.primary.main : "transparent",
    borderRadius: "100%",
    outline: "none",
    cursor: "pointer",
    position: "relative",
    border: checked
      ? "2px solid transparent"
      : `2px solid ${themeColors.border.checkbox}`,
    width: "20px",
    maxWidth: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "8px",
    transition: "all 0.3s ease",
    "&::before": {
      content: checked ? '"✓"' : '""',
      color: "#fff",
      fontSize: "12px",
      fontWeight: 900,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    },
  })
);

const ForgotLink = styled(NextLink)(({ theme }) => ({
  fontSize: themeFonts.body.size,
  color: themeColors.text.primary,
  textDecoration: "none",
  fontWeight: themeFonts.body.weight,
  cursor: "pointer",
  transition: "color 0.3s ease",
  "&:hover": {
    color: themeColors.primary.main,
  },
}));

const StyledButton = styled("button")(({ theme }) => ({
  width: "100%",
  color: "#fff",
  border: "none",
  fontSize: "16px",
  fontWeight: 400,
  background: themeColors.primary.main,
  borderRadius: themeDimensions.button.borderRadius,
  minHeight: themeDimensions.button.height,
  display: "flex",
  alignItems: "center",
  gap: "12px",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  marginTop: themeSpacing.buttonTop,
  fontFamily: themeFonts.family,
  "&:hover": {
    background: themeColors.primary.hover,
  },
  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
}));

export function LoginForm() {
  const [api] = useApi();
  const router = useRouter();
  const { dispatch } = useAppContext();
  const { fetchMetadata } = useFetchMetadata();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      setError(null);
      setLoading(true);

      const data = new FormData(event.currentTarget);

      const body = {
        email: data.get("email"),
        password: data.get("password"),
      };

      const response = await api({
        method: "POST",
        uri: endpoints.login,
        body: JSON.stringify(body),
      });

      if (response?.data.user.role.toLowerCase() === "advisor") {
        throw new Error("You are not authorized to login");
      }

      dispatch({
        type: AuthTypes.LOGIN,
        payload: response?.data,
      });

      // Fetch Metadata with the token from the response
      await fetchMetadata(response?.data.accessToken);

      router.replace("/app");
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <FormTitle style={{ marginBottom: "28px" }}>
        Login to your account
      </FormTitle>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <FormGroup>
          <StyledInput
            required
            autoFocus
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
          />
        </FormGroup>

        <FormGroup>
          <StyledInput
            required
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
          />
          <PasswordToggle
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
          >
            {showPassword ? (
              <VisibilityOff sx={{ fontSize: 16 }} />
            ) : (
              <Visibility sx={{ fontSize: 16 }} />
            )}
          </PasswordToggle>
        </FormGroup>

        <CheckboxWrapper>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => setRememberMe(!rememberMe)}
          >
            <HiddenCheckbox
              type="checkbox"
              checked={rememberMe}
              onChange={(e: any) => setRememberMe(e.target.checked)}
              id="remember-me"
            />
            <CustomCheckbox checked={rememberMe} />
            <label
              htmlFor="remember-me"
              style={{
                fontSize: themeFonts.body.size,
                color: themeColors.text.primary,
                cursor: "pointer",
                fontFamily: themeFonts.family,
              }}
            >
              Remember Me
            </label>
          </Box>
          <ForgotLink href="/auth/forgot-password">Forgot Password?</ForgotLink>
        </CheckboxWrapper>

        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert type="error" message={error} />
          </Box>
        )}

        <StyledButton
          type="submit"
          disabled={loading}
          style={{ fontWeight: 600 }}
        >
          {loading ? "Signing in..." : "Sign in with email"}
        </StyledButton>
      </Box>
    </Box>
  );
}

export function Registerform() {
  const [api] = useApi();
  const router = useRouter();
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
        email: data.get("email"),
        password: data.get("password"),
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
      };

      const response = await api({
        method: "POST",
        uri: endpoints.register,
        body: JSON.stringify(body),
        message: "Registered successfully",
      });

      dispatch({
        type: AuthTypes.LOGIN,
        payload: response?.data,
      });

      console.log("fetch metadata 4 called");
      // Fetch Metadata with the token from the response
      await fetchMetadata(response?.data.accessToken);

      router.replace("/app");
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
      <Typography component="h1" variant="h4">
        Sign up
      </Typography>

      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Input
              autoFocus
              required
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              autoComplete="given-name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              required
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              autoComplete="family-name"
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              required
              fullWidth
              id="email"
              name="email"
              autoComplete="email"
              label="Email Address"
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              required
              fullWidth
              id="password"
              name="password"
              type="password"
              label="Password"
              autoComplete="new-password"
            />
          </Grid>
        </Grid>
        <Alert type="error" message={error} />
        <Button type="submit" sx={{ mt: 4 }} fullWidth loading={loading}>
          Sign Up
        </Button>
        <Box
          sx={{ mt: 2, flex: 1, display: "flex", justifyContent: "flex-end" }}
        >
          <Link href="/auth/login">{"Already have an account? Sign in"}</Link>
        </Box>
      </Box>
    </Box>
  );
}

export function ForgotPasswordForm() {
  const [api] = useApi();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      setError(null);
      setLoading(true);

      const data = new FormData(event.currentTarget);

      await api({
        method: "POST",
        uri: endpoints.recoverPasswordRequest,
        message: "Password reset link sent",
        body: JSON.stringify({
          email: data.get("email"),
        }),
      });

      router.replace("/auth/login");
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
      <Typography component="h1" variant="h4">
        Recover Password
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 4 }}>
        <Input
          autoFocus
          required
          fullWidth
          id="email"
          name="email"
          margin="normal"
          autoComplete="email"
          label="Email Address"
        />

        <Alert type="error" message={error} />
        <Button type="submit" sx={{ mt: 2 }} fullWidth loading={loading}>
          Recover Password
        </Button>
        <Box
          sx={{ mt: 2, flex: 1, display: "flex", justifyContent: "flex-end" }}
        >
          <Link href="/auth/login">{"Sign in"}</Link>
        </Box>
      </Box>
    </Box>
  );
}

export function RecoverPasswordForm({ token }: { token: string }) {
  const [api] = useApi();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      setError(null);
      setLoading(true);

      const data = new FormData(event.currentTarget);

      if (data.get("password") !== data.get("confirmPassword")) {
        throw new Error("Passwords do not match");
      }

      const body = {
        password: data.get("password"),
      };

      await api({
        method: "PUT",
        body: JSON.stringify(body),
        message: "Password updated successfully",
        uri: endpoints.recoverPassword.replace(":token", token),
      });

      router.replace("/auth/login");
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
      <Typography component="h1" variant="h4">
        Enter your new password
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 4 }}>
        <Input
          required
          fullWidth
          id="password"
          margin="normal"
          name="password"
          type="password"
          label="New Password"
          autoComplete="new-password"
        />
        <Input
          required
          fullWidth
          margin="normal"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          autoComplete="confirm-password"
        />

        <Alert type="error" message={error} />
        <Button type="submit" sx={{ mt: 4 }} fullWidth loading={loading}>
          Update Password
        </Button>
        <Box
          sx={{ mt: 2, flex: 1, display: "flex", justifyContent: "flex-end" }}
        >
          <Link href="/auth/login">Sign in</Link>
        </Box>
      </Box>
    </Box>
  );
}

export function AcceptInviteForm({
  name,
  token,
}: {
  name: string;
  token: string;
}) {
  const [api] = useApi();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      setError(null);
      setLoading(true);

      const data = new FormData(event.currentTarget);

      const body = {
        password: data.get("password"),
      };

      if (body.password !== data.get("confirmPassword")) {
        throw new Error("Passwords do not match");
      }

      await api({
        method: "POST",
        body: JSON.stringify(body),
        message: "Registered successfully",
        uri: `${endpoints.invites}/${token}`,
      });

      router.replace("/auth/login");
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
      <Typography component="h1" variant="h4">
        {name} - Complete your registration
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 4 }}>
        <Input
          required
          fullWidth
          id="password"
          margin="normal"
          name="password"
          type="password"
          label="Password"
          autoComplete="new-password"
        />
        <Input
          required
          fullWidth
          margin="normal"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          autoComplete="confirm-password"
        />

        <Alert type="error" message={error} />
        <Button type="submit" sx={{ mt: 4 }} fullWidth loading={loading}>
          Accept Invite
        </Button>
      </Box>
    </Box>
  );
}
