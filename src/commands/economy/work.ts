import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../../types/command'
import { Category } from '../../types/category'
import { loadEconomy, saveEconomy, getUser } from '../../utils/economy'
import { createEconomyEmbed } from '../../embeds/economyEmbed'
import { workMessages } from '../../constants/economyMessages'

export const work: Command = {
  data: new SlashCommandBuilder().setName('work').setDescription(`Work and earn some money.`),

  category: Category.ECONOMY,

  async execute(interaction: CommandInteraction) {
    const guildId = interaction.guildId!
    const userId = interaction.user.id

    const economy = loadEconomy()
    const user = getUser(economy, guildId, userId)

    const earned = Math.floor(Math.random() * 100) + 1
    user.balance += earned

    saveEconomy(economy)

    const message = workMessages[Math.floor(Math.random() * workMessages.length)].replace(
      '${earned}',
      earned.toString(),
    )

    const embed = createEconomyEmbed('profit').setDescription(message)

    await interaction.reply({ embeds: [embed] })
  },
}
