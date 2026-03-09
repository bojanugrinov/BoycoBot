import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { createEmbed } from '../../utils/embed'

export const ping: Command = {
  data: new SlashCommandBuilder().setName('ping').setDescription(`Check the bot's response time.`),

  category: Category.UTILITY,
  scope: CommandScope.PUBLIC,

  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: 'Pinging...', withResponse: true })

    const sent = await interaction.fetchReply()
    const latency = sent.createdTimestamp - interaction.createdTimestamp

    const embed = createEmbed(this.category, { includeAuthor: false }).setTitle(
      `Latency: \`${latency}ms\``,
    )

    await interaction.editReply({ embeds: [embed] })
  },
}
