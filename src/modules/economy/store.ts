import path from 'path'
import { Economy } from './types'
import { loadJSON, saveJSON } from '../../store/json'

const FILEPATH = path.join(__dirname, '../../data/economy.json')

const EconomyStore = (() => {
  const economy: Economy = loadJSON<Economy>(FILEPATH, { guilds: {} })

  return {
    getEconomy: () => economy,

    saveEconomy: () => saveJSON(FILEPATH, economy),

    getEconomyUser: (guildId: string, userId: string) => {
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
})()

export const getEconomy = EconomyStore.getEconomy
export const saveEconomy = EconomyStore.saveEconomy
export const getEconomyUser = EconomyStore.getEconomyUser
