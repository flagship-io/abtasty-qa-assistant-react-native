import React from "react";
import { ABTastyQA } from "@flagship.io/react-native-sdk";
import { appDataReducer } from "../reducers/appReducer";
import { initialAppDataState } from "../data/initialAppDataState";
import { ReactNode, useMemo, useReducer } from "react";
import { AppContext } from "../contexts/appContext";
import {
  useBucketingFileSync,
  useQAReadyEmitter,
  useAllocatedVariationsListener,
} from "../hooks";
import { HitProvider } from "./HitProvider";

type AppProviderProps = {
  ABTastQA: ABTastyQA;
  children: ReactNode;
};

export function AppProvider({ ABTastQA, children }: AppProviderProps) {
  const [appDataState, dispatchAppData] = useReducer(appDataReducer, {
    ...initialAppDataState,
    ABTastQA,
    fsEnvId: ABTastQA.envId as string,
    isCampaignsLoading: true,
  });

  useBucketingFileSync(ABTastQA.envId as string, dispatchAppData);

  // Emit QA_READY event when bucketing file is loaded
  useQAReadyEmitter(ABTastQA, appDataState.bucketingFile);

  // Listen for SDK allocated variations events
  useAllocatedVariationsListener(ABTastQA, dispatchAppData);

  const appValue = useMemo(
    () => ({
      appDataState,
      dispatchAppData,
    }),
    [appDataState, dispatchAppData],
  );

  return (
    <AppContext.Provider value={appValue}>
      <HitProvider ABTastQA={ABTastQA}>{children}</HitProvider>
    </AppContext.Provider>
  );
}
