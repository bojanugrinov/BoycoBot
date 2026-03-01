import { CommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../../types/command'
import { createBaseEmbed } from '../../../utils/embed'
import * as commandModules from '../index'

export const adminhelp: Command = {
  data: new SlashCommandBuilder()
    .setName('adminhelp')
    .setDescription('Display a list of all available admin commands.'),

  category: Category.UTILITY,
  scope: CommandScope.ADMIN,

  async execute(interaction: CommandInteraction) {
    const commandList = Object.values(commandModules) as Command[]
    const categories: Record<string, Command[]> = {}
    const client = interaction.client.user
    const clientAvatar = client.displayAvatarURL({ extension: 'png', size: 1024 })

    commandList.map((command) => {
      const category = command.category
      if (!categories[category]) categories[category] = []
      categories[category].push(command)
    })

    const embed = createBaseEmbed(interaction, 'BoycoBot Admin Help Menu').setThumbnail(
      clientAvatar,
    )

    Object.entries(categories).map(([categoryName, commands]) => {
      embed.addFields({
        name: `${categoryName} Commands`,
        value: commands
          .map((command) => `\`/${command.data.name}\` - ${command.data.description}`)
          .join('\n'),
        inline: false,
      })
    })

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
  },
}
