import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { createEmbed } from '../../utils/embed'

export const roll: Command = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a dice with a custom number of sides.')
    .addIntegerOption((option) =>
      option
        .setName('input')
        .setDescription('Input a number from 1 to 100.')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100),
    ),

  category: Category.FUN,
  scope: CommandScope.PUBLIC,

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.user
    const input = interaction.options.getInteger('input', true)
    const result = Math.floor(Math.random() * input) + 1

    const embed = createEmbed(this.category)
      .setAuthor({ name: '🎲 Dice Roll' })
      .setDescription(`${user} rolled a **1d${input}** and got: **${result}** 🎲`)

    await interaction.reply({ embeds: [embed] })
  },
}
