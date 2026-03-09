import { CommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { loadEconomy, saveEconomy, getUser } from '../../services/economyService'
import { crimeFailureMessages, crimeSuccessMessages } from '../../constants/economyMessages'
import { createEmbed } from '../../utils/embed'
import { getRemainingCooldown } from '../../utils/getRemainingCooldown'

const COMMAND_COOLDOWN = 5 * 60 * 1000 // 5m

export const crime: Command = {
  data: new SlashCommandBuilder()
    .setName('crime')
    .setDescription(`Take a risk and earn some money through crime.`),

  category: Category.ECONOMY,
  scope: CommandScope.PUBLIC,

  async execute(interaction: CommandInteraction) {
    const guildId = interaction.guildId!
    const userId = interaction.user.id

    const economy = loadEconomy()
    const user = getUser(economy, guildId, userId)

    const cooldown = getRemainingCooldown(user.lastCrime, COMMAND_COOLDOWN)

    if (cooldown) {
      const { hours, minutes, seconds } = cooldown

      const embed = createEmbed(this.category)
        .setColor('Red')
        .setDescription(`⏳ You can do crime again in \`${hours}h ${minutes}m ${seconds}s\`.`)

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
      return
    }

    const success = Math.random() < 0.5
    user.lastCrime = Date.now()

    const description = success
      ? (() => {
          const earned = Math.floor(Math.random() * 101) + 100
          user.balance += earned

          return crimeSuccessMessages[
            Math.floor(Math.random() * crimeSuccessMessages.length)
          ].replace('${earned}', earned.toString())
        })()
      : (() => {
          const lost = Math.floor(Math.random() * 101) + 100
          const amountLost = Math.min(lost, user.balance)
          user.balance -= amountLost

          return crimeFailureMessages[
            Math.floor(Math.random() * crimeFailureMessages.length)
          ].replace('${amountLost}', amountLost.toString())
        })()

    saveEconomy(economy)

    const embed = createEmbed(this.category)
      .setColor(success ? 'Green' : 'Red')
      .setDescription(description)

    await interaction.reply({ embeds: [embed] })
  },
}
