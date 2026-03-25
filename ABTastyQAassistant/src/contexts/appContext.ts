import { createContext } from "react";
import { AppContextValue } from "../types.local";
import { initialAppDataState } from "../data/initialAppDataState";

const appValue: AppContextValue = {
  appDataState: initialAppDataState,
  dispatchAppData: () => {},
};

export const AppContext = createContext<AppContextValue>(appValue);
