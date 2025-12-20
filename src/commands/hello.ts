import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../types/command'

export const hello: Command = {
  data: new SlashCommandBuilder().setName('hello').setDescription('Replies with Hello World!'),

  async execute(interaction: CommandInteraction) {
    await interaction.reply('Hello World!')
  },
}
