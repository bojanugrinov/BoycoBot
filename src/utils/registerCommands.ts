import { Collection, REST, Routes } from 'discord.js'
import { Command } from '../types/command'

export async function registerCommands(
  commands: Collection<string, Command>,
  token: string,
  clientId: string,
  guildId: string
): Promise<void> {
  const rest = new REST({ version: '10' }).setToken(token)

  const commandsList = Array.from(commands.values()).map((command) => command.data.toJSON())

  const categories: Record<string, string[]> = {}

  Array.from(commands.values()).map((command) => {
    const category = command.category
    if (!categories[category]) categories[category] = []
    categories[category].push(command.data.name)
  })

  console.log('\n📋 Commands to register:')
  Object.entries(categories).map(([category, commands]) => {
    console.log(`📂 ${category}:`, commands)
  })

  try {
    console.log('\n🔄 Registering slash commands...')
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandsList })
    console.log('✅ Slash commands registered successfully!\n')
  } catch (error) {
    console.error('❌ Error registering commands:', error)
  }
}
