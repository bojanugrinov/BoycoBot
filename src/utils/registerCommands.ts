import { Collection, REST, Routes, StringMappedInteractionTypes } from 'discord.js'
import { Command } from '../types/command'

export async function registerCommands(
  commands: Collection<string, Command>,
  adminCommands: Collection<string, Command>,
  token: string,
  clientId: string,
  guildId: string,
): Promise<void> {
  const rest = new REST({ version: '10' }).setToken(token)

  const commandsList = Array.from(commands.values()).map((command) => command.data.toJSON())
  const adminCommandsList = Array.from(adminCommands.values()).map((command) =>
    command.data.toJSON(),
  )

  const logCategories = (title: string, collection: Collection<string, Command>) => {
    const categories: Record<string, string[]> = {}

    Array.from(collection.values()).forEach((command) => {
      const category = command.category
      if (!categories[category]) categories[category] = []
      categories[category].push(command.data.name)
    })

    console.log(`\n📋 ${title}`)

    Object.entries(categories).forEach(([category, commands]) => {
      console.log(`📂 [${commands.length}] ${category}:`, commands)
    })
  }

  logCategories('Commands to register:', commands)
  logCategories('Admin commands to register:', adminCommands)

  try {
    console.log('\n🔄 Registering slash commands...')
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: [...commandsList, ...adminCommandsList],
    })
    console.log('✅ Slash commands registered successfully!\n')
  } catch (error) {
    console.error('❌ Error registering commands:', error)
  }
}
