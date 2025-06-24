import Head from "next/head";
import * as React from "react";
import { useState, useEffect } from "react";

import { Box, CircularProgress } from "@mui/material";

import { Heading } from "@components/Title";
import { DrawerLayout } from "@layouts/Drawer";
import { useFetchMetadata } from "@hooks/auth";
import { UpdateProfile, UpdatePassword } from "@forms/profile";
import { useAppContext } from "@contexts/index";
import { DashboardHeader } from "@components/DashboardHeader";

export default function Profile() {
  const { fetchMetadata, loading } = useFetchMetadata();
  const { state } = useAppContext();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        if (state.auth.isAuth) {
          console.log("fetching metadata 2", state.auth.token);
          await fetchMetadata(state.auth.token);
        }
      } catch (error) {
        console.error("Failed to fetch profile metadata:", error);
      } finally {
        setIsReady(true);
      }
    };

    initializeProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.auth.isAuth]);

  if (loading || !isReady) {
    return (
      <>
        <Head>
          <title>Profile - Six Wraps</title>
        </Head>
        <DrawerLayout>
          <DashboardHeader
            title="Profile"
            subtitle="Manage your account settings and preferences"
          />
          <Box
            sx={{
              padding: 3,
              display: "flex",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <CircularProgress />
          </Box>
        </DrawerLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Profile - Six Wraps</title>
      </Head>

      <DrawerLayout>
        <DashboardHeader
          title="Profile"
          subtitle="Manage your account settings and preferences"
        />

        <Box sx={{ padding: 3 }}>
          <Box sx={{ 
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e8edff'
          }}>
            <Heading sx={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: '#030229',
              marginBottom: '8px'
            }}>
              Account Settings
            </Heading>

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box>
                <Heading sx={{ 
                  fontSize: '16px', 
                  fontWeight: 500, 
                  color: '#030229',
                  marginBottom: '16px'
                }}>
                  Personal Information
                </Heading>
                <UpdateProfile />
              </Box>
              
              <Box>
                <Heading sx={{ 
                  fontSize: '16px', 
                  fontWeight: 500, 
                  color: '#030229',
                  marginBottom: '16px'
                }}>
                  Security Settings
                </Heading>
                <UpdatePassword />
              </Box>
            </Box>
          </Box>
        </Box>
      </DrawerLayout>
    </>
  );
}
