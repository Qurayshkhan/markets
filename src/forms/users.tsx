import { useState, useEffect } from "react"

import {
  Box,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material"

import { Alert } from "@ui/Alert"
import { Input } from "@ui/Input"
import { Button } from "@ui/Button"
import { useApi } from "@hooks/useApi"
import { endpoints } from "@utils/constants"
import { getOrgMetadata } from "@utils/browser-utility"

export function InviteUser({
  onClose,
  onSubmit,
}: {
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
      }

      const response = await api({
        method: "POST",
        uri: endpoints.invites,
        body: JSON.stringify(body),
        message: "Invite sent successfully",
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
      <Box
        noValidate
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "100%", mt: 1 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Input
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              placeholder="Enter first name"
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
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
          <Button onClick={onClose} variant="text">
            Cancel
          </Button>
          <Button type="submit" loading={loading} variant="contained">
            Invite
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export function EditUser({
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
        email: data.get("email"),
        phone: data.get("phone") ?? "",
        firstName: data.get("firstName"),
        lastName: data.get("lastName") ?? "",
      }

      const response = await api({
        method: "PUT",
        body: JSON.stringify(body),
        message: "User updated successfully",
        uri: `${endpoints.franchiseUsers}/${value._id}`,
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
      <Box
        noValidate
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "100%", mt: 1 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Input
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              placeholder="Enter first name"
              autoFocus
              defaultValue={value.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              placeholder="Enter last name"
              defaultValue={value.lastName}
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
              defaultValue={value.email}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              type="tel"
              autoComplete="phone"
              placeholder="Enter phone number"
              defaultValue={value.phone}
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
          <Button onClick={onClose} variant="text">
            Cancel
          </Button>
          <Button type="submit" loading={loading} variant="contained">
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export function UpdateRole({
  value,
  onClose,
  onSubmit,
}: {
  value: any
  onClose?: () => void
  onSubmit?: (args: any) => void
}) {
  const [api] = useApi()
  const [roles, setRoles] = useState([])

  useEffect(() => {
    const metadata = getOrgMetadata()
    setRoles(metadata?.orgRoles || [])
  }, [])

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()

      setError(null)
      setLoading(true)

      const data = new FormData(event.currentTarget)

      const body = {
        role: data.get("role"),
      }

      await api({
        method: "PUT",
        body: JSON.stringify(body),
        message: "User updated successfully",
        uri: `${endpoints.franchiseUsersRole}/${value._id}`,
      })

      onSubmit?.(body)
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
      <Box
        noValidate
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "100%", mt: 1 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl>
              <RadioGroup
                row
                id="role"
                name="role"
                defaultValue={value.role}
                aria-labelledby="update-user-role"
                sx={{
                  gap: 2,
                  "& .MuiFormControlLabel-root": {
                    marginRight: 0,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#030229",
                    },
                  },
                  "& .MuiRadio-root": {
                    color: "#E6E8EC",
                    "&.Mui-checked": {
                      color: "#194bfb",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(25, 75, 251, 0.08)",
                    },
                  },
                }}
              >
                {roles.map((role: any) => (
                  <FormControlLabel
                    key={role.value}
                    value={role.value}
                    label={role.label}
                    control={<Radio />}
                  />
                ))}
              </RadioGroup>
            </FormControl>
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
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
