interface UserData {
  balance: number
  lastDaily: number
}

interface GuildEconomy {
  users: Record<string, UserData>
}

export interface Economy {
  guilds: Record<string, GuildEconomy>
}
