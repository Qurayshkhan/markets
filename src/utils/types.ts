import React from "react"

export type Address = {
  addressOne: string
  addressTwo?: string
  addressThree?: string
  zip?: string
  city?: string
  state?: string
  country?: string
}

export type Organization = {
  _id: string
  name: string
  email: string
  phone: string
  logo?: string
  address?: Address
}

export type Franchise = {
  _id: string
  name: string
}

export type LastLogin = {
  ip: string
  timestamp: Date
  franchiseId: string
  organizationId: string
}

export type User = {
  _id: string
  name: string
  firstName: string
  lastName?: string
  email: string
  phone?: string
  gender?: string
  dateOfBirth?: string | Date
  image?: string
  fcmToken?: string
  lastLogin?: LastLogin
  role: string
  status?: string
  address?: Address
  franchiseId: string
  organizationId: string
  organization: Organization
  organizations: Organization[]
}

export type Invite = {
  _id: string
  name: string
  firstName: string
  lastName?: string
  email: string
  organizationId: string
  franchiseId: string
  token: string
}

export type Customer = {
  _id: string
  firstName: string
  lastName?: string
  name?: string
  email: string
  phone: string
  gender?: string
  dateOfBirth?: string | Date
  image?: string
  reviewedAt?: Date
  organizationId: string
  franchiseId: string
  organization: Organization
  franchise: Franchise
  status: string
  totalJobs: number
}

export type Service = {
  _id: string
  name: string
  parentId?: string
  subServices?: Service[]
  organizationId: string
  franchiseId: string
  status: any
  updateAt: Date
  createdAt: Date
}

export type Vehicle = {
  vinNumber: string
  licenseNumber: string
  color: string
  make: string
  model: string
  year: string
}

export type Job = {
  _id: string
  customer: Customer
  customerSign?: string
  vehicle: Vehicle
  services: Service[]
  estimatedCompletionDate: Date
  paymentType: "cash" | "credit_cart" | "check" | "finance" | "other"
  images: string[]
  videos: string[]
  description: string
  reviewed: boolean
  userId: string
  organizationId: string
  franchiseId: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export type MetadataStatus = {
  label: string
  value: string
}
export type MetadataStatusTexts = {
  _id: string
  text: string
  label: string
  status: string
}

export type Metadata = {
  promotionalMessage: string
  statusTexts: MetadataStatusTexts[]
  statuses: MetadataStatus[]
  services?: Service[]
}

export type DataTableHeader = {
  id: string
  label: string
  align?: "right" | "inherit" | "left" | "center" | "justify"
  width?: string | number
  minWidth?: string | number
  sortable?: boolean
  sort?: string
  filterable?: boolean
  filter?: string
  format?: (value: any) => string
  render?: (value: any) => React.ReactNode
}

export type ThemeMode = "light" | "dark"

export type ActionType = {
  type: string
  payload: any
}

export type AuthStateType = {
  user: User
  token: string
  isAuth: boolean
  loading: boolean
  refreshToken: string
  theme: ThemeMode
}

export type Pagination = {
  page: number
  limit: number
  totalPages: number
  totalData: number
}

export type Response =
  | {
      data: any
      headers?: any
      message: string
      pagination?: Pagination
    }
  | undefined

export type T = Awaited<Promise<Response>>

export type NavLink = {
  type: string
  href?: string
  label: string
  color?: string
  exact?: boolean
  children?: NavLink[]
  icon?: React.ReactElement
}

export type Interval = "day" | "week" | "month" | "year"
export type Color =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning"

export type MenuLink = {
  href?: string
  label: string
  color?: string
  icon?: React.ReactElement
  onClick?: () => void
}

export type DateRangeType = [Date | null, Date | null]

export type Freeze<T> = {
  readonly [P in keyof T]: T[P]
}
