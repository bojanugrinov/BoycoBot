import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { getEconomy } from '../../modules/economy/store'
import { formatBalance } from '../../utils/formatBalance'
import { createEmbed } from '../../utils/embed'

export const leaderboard: Command = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription(`View the top 10 richest users in the server.`),

  category: Category.ECONOMY,
  scope: CommandScope.PUBLIC,

  async execute(interaction: CommandInteraction) {
    const guildId = interaction.guildId!

    const economy = getEconomy()
    const guildEconomy = economy.guilds[guildId]

    if (!guildEconomy || Object.keys(guildEconomy.users).length === 0) {
      const embed = createEmbed(this.category).setDescription(
        'No economy data for this server yet.',
      )
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

    const embed = createEmbed(this.category).setTimestamp().setDescription(message)

    await interaction.reply({ embeds: [embed] })
  },
}
