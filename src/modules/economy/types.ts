interface EconomyUser {
  balance: number
  lastDaily: number
  lastWork: number
  lastCrime: number
}

interface EconomyGuild {
  users: Record<string, EconomyUser>
}

export interface Economy {
  guilds: Record<string, EconomyGuild>
}
