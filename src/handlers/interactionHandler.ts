import { Interaction, Collection } from 'discord.js'
import { Command } from '../types/command'

export async function handleInteraction(
  interaction: Interaction,
  commands: Collection<string, Command>
): Promise<void> {
  if (!interaction.isChatInputCommand()) return

  const command = commands.get(interaction.commandName)
  const timestamp = new Date().toLocaleString('en-CA', { hour12: false }).replace(',', ' -')

  if (!command) {
    console.log(`Command ${interaction.commandName} not found`)
    return
  }

  try {
    await command.execute(interaction)
    console.log(
      `[${timestamp}] ✅ Command /${interaction.commandName} executed by ${interaction.user.tag} (ID: ${interaction.user.id})`
    )
  } catch (error) {
    console.error('Error executing command:', error)

    const errorMessage = {
      content: 'There was an error executing this command!',
      ephemeral: true,
    }

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage)
    } else {
      await interaction.reply(errorMessage)
    }
  }
}
