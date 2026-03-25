import React from "react";
import {
  useNavigationBuilder,
  createNavigatorFactory,
  ParamListBase,
  StackRouter,
  StackNavigationState,
  StackRouterOptions,
} from "@react-navigation/native";
import { View, StyleSheet } from "react-native";

type QAScreenOptions = {
  headerTitle?: string | ((props: { canGoBack: boolean }) => React.ReactNode);
  [key: string]: unknown;
};

type QANavigatorProps = StackRouterOptions & {
  children: React.ReactNode;
  screenOptions?: QAScreenOptions;
};

function QANavigator({ children, screenOptions, ...rest }: QANavigatorProps) {
  const { state, descriptors, NavigationContent } = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackRouterOptions,
    Record<string, () => void>,
    QAScreenOptions,
    Record<string, { data?: unknown; canPreventDefault?: boolean }>
  >(StackRouter, {
    children,
    screenOptions,
    ...rest,
  });

  return (
    <NavigationContent>
      <View style={styles.container}>
        {state.routes.map((route, i) => {
          const descriptor = descriptors[route.key];
          const isFocused = state.index === i;
          const { options } = descriptor;

          return (
            <View
              key={route.key}
              style={[
                styles.screen,
                { display: isFocused ? "flex" : "none" },
              ]}
            >
              {options.headerTitle && (
                <View style={styles.header}>
                  {typeof options.headerTitle === "function"
                    ? options.headerTitle({ canGoBack: i > 0 })
                    : options.headerTitle}
                </View>
              )}
              {descriptor.render()}
            </View>
          );
        })}
      </View>
    </NavigationContent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  header: {
    backgroundColor: "#FFFFFF",
  },
});

export const createQANavigator = createNavigatorFactory(QANavigator);
