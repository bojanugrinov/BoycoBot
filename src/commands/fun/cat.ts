import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../../types/command'
import { createBaseEmbed } from '../../utils/embed'
import { Category } from '../../types/category'

export const cat: Command = {
  data: new SlashCommandBuilder().setName('cat').setDescription(`Shows a random cat picture.`),

  category: Category.FUN,

  async execute(interaction: CommandInteraction) {
    const user = interaction.user

    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search')
      const data = await response.json()
      const imageURL = data[0].url

      if (!imageURL) {
        await interaction.reply('Could not fetch a cat picture.')
        return
      }

      const embed = createBaseEmbed(interaction)
        .setTitle('🐱 Random Cat Picture')
        .setImage(imageURL)
        .setFooter({
          text: `Requested by ${user.username}`,
          iconURL: user.displayAvatarURL({ extension: 'png', size: 1024 }),
        })

      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error(error)
      await interaction.reply('Something went wrong while fetching a cat picture')
    }
  },
}
