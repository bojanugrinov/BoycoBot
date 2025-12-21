import { CommandInteraction, EmbedBuilder } from 'discord.js'

export function createBaseEmbed(interaction: CommandInteraction): EmbedBuilder {
  const user = interaction.client.user
  const guild = interaction.guild

  const userAvatar = user?.displayAvatarURL({ extension: 'png', size: 1024 })
  const guildAvatar = guild?.iconURL({ size: 1024 }) || undefined

  return new EmbedBuilder()
    .setAuthor({ name: `${user?.username} #${user?.discriminator}`, iconURL: userAvatar })
    .setColor('#0e7fe9')
    .setFooter({ text: guild?.name ?? '', iconURL: guildAvatar })
    .setTimestamp()
}
