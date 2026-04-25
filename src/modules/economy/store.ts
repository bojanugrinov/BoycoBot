import path from 'path'
import { Economy } from './types'
import { loadJSON, saveJSON } from '../../store/json'

const FILEPATH = path.join(__dirname, '../../data/economy.json')

const economy: Economy = loadJSON(FILEPATH, {
  guilds: {},
})

export const EconomyStore = {
  save: () => saveJSON(FILEPATH, economy),

  economy: (guildId: string) => economy.guilds[guildId],

  user: (guildId: string, userId: string) => {
    if (!economy.guilds[guildId]) {
      economy.guilds[guildId] = { users: {} }
    }

    const guild = economy.guilds[guildId]

    if (!guild.users[userId]) {
      guild.users[userId] = {
        balance: 0,
        lastDaily: 0,
        lastWork: 0,
        lastCrime: 0,
      }
    }

    return guild.users[userId]
  },
}
