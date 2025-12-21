import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '../types/command'
import { createBaseEmbed } from '../utils/embed'

export const ping: Command = {
  data: new SlashCommandBuilder().setName('ping').setDescription(`Check the bot's response time.`),

  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: 'Pinging...', withResponse: true })

    const sent = await interaction.fetchReply()
    const latency = sent.createdTimestamp - interaction.createdTimestamp

    const message = createBaseEmbed(interaction).setTitle(`Latency: **${latency}ms**`)

    await interaction.editReply({ content: '', embeds: [message] })
  },
}
