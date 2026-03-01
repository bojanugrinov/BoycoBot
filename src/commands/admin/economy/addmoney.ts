import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../../types/command'
import { createEconomyEmbed } from '../../../embeds/economyEmbed'
import { getUser, loadEconomy, saveEconomy } from '../../../utils/economy'
import { formatBalance } from '../../../utils/formatBalance'

export const addmoney: Command = {
  data: new SlashCommandBuilder()
    .setName('addmoney')
    .setDescription(`Add money to a user.`)
    .addUserOption((option) =>
      option.setName('user').setDescription('The user to add money to.').setRequired(true),
    )
    .addNumberOption((option) =>
      option.setName('amount').setDescription('The amount to add.').setRequired(true),
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

    user.balance += amount
    saveEconomy(economy)

    const formattedAmount = formatBalance(amount)

    const embed = createEconomyEmbed()
      .setColor('Green')
      .setDescription(`🟢 Added **$${formattedAmount}** to ${target}'s balance.`)

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
  },
}
