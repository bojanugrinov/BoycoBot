import { Collection } from 'discord.js'
import { Command } from '../types/command'

export function logCommands(collection: Collection<string, Command>): void {
  const categories: Record<string, string[]> = {}

  Array.from(collection.values()).forEach((command) => {
    const category = command.category
    if (!categories[category]) categories[category] = []
    categories[category].push(command.data.name)
  })

  console.log(`\n📋 Commands to register:`)

  Object.entries(categories).forEach(([category, commands]) => {
    console.log(`📂 [${commands.length}] ${category}`)
  })
}
