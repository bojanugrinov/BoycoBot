import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { EconomyStore } from '../../modules/economy/store'
import { createEmbed } from '../../utils/embed'

export const reseteconomy: Command = {
  data: new SlashCommandBuilder()
    .setName('reseteconomy')
    .setDescription(`Resets the servers economy.`),

  category: Category.ECONOMY,
  scope: CommandScope.ADMIN,

  async execute(interaction: CommandInteraction) {
    const user = interaction.user
    const guildId = interaction.guildId!

    const economy = EconomyStore.economy(guildId)

    console.log(economy)

    economy.users = {}

    EconomyStore.save()

    const embed = createEmbed(this.category)
      .setColor('Green')
      .setDescription(`✅ Server's economy is successfully reset.`)
      .setFooter({
        text: `Requested by ${user.username}`,
        iconURL: user.displayAvatarURL({ extension: 'png', size: 1024 }),
      })

    await interaction.reply({ embeds: [embed] })
  },
}
