import { ChannelType, CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../../types/command'
import { createBaseEmbed } from '../../utils/embed'
import { Category } from '../../types/category'

export const serverinfo: Command = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Display information about the server.'),

  category: Category.UTILITY,

  async execute(interaction: CommandInteraction) {
    const guild = interaction.guild!

    await guild.fetch()

    const roles = guild.roles.cache.filter((role) => role.id !== guild.id && !role.managed)

    const embed = createBaseEmbed(interaction)
      .setAuthor({
        name: 'Server Information',
        iconURL: guild.iconURL() ?? '',
      })
      .setThumbnail(guild.iconURL())
      .setFooter({
        text: `ID: ${guild.id} | Server Created: ${guild.createdAt.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}`,
      })

    embed.addFields(
      {
        name: 'Name',
        value: guild.name,
        inline: true,
      },
      {
        name: 'Owner',
        value: `<@${guild.ownerId}>`,
        inline: true,
      },
      {
        name: 'Members',
        value: guild.memberCount.toString(),
        inline: true,
      },
      {
        name: 'Text Channels',
        value: guild.channels.cache
          .filter((channel) => channel.type === ChannelType.GuildText)
          .size.toString(),
        inline: true,
      },
      {
        name: 'Voice Channels',
        value: guild.channels.cache
          .filter((channel) => channel.type === ChannelType.GuildVoice)
          .size.toString(),
        inline: true,
      },
      {
        name: 'Emojis',
        value: guild.emojis.cache.size.toString(),
        inline: true,
      },
      {
        name: 'Boost Level',
        value: guild.premiumTier.toString(),
        inline: true,
      },
      {
        name: 'Boosters',
        value: (guild.premiumSubscriptionCount ?? 0).toString(),
        inline: true,
      },
      {
        name: 'Verification Level',
        value: guild.verificationLevel.toString(),
        inline: true,
      },
      {
        name: `Roles [${roles.size}]`,
        value:
          guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .filter((role) => role.id !== guild.id && !role.managed)
            .map((role) => role.toString())
            .slice(0, 15)
            .join(', ') + (roles.size > 15 ? '...' : ''),
        inline: false,
      }
    )

    await interaction.reply({ embeds: [embed] })
  },
}
