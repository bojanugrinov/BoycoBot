import { Interaction, Collection, EmbedBuilder, MessageFlags } from 'discord.js'
import { Command, CommandScope } from '../types/command'
import { getGuildConfig } from '../modules/config/store'

export async function handleInteraction(
  interaction: Interaction,
  commands: Collection<string, Command>,
): Promise<void> {
  if (interaction.isAutocomplete()) {
    const command = commands.get(interaction.commandName)
    if (!command?.autocomplete) return

    try {
      await command.autocomplete(interaction)
    } catch (error) {
      console.error('Autocomplete error:', error)
    }
  }

  if (!interaction.isChatInputCommand()) return

  const command = commands.get(interaction.commandName)
  const timestamp = new Date().toLocaleString('en-CA', { hour12: false }).replace(',', ' -')

  if (!command) {
    console.log(`Command ${interaction.commandName} not found`)
    return
  }

  // DISABLED COMMAND CHECK
  const guildId = interaction.guildId!
  const guildConfig = getGuildConfig(guildId)

  if (guildConfig.disabledCommands.includes(command.data.name)) {
    const embed = new EmbedBuilder()
      .setColor('Red')
      .setAuthor({ name: '⛔ Disabled' })
      .setDescription(`Command \`/${command.data.name}\` is disabled in this server.`)
      .setFooter({ text: 'Use /help to see a list of available commands.' })

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    })

    return
  }

  // PERMISSIONS CHECK
  if (
    command.scope === CommandScope.ADMIN &&
    !interaction.memberPermissions?.has('Administrator')
  ) {
    const embed = new EmbedBuilder()
      .setColor('Red')
      .setAuthor({ name: '⛔ Not Allowed' })
      .setDescription(`You must be an administrator to use \`/${command.data.name}\`.`)
      .setFooter({ text: 'Use /help to see a list of available commands.' })

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
    return
  }

  // EXECUTE COMMAND
  try {
    await command.execute(interaction)
    console.log(
      `[${timestamp}] ✅ Command /${interaction.commandName} executed by ${interaction.user.tag} (ID: ${interaction.user.id})`,
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
