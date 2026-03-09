import { Collection } from 'discord.js'
import { Command } from '../types/command'
import * as commandModules from '../commands'
import * as adminCommandModules from '../commands/admin'

export function loadCommands(): {
  commands: Collection<string, Command>
  adminCommands: Collection<string, Command>
} {
  const commands = new Collection<string, Command>()
  const adminCommands = new Collection<string, Command>()

  Object.values(commandModules).forEach((command: Command) => {
    commands.set(command.data.name, command)
  })

  Object.values(adminCommandModules).forEach((command: Command) => {
    adminCommands.set(command.data.name, command)
  })

  return { commands, adminCommands }
}
