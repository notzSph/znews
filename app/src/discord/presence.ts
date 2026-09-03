import { ActivityType, Client, PresenceUpdateStatus } from "discord.js";

export interface DiscordPresenceConfig {
  token?: string;
}

export class DiscordPresenceClient {
  private client?: Client;

  constructor(private readonly config: DiscordPresenceConfig) {}

  async start(): Promise<void> {
    if (!this.config.token || this.client) return;

    this.client = new Client({ intents: [] });
    this.client.once("ready", () => {
      this.client?.user?.setPresence({
        status: PresenceUpdateStatus.DoNotDisturb,
        activities: [
          {
            name: "Digging shit..",
            state: "Digging shit..",
            type: ActivityType.Custom,
          },
        ],
      });
      console.log(`Discord presence online as ${this.client?.user?.tag ?? "zNews"}`);
    });

    await this.client.login(this.config.token);
  }

  async stop(): Promise<void> {
    const client = this.client;
    this.client = undefined;
    await client?.destroy();
  }
}
