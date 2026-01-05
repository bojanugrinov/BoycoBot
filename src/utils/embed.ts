import { CommandInteraction, EmbedBuilder } from 'discord.js'

export function createBaseEmbed(interaction: CommandInteraction, title?: string): EmbedBuilder {
  const client = interaction.client.user

  const clientAvatar = client?.displayAvatarURL({ extension: 'png', size: 1024 })

  const embed = new EmbedBuilder().setColor('#0e7fe9')

  if (title) {
    embed.setAuthor({ name: title, iconURL: clientAvatar })
  }

  return embed
}
