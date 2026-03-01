import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../../types/command'
import { createEconomyEmbed } from '../../../embeds/economyEmbed'
import { getUser, loadEconomy, saveEconomy } from '../../../utils/economy'
import { formatBalance } from '../../../utils/formatBalance'

export const removemoney: Command = {
  data: new SlashCommandBuilder()
    .setName('removemoney')
    .setDescription(`Remove money from a user.`)
    .addUserOption((option) =>
      option.setName('user').setDescription('The user to remove money from.').setRequired(true),
    )
    .addNumberOption((option) =>
      option.setName('amount').setDescription('The amount to remove.').setRequired(true),
    ),

  category: Category.ECONOMY,
  scope: CommandScope.ADMIN,

  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId!

    const target = interaction.options.getUser('user', true)
    const amount = interaction.options.getNumber('amount', true)

    if (amount <= 0) {
      const embed = createEconomyEmbed()
        .setColor('Red')
        .setDescription('❌ Amount must be greater than 0.')
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
      return
    }

    const economy = loadEconomy()
    const user = getUser(economy, guildId, target.id)

    if (amount > user.balance) user.balance = 0
    else user.balance -= amount

    saveEconomy(economy)

    const formattedAmount = formatBalance(amount)

    const embed = createEconomyEmbed()
      .setColor('Red')
      .setDescription(`🔴 Removed **$${formattedAmount}** from ${target}'s balance.`)

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
  },
}
