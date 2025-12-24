import { Client, GatewayIntentBits, Events, ActivityType } from 'discord.js'
import * as dotenv from 'dotenv'
import { handleInteraction } from './handlers/interactionHandler'
import { loadCommands } from './utils/loadCommands'
import { registerCommands } from './utils/registerCommands'
import { clearCommands } from './utils/clearCommands'

dotenv.config()

if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
  console.error('❌ Missing required environment variables!')
  console.error('Make sure .env file exists with DISCORD_TOKEN, CLIENT_ID, and GUILD_ID')
  process.exit(1)
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

const commands = loadCommands()

client.once(Events.ClientReady, (client) => {
  client.user.setActivity('BoycoBot | /help', { type: ActivityType.Watching })

  console.log(`✅ Bot is online! Logged in as ${client.user.tag}`)
  console.log(`📊 Bot is in ${client.guilds.cache.size} server(s)\n`)
})

client.on(Events.InteractionCreate, async (interaction) => {
  await handleInteraction(interaction, commands)
})

async function start() {
  try {
    await clearCommands(process.env.DISCORD_TOKEN!, process.env.CLIENT_ID!, process.env.GUILD_ID!)

    await registerCommands(
      commands,
      process.env.DISCORD_TOKEN!,
      process.env.CLIENT_ID!,
      process.env.GUILD_ID!
    )

    await client.login(process.env.DISCORD_TOKEN)
  } catch (error) {
    console.error('Failed to start bot:', error)
    process.exit(1)
  }
}

start()
