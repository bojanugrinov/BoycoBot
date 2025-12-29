import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../../types/command'
import { createBaseEmbed } from '../../utils/embed'
import { Category } from '../../types/category'

export const info: Command = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription(`Display information about the user, server and bot.`),

  category: Category.UTILITY,

  async execute(interaction: CommandInteraction) {
    const bot = interaction.client.user
    const user = interaction.user
    const userMember = interaction.guild?.members.cache.get(user.id)
    const guild = interaction.guild

    const embed = createBaseEmbed(interaction)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        {
          name: '👤 User Information',
          value: [
            `**Username:** ${user.username}`,
            `**Display Name:** ${user.displayName}`,
            `**ID:** \`${user.id}\``,
            `**Joined Server:** <t:${Math.floor((userMember?.joinedTimestamp ?? 0) / 1000)}:R>`,
            `**Account Created:** <t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
          ].join('\n'),
          inline: false,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: false,
        },
        {
          name: '🌐 Server Information',
          value: [
            `**Name:** ${guild?.name}`,
            `**Owner:** <@${guild?.ownerId}>`,
            `**Members:** ${guild?.memberCount}`,
            `**ID:** \`${guild?.id}\``,
            `**Created:** <t:${Math.floor((guild?.createdTimestamp ?? 0) / 1000)}:R>`,
          ].join('\n'),
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: true,
        },
        {
          name: '🤖 Bot Information',
          value: [
            `**Name:** ${bot.username} #${bot.discriminator}`,
            `**ID:** \`${bot.id}\``,
            `**Created:** <t:${Math.floor(bot.createdTimestamp / 1000)}:R>`,
          ].join('\n'),
          inline: true,
        }
      )

    await interaction.reply({ embeds: [embed] })
  },
}
