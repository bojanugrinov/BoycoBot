import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { EconomyStore } from '../../modules/economy/store'
import { formatBalance } from '../../utils/formatBalance'
import { createEmbed } from '../../utils/embed'

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
      const embed = createEmbed(this.category)
        .setColor('Red')
        .setDescription('❌ Amount must be 0 or greater.')
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
      return
    }

    const economyUser = EconomyStore.user(guildId, target.id)
    economyUser.balance = amount
    EconomyStore.save()

    const formattedAmount = formatBalance(amount)

    const embed = createEmbed(this.category)
      .setColor('Green')
      .setDescription(`✅ Successfully set ${target}'s balance to **$${formattedAmount}**.`)

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
  },
}
