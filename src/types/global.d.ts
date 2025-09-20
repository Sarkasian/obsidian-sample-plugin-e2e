export {};

declare global {
  interface Window {
    __PLUGIN_TEST_LOGS__?: Array<{
      level: import("../utils/logging").LogLevel;
      message: string;
      timestamp: number;
    }>;
  }
}


