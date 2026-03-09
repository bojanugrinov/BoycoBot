import { CommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { loadEconomy, saveEconomy, getUser } from '../../services/economyService'
import { createEmbed } from '../../utils/embed'
import { getRemainingCooldown } from '../../utils/getRemainingCooldown'

const DAILY_AMOUNT = 500
const COMMAND_COOLDOWN = 24 * 60 * 60 * 1000 // 24h

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
    const cooldown = getRemainingCooldown(user.lastDaily, COMMAND_COOLDOWN)

    if (cooldown) {
      const { hours, minutes, seconds } = cooldown

      const embed = createEmbed(this.category)
        .setColor('Red')
        .setDescription(`⏳ You can claim again in \`**${hours}h ${minutes}m ${seconds}s*\`.`)

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
      return
    }

    user.balance += DAILY_AMOUNT
    user.lastDaily = now

    saveEconomy(economy)

    const embed = createEmbed(this.category)
      .setColor('Green')
      .setDescription(`You claimed your daily  reward of **$${DAILY_AMOUNT}** 💸`)

    await interaction.reply({ embeds: [embed] })
  },
}
