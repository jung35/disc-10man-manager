const Discord = require('discord.js')
const commandPrefix = process.env.COMMAND_PREFIX || '.'

module.exports = class Help {
  constructor(settings) {
    this.settings = settings
  }
  
  run(client, message) {
    const { channel } = message

    channel.send('', new Discord.RichEmbed({
      color: 0x795548,
      title: '10 Man Help',
      description: `-------------------------
<@user> - required parameter
[@user] - optional parameter
-------------------------
**${commandPrefix}help** - Displays list of available commands

**${commandPrefix}ready**/**${commandPrefix}join** [@user] [...] - Adds user(s) to lobby
**${commandPrefix}unready**/**${commandPrefix}leave** [@user] [...] - Removes user(s) from lobby
**${commandPrefix}link**/**${commandPrefix}mic** <@user1> [@user2] - Link microphone account to your main discord
**${commandPrefix}unlink**/**${commandPrefix}unmic** [@user] [...] - Unlinks account that was linked using **${commandPrefix}link**
**${commandPrefix}popflash** [@user] <url/user id> - Link popflash to account
**${commandPrefix}unpopflash** [@user] [...] - Unlink popflash from account

**${commandPrefix}setup** - 10 man setup command (_Admin only_)
**${commandPrefix}restart** - Clears all data and restarts setup (_Admin only_)
**${commandPrefix}start** - Start picking teams (_Admin only_) (_Must have 10 in lobby_)
**${commandPrefix}voicechannel**/**${commandPrefix}vc** <lobby/1/2> - Set desired voice channel (_Admin only_)
**${commandPrefix}move** - Move players to their voice channels (_Admin only_) (_Players must be in voice channel to be moved_)`
    }))

    console.log(this.settings.state)
  }
}