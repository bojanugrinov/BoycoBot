import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../types/command'
import { createBaseEmbed } from '../utils/embed'
import * as commands from './index'

export const help: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display a list of all available commands.'),

  async execute(interaction: CommandInteraction) {
    const commandList = Object.values(commands) as Command[]

    const message = createBaseEmbed(interaction)
      .setDescription('🤖 **Bot Commands**')
      .addFields(
        ...commandList.map((cmd) => ({
          name: `/${cmd.data.name}`,
          value: cmd.data.description || '',
          inline: false,
        }))
      )

    await interaction.reply({ content: '', embeds: [message] })
  },
}
