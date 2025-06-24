import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";

import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import { useApi } from "@hooks/useApi";
import { endpoints } from "@utils/constants";
import { useSystemTheme } from "@hooks/useSystemTheme";
import { AuthTypes, useAppContext } from "@contexts/index";
import { NavLink, Metadata, MenuLink } from "@utils/types";
import { getBrowserItem, setOrgMetadata } from "@utils/browser-utility";

export const useRouteLinks = () => {
  const router = useRouter();
  const { dispatch } = useAppContext();

  const NavLinks: NavLink[] = useMemo(
    () => [
      {
        type: "group",
        label: "Menu",
        children: [
          {
            type: "item",
            label: "Home",
            href: "/app",
            icon: (
              <svg
                className="crancy-svg-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="22"
                viewBox="0 0 20 22"
                fill="none"
              >
                <path
                  d="M1 11L10 2L19 11M3 9V20C3 20.5523 3.44772 21 4 21H16C16.5523 21 17 20.5523 17 20V9M8 21V15C8 14.4477 8.44772 14 9 14H11C11.5523 14 12 14.4477 12 15V21"
                  stroke="#191b23"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            exact: true,
          },
          {
            type: "item",
            label: "Dashboard",
            href: "/app/dashboard",
            icon: (
              <svg
                className="crancy-svg-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="22"
                viewBox="0 0 20 22"
                fill="none"
              >
                <path
                  d="M14 21V17C14 14.7909 12.2091 13 10 13C7.79086 13 6 14.7909 6 17V21M19 9.15033V16.9668C19 19.1943 17.2091 21 15 21H5C2.79086 21 1 19.1943 1 16.9668V9.15033C1 7.93937 1.53964 6.7925 2.46986 6.02652L7.46986 1.90935C8.9423 0.696886 11.0577 0.696883 12.5301 1.90935L17.5301 6.02652C18.4604 6.7925 19 7.93937 19 9.15033Z"
                  stroke="#191b23"
                  strokeWidth="1.5"
                />
              </svg>
            ),
            exact: true,
          },
          {
            type: "item",
            label: "Jobs",
            href: "/app/jobs",
            icon: (
              <svg
                className="crancy-svg-icon"
                width="20"
                height="22"
                viewBox="0 0 20 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9H14M6 13H14M6 17H10M6 3C6 4.10457 6.89543 5 8 5H12C13.1046 5 14 4.10457 14 3M6 3C6 1.89543 6.89543 1 8 1H12C13.1046 1 14 1.89543 14 3M6 3H5C2.79086 3 1 4.79086 1 7V17C1 19.2091 2.79086 21 5 21H15C17.2091 21 19 19.2091 19 17V7C19 4.79086 17.2091 3 15 3H14"
                  stroke="#191b23"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ),
          },
          {
            type: "item",
            label: "Customers",
            href: "/app/customers",
            icon: (
              <svg
                className="crancy-svg-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M2 7C2 4.79086 3.79086 3 6 3H18C20.2091 3 22 4.79086 22 7V17C22 19.2091 20.2091 21 18 21H6C3.79086 21 2 19.2091 2 17V7Z"
                  stroke="#191b23"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 9L22 15H18C16.3431 15 15 13.6569 15 12C15 10.3431 16.3431 9 18 9L22 9Z"
                  stroke="#191b23"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle
                  cx="18"
                  cy="12"
                  r="0.5"
                  fill="#191b23"
                  stroke="#191b23"
                />
                <path
                  d="M6.5 9V6.5C6.5 6.22386 6.72386 6 7 6H12.5"
                  stroke="#191b23"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
          },
          {
            type: "item",
            label: "Services",
            href: "/app/services",
            icon: (
              <svg
                className="crancy-svg-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21.7155 16.134L20.6548 17.866L17.7572 18.5981L17.3986 19.2568L20.939 13.4019L21.2976 11.2568L20.939 10.5981L17.7572 5.40193L18.1158 6.06066L20.6548 6.13398L21.7155 7.86603L22.3551 16.5256ZM2.28455 7.86602L3.34516 6.13397L6.2428 5.40192L6.60138 4.74319L3.06097 10.5981L2.70238 12.7432L3.06096 13.4019L6.24279 18.5981L5.88422 17.9394L3.34515 17.866L2.28454 16.134L1.64493 7.47436ZM14.5833 12C14.5833 13.4267 13.4267 14.5833 12 14.5833C10.5733 14.5833 9.41668 13.4267 9.41668 12C9.41668 10.5733 10.5733 9.41667 12 9.41667C13.4267 9.41667 14.5833 10.5733 14.5833 12Z"
                  stroke="#191b23"
                  strokeWidth="1.5"
                />
              </svg>
            ),
          },
          {
            type: "item",
            label: "Users",
            href: "/app/users",
            icon: (
              <svg
                className="crancy-svg-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20.5 21V19C20.5 16.7909 18.7091 15 16.5 15H11.5C9.29086 15 7.5 16.7909 7.5 19V21M8 2.58468C7.09652 2.21165 6.0847 2 5 2C2.23858 2 0 4.23858 0 7C0 9.07542 1.10417 10.887 2.73249 11.873M16.5 7C16.5 9.76142 14.2614 12 11.5 12C8.73858 12 6.5 9.76142 6.5 7C6.5 4.23858 8.73858 2 11.5 2C14.2614 2 16.5 4.23858 16.5 7ZM5 7C5 8.10457 4.10457 9 3 9C1.89543 9 1 8.10457 1 7C1 5.89543 1.89543 5 3 5C4.10457 5 5 5.89543 5 7Z"
                  stroke="#191b23"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ),
          },
          {
            type: "item",
            label: "Settings",
            href: "/app/settings",
            icon: (
              <svg
                className="crancy-svg-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke="#191b23"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2579 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
                  stroke="#191b23"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
          },
        ],
      },
    ],
    []
  );

  const MenuLinks: MenuLink[] = useMemo(
    () => [
      {
        type: "item",
        label: "Home",
        href: "/app",
        icon: <HomeOutlinedIcon fontSize="small" />,
      },
      {
        type: "item",
        label: "Profile",
        href: "/app/profile",
        icon: <Settings fontSize="small" />,
      },
      {
        color: "error",
        label: "Logout",
        icon: <Logout fontSize="small" />,
        onClick: () => {
          dispatch({ type: AuthTypes.LOGOUT });
          router.push("/");
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, dispatch]
  );

  return { NavLinks, MenuLinks };
};

export const AuthWrapper = ({ children }: { children: any }) => {
  const router = useRouter();

  const { theme } = useSystemTheme();
  const { state, dispatch } = useAppContext();
  const { fetchMetadata } = useFetchMetadata();

  const [api] = useApi();

  const checkAuth = async () => {
    try {
      let route = "/";

      const token = getBrowserItem();

      // Check if token exists
      if (!token) {
        if (!router.asPath.startsWith("/app")) route = router.asPath;

        dispatch({ type: AuthTypes.LOGOUT });
        router.replace(route);
        return;
      }

      const response = await api({
        uri: endpoints.authProfile,
      });

      dispatch({
        type: AuthTypes.LOGIN,
        payload: response?.data,
      });

      dispatch({
        type: AuthTypes.TRIGGER_THEME,
        payload: { theme: response?.data?.user?.theme },
      });

      // Fetch Metadata
      await fetchMetadata(response?.data?.accessToken);

      if (
        ((!router.asPath.startsWith("/auth/login") ||
          !router.asPath.startsWith("/auth/register")) &&
          router.asPath.startsWith("/app")) ||
        router.asPath.startsWith("/auth")
      ) {
        route = router.asPath;
      }

      router.prefetch(route);
      router.replace(route);
    } catch (error: any) {
      dispatch({ type: AuthTypes.LOGOUT });
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch({ type: AuthTypes.TRIGGER_THEME, payload: { theme } });

    // eslint-disable-next-line
  }, [theme, state.auth.isAuth]);

  return children;
};

export const useFetchMetadata = () => {
  const [api] = useApi();

  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = async (token?: string, retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api({
        uri: `${endpoints.franchiseMetadata}?filter=`,
        ...(token && {
          headers: new Headers([
            ["Authorization", `Bearer ${token}`],
            ["Content-Type", "application/json"],
          ]),
        }),
      });

      setMetadata(response?.data);
      setOrgMetadata(response?.data);
      setLoading(false);
    } catch (error: any) {
      console.error("Failed to fetch metadata:", error);
      setLoading(false);
      setError(error.message || "Failed to fetch metadata");

      // Only retry up to 3 times with exponential backoff
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        setTimeout(() => {
          fetchMetadata(token, retryCount + 1);
        }, delay);
      }
    }
  };

  return { loading, metadata, error, fetchMetadata };
};
