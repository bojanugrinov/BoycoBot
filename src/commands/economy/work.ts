import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { loadEconomy, saveEconomy, getUser } from '../../services/economyService'
import { workMessages } from '../../constants/economyMessages'
import { createEmbed } from '../../utils/embed'

export const work: Command = {
  data: new SlashCommandBuilder().setName('work').setDescription(`Work and earn some money.`),

  category: Category.ECONOMY,
  scope: CommandScope.PUBLIC,

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

    const embed = createEmbed(this.category).setColor('Green').setDescription(message)

    await interaction.reply({ embeds: [embed] })
  },
}
