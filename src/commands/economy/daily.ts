import { CommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { EconomyStore } from '../../modules/economy/store'
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

    const economyUser = EconomyStore.user(guildId, userId)
    const cooldown = getRemainingCooldown(economyUser.lastDaily, COMMAND_COOLDOWN)

    if (cooldown) {
      const { hours, minutes, seconds } = cooldown

      const embed = createEmbed(this.category)
        .setColor('Red')
        .setDescription(`⏳ You can claim again in \`${hours}h ${minutes}m ${seconds}s\`.`)

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
      return
    }

    economyUser.balance += DAILY_AMOUNT
    economyUser.lastDaily = Date.now()
    EconomyStore.save()

    const embed = createEmbed(this.category)
      .setColor('Green')
      .setDescription(`You claimed your daily reward of **$${DAILY_AMOUNT}** 💸`)

    await interaction.reply({ embeds: [embed] })
  },
}
