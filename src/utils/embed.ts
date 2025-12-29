import { CommandInteraction, EmbedBuilder } from 'discord.js'

export function createBaseEmbed(interaction: CommandInteraction, title?: string): EmbedBuilder {
  const user = interaction.client.user

  const userAvatar = user?.displayAvatarURL({ extension: 'png', size: 1024 })

  const embed = new EmbedBuilder().setColor('#0e7fe9')

  if (title) {
    embed.setAuthor({ name: title, iconURL: userAvatar })
  }

  return embed
}
