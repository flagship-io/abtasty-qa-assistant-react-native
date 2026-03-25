import React, { memo, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Targetings } from "../../types.local";
import { COLORS } from "../../constants";

interface Props {
  targetings: Targetings;
  isLast?: boolean;
}

interface TargetingValueArrayItemProps {
  val: unknown;
  matchedValue?: Set<unknown>;
}

const TargetingValueArrayItem = memo<TargetingValueArrayItemProps>(
  ({ val, matchedValue }) => {
    const backgroundColor = matchedValue?.has(val)
      ? COLORS.success
      : COLORS.blueLight;

    const displayValue = useMemo(() => String(val), [val]);

    return (
      <Text style={[localStyles.valueText, { backgroundColor }]}>
        {displayValue}
      </Text>
    );
  }
);

interface TargetingValueProps {
  value: unknown;
  matchedValue?: Set<unknown>;
}

const TargetingValue = memo<TargetingValueProps>(({ value, matchedValue }) => {
  const backgroundColor = useMemo(
    () => (matchedValue?.has(value) ? COLORS.success : COLORS.blueLight),
    [matchedValue, value]
  );

  const renderValue = useMemo(() => {
    if (Array.isArray(value)) {
      return (
        <>
          {value.map((val, index) => (
            <TargetingValueArrayItem
              key={`${val}-${index}`}
              val={val}
              matchedValue={matchedValue}
            />
          ))}
        </>
      );
    }

    if (typeof value === "object" && value !== null) {
      return (
        <Text style={[localStyles.valueText, { backgroundColor }]}>
          {JSON.stringify(value)}
        </Text>
      );
    }

    return (
      <Text style={[localStyles.valueText, { backgroundColor }]}>
        {String(value)}
      </Text>
    );
  }, [value, matchedValue, backgroundColor]);

  return <>{renderValue}</>;
});

export const TargetingItem = memo<Props>(({ targetings, isLast = false }) => {
  const isAllUsers = useMemo(
    () => targetings.key === "fs_all_users",
    [targetings.key]
  );

  return (
    <View style={localStyles.container}>
      <View style={localStyles.keyOperatorValueContainer}>
        {isAllUsers ? (
          <Text style={localStyles.keyText}>All Users</Text>
        ) : (
          <>
            <Text style={localStyles.keyText}>{targetings.key}</Text>
            <Text style={localStyles.operatorText}>{targetings.operator}</Text>
            <View style={localStyles.valueContainer}>
              <TargetingValue
                value={targetings.value}
                matchedValue={targetings.matchedValue}
              />
            </View>
          </>
        )}
      </View>
      {!isLast && <Text style={localStyles.andText}>AND</Text>}
    </View>
  );
});


const localStyles = StyleSheet.create({
  container: {},
  keyOperatorValueContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
  },
  keyText: {
    fontWeight: "bold",
    flexShrink: 0,
  },
  operatorText: {
    fontWeight: "600",
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginHorizontal: 5,
  },
  valueContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
  },
  valueText: {
    fontWeight: "600",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  andText: {
    fontWeight: "600",
    backgroundColor: COLORS.greyLight,
    borderColor: COLORS.border,
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginVertical: 15,
  },
});
