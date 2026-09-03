import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

export interface DiscordPosterConfig {
  token?: string;
  tapeChannelId?: string;
  driverBoardChannelId?: string;
  digestChannelId?: string;
}

export interface DiscordPostResult {
  posted: boolean;
  messageId?: string;
  threadId?: string;
  reason?: "disabled" | "missing-config";
}

interface DiscordMessageResponse {
  id: string;
}

interface DiscordThreadResponse {
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

  async syncDriverBoard(threadName: string, message: string, existingThreadId?: string, existingMessageId?: string): Promise<DiscordPostResult> {
    if (!this.config.token || !this.config.driverBoardChannelId || !this.rest) {
      return { posted: false, reason: "missing-config" };
    }

    const threadId = existingThreadId ?? await this.createDriverThread(threadName);
    if (existingThreadId) {
      await this.rest.patch(Routes.channel(threadId), { body: { archived: false } });
    }

    if (existingMessageId) {
      await this.rest.patch(Routes.channelMessage(threadId, existingMessageId), {
        body: { content: message, allowed_mentions: { parse: [] } },
      });
      return { posted: true, threadId, messageId: existingMessageId };
    }

    const response = (await this.rest.post(Routes.channelMessages(threadId), {
      body: { content: message, allowed_mentions: { parse: [] } },
    })) as DiscordMessageResponse;
    return { posted: true, threadId, messageId: response.id };
  }

  private async createDriverThread(name: string): Promise<string> {
    const response = (await this.rest!.post(Routes.threads(this.config.driverBoardChannelId!), {
      body: { name, type: 11, auto_archive_duration: 10080 },
    })) as DiscordThreadResponse;
    return response.id;
  }

  async postDigest(message: string, destinationChannelId = this.config.digestChannelId): Promise<DiscordPostResult> {
    if (!this.config.token || !destinationChannelId || !this.rest) {
      return { posted: false, reason: "missing-config" };
    }

    const response = (await this.rest.post(Routes.channelMessages(destinationChannelId), {
      body: { content: message, allowed_mentions: { parse: [] } },
    })) as DiscordMessageResponse;
    return { posted: true, messageId: response.id };
  }
}
