import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js'
import { Category } from './category'

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
  category: Category
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}
