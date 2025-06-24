import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import NextLink from "next/link";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { LoginForm } from "@forms/auth";
import {
  themeColors,
  themeDimensions,
  themeSpacing,
  themeFonts,
} from "@utils/theme-constants";

// Styled Components
const FullContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "100vh",
  overflow: "hidden",
  backgroundColor: themeColors.background.default,
}));

const FormMiddle = styled(Box)(({ theme }) => ({
  backgroundColor: themeColors.background.default,
  display: "flex",
  borderRadius: "12px",
  overflow: "hidden",
  width: "100%",
  height: "100%",
}));

const FormInner = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "60px 120px",
  minWidth: "50%",
  justifyContent: "space-between",
  alignItems: "flex-start",
  height: "100%",
  [theme.breakpoints.down("xl")]: {
    padding: "20px 50px",
  },
  [theme.breakpoints.down("md")]: {
    minWidth: "100%",
    padding: "40px",
    alignItems: "center",
  },
}));

const Banner = styled(Box)(({ theme }) => ({
  backgroundColor: themeColors.background.dark,
  minWidth: "50%",
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  gap: 0,
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: "url('/img/welcome-vector-shape.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: themeSpacing.logoBottom,
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: "32px",
  height: "32px",
  backgroundColor: themeColors.primary.main,
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: "24px",
  fontWeight: themeFonts.logo.weight,
  color: themeColors.text.primary,
  fontFamily: "inherit",
}));

const FooterTop = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  textAlign: "center",
}));

const FooterList = styled("ul")(({ theme }) => ({
  display: "flex",
  listStyle: "none",
  gap: "40px",
  padding: 0,
  flexWrap: "wrap",
  margin: 0,
  justifyContent: "center",
  alignItems: "center",
}));

const FooterLink = styled(NextLink)(({ theme }) => ({
  color: themeColors.text.primary,
  fontWeight: themeFonts.small.weight,
  fontSize: themeFonts.small.size,
  textDecoration: "none",
  "&:hover": {
    color: themeColors.primary.main,
  },
}));

const Copyright = styled("p")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px",
  color: themeColors.text.secondary,
  fontSize: themeFonts.small.size,
  marginTop: themeSpacing.footerTop,
  fontWeight: 500,
  margin: 0,
}));

const SliderDots = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "8px",
  marginTop: "40px",
  justifyContent: "center",
  "& .dot": {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    transition: "all 0.3s ease",
    "&.active": {
      backgroundColor: "#fff",
      width: "24px",
      borderRadius: "4px",
    },
  },
}));

const Login: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/auth/register");
    router.prefetch("/app");
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Head>
        <title>Login - Six Wraps</title>
        <meta name="description" content="Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <FullContainer>
        <FormMiddle>
          <FormInner>
            <Box sx={{ width: "100%", maxWidth: "400px" }}>
              <Typography
                sx={{
                  fontSize: themeFonts.logo.size,
                  fontWeight: themeFonts.logo.weight,
                  color: themeColors.text.primary,
                  fontFamily: themeFonts.family,
                }}
              >
                SixWraps
              </Typography>
            </Box>
            <Box sx={{ marginX: "auto", width: "100%", maxWidth: "400px" }}>
              <LoginForm />
            </Box>
            <FooterTop sx={{ marginX: "auto" }}>
              <FooterList>
                <li>
                  <FooterLink href="#">Terms & Condition</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Privacy Policy</FooterLink>
                </li>
                <li>
                  <FooterLink href="#">Help</FooterLink>
                </li>
              </FooterList>
              <Copyright>
                © {new Date().getFullYear()}{" "}
                <NextLink
                  href="#"
                  style={{
                    color: themeColors.primary.main,
                    textDecoration: "none",
                  }}
                >
                  OxMotive.co
                </NextLink>{" "}
                - All Right Reserved.
              </Copyright>
            </FooterTop>
          </FormInner>
          <Banner>
            <Image
              src="/img/welcome-vector.png"
              alt="Welcome"
              width={880}
              height={600}
              style={{
                maxWidth: "880px",
                width: "90%",
                height: "auto",
                objectFit: "contain",
              }}
            />
            <Box
              sx={{
                textAlign: "center",
                color: "white",
                maxWidth: "385px",
                px: 4,
                position: "absolute",
                bottom: "2%",
              }}
            >
              <Typography
                sx={{
                  fontSize: themeFonts.title.size,
                  fontWeight: themeFonts.title.weight,
                }}
              >
                Simplify Your Auto, Shop Workflow
              </Typography>

              <SliderDots>
                <Box
                  className="dot active"
                  style={{ backgroundColor: themeColors.primary.main }}
                />
                <Box className="dot" />
                <Box className="dot" />
              </SliderDots>
            </Box>
          </Banner>
        </FormMiddle>
      </FullContainer>
    </>
  );
};

export default Login;
