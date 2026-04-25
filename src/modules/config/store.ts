import path from 'path'
import { Config } from './types'
import { loadJSON, saveJSON } from '../../store/json'

const FILEPATH = path.join(__dirname, '../../data/guildConfig.json')

const ConfigStore = (() => {
  const config: Config = loadJSON<Config>(FILEPATH, { guilds: {} })

  return {
    saveGuildConfig: () => saveJSON(FILEPATH, config),

    getGuildConfig: (guildId: string) => {
      if (!config.guilds[guildId]) {
        config.guilds[guildId] = {
          disabledCommands: [],
        }
      }

      return config.guilds[guildId]
    },
  }
})()

export const saveGuildConfig = ConfigStore.saveGuildConfig
export const getGuildConfig = ConfigStore.getGuildConfig
