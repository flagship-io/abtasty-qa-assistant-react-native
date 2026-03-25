const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");
const packageRoot = path.resolve(workspaceRoot, "ABTastyQAassistant");

const config = getDefaultConfig(projectRoot);

// Watch the parent workspace
config.watchFolders = [workspaceRoot];

// Configure resolver to properly handle the local package
config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [path.resolve(projectRoot, "node_modules")],
  // Explicitly resolve the package to its dist folder
  extraNodeModules: {
    "@abtasty/qa-assistant-react-native": path.resolve(packageRoot, "dist"),
    react: path.resolve(__dirname, "node_modules/react"),
    "react-native": path.resolve(__dirname, "node_modules/react-native"),
  },
  // Ensure .js and .ts files are resolved
  sourceExts: [...(config.resolver.sourceExts || []), "ts", "tsx"],
};



// Reset Metro cache on start
config.resetCache = true;

module.exports = config;
