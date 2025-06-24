import React from "react"
import Head from "next/head"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import { styled, Theme } from "@mui/material/styles"

import { Logo } from "@components/Logo"
import { useAppContext } from "@contexts/index"
import { APPBAR_HEIGHT } from "@utils/constants"
import { UserMenu } from "@components/UserMenu"
import { NextLinkComposed } from "@components/Link"

const Main = styled("main")(({ theme }) => ({
  padding: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  overflow: "hidden",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}))

const Children = styled(Container)(() => ({
  height: "100%",
  overflow: "auto",
  /* width */
  "&::-webkit-scrollbar": {
    width: 5,
    backgroundColor: "transparent",
  },
  /* Track */
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  /* Thumb */
  "&::-webkit-scrollbar-thumb": {
    borderRadius: 8,
    backgroundColor: "#babac0",
  },
  /* Thumb:hover */
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#babac0",
  },
  /* Button (top and bottom of the scrollbar) */
  "&::-webkit-scrollbar-button": {
    display: "none",
  },
}))

export const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>Home - Six Wraps</title>
        <meta name="description" content="Home - Six Wraps" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Header />

        <Children maxWidth="xl">{children}</Children>
      </Main>
    </>
  )
}

const Header = () => {
  const { state } = useAppContext()

  return (
    <Box
      sx={(theme: Theme) => ({
        py: 2,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: `${APPBAR_HEIGHT}px`,
        justifyContent: "space-between",
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Container maxWidth="xl" component="main">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Logo />

          <Box
            sx={{
              gap: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {state.auth.user ? (
              <UserMenu />
            ) : (
              <Box
                sx={{
                  gap: 2,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Button
                  to="/auth/login"
                  variant="outlined"
                  component={NextLinkComposed}
                >
                  Login
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
