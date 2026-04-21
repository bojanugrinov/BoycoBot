import { Collection, REST, Routes } from 'discord.js'
import { Command } from '../types/command'
import { logCommands } from './logCommands'

export async function registerCommands(
  commands: Collection<string, Command>,
  token: string,
  clientId: string,
  guildId: string,
): Promise<void> {
  const rest = new REST({ version: '10' }).setToken(token)

  const commandsList = Array.from(commands.values()).map((command) => command.data.toJSON())
  logCommands(commands)

  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: [...commandsList],
    })
    console.log('\n✅ Slash commands registered successfully!\n')
  } catch (error) {
    console.error('\n❌ Error registering commands:', error)
  }
}
