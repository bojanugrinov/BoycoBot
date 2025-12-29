import { ChatInputCommandInteraction, CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../../types/command'
import { Category } from '../../types/category'

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
        .setMaxValue(100)
    ),

  category: Category.FUN,

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.user
    const input = interaction.options.getInteger('input', true)
    const result = Math.floor(Math.random() * input) + 1

    const message = `🎲 **Dice Roll** 🎲\n${user} rolled a **d${input}** and got: **${result}** 🎲`

    await interaction.reply(message)
  },
}
