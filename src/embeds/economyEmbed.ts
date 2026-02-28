import { EmbedBuilder } from 'discord.js'

export function createEconomyEmbed(type?: 'profit' | 'loss'): EmbedBuilder {
  const embed = new EmbedBuilder().setAuthor({ name: '🏦 Economy' })

  if (type === 'profit') {
    embed.setColor('#2ECC71')
  }

  if (type === 'loss') {
    embed.setColor('#E74C3C')
  }

  if (!type) {
    embed.setColor('#0E7fE9')
  }

  return embed
}
