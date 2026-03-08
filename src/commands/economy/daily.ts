import { CommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { loadEconomy, saveEconomy, getUser } from '../../utils/economy'
import { createEconomyEmbed } from '../../embeds/economyEmbed'

const DAILY_AMOUNT = 500
const COOLDOWN = 24 * 60 * 60 * 1000 // 24h

export const daily: Command = {
  data: new SlashCommandBuilder().setName('daily').setDescription(`Claim your daily reward.`),

  category: Category.ECONOMY,
  scope: CommandScope.PUBLIC,

  async execute(interaction: CommandInteraction) {
    const guildId = interaction.guildId!
    const userId = interaction.user.id

    const economy = loadEconomy()
    const user = getUser(economy, guildId, userId)

    const now = Date.now()

    if (user.lastDaily && now - user.lastDaily < COOLDOWN) {
      const remaining = COOLDOWN - (now - user.lastDaily)

      const hours = Math.floor(remaining / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))

      const embed = createEconomyEmbed()
        .setColor('Red')
        .setDescription(`⏳ You can claim again in ${hours}h ${minutes}m.`)

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
      return
    }

    user.balance += DAILY_AMOUNT
    user.lastDaily = now

    saveEconomy(economy)

    const embed = createEconomyEmbed()
      .setColor('Green')
      .setDescription(`You claimed your daily  reward of **$${DAILY_AMOUNT}** 💸`)

    await interaction.reply({ embeds: [embed] })
  },
}
