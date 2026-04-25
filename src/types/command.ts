import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js'

export enum Category {
  CONFIG = '⚙️ Config',
  ECONOMY = '🏦 Economy',
  FUN = '🎉 Fun',
  UTILITY = '🛠️ Utility',
}

export enum CommandScope {
  PUBLIC = 'Public',
  ADMIN = 'Admin',
}

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
  category: Category
  scope: CommandScope
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}
