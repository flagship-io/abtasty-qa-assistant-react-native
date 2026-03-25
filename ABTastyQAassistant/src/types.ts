/**
 * Represents the QA mode configuration
 */
export interface QAConfig {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  floatingButton?: boolean;
}

/**
 * QA Assistant props
 */
export interface QAAssistantProps {
  config?: QAConfig;
  onClose?: () => void;
}