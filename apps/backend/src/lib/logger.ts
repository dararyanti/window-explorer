type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  private format(level: LogLevel, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    return meta ? `${base} | ${JSON.stringify(meta)}` : base;
  }

  debug(message: string, meta?: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.format("debug", message, meta));
    }
  }

  info(message: string, meta?: unknown) {
    console.info(this.format("info", message, meta));
  }

  warn(message: string, meta?: unknown) {
    console.warn(this.format("warn", message, meta));
  }

  error(message: string, meta?: unknown) {
    console.error(this.format("error", message, meta));
  }
}

export const logger = new Logger();
