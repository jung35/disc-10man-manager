
module.exports = class Move {
  constructor(settings) {
    this.settings = settings
  }

  run(client, message) {
    const { state, settings } = this.settings
    const { channel, guild, author } = message
    const { members } = guild

    const commandUser = members.find('id', author.id)

    const checkAdmin = commandUser.hasPermission('ADMINISTRATOR')
    if(!checkAdmin) return

    const { voiceChannels } = settings
    if(voiceChannels.team_1 == null ||
       voiceChannels.team_2 == null) return message.reply('please configure which voicechannels you want me to move players to')
    
    if(state.team_1.captain == null || state.team_2.captain == null) return message.reply('please set teams')

    for(let i = 1; i <= 2; i++) {
      const teamId = `team_${i}`
      const team = state[teamId]
      members.find('id', team.captain).setVoiceChannel(voiceChannels[teamId])
      let k = 0
      for(; k < state.linkMic.length; k++) {
        const mic = state.linkMic[k]
        const index = mic.indexOf(team.captain)

        if(index > -1) {
          members.find('id', mic[(index + 1) % 2]).setVoiceChannel(voiceChannels[teamId])
        }
      }

      for(let j = 0; j < team.players.length; j++) {
        const playerId = team.players[j]
        members.find('id', playerId).setVoiceChannel(voiceChannels[teamId])

        for(k = 0; k < state.linkMic.length; k++) {
          const mic = state.linkMic[k]
          const index = mic.indexOf(playerId)

          if(index > -1) {
            members.find('id', mic[(index + 1) % 2]).setVoiceChannel(voiceChannels[teamId])
          }
        }
      }
    }
  }
}