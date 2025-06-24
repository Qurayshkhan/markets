import Head from "next/head"
import Image from "next/image"
import { useState } from "react"
import type { NextPage } from "next"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

import { useApi } from "@hooks/useApi"
import { Logo } from "@components/Logo"
import { Button } from "@ui/Button"
import { endpoints } from "@utils/constants"

const Home: NextPage = () => {
  const [api] = useApi()

  const [loading, setLoading] = useState(false)
  const [imageLink, setImageLink] = useState("")

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    try {
      setLoading(true)

      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        const fileType = file.type

        const response = await api({
          uri: `${endpoints.uploadData}?fileType=image&mimeType=${fileType}`,
        })

        await fetch(response?.data.uploadUrl, {
          body: file,
          method: "PUT",
          headers: { "Content-Type": fileType },
        })

        setImageLink(response?.data.downloadUrl)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Home - Six Wraps</title>
        <meta name="description" content="Home - Six Wraps" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container component="main" maxWidth="xs">
        <Box
          sx={{ my: 8, flex: 1, display: "center", justifyContent: "center" }}
        >
          <Logo />
        </Box>

        {imageLink && (
          <Image
            width={400}
            height={300}
            loading="lazy"
            src={imageLink}
            unoptimized={true}
            alt="Upload testing"
            loader={() => imageLink}
          />
        )}

        <Box
          sx={{ my: 4, flex: 1, display: "center", justifyContent: "center" }}
        >
          <Button component="label" variant="contained" loading={loading}>
            Upload
            <input
              hidden
              multiple
              type="file"
              accept="image/*"
              onChange={uploadImage}
            />
          </Button>
        </Box>
      </Container>
    </>
  )
}

export default Home
