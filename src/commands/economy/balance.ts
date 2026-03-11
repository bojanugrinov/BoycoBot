import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { getEconomyUser } from '../../modules/economy/store'
import { formatBalance } from '../../utils/formatBalance'
import { createEmbed } from '../../utils/embed'

export const balance: Command = {
  data: new SlashCommandBuilder().setName('balance').setDescription(`Check your current balance.`),

  category: Category.ECONOMY,
  scope: CommandScope.PUBLIC,

  async execute(interaction: CommandInteraction) {
    const guildId = interaction.guildId!
    const userId = interaction.user.id

    const economyUser = getEconomyUser(guildId, userId)
    const balance = formatBalance(economyUser.balance)

    const embed = createEmbed(this.category).setDescription(
      `Your current balance is **$${balance}** 💸`,
    )

    await interaction.reply({ embeds: [embed] })
  },
}
