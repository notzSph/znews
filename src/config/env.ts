export interface AppEnv {
  databaseUrl: string;
  discordToken?: string;
  discordTapeChannelId?: string;
  discordDriverBoardChannelId?: string;
  discordDigestChannelId?: string;
  discordRoadmapThreadId?: string;
  timezone: string;
  pollIntervalMs: number;
  maxItemAgeHours: number;
}

export interface ReadEnvOptions {
  requireDatabaseUrl?: boolean;
}

export function readEnv(env: NodeJS.ProcessEnv = process.env, options: ReadEnvOptions = {}): AppEnv {
  const requireDatabaseUrl = options.requireDatabaseUrl ?? true;

  return {
    databaseUrl: requireDatabaseUrl ? readRequired(env, "DATABASE_URL") : (readOptional(env, "DATABASE_URL") ?? ""),
    discordToken: readOptional(env, "DISCORD_TOKEN"),
    discordTapeChannelId: readOptional(env, "DISCORD_TAPE_CHANNEL_ID"),
    discordDriverBoardChannelId: readOptional(env, "DISCORD_DRIVER_BOARD_CHANNEL_ID"),
    discordDigestChannelId: readOptional(env, "DISCORD_DIGEST_CHANNEL_ID"),
    discordRoadmapThreadId: readOptional(env, "DISCORD_ROADMAP_THREAD_ID"),
    timezone: readOptional(env, "ZN_TIMEZONE") ?? "UTC",
    pollIntervalMs: readOptionalInteger(env, "ZN_POLL_INTERVAL_MS") ?? 60_000,
    maxItemAgeHours: readOptionalInteger(env, "ZN_MAX_ITEM_AGE_HOURS") ?? 48,
  };
}

function readRequired(env: NodeJS.ProcessEnv, key: string): string {
  const value = readOptional(env, key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function readOptional(env: NodeJS.ProcessEnv, key: string): string | undefined {
  const value = env[key]?.trim();
  return value ? value : undefined;
}

function readOptionalInteger(env: NodeJS.ProcessEnv, key: string): number | undefined {
  const value = readOptional(env, key);
  if (!value) return undefined;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid positive integer environment variable: ${key}`);
  }

  return parsed;
}
