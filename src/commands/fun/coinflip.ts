import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'

export const coinflip: Command = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription(`Flip a coin and get heads or tails.`),

  category: Category.FUN,
  scope: CommandScope.PUBLIC,

  async execute(interaction: CommandInteraction) {
    const user = interaction.user
    const result = Math.random() >= 0.5 ? 'Heads' : 'Tails'

    const message = `🪙 **Coin Flip** 🪙\n${user} flipped a coin and got: **${result}** 🪙`

    await interaction.reply(message)
  },
}
