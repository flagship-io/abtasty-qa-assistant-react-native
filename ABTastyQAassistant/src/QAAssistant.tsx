import React, { useEffect } from "react";
import { QAConfig } from "./types";
import { DEFAULT_CONFIG } from "./constants";
import { useABTastyQA } from "./deps";
import { QAAssistantContent } from "./QAAssistantContent";

interface QAAssistantProps {
  config?: Partial<QAConfig>;
}

/**
 * Main QA Assistant Component
 *
 * Usage:
 * ```tsx
 * import { QAAssistant } from '@abtasty/qa-assistant-react-native';
 *
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <QAAssistant config={{ position: 'bottom-right' }} />
 *     </>
 *   );
 * }
 * ```
 */
export const QAAssistant: React.FC<QAAssistantProps> = ({
  config: userConfig,
}) => {
  const config = { ...DEFAULT_CONFIG, ...userConfig };

  const ABTastQA = useABTastyQA();

  useEffect(() => {
    if (!ABTastQA) {
      console.warn(`
ABTasty QA Assistant Error: The ABTasty QA Assistant is not able to access the Flagship SDK instance. 
Make sure to wrap your app with FlagshipProvider or that you are using a compatible version of @flagship.io/react-native-sdk.
            `);
    }
    if (ABTastQA && !ABTastQA.isQAModeEnabled) {
      console.warn(`
ABTasty QA Assistant Warning: The ABTasty QA Assistant is disabled because the Flagship SDK is not in QA mode.
To enable QA mode, initialize the Flagship React SDK with the 'isQAModeEnabled' props set to true.
            `);
    }

    if (ABTastQA && !ABTastQA.envId) {
      console.warn(`
ABTasty QA Assistant Warning: The ABTasty QA Assistant is disabled because the Flagship SDK is not configured with a valid environment ID.
Make sure to provide a valid 'envId' when initializing the Flagship React SDK.
            `);
    }
  }, [ABTastQA, ABTastQA?.isQAModeEnabled]);

  if (!ABTastQA || !ABTastQA.isQAModeEnabled || !ABTastQA.envId) {
    return null;
  }

  return <QAAssistantContent config={config} ABTastQA={ABTastQA} />;
};
