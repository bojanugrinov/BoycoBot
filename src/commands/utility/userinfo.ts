import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Category, Command, CommandScope } from '../../types/command'
import { createBaseEmbed } from '../../utils/embed'

export const userinfo: Command = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Display information about a user.')
    .addUserOption((option) =>
      option.setName('user').setDescription('The user to get information about').setRequired(false),
    ),

  category: Category.UTILITY,
  scope: CommandScope.PUBLIC,

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('user') ?? interaction.user
    const member = await interaction.guild!.members.fetch(targetUser.id)

    const roles = member.roles.cache
      .filter((role) => role.id !== interaction.guild!.id)
      .sort((a, b) => b.position - a.position)

    const embed = createBaseEmbed(interaction)
      .setAuthor({
        name: 'User Information',
        iconURL: targetUser.displayAvatarURL(),
      })
      .setThumbnail(targetUser.displayAvatarURL())
      .setFooter({
        text: `ID: ${targetUser.id} | Account Created: ${targetUser.createdAt.toLocaleDateString(
          'en-GB',
          {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          },
        )}`,
      })

    embed.addFields(
      {
        name: 'Username',
        value: targetUser.bot
          ? `${targetUser.username}#${targetUser.discriminator}`
          : targetUser.username,
        inline: true,
      },
      {
        name: 'Display Name',
        value: member.displayName,
        inline: true,
      },
      {
        name: 'Bot',
        value: targetUser.bot ? 'Yes' : 'No',
        inline: true,
      },
      {
        name: 'Joined Server',
        value: member.joinedAt
          ? member.joinedAt.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'Unknown',
        inline: true,
      },
      {
        name: 'Nickname',
        value: member.nickname ?? 'None',
        inline: true,
      },
      {
        name: 'Boosting Since',
        value: member.premiumSince
          ? member.premiumSince.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'Not Boosting',
        inline: true,
      },
      {
        name: `Roles [${roles.size}]`,
        value:
          roles.size > 0
            ? roles
                .map((role) => role.toString())
                .slice(0, 15)
                .join(', ') + (roles.size > 15 ? '...' : '')
            : 'None',
        inline: false,
      },
    )

    await interaction.reply({ embeds: [embed] })
  },
}
