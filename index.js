require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const token = process.env.BOT_TOKEN || null
const commandPrefix = process.env.COMMAND_PREFIX || '.'
const { Help, Setup, LinkMic, UnlinkMic, Ready, Unready, Popflash, Unpopflash,
  Restart, Captain, Start, Move, VoiceChannel } = require('./commands')

const Settings = require('./settings')
setting = new Settings()

const commands = [
  {
    name: 'help',
    class: Help
  }, {
    name: 'setup',
    class: Setup
  }, {
    name: 'link|mic',
    class: LinkMic
  }, {
    name: 'unlink|unmic',
    class: UnlinkMic
  }, {
    name: 'ready|join|gaben|bitcoin',
    class: Ready
  }, {
    name: 'unready|leave',
    class: Unready
  }/*, {
    name: 'popflash',
    class: Popflash
  }, {
    name: 'unpopflash',
    class: Unpopflash
  }*/, {
    name: 'restart',
    class: Restart
  }, {
    name: 'captain',
    class: Captain
  }, {
    name: 'start',
    class: Start
  }, {
    name: 'move',
    class: Move
  }, {
    name: 'voicechannel|vc',
    class: VoiceChannel
  }
]

message_listener = []

client.once('ready', () => console.log('Ready'))

client.on('message', message => {
  const { channel, content } = message

  if(channel.type != 'text') return false
  if(content.length < commandPrefix.length + 1) return false
  if(content.substring(0, commandPrefix.length) != commandPrefix) return false

  foundCommand = {}

  for(let i in commands) {
    const command = commands[i]

    const aliases = command.name.split('|')
    let alias = null

    for(let j = 0; j < aliases.length; j++) {
      alias = aliases[j]
      const substringLength = commandPrefix.length + alias.length
      const contentCommand = content.substring(commandPrefix.length, substringLength)

      if(contentCommand == alias) {
        if(content.length > substringLength && content.substring(substringLength, substringLength + 1) != ' ') {
          continue
        }

        foundCommand = command
        break
      }
    }

    if(foundCommand.name != undefined) break
  }

  if(foundCommand.name == undefined) return

  const Class = foundCommand.class
  const tempClass = new Class(setting)
  tempClass.run(client, message)
});

client.login(token);