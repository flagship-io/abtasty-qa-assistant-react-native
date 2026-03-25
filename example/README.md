# ABTasty QA Assistant - Demo App

This is an [Expo](https://expo.dev) demo application showcasing the **@abtasty/qa-assistant-react-native** package. This example demonstrates how to integrate and use the QA Assistant for ABTasty Feature Experimentation in React Native.

## Prerequisites

- Node.js (v18 or later)
- Yarn (v4.11.0+)
- iOS Simulator (for macOS) or Android Emulator
- Expo CLI

## Getting Started

Follow these steps to run the demo app locally:

### 1. Install Dependencies

From the **root directory** of the monorepo, install all dependencies for both the QA Assistant library and the demo app:

```bash
yarn install
```

### 2. Build the QA Assistant Library

Before running the demo app, you need to build the `@abtasty/qa-assistant-react-native` library:

```bash
yarn build
```

This compiles the TypeScript source code in the `ABTastyQAassistant` folder into JavaScript that can be used by the example app.

### 3. Start the Expo Development Server

Start the Expo development server:

```bash
yarn example:start
```

Or navigate to the example directory and start directly:

```bash
cd example
yarn start
```

### 4. Run on a Platform

In the Expo development server output, you'll find options to open the app:

- Press **`i`** to open in iOS Simulator
- Press **`a`** to open in Android Emulator
- Scan the QR code with Expo Go app on your physical device

You can also run platform-specific commands from the root:

```bash
# For iOS
yarn example:ios

# For Android
yarn example:android
```

## Development Workflow

### Making Changes to the QA Assistant Library

If you're modifying the QA Assistant library code in `ABTastyQAassistant/src`:

1. **Watch mode** (recommended for development):
   ```bash
   yarn watch
   ```
   This will automatically rebuild the library when you make changes.

2. **Manual rebuild**:
   ```bash
   yarn build
   ```

3. **Restart Expo**: After rebuilding, restart the Expo development server to pick up the changes.

### Making Changes to the Demo App

Edit files in the `example/app` directory. Changes will hot-reload automatically thanks to Expo's Fast Refresh.

## Project Structure

```
example/
├── app/              # Main application code (Expo Router)
│   ├── _layout.tsx   # Root layout
│   └── index.tsx     # Home screen
├── assets/           # Images and other static assets
├── package.json      # Demo app dependencies
└── README.md         # This file
```

## Troubleshooting

### Module not found errors

If you see errors about missing `@abtasty/qa-assistant-react-native` module:

1. Make sure you've run `yarn build` from the root directory
2. Try clearing the Expo cache:
   ```bash
   yarn start --clear
   ```

### Nested node_modules issues

If you encounter dependency resolution issues:

```bash
yarn example:rm-abtasty-node-modules
```

This removes nested node_modules that might cause conflicts with the yarn workspace setup.

## Learn More

- [ABTasty QA Assistant Documentation](../ABTastyQAassistant/README.md)
- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
- [ABTasty Feature Experimentation](https://www.abtasty.com/)
