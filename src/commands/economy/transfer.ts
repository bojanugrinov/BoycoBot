import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { Command } from '../../types/command'
import { Category } from '../../types/category'
import { createEconomyEmbed } from '../../embeds/economyEmbed'
import { getUser, loadEconomy, saveEconomy } from '../../utils/economy'
import { formatBalance } from '../../utils/formatBalance'

export const transfer: Command = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription(`Send money to another user.`)
    .addUserOption((option) =>
      option.setName('target').setDescription('The user to send money to.').setRequired(true),
    )
    .addNumberOption((option) =>
      option.setName('amount').setDescription('The amount to send to the user.').setRequired(true),
    ),

  category: Category.ECONOMY,

  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId!

    const user = interaction.user
    const target = interaction.options.getUser('target', true)

    if (user.id === target.id) {
      const embed = createEconomyEmbed()
        .setColor('Red')
        .setDescription(`You can't send money to yourself.`)
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
      return
    }

    const economy = loadEconomy()
    const sender = getUser(economy, guildId, user.id)
    const receiver = getUser(economy, guildId, target.id)

    const amount = interaction.options.getNumber('amount', true)
    const formattedAmount = formatBalance(amount)

    if (sender.balance < amount) {
      const embed = createEconomyEmbed()
        .setColor('Red')
        .setDescription(`You don't have enough money. Current balance: **$${sender.balance}** 💸`)
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
      return
    }

    sender.balance -= amount
    receiver.balance += amount
    saveEconomy(economy)

    const embed = createEconomyEmbed()
      .setColor('Green')
      .setDescription(`${user} sent **$${formattedAmount}** 💸 to ${target}`)

    await interaction.reply({ embeds: [embed] })
  },
}
