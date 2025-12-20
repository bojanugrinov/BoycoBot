import { Collection } from 'discord.js'
import { Command } from '../types/command'
import { hello } from '../commands'

export function loadCommands(): Collection<string, Command> {
  const commands = new Collection<string, Command>()

  commands.set(hello.data.name, hello)

  return commands
}
