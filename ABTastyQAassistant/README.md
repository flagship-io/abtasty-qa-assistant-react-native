# ABTasty QA Assistant for React Native

A visual testing tool for React Native applications that integrates with ABTasty Feature Experimentation. It provides a floating UI overlay that allows developers and QA engineers to test campaign variations and feature flags without backend changes or app redeployment.

> **Full documentation**: [docs.abtasty.com/server-side/sdks/react-native/abtasty-qa-assistant-for-react-native](https://docs.abtasty.com/server-side/sdks/react-native/abtasty-qa-assistant-for-react-native)  
> **Usage guide**: [docs.abtasty.com/server-side/concepts/using-abtasty-qa-assistant](https://docs.abtasty.com/server-side/concepts/using-abtasty-qa-assistant)

## Key Features

- **Force variations** - Switch to a specific variation within a campaign
- **Force allocation** - Make a rejected campaign available for testing
- **Hide campaign** - Hide accepted campaigns to test exclusion scenarios
- **Real-time event monitoring** - Track all SDK events for integration verification
- **Context inspection** - View visitor data and targeting rules
- **Search & filter** - Quickly find specific campaigns and events

> **Note:** Forced allocations, variations, and hidden campaigns are temporary. They reset when you disable QA mode or restart the app. Everything returns to natural allocation automatically.

## Prerequisites

- `@flagship.io/react-native-sdk` >= 5.1.0
- `react` >= 18.0.0
- `react-native` >= 0.70.0

## Installation

### 1. Install Flagship SDK (if not already installed)

```bash
# Using npm
npm install @flagship.io/react-native-sdk

# Using yarn
yarn add @flagship.io/react-native-sdk
```

### 2. Install the Package

```bash
# Using npm
npm install @abtasty/qa-assistant-react-native

# Using yarn
yarn add @abtasty/qa-assistant-react-native
```

## Integration

### Quick Start

Add the QA Assistant to your app in two steps.

#### Step 1 - Enable QA Mode in FlagshipProvider

```tsx
// Import FlagshipProvider from the Flagship React Native SDK
import { FlagshipProvider } from '@flagship.io/react-native-sdk';
// Import QAAssistant from the QA Assistant package
import { QAAssistant } from '@abtasty/qa-assistant-react-native';

export default function App() {
  return (
    // Wrap your app with FlagshipProvider to enable the Flagship SDK
    <FlagshipProvider
      envId="YOUR_ENV_ID"         // Your ABTasty environment ID
      apiKey="YOUR_API_KEY"       // Your ABTasty API key
      isQAModeEnabled={true}      // REQUIRED: enables the QA Assistant overlay
      visitorData={{
        id: 'visitor_id',         // Unique identifier for the visitor
        hasConsented: true,       // GDPR consent flag
        context: { platform: 'mobile' }  // Targeting context attributes
      }}
    >
      <YourApp />
      {/* Mount QAAssistant inside FlagshipProvider so it can access the SDK */}
      <QAAssistant />
    </FlagshipProvider>
  );
}
```

> **Important:** `isQAModeEnabled={true}` is required. Without it, the QA Assistant will not render.

#### Step 2 - Development-Only Usage

Ensure the QA Assistant only appears in development builds:

```tsx
export default function App() {
  return (
    <FlagshipProvider {...props}>
      <YourApp />
      {/* Render QAAssistant only in development mode.
          This prevents the overlay from being bundled in production releases. */}
      {__DEV__ && <QAAssistant />}
    </FlagshipProvider>
  );
}
```

## Configuration

Customize the QA Assistant appearance:

```tsx
<QAAssistant
  config={{
    position: "bottom-right",  // "top-right" | "top-left" | "bottom-right" | "bottom-left"
  }}
/>
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Position of the floating button |

## Complete Example

```tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FlagshipProvider, useFsFlag } from '@flagship.io/react-native-sdk';
import { QAAssistant } from '@abtasty/qa-assistant-react-native';

function MyApp() {
  // Retrieve feature flag values reactively from the SDK
  const welcomeMessage = useFsFlag('welcome_message');
  const showNewFeature = useFsFlag('show_new_feature');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {welcomeMessage.getValue('Welcome!')}
      </Text>
      {showNewFeature.getValue(false) && (
        <Text>New Feature Enabled</Text>
      )}
    </View>
  );
}

