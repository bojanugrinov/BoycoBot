import { Collection } from 'discord.js'
import { Command } from '../types/command'
import { help, info, ping } from '../commands'

export function loadCommands(): Collection<string, Command> {
  const commands = new Collection<string, Command>()

  commands.set(help.data.name, help)
  commands.set(info.data.name, info)
  commands.set(ping.data.name, ping)

  return commands
}
