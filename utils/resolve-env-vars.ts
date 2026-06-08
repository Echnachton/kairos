import { join } from "node:path";

type EnvVars =
  | "DB_FILE_NAME"
  | "PROFILE_DIR"
  | "CDP_PORT"
  | "CDP_URL"
  | "USER_DATA_DIR";

function requireEnv(name: EnvVars, fallback?: string): string {
  const value = process.env[name];

  if (!value && !!fallback) {
    return fallback;
  }

  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
}

const env: Record<EnvVars, string> = {
  DB_FILE_NAME: requireEnv("DB_FILE_NAME"),
  PROFILE_DIR: requireEnv("PROFILE_DIR"),
  CDP_PORT: requireEnv("CDP_PORT", "9222"),
  CDP_URL: requireEnv("CDP_URL", "http://127.0.0.1"),
  USER_DATA_DIR: requireEnv(
    "USER_DATA_DIR",
    join(import.meta.dirname, "..", "auth", "chrome-profile"),
  ),
};

export default env;
