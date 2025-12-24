import { Collection, REST, Routes } from 'discord.js'
import { Command } from '../types/command'

export async function registerCommands(
  commands: Collection<string, Command>,
  token: string,
  clientId: string,
  guildId: string
): Promise<void> {
  const rest = new REST({ version: '10' }).setToken(token)

  const commandsData = Array.from(commands.values()).map((cmd) => cmd.data.toJSON())

  console.log(
    '\n📋 Commands to register:',
    commandsData.map((cmd) => cmd.name)
  )

  try {
    console.log('🔄 Registering slash commands...')
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandsData })
    console.log('✅ Slash commands registered successfully!\n')
  } catch (error) {
    console.error('❌ Error registering commands:', error)
  }
}
