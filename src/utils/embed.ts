import { EmbedBuilder } from 'discord.js'
import { Category } from '../types/command'

export function createEmbed(
  category: Category,
  options?: { includeAuthor?: boolean },
): EmbedBuilder {
  const embed = new EmbedBuilder().setColor('#0e7fe9')

  if (options?.includeAuthor ?? true) {
    embed.setAuthor({ name: category })
  }

  return embed
}
