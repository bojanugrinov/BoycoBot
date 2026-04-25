import * as commandsList from '../commands/index'
import { getGuildConfig } from '../modules/config/store'
import { Command } from '../types/command'

export function getEnabledCommands(guildId: string): Command[] {
  const guildConfig = getGuildConfig(guildId)
  const disabled = new Set(guildConfig.disabledCommands ?? [])

  const enabledCommands = Object.values(commandsList).filter(
    (command: Command) => !disabled.has(command.data.name),
  )

  return enabledCommands
}
