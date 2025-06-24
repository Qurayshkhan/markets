import { setBrowserItem, removeBrowserAll } from "@utils/browser-utility";

import { User, ActionType, AuthStateType, ThemeMode } from "@utils/types";

export const AuthInitialState = {
  user: {} as User,
  token: "" as string,
  loading: true as boolean,
  isAuth: false as boolean,
  refreshToken: "" as string,
  theme: "light" as ThemeMode,
};

export const AuthTypes = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  SET_USER: "SET_USER",
  TRIGGER_THEME: "TRIGGER_THEME",
};

export const AuthReducer = (state: AuthStateType, action: ActionType) => {
  switch (action.type) {
    case AuthTypes.LOGIN:
      setBrowserItem(action.payload?.accessToken || "");
      setBrowserItem(action.payload?.refreshToken || "", "refreshToken");
      return {
        ...state,
        ...action.payload,
        isAuth: true,
        loading: false,
      };
    case AuthTypes.LOGOUT:
      removeBrowserAll();
      return {
        ...state,
        user: "",
        token: "",
        isAuth: false,
        loading: false,
      };
    case AuthTypes.SET_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    case AuthTypes.TRIGGER_THEME:
      return {
        ...state,
        theme: (action.payload.theme as ThemeMode) || "light",
      };
    default:
      return state;
  }
};
