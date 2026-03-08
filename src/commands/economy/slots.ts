import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { loadEconomy, getUser, saveEconomy } from '../../utils/economy'
import { createEconomyEmbed } from '../../embeds/economyEmbed'
import { formatBalance } from '../../utils/formatBalance'

export const slots: Command = {
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription(`Play the slot machine and try your luck.`)
    .addNumberOption((option) =>
      option.setName('amount').setDescription('The amount to bet.').setRequired(true),
    ),

  category: Category.ECONOMY,
  scope: CommandScope.PUBLIC,

  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.user.id
    const guildId = interaction.guildId!

    const bet = interaction.options.getNumber('amount', true)

    const economy = loadEconomy()
    const user = getUser(economy, guildId, userId)
    const formattedBalance = formatBalance(user.balance)

    if (bet <= 0) {
      const embed = createEconomyEmbed()
        .setColor('Red')
        .setDescription('❌ Amount to bet must be greater than 0.')

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
      return
    }

    if (bet > user.balance) {
      const embed = createEconomyEmbed()
        .setColor('Red')
        .setDescription(
          `❌ You can't bet more than your balance. Current balance **$${formattedBalance}**`,
        )

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
      return
    }

    const roll = Math.floor(Math.random() * 100) + 1
    const symbols = ['🍎', '🍌', '🍒', '🍇', '🍉']

    const slotResult: { spin: string[]; multiplier: number } = {
      spin: [],
      multiplier: 0,
    }

    if (roll <= 10) {
      slotResult.spin = ['7️⃣', '7️⃣', '7️⃣']
      slotResult.multiplier = 4
    } else if (roll <= 35) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)]
      slotResult.spin = [symbol, symbol, symbol]
      slotResult.multiplier = 2
    } else {
      do {
        slotResult.spin = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
        ]
      } while (
        slotResult.spin[0] === slotResult.spin[1] &&
        slotResult.spin[1] === slotResult.spin[2]
      )
      slotResult.multiplier = 0
    }

    const display = `[ ${slotResult.spin[0]} | ${slotResult.spin[1]} | ${slotResult.spin[2]} ]`
    const isWin = slotResult.multiplier > 0
    const payout = isWin ? bet * slotResult.multiplier : -bet
    const color = isWin ? 'Green' : 'Red'

    user.balance += payout
    saveEconomy(economy)

    const embed = createEconomyEmbed()
      .setColor(color)
      .setDescription(
        [
          `🎰 **Slots:**`,
          `Bet: **$${formatBalance(bet)}**`,
          ``,
          `${display}`,
          ``,
          isWin
            ? `✅ <@${userId}> played the slots and won **$${formatBalance(payout)}**! (${slotResult.multiplier}x)`
            : `❌ <@${userId}> played the slots and lost **$${formatBalance(bet)}**.`,
        ].join('\n'),
      )

    await interaction.reply({ embeds: [embed] })
  },
}
