/* eslint-disable */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      WEBSOCKET_URL: string;
    }
  }
}

export {};
