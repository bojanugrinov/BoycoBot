import { CommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../../types/command'
import { createEconomyEmbed } from '../../../embeds/economyEmbed'
import { loadEconomy, saveEconomy } from '../../../utils/economy'

export const reseteconomy: Command = {
  data: new SlashCommandBuilder()
    .setName('reseteconomy')
    .setDescription(`Resets the servers economy.`),

  category: Category.ECONOMY,
  scope: CommandScope.ADMIN,

  async execute(interaction: CommandInteraction) {
    const user = interaction.user
    const guildId = interaction.guildId!

    const economy = loadEconomy()

    if (!economy.guilds[guildId]) {
      economy.guilds[guildId] = { users: {} }
    }

    const guild = economy.guilds[guildId]

    if (!guild.users) {
      guild.users = {}
    }

    Object.values(guild.users).forEach((user) => {
      user.balance = 0
    })

    saveEconomy(economy)

    const embed = createEconomyEmbed()
      .setColor('Green')
      .setDescription(`✅ Server's economy is successfully reset.`)
      .setFooter({
        text: `Requested by ${user.username}`,
        iconURL: user.displayAvatarURL({ extension: 'png', size: 1024 }),
      })

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
  },
}
