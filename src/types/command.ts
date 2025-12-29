import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Category } from './category'

export interface Command {
  data: SlashCommandBuilder
  category: Category
  execute: (interaction: CommandInteraction) => Promise<void>
}
