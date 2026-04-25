import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { getGuildConfig, saveGuildConfig } from '../../modules/config/store'
import { getEnabledCommands } from '../../utils/getEnabledCommands'
import { createEmbed } from '../../utils/embed'
import { PROTECTED_COMMANDS } from '../../constants/commands'

export const disablecommand: Command = {
  data: new SlashCommandBuilder()
    .setName('disablecommand')
    .setDescription(`Disable a command in the server.`)
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('Select a command to disable.')
        .setRequired(true)
        .setAutocomplete(true),
    ),

  category: Category.CONFIG,
  scope: CommandScope.ADMIN,

  async autocomplete(interaction: AutocompleteInteraction) {
    const guildId = interaction.guildId!
    const search = interaction.options.getFocused().toLowerCase()

    const commands = getEnabledCommands(guildId)
    const grouped: Record<string, { name: string; value: string }[]> = {}

    for (const command of commands) {
      const name = command.data.name

      if (PROTECTED_COMMANDS.includes(name)) continue

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
    await interaction.respond(results)
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId!
    const command = interaction.options.getString('command', true)

    if (PROTECTED_COMMANDS.includes(command)) {
      const embed = createEmbed(this.category)
        .setColor('Red')
        .setDescription(`❌ Command \`/${command}\` cannot be disabled.`)

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      })

      return
    }

    const guildConfig = getGuildConfig(guildId)

    if (guildConfig.disabledCommands.includes(command)) {
      const embed = createEmbed(this.category)
        .setColor('Red')
        .setDescription(`Command  \`/${command}\` is already disabled.`)
        .setFooter({ text: 'Use /disabledcommands to list all disabled commands.' })

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      })

      return
    }

    guildConfig.disabledCommands.push(command)
    saveGuildConfig()

    const embed = createEmbed(this.category)
      .setColor('Green')
      .setDescription(`✅ Command \`/${command}\` disabled successfully.`)

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
  },
}
