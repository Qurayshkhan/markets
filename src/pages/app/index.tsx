import React from "react";
import Head from "next/head";
import type { NextPage } from "next";

import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { Logo } from "@components/Logo";
import { Title } from "@components/Title";
import { useAppContext } from "@contexts/index";
import { UserMenu } from "@components/UserMenu";
import { NextLinkComposed } from "@components/Link";
import {
  themeColors,
  themeDimensions,
  themeSpacing,
  themeFonts,
} from "@utils/theme-constants";

// Icons
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: "#ffffff",
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#ffffff",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
}));

const StyledButton = styled("button")(({ theme }) => ({
  color: "#fff",
  border: "none",
  fontSize: "16px",
  fontWeight: 600,
  background: themeColors.primary.main,
  borderRadius: themeDimensions.button.borderRadius,
  height: themeDimensions.button.height,
  padding: "0 24px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  fontFamily: themeFonts.family,
  "&:hover": {
    background: themeColors.primary.hover,
  },
  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
}));

const IntegrationCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#fafafa",
  borderRadius: "16px",
  padding: theme.spacing(3),
  border: "none",
  boxShadow: "none",
  transition: "all 0.3s ease",
  cursor: "pointer",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: "64px",
  height: "64px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
  flexShrink: 0,
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: "20px",
  fontWeight: 600,
  color: "#191b23",
  marginBottom: theme.spacing(0.5),
}));

const CardLabel = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#5d6a83",
}));

const CardDescription = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#5d6a83",
  lineHeight: 1.6,
  marginBottom: theme.spacing(3),
  flexGrow: 1,
}));

const ConnectButton = styled(Button)(({ theme }) => ({
  backgroundColor: "transparent",
  color: "#194bfb",
  border: "1px solid #194bfb",
  padding: "10px 24px",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: 500,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#194bfb",
    color: "white",
  },
}));

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home - Six Wraps</title>
        <meta name="description" content="Home - Six Wraps" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Content />
    </>
  );
};

export default Home;

function Content() {
  const theme = useTheme();
  const { state } = useAppContext();

  const cards = [
    {
      icon: <DashboardOutlinedIcon sx={{ color: "#194bfb" }} />,
      iconBg: "rgba(25, 75, 251, 0.1)",
      title: "Dashboard",
      label: "See What’s Happening, Instantly",
      description:
        "View key metrics like job flow, customer growth, and performance trends — all in clean, visual reports.",
      buttontext: "View Analytics",
      link: "/app/dashboard",
    },
    {
      icon: <WorkOutlineIcon sx={{ color: "#ff6b35" }} />,
      iconBg: "rgba(255, 107, 53, 0.1)",
      title: "Jobs",
      label: "Track Every Job, Every Step",
      description:
        "Create, update, and manage jobs from intake to completion with real-time statuses and customer updates.",
      buttontext: "Go to Jobs",
      link: "/app/jobs",
    },

    {
      icon: <BuildOutlinedIcon sx={{ color: "#10b981" }} />,
      iconBg: "rgba(16, 185, 129, 0.1)",
      title: "Services",
      label: "Organize Your Service Catalog",
      description:
        "Add, edit, and manage service types and categories — so your team stays consistent.",
      buttontext: "Edit Services",
      link: "/app/services",
    },
    {
      icon: <PeopleAltOutlinedIcon sx={{ color: "#7c3aed" }} />,
      iconBg: "rgba(124, 58, 237, 0.1)",
      title: "Users",
      label: "Manage Your Team with Ease",
      description:
        "Control roles and permissions for advisors, managers, and admins — across all locations.",
      buttontext: "Manage Users",
      link: "/app/users",
    },
  ];

  return (
    <PageContainer>
      <StyledAppBar elevation={0} position="static">
        <Container maxWidth="xl" component="main">
          <Toolbar disableGutters sx={{ flexWrap: "wrap", py: 2 }}>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#191b23",
                fontFamily: themeFonts.family,
              }}
            >
              Six Wraps
            </Typography>
            <Box sx={{ flex: 1 }} />
            {state.auth.user ? (
              <UserMenu />
            ) : (
              <NextLinkComposed
                to="/auth/login"
                style={{ textDecoration: "none" }}
              >
                <StyledButton>Login</StyledButton>
              </NextLinkComposed>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Hero unit */}
      <Container maxWidth="lg" component="main" sx={{ pt: 8, pb: 6 }}>
        <Box sx={{ mb: 6 }}>
          <Typography
            sx={{
              fontSize: { xs: 28, sm: 36, lg: 42 },
              fontWeight: 700,
              color: "#191b23",
              fontFamily: themeFonts.family,
              mb: 1,
            }}
          >
            Your OxMotive Dashboard
          </Typography>
          <Typography
            component="p"
            color="#5d6a83"
            sx={{
              fontSize: { xs: 14, sm: 16, lg: 18 },
              maxWidth: "800px",
            }}
          >
            All your shop tools in one place — manage jobs, track performance,
            organize services, and control user access from a single, clean
            dashboard.
          </Typography>
        </Box>

        {/* Cards Grid - 2x2 layout */}
        <Grid container spacing={3}>
          {cards.slice(0, 2).map((card, index) => (
            <Grid item xs={12} md={6} key={index}>
              <IntegrationCard>
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <IconWrapper sx={{ backgroundColor: card.iconBg }}>
                      {card.icon}
                    </IconWrapper>
                    <Box>
                      <CardTitle>{card.title}</CardTitle>
                      <CardLabel>{card.label}</CardLabel>
                    </Box>
                  </Box>
                  <CardDescription>{card.description}</CardDescription>
                  <NextLinkComposed
                    to={card.link}
                    style={{ textDecoration: "none" }}
                  >
                    <ConnectButton fullWidth>{card.buttontext}</ConnectButton>
                  </NextLinkComposed>
                </CardContent>
              </IntegrationCard>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 0 }}>
          {cards.slice(2, 4).map((card, index) => (
            <Grid item xs={12} md={6} key={index + 2}>
              <IntegrationCard>
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <IconWrapper sx={{ backgroundColor: card.iconBg }}>
                      {card.icon}
                    </IconWrapper>
                    <Box>
                      <CardTitle>{card.title}</CardTitle>
                      <CardLabel>{card.label}</CardLabel>
                    </Box>
                  </Box>
                  <CardDescription>{card.description}</CardDescription>
                  <NextLinkComposed
                    to={card.link}
                    style={{ textDecoration: "none" }}
                  >
                    <ConnectButton fullWidth>{card.buttontext}</ConnectButton>
                  </NextLinkComposed>
                </CardContent>
              </IntegrationCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </PageContainer>
  );
}
