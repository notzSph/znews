import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

export interface DiscordPosterConfig {
  token?: string;
  tapeChannelId?: string;
}

export interface DiscordPostResult {
  posted: boolean;
  messageId?: string;
  reason?: "disabled" | "missing-config";
}

interface DiscordMessageResponse {
  id: string;
}

export class DiscordPoster {
  private readonly rest?: REST;

  constructor(private readonly config: DiscordPosterConfig) {
    if (config.token) {
      this.rest = new REST({ version: "10" }).setToken(config.token);
    }
  }

  async postTapeLine(message: string): Promise<DiscordPostResult> {
    if (!this.config.token || !this.config.tapeChannelId || !this.rest) {
      return { posted: false, reason: "missing-config" };
    }

    const response = (await this.rest.post(Routes.channelMessages(this.config.tapeChannelId), {
      body: {
        content: message,
        allowed_mentions: { parse: [] },
      },
    })) as DiscordMessageResponse;

    return { posted: true, messageId: response.id };
  }
}
