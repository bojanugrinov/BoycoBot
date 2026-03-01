import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js'

export enum Category {
  ECONOMY = '🏦 Economy',
  FUN = '🎉 Fun',
  UTILITY = '🛠 Utility',
}

export enum CommandScope {
  PUBLIC = 'Public',
  ADMIN = 'Admin',
}

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
  category: Category
  scope: CommandScope
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}
