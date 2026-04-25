import { CommandInteraction, SlashCommandBuilder, MessageFlags } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { getDisabledCommands } from '../../utils/getDisabledCommands'
import { createEmbed } from '../../utils/embed'

export const disabledcommands: Command = {
  data: new SlashCommandBuilder()
    .setName('disabledcommands')
    .setDescription('List all disabled commands in the server.'),

  category: Category.CONFIG,
  scope: CommandScope.ADMIN,

  async execute(interaction: CommandInteraction) {
    const guildId = interaction.guildId!
    const commands = getDisabledCommands(guildId)

    const embed = createEmbed(this.category).setAuthor({ name: '⛔ Disabled commands:' })

    if (!commands.length) {
      embed.setDescription('No disabled commands in the server.')
      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      })
      return
    }

    const disabledCommands = commands.map((command) => `\`/${command.data.name}\``).join(' ')
    embed.setDescription(`${disabledCommands}`)

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    })
  },
}
