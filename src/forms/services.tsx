import { useState } from "react"

import { Box } from "@mui/material"

import { Alert } from "@ui/Alert"
import { Input } from "@ui/Input"
import { Button } from "@ui/Button"
import { useApi } from "@hooks/useApi"
import { endpoints } from "@utils/constants"

export function CreateService({
  parentId,
  onClose,
  onSubmit,
}: {
  parentId?: string
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
        name: data.get("name"),
        parentId,
      }

      const response = await api({
        method: "POST",
        uri: endpoints.services,
        body: JSON.stringify(body),
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
        sx={{
          mt: 1,
          width: "100%",
        }}
      >
        <Input
          autoComplete="service-name"
          name="name"
          required
          fullWidth
          id="name"
          label="Service Name"
          placeholder="Enter service name"
          autoFocus
        />

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
            Create
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export function EditService({
  value,
  parentId,
  onClose,
  onSubmit,
}: {
  value: any
  parentId?: string
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
        name: data.get("name"),
        parentId,
      }

      const response = await api({
        method: "PUT",
        uri: `${endpoints.services}/${value._id}`,
        body: JSON.stringify(body),
        message: "Service updated successfully",
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
        sx={{
          mt: 1,
          width: "100%",
        }}
      >
        <Input
          autoComplete="service-name"
          name="name"
          required
          fullWidth
          id="name"
          label="Service Name"
          placeholder="Enter service name"
          autoFocus
          defaultValue={value.name}
        />

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
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
