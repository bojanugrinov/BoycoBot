import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Command } from '../../types/command'
import { createBaseEmbed } from '../../utils/embed'
import { Category } from '../../types/category'

export const botinfo: Command = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Display information about the bot.'),

  category: Category.UTILITY,

  async execute(interaction: CommandInteraction) {
    const client = interaction.client
    const bot = client.user!

    const uptime = client.uptime!
    const days = Math.floor(uptime / 86400000)
    const hours = Math.floor(uptime / 3600000) % 24
    const minutes = Math.floor(uptime / 60000) % 60
    const seconds = Math.floor(uptime / 1000) % 60

    const embed = createBaseEmbed(interaction)
      .setAuthor({
        name: 'Bot Information',
        iconURL: bot.displayAvatarURL(),
      })
      .setThumbnail(bot.displayAvatarURL())
      .setFooter({
        text: `ID: ${bot.id} | Created: ${bot.createdAt.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}`,
      })

    embed.addFields(
      {
        name: 'Bot Name',
        value: bot.username,
        inline: true,
      },
      {
        name: 'Username',
        value: bot.tag,
        inline: true,
      },
      {
        name: 'Servers',
        value: client.guilds.cache.size.toString(),
        inline: true,
      },
      {
        name: 'Uptime',
        value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
        inline: true,
      },
      {
        name: 'Memory Usage',
        value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        inline: true,
      },
      {
        name: 'Ping',
        value: `${Math.round(client.ws.ping)}ms`,
        inline: true,
      }
    )

    await interaction.reply({ embeds: [embed] })
  },
}
