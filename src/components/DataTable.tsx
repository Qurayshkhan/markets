import React from "react"

import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import { useMediaQuery } from "@mui/material"
import TableRow from "@mui/material/TableRow"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableContainer from "@mui/material/TableContainer"
import TablePagination from "@mui/material/TablePagination"
import CircularProgress from "@mui/material/CircularProgress"

import { Select } from "@ui/Select"
import { DataTableHeader } from "@utils/types"

function getValue(
  obj: any,
  fieldArray: string[],
  i: number = 0
): React.ReactNode {
  let value
  value = obj[fieldArray[i]]
  if (typeof value === "object" && !React.isValidElement(value)) {
    value = getValue(value, [fieldArray[i + 1]])
  }
  return value
}

export const DataTable = ({
  page,
  limit,
  loading,
  data = [],
  totalData,
  totalPages,
  columns = [],
  onPageChange,
  onLimitChange,
}: {
  data?: any[]
  page?: number
  limit?: number
  loading?: boolean
  totalData?: number
  totalPages?: number
  columns?: DataTableHeader[]
  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void
}) => {
  const isMobile = useMediaQuery("(max-width: 600px)")

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    onPageChange?.(newPage + 1)
  }

  const handleLimitChange = (event: any) => {
    onLimitChange?.(+event.target.value)
    onPageChange?.(1)
  }

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer 
        component={Paper} 
        variant="outlined"
        sx={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e8edff',
          overflow: 'hidden',
        }}
      >
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: '#F8F9FB',
                '& .MuiTableCell-head': {
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#030229',
                  borderBottom: '1px solid #E6E8EC',
                  padding: '16px 20px',
                },
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: any, index) => {
              return (
                <TableRow 
                  hover 
                  role="checkbox" 
                  tabIndex={-1} 
                  key={row._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#F8F9FB',
                    },
                    '& .MuiTableCell-body': {
                      fontSize: '14px',
                      color: '#030229',
                      borderBottom: '1px solid #F1F3F9',
                      padding: '16px 20px',
                    },
                  }}
                >
                  {columns.map((column: DataTableHeader) => {
                    let value
                    if (column.render) {
                      value = column.render(row)
                    } else {
                      value = getValue(row, column.id.split("."))
                    }

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
            {(loading || data.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{ 
                    textAlign: "center",
                    padding: '40px 20px',
                    fontSize: '14px',
                    color: '#5D6A83',
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                      <CircularProgress size={20} sx={{ color: '#194bfb' }} />
                      <span>Loading...</span>
                    </Box>
                  ) : (
                    "No data available"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {page && limit && totalData ? (
        <Grid
          container
          spacing={2}
          sx={{ mt: 0.5 }}
          direction={isMobile ? "column-reverse" : "row"}
        >
          <Grid item xs={isMobile ? 12 : 6}>
            <Select
              size="small"
              fullWidth={isMobile}
              value={String(limit)}
              onChange={handleLimitChange}
              options={["10", "25", "100"].map((option: string) => ({
                value: option,
                label: `${option} items per page`,
              }))}
            />
          </Grid>
          <Grid
            item
            display="flex"
            alignItems="center"
            xs={isMobile ? 12 : 6}
            justifyContent={isMobile ? "center" : "flex-end"}
          >
            <TablePagination
              page={page - 1}
              component="div"
              count={totalData}
              rowsPerPage={limit}
              rowsPerPageOptions={[-1]}
              onPageChange={handleChangePage}
            />
          </Grid>
        </Grid>
      ) : (
        ""
      )}
    </Box>
  )
}
