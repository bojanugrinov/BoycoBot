import fs from 'fs'
import path from 'path'
import { Economy } from '../types/economy'

const FILEPATH = path.join(__dirname, '../data/economy.json')

export function loadEconomy() {
  if (!fs.existsSync(FILEPATH)) {
    fs.writeFileSync(FILEPATH, JSON.stringify({ guilds: {} }, null, 2))
  }

  const data = fs.readFileSync(FILEPATH, 'utf-8')
  return JSON.parse(data) as Economy
}

export function saveEconomy(data: Economy) {
  fs.writeFileSync(FILEPATH, JSON.stringify(data, null, 2))
}

export function getUser(economy: Economy, guildId: string, userId: string) {
  if (!economy.guilds[guildId]) {
    economy.guilds[guildId] = { users: {} }
  }

  const guildEconomy = economy.guilds[guildId]

  if (!guildEconomy.users[userId]) {
    guildEconomy.users[userId] = { balance: 0 }
  }

  return guildEconomy.users[userId]
}
