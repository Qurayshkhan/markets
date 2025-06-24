import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()

export const apiLimit = publicRuntimeConfig.apiLimit

export const baseURL = `${publicRuntimeConfig.apiPath}/api/${publicRuntimeConfig.apiVersion}`

export const drawerWidth = 260
export const APPBAR_HEIGHT = 65

export const days: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
export const months: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]
export const years: string[] = Array.from(new Array(10), (_, i) =>
  String(new Date().getFullYear() - i)
).reverse()

export const endpoints = {
  auth: "/auth",
  login: "/auth/login",
  authEmail: "/auth/email",
  register: "/auth/register",
  authProfile: "/auth/profile",
  checkToken: "/auth/:token/check",
  verifyEmail: "/auth/:token/verify",
  refreshToken: "/auth/:token/refresh",
  recoverPassword: "/auth/:token/recover",
  recoverPasswordRequest: "/auth/recover",
  switchOrganization: "/auth/organization/:organizationId/:franchiseId",

  // Upload
  uploadData: "/upload",

  // Profile
  profile: "/profile",
  profileTheme: "/profile/theme",

  // Users
  users: "/users",

  // Organization Franchises
  franchises: "/organizations/franchises",
  settings: "/organizations/franchises/settings",
  statusTexts: "/organizations/franchises/status-texts",
  franchiseMetadata: "/organizations/franchises/metadata",
  legalMessages: "/organizations/franchises/legal-messages",

  // Organization Franchise Users
  franchiseUsers: "/organizations/franchises/users",
  franchiseUsersRole: "/organizations/franchises/users/role",

  // Invite Users
  invites: "/invites",

  // Customers
  customers: "/customers",
  customersSearch: "/customers/search",

  // Services
  services: "/services",
  servicesStatus: "/services/status",

  // Jobs
  jobs: "/jobs",

  // Analytics
  analyticsJobs: "/analytics/jobs",
  analyticsCustomers: "/analytics/customers",
  analyticsChartsJobs: "/analytics/charts/jobs",
  analyticsChartsServices: "/analytics/charts/services",
  analyticsChartsCustomers: "/analytics/charts/customers",
  analyticsChartsJobsStatus: "/analytics/charts/jobs-status",
  analyticsChartsCustomersJobs: "/analytics/charts/customers-jobs",
}
