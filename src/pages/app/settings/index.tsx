import Head from "next/head";
import * as React from "react";
import { useEffect, useState } from "react";

import { Box, CircularProgress } from "@mui/material";

import { Heading } from "@components/Title";
import { DrawerLayout } from "@layouts/Drawer";
import { useFetchMetadata } from "@hooks/auth";
import {
  UpdateMessages,
  UpdateStatusTexts,
  UpdateMessagesSettings,
} from "@forms/profile";
import { DashboardHeader } from "@components/DashboardHeader";

export default function Settings() {
  const { fetchMetadata, loading, error } = useFetchMetadata();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        console.log("fetching metadata 1 called");
        await fetchMetadata();
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      } finally {
        setIsReady(true);
      }
    };

    initializeSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !isReady) {
    return (
      <>
        <Head>
          <title>Settings - Six Wraps</title>
        </Head>
        <DrawerLayout>
          <DashboardHeader
            title="Settings"
            subtitle="Configure your application preferences"
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
        <title>Settings - Six Wraps</title>
      </Head>

      <DrawerLayout>
        <DashboardHeader
          title="Settings"
          subtitle="Configure your application preferences"
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
              Messages Settings
            </Heading>

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box>
                <Heading sx={{ 
                  fontSize: '16px', 
                  fontWeight: 500, 
                  color: '#030229',
                  marginBottom: '16px',
                  textAlign: 'right'
                }}>
                  SMS Settings
                </Heading>
                <UpdateMessagesSettings />
              </Box>
              
              <Box>
                <Heading sx={{ 
                  fontSize: '16px', 
                  fontWeight: 500, 
                  color: '#030229',
                  marginBottom: '16px'
                }}>
                  Message Templates
                </Heading>
                <UpdateMessages />
              </Box>
              
              <Box>
                <Heading sx={{ 
                  fontSize: '16px', 
                  fontWeight: 500, 
                  color: '#030229',
                  marginBottom: '16px'
                }}>
                  Status Messages
                </Heading>
                <UpdateStatusTexts />
              </Box>
            </Box>
          </Box>
        </Box>
      </DrawerLayout>
    </>
  );
}
