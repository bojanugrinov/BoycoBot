import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { loadEconomy } from '../../utils/economy'
import { createEconomyEmbed } from '../../embeds/economyEmbed'
import { formatBalance } from '../../utils/formatBalance'

export const leaderboard: Command = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription(`View the top 10 richest users in the server.`),

  category: Category.ECONOMY,
  scope: CommandScope.PUBLIC,

  async execute(interaction: CommandInteraction) {
    const guildId = interaction.guildId!

    const economy = loadEconomy()
    const guildEconomy = economy.guilds[guildId]

    if (!guildEconomy || Object.keys(guildEconomy.users).length === 0) {
      const embed = createEconomyEmbed().setDescription('No economy data for this server yet.')
      await interaction.reply({ embeds: [embed] })
      return
    }

    const users = Object.entries(guildEconomy.users).map(([id, data]) => ({
      id,
      balance: data.balance,
    }))

    const topUsers = users.sort((a, b) => b.balance - a.balance).slice(0, 10)

    const message = topUsers
      .map((user, index) => {
        return `**${index + 1}.** <@${user.id}> — **$${formatBalance(user.balance)}** 💸`
      })
      .join('\n')

    const embed = createEconomyEmbed().setTimestamp().setDescription(message)

    await interaction.reply({ embeds: [embed] })
  },
}
