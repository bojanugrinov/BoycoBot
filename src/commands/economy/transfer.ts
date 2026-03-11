import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { getEconomyUser, saveEconomy } from '../../modules/economy/store'
import { formatBalance } from '../../utils/formatBalance'
import { createEmbed } from '../../utils/embed'

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
  scope: CommandScope.PUBLIC,

  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId!

    const user = interaction.user
    const target = interaction.options.getUser('target', true)

    if (user.id === target.id) {
      const embed = createEmbed(this.category)
        .setColor('Red')
        .setDescription(`You can't send money to yourself.`)
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
      return
    }

    const sender = getEconomyUser(guildId, user.id)
    const receiver = getEconomyUser(guildId, target.id)

    const amount = interaction.options.getNumber('amount', true)
    const formattedAmount = formatBalance(amount)

    if (sender.balance < amount) {
      const embed = createEmbed(this.category)
        .setColor('Red')
        .setDescription(`You don't have enough money. Current balance: **$${sender.balance}** 💸`)
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
      return
    }

    sender.balance -= amount
    receiver.balance += amount
    saveEconomy()

    const embed = createEmbed(this.category)
      .setColor('Green')
      .setDescription(`${user} sent **$${formattedAmount}** 💸 to ${target}`)

    await interaction.reply({ embeds: [embed] })
  },
}
