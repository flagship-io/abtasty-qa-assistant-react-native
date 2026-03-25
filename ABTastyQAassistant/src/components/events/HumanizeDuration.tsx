import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text } from "react-native";
import { COLORS } from "../../constants";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;

type HumanizeDurationProps = {
  timestamp: number;
  updateInterval?: number;
};

function formatDuration(timestamp: number): string {
  const delta = Date.now() - timestamp;

  if (delta < 15 * SECOND) {
    return "Just now";
  }
  if (delta < MINUTE) {
    return `${Math.floor(delta / SECOND)} sec. ago`;
  }
  if (delta < 2 * MINUTE) {
    return "a min. ago";
  }
  if (delta < HOUR) {
    return `${Math.floor(delta / MINUTE)} min. ago`;
  }
  if (delta < 2 * HOUR) {
    return "1 hour ago";
  }
  if (delta < DAY) {
    return `${Math.floor(delta / HOUR)} hours ago`;
  }
  if (delta < 2 * DAY) {
    return "one day ago";
  }
  if (delta < MONTH) {
    return `${Math.floor(delta / DAY)} days ago`;
  }

  return `${Math.floor(delta / MONTH)} months ago`;
}

export function HumanizeDuration({
  timestamp,
  updateInterval = 9000,
}: HumanizeDurationProps) {
  const [duration, setDuration] = useState<string>(() =>
    formatDuration(timestamp),
  );

  const updateDuration = useCallback(() => {
    setDuration(formatDuration(timestamp));
  }, [timestamp]);

  useEffect(() => {
    updateDuration();
    const interval = setInterval(updateDuration, updateInterval);
    return () => clearInterval(interval);
  }, [timestamp, updateInterval, updateDuration]);

  const isNew = duration === "Just now";

  return (
    <Text
      style={[
        styles.triggered,
        isNew ? styles.triggeredNew : styles.triggeredOld,
      ]}
    >
      {duration}
    </Text>
  );
}

const styles = StyleSheet.create({
  triggered: {
    fontSize: 12,
    fontWeight: "500",
  },
  triggeredNew: {
    color: COLORS.successDark,
  },
  triggeredOld: {
    color: COLORS.textSecondary,
  },
});
