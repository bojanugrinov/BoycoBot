import { Collection } from 'discord.js'
import { Command } from '../types/command'
import * as commandModules from '../commands'

export function loadCommands(): Collection<string, Command> {
  const commands = new Collection<string, Command>()

  Object.values(commandModules).forEach((command: Command) => {
    commands.set(command.data.name, command)
  })

  return commands
}
