import axios from 'axios';

const LOG_API = 'http://20.244.56.144/evaluation-service/logs';
const ACCESS_TOKEN = 'YOUR_TOKEN'; // Replace with actual token from auth

export type Stack = 'frontend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type Package = 
  | 'api' 
  | 'component' 
  | 'hook' 
  | 'page' 
  | 'state' 
  | 'style' 
  | 'auth' 
  | 'config' 
  | 'middleware' 
  | 'utils';

export interface LogResponse {
  logID: string;
  message: string;
  [key: string]: any;
}

export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<LogResponse> {
  try {
    const response = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        timeout: 5000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Logging failed', error);
    return {
      logID: '',
      message: 'Logging failed',
    };
  }
}

// Convenience functions for common log types
export const logger = {
  info: (pkg: Package, message: string) => Log('frontend', 'info', pkg, message),
  error: (pkg: Package, message: string) => Log('frontend', 'error', pkg, message),
  warn: (pkg: Package, message: string) => Log('frontend', 'warn', pkg, message),
  debug: (pkg: Package, message: string) => Log('frontend', 'debug', pkg, message),
};
