interface UserData {
  balance: number
}

interface GuildEconomy {
  users: Record<string, UserData>
}

export interface Economy {
  guilds: Record<string, GuildEconomy>
}
