import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../../types/command'
import { createBaseEmbed } from '../../utils/embed'
import { Category } from '../../types/category'

export const dog: Command = {
  data: new SlashCommandBuilder().setName('dog').setDescription(`Shows a random dog picture.`),

  category: Category.FUN,

  async execute(interaction: CommandInteraction) {
    const user = interaction.user

    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random')
      const data = await response.json()
      const imageURL = data.message

      if (!imageURL) {
        await interaction.reply('Could not fetch a dog picture.')
        return
      }

      const embed = createBaseEmbed(interaction)
        .setTitle('🐶 Random Dog Picture')
        .setImage(imageURL)
        .setFooter({
          text: `Requested by ${user.username}`,
          iconURL: user.displayAvatarURL({ extension: 'png', size: 1024 }),
        })

      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error(error)
      await interaction.reply('Something went wrong while fetching a dog picture')
    }
  },
}