export default function App() {
  return (
    <FlagshipProvider
      envId="YOUR_ENV_ID"
      apiKey="YOUR_API_KEY"
      isQAModeEnabled={true}
      visitorData={{
        id: 'test_visitor_123',
        hasConsented: true,
        context: {
          platform: 'mobile',
          userType: 'free'
        }
      }}
    >
      <MyApp />
      {/* Only include QAAssistant in development builds */}
      {__DEV__ && (
        <QAAssistant config={{ position: "bottom-right" }} />
      )}
    </FlagshipProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' }
});
```

## Best Practices

**DO:**
- Always use `isQAModeEnabled={true}` in `FlagshipProvider`
- Place `QAAssistant` inside `FlagshipProvider`
- Use conditional rendering (`__DEV__`) to exclude from production
- Use SDK hooks to ensure flag changes are reactive

**DON'T:**
- Never include QA Assistant in production builds
- Don't place `QAAssistant` outside `FlagshipProvider`
- Don't hardcode flag values — always use SDK hooks

> **Warning:** The QA Assistant must **never** be included in production builds. Exposing QA mode in production allows anyone to view all campaign configurations, force any variation, see internal feature flags, and monitor SDK events.

## Troubleshooting

### QA Assistant not showing

1. Verify `isQAModeEnabled` is set to `true`:
   ```tsx
   <FlagshipProvider isQAModeEnabled={true} {...props}>
   ```
2. Ensure `QAAssistant` is inside `FlagshipProvider`:
   ```tsx
   <FlagshipProvider>
     <App />
     <QAAssistant />  {/* ✓ Correct placement */}
   </FlagshipProvider>
   ```
3. Check conditional rendering — verify `__DEV__` is `true`:
   ```tsx
   console.log('__DEV__:', __DEV__);
   {__DEV__ && <QAAssistant />}
   ```
4. Clear cache and reinstall:
   ```bash
   rm -rf node_modules && yarn install
   npx react-native start --reset-cache
   ```

### Console warnings

**"Not able to access Flagship SDK instance"**

```tsx
// ✗ Wrong — QAAssistant outside FlagshipProvider
<>
  <FlagshipProvider {...props}>
    <App />
  </FlagshipProvider>
  <QAAssistant />
</>

// ✓ Correct
<FlagshipProvider {...props}>
  <App />
  <QAAssistant />
</FlagshipProvider>
```

Also ensure the SDK version is `>= 5.1.0`:
```bash
yarn add @flagship.io/react-native-sdk@latest
```

**"QA mode not enabled"** — Add `isQAModeEnabled={true}` to `FlagshipProvider`.

**"No valid envId configured"** — Verify the `envId` prop is set correctly.

### Campaigns not appearing

1. No campaigns configured — check ABTasty platform
2. Network issues — verify `bucketing.json` loads correctly
3. Wrong environment — ensure you are using the correct `envId`
4. SDK initialization — wait a few seconds after app launch

### Forced variations not applying

Use SDK hooks — ensure you are using `useFsFlag()`:

```tsx
// ✗ Wrong — hardcoded
const message = "Welcome";

// ✓ Correct — using SDK
const messageFlag = useFsFlag('welcome_message');
const message = messageFlag.getValue('Welcome');
```

### Floating button overlapping UI

Change the position:

```tsx
<QAAssistant config={{ position: "top-left" }} />
```

## Frequently Asked Questions

**Q: Do forced allocations persist after app restart?**  
A: No. All forced allocations, hidden campaigns, and variations reset automatically when you disable QA mode (`isQAModeEnabled={false}`) or restart the app. This is by design to ensure a clean state and prevent accidental forced states in production.

**Q: Can I force multiple campaigns at once?**  
A: Yes. Each forced variation, allocation, and hidden campaign is independent.

**Q: What is the difference between forcing a variation, allocation, and hiding a campaign?**

| Action | Description |
|--------|-------------|
| Force variation | Switches to a specific variation within a campaign you are already allocated to |
| Force allocation | Makes a campaign that rejected you available for testing |
| Hide campaign | Hides an accepted campaign to simulate exclusion scenarios |

**Q: Can I use QA Assistant in production?**  
A: No. Always use `{__DEV__ && <QAAssistant />}` to exclude it from production.

**Q: Does QA Assistant work offline?**  
A: Initial load requires network to fetch campaigns. After that, it works offline with cached data.

**Q: Can I force variations programmatically?**  
A: QA Assistant is for manual testing. For automated tests, use Flagship SDK methods directly with controlled context values.

## Requirements

- React Native >= 0.70.0
- React >= 18.0.0
- @flagship.io/react-native-sdk >= 5.1.0

## License

Apache-2.0

## Support

- GitHub: [abtasty/qa-assistant-react-native](https://github.com/abtasty/qa-assistant-react-native)
- Documentation: [docs.abtasty.com/server-side/sdks/react-native/abtasty-qa-assistant-for-react-native](https://docs.abtasty.com/server-side/sdks/react-native/abtasty-qa-assistant-for-react-native)
- Flagship SDK docs: [docs.developers.flagship.io](https://docs.developers.flagship.io/)
- ABTasty Support: https://support.abtasty.com/

## Changelog

### v1.0.0

- Initial release
- Campaign viewing, forcing, and hiding
- Force allocation for rejected campaigns
- Real-time event monitoring
- Context inspection
- Search & filter
- Floating button UI with configurable position
- TypeScript support
