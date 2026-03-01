import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../../types/command'
import { createEconomyEmbed } from '../../../embeds/economyEmbed'
import { getUser, loadEconomy, saveEconomy } from '../../../utils/economy'
import { formatBalance } from '../../../utils/formatBalance'

export const setbalance: Command = {
  data: new SlashCommandBuilder()
    .setName('setbalance')
    .setDescription(`Set a user's balance to a specific amount.`)
    .addUserOption((option) =>
      option.setName('user').setDescription('The user to set the balance to.').setRequired(true),
    )
    .addNumberOption((option) =>
      option.setName('amount').setDescription('The amount to set.').setRequired(true),
    ),

  category: Category.ECONOMY,
  scope: CommandScope.ADMIN,

  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId!

    const target = interaction.options.getUser('user', true)
    const amount = interaction.options.getNumber('amount', true)

    if (amount < 0) {
      const embed = createEconomyEmbed()
        .setColor('Red')
        .setDescription('❌ Amount must be 0 or greater.')
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
      return
    }

    const economy = loadEconomy()
    const user = getUser(economy, guildId, target.id)

    user.balance = amount

    saveEconomy(economy)

    const formattedAmount = formatBalance(amount)

    const embed = createEconomyEmbed()
      .setColor('Green')
      .setDescription(`✅ Successfully set ${target}'s balance to **$${formattedAmount}**.`)

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
  },
}
