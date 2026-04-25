interface GuildConfig {
  disabledCommands: string[]
}

export interface Config {
  guilds: Record<string, GuildConfig>
}
