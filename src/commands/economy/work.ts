import { CommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { getEconomyUser, saveEconomy } from '../../modules/economy/store'
import { workMessages } from '../../constants/economyMessages'
import { createEmbed } from '../../utils/embed'
import { getRemainingCooldown } from '../../utils/getRemainingCooldown'

const COMMAND_COOLDOWN = 5 * 60 * 1000 // 5m

export const work: Command = {
  data: new SlashCommandBuilder().setName('work').setDescription(`Work and earn some money.`),

  category: Category.ECONOMY,
  scope: CommandScope.PUBLIC,

  async execute(interaction: CommandInteraction) {
    const guildId = interaction.guildId!
    const userId = interaction.user.id

    const economyUser = getEconomyUser(guildId, userId)
    const cooldown = getRemainingCooldown(economyUser.lastWork, COMMAND_COOLDOWN)

    if (cooldown) {
      const { hours, minutes, seconds } = cooldown

      const embed = createEmbed(this.category)
        .setColor('Red')
        .setDescription(`⏳ You can work again in \`${hours}h ${minutes}m ${seconds}s\`.`)

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
      return
    }

    const earned = Math.floor(Math.random() * 100) + 1

    economyUser.balance += earned
    economyUser.lastWork = Date.now()
    saveEconomy()

    const message = workMessages[Math.floor(Math.random() * workMessages.length)].replace(
      '${earned}',
      earned.toString(),
    )

    const embed = createEmbed(this.category).setColor('Green').setDescription(message)

    await interaction.reply({ embeds: [embed] })
  },
}
