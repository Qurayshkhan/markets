import Head from "next/head"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"

import { useApi } from "@hooks/useApi"
import { Alert } from "@ui/Alert"
import { endpoints } from "@utils/constants"
import { HeaderLayout } from "@layouts/Header"
import { RecoverPasswordForm } from "@forms/auth"

let requested = false
const AcceptInvite: NextPage = () => {
  const [api] = useApi()
  const router = useRouter()
  const { query } = router

  const [user, setUser] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    router.prefetch("/auth/login")
    router.prefetch("/app")
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (query.token && !requested) {
      checkToken()
      requested = true
    }

    // eslint-disable-next-line
  }, [query])

  const checkToken = async () => {
    try {
      const response = await api({
        uri: endpoints.checkToken.replace(":token", query.token as string),
      })

      setUser(response?.data)
      setLoading(false)
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Reset Password</title>
        <meta name="description" content="Accept Email" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeaderLayout>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert type="error" message={error} />
            ) : (
              <RecoverPasswordForm token={query.token as string} />
            )}
          </Box>
        </Box>
      </HeaderLayout>
    </>
  )
}

export default AcceptInvite
