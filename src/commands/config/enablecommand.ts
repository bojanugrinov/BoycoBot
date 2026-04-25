import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { getDisabledCommands } from '../../utils/getDisabledCommands'
import { getGuildConfig, saveGuildConfig } from '../../modules/config/store'
import { createEmbed } from '../../utils/embed'

export const enablecommand: Command = {
  data: new SlashCommandBuilder()
    .setName('enablecommand')
    .setDescription(`Enable a command in the server.`)
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('Select a command to enable.')
        .setRequired(true)
        .setAutocomplete(true),
    ),

  category: Category.CONFIG,
  scope: CommandScope.ADMIN,

  async autocomplete(Interaction: AutocompleteInteraction) {
    const guildId = Interaction.guildId!
    const search = Interaction.options.getFocused().toLowerCase()

    const commands = getDisabledCommands(guildId)
    const grouped: Record<string, { name: string; value: string }[]> = {}

    for (const command of commands) {
      const name = command.data.name

      const category = String(command.category)
      const label = `[${category}] /${name} - ${command.data.description}`

      if (!label.toLowerCase().includes(search)) continue
      if (!grouped[category]) grouped[category] = []

      grouped[category].push({
        name: label,
        value: name,
      })
    }

    const results = Object.values(grouped).flat().slice(0, 25)
    await Interaction.respond(results)
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId!
    const command = interaction.options.getString('command', true)

    const guildConfig = getGuildConfig(guildId)

    if (!guildConfig.disabledCommands.includes(command)) {
      const embed = createEmbed(this.category)
        .setColor('Red')
        .setDescription(`Command  \`/${command}\` is already enabled.`)
        .setFooter({ text: 'Use /disabledcommands to list all disabled commands.' })

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      })

      return
    }

    guildConfig.disabledCommands = guildConfig.disabledCommands.filter(
      (disabledCommand) => disabledCommand !== command,
    )

    saveGuildConfig()

    const embed = createEmbed(this.category)
      .setColor('Green')
      .setDescription(`✅ Command \`/${command}\` enabled successfully.`)

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
  },
}
