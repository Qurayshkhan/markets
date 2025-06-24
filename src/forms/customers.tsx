import { useState } from "react"

import { Box, Grid } from "@mui/material"

import { Alert } from "@ui/Alert"
import { Input } from "@ui/Input"
import { Button } from "@ui/Button"
import { useApi } from "@hooks/useApi"
import { endpoints } from "@utils/constants"

export function CreateCustomer({
  onClose,
  onCreate,
}: {
  onClose?: () => void
  onCreate?: (args: any) => void
}) {
  const [api] = useApi()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()

      setError(null)
      setLoading(true)

      const data = new FormData(event.currentTarget)

      const body = {
        firstName: data.get("firstName"),
        lastName: data.get("lastName") ?? "",
        email: data.get("email"),
        phone: data.get("phone"),
      }

      const response = await api({
        method: "POST",
        uri: endpoints.customers,
        body: JSON.stringify(body),
      })

      onCreate?.(response?.data)
      onClose?.()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Input
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
              placeholder="Enter first name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              placeholder="Enter last name"
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter email address"
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              required
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              type="tel"
              autoComplete="phone"
              placeholder="Enter phone number"
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
              <Button onClick={onClose} variant="text">
                Cancel
              </Button>
              <Button type="submit" loading={loading} variant="contained">
                Create
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Alert type="error" message={error} />
      </Box>
    </Box>
  )
}

export function EditCustomer({
  value,
  onClose,
  onSubmit,
}: {
  value: any
  onClose?: () => void
  onSubmit?: (args: any) => void
}) {
  const [api] = useApi()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()

      setError(null)
      setLoading(true)

      const data = new FormData(event.currentTarget)

      const body = {
        firstName: data.get("firstName"),
        lastName: data.get("lastName") ?? "",
        email: data.get("email"),
        phone: data.get("phone"),
      }

      const response = await api({
        method: "PUT",
        body: JSON.stringify(body),
        message: "Customer updated successfully",
        uri: `${endpoints.customers}/${value._id}`,
      })

      onSubmit?.(response?.data)
      onClose?.()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Input
              required
              autoFocus
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              autoComplete="given-name"
              defaultValue={value.firstName}
              placeholder="Enter first name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              autoComplete="family-name"
              defaultValue={value.lastName}
              placeholder="Enter last name"
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              fullWidth
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              label="Email Address"
              defaultValue={value.email}
              placeholder="Enter email address"
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              fullWidth
              id="phone"
              name="phone"
              label="Phone Number"
              type="tel"
              autoComplete="phone"
              defaultValue={value.phone}
              placeholder="Enter phone number"
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
              <Button onClick={onClose} variant="text">
                Cancel
              </Button>
              <Button type="submit" loading={loading} variant="contained">
                Update
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Alert type="error" message={error} />
      </Box>
    </Box>
  )
}
