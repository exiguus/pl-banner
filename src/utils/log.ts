export type LogType = 'info' | 'warn' | 'error';
export type LogEnvironment = 'development' | 'production' | 'all';
export type LogEnvironments = LogEnvironment[] | LogEnvironment;

export type LogOptions = { type?: LogType; env?: LogEnvironments };
export type LogItem = { message: any } & LogOptions;
export type LogMessage = any | LogItem;
export const DEFAULT_LOG_ENVIRONMENT: LogEnvironment = 'development';
export const DEFAULT_LOG_TYPE: LogType = 'info';

const isLogItem = (message: LogMessage): message is LogItem =>
  typeof message === 'object' && 'message' in message;

export function log(
  message?: LogMessage,
  ...optionalParams: LogMessage[]
): void {
  const logMessage = (msg: LogMessage): void => {
    if (isLogItem(msg)) {
      logItem(msg);
    } else {
      logItem({ message: msg });
    }
  };

  logMessage(message);

  optionalParams.forEach((item) => {
    logMessage(item);
  });
}

function logItem(item: LogItem): void {
  const options = {
    type: item?.type ?? DEFAULT_LOG_TYPE,
    env: item?.env ?? DEFAULT_LOG_ENVIRONMENT,
  };
  const shouldLog =
    options.env === 'all' ||
    [options.env]
      .flat()
      .includes((process.env.NODE_ENV as LogEnvironment) ?? ('all' as const));
  if (shouldLog) console[options.type](item.message);
}
