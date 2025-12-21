import { Collection } from 'discord.js'
import { Command } from '../types/command'
import { ping } from '../commands'

export function loadCommands(): Collection<string, Command> {
  const commands = new Collection<string, Command>()
  commands.set(ping.data.name, ping)

  return commands
}
