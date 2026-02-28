import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../../types/command'
import { Category } from '../../types/category'
import { loadEconomy, getUser } from '../../utils/economy'
import { createEconomyEmbed } from '../../embeds/economyEmbed'
import { formatBalance } from '../../utils/formatBalance'

export const balance: Command = {
  data: new SlashCommandBuilder().setName('balance').setDescription(`Check your current balance.`),

  category: Category.ECONOMY,

  async execute(interaction: CommandInteraction) {
    const guildId = interaction.guildId!
    const userId = interaction.user.id

    const economy = loadEconomy()
    const user = getUser(economy, guildId, userId)

    const balance = formatBalance(user.balance)

    const embed = createEconomyEmbed().setDescription(`Your current balance is **$${balance}** 💸`)

    await interaction.reply({ embeds: [embed] })
  },
}
