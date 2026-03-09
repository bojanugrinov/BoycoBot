import { REST, Routes } from 'discord.js'

export async function clearCommands(
  token: string,
  clientId: string,
  guildId: string
): Promise<void> {
  const rest = new REST({ version: '10' }).setToken(token)

  try {
    console.log('\n🗑️ Clearing old guild commands...')
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
    console.log('✅ Old commands cleared successfully!\n')
  } catch (error) {
    console.error('❌ Error clearing commands:', error)
  }
}
