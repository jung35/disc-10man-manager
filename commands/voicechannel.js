
module.exports = class VoiceChannel {
  constructor(settings) {
    this.settings = settings
  }

  run(client, message) {
    const { state, settings } = this.settings
    const { channel, guild, author } = message

    guild.fetchMember(author).then(guildMember => {
      const checkAdmin = guildMember.hasPermission('ADMINISTRATOR')
      if(!checkAdmin) return

      const type = message.content.split(' ')[1]
      const setLoc = guildMember.voiceChannel

      if(setLoc == undefined || setLoc.type != 'voice') return message.reply('pick a voice channel')

      switch(type) {
        case 'lobby':
          settings.voiceChannels.lobby = setLoc.id
          return message.reply(`added ${setLoc} as lobby voice channel`)
        case '1':
          settings.voiceChannels.team_1 = setLoc.id
          return message.reply(`added ${setLoc} as team 1's voice channel`)
        case '2':
          settings.voiceChannels.team_2 = setLoc.id
          return message.reply(`added ${setLoc} as team 2's voice channel`)
        default:
          return message.reply('please include the channel type')
      }
      
    })

  }
}