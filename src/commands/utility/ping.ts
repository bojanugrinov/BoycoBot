import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../../types/command'
import { createBaseEmbed } from '../../utils/embed'
import { Category } from '../../types/category'

export const ping: Command = {
  data: new SlashCommandBuilder().setName('ping').setDescription(`Check the bot's response time.`),

  category: Category.UTILITY,

  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: 'Pinging...', withResponse: true })

    const sent = await interaction.fetchReply()
    const latency = sent.createdTimestamp - interaction.createdTimestamp

    const embed = createBaseEmbed(interaction).setTitle(`Latency: \`${latency}ms\``)

    await interaction.editReply({ embeds: [embed] })
  },
}
