import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../../types/command'
import { createBaseEmbed } from '../../utils/embed'
import * as commandModules from '../index'
import { Category } from '../../types/category'

export const help: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display a list of all available commands.'),

  category: Category.UTILITY,

  async execute(interaction: CommandInteraction) {
    const commandList = Object.values(commandModules) as Command[]

    const categories: Record<string, Command[]> = {}

    commandList.map((command) => {
      const category = command.category
      if (!categories[category]) categories[category] = []
      categories[category].push(command)
    })

    const embed = createBaseEmbed(interaction, 'Bot Commands')

    Object.entries(categories).map(([categoryName, commands]) => {
      embed.addFields({
        name: `📂 ${categoryName} Commands`,
        value: commands
          .map((command) => `\`/${command.data.name}\` - ${command.data.description}`)
          .join('\n'),
        inline: false,
      })
    })

    await interaction.reply({ embeds: [embed] })
  },
}
