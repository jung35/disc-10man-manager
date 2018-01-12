const Setting = require('../settings')
const newSettings = new Setting()

module.exports = class Captain {
  constructor(settings) {
    this.settings = settings
  }

  run(client, message) {
    this.client = client
    const { author, mentions, channel } = message

    message.guild.fetchMember(message.author).then(guildMember => {
      const checkAdmin = guildMember.hasPermission('ADMINISTRATOR')
      if(!checkAdmin) return
      
      const mention_members = mentions.members.array()

      if(mention_members.length != 2) {
        return message.reply('include both the captains names after the command')
      }

      for(let i = 0; i < 2; i++) {
        if(this.settings.state.joinedUsers.indexOf(mention_members[i].user.id) == -1) {
          return message.reply('make sure both players are ready')
        }
      }

      const { state } = this.settings

      if(state.team_1.captain != null || state.team_2.captain != null) {
        message.reply('Clearing previous captains and players')

        state.team_1 = newSettings.state.team_1
        state.team_2 = newSettings.state.team_2
        state.pickTurn = newSettings.state.pickTurn
        state.map = newSettings.state.map
        state.mapVote = newSettings.state.mapVote
      }

      const flip = Math.round(Math.random())

      if(flip) {
        state.team_1.captain = mention_members[0].user.id
        state.team_2.captain = mention_members[1].user.id
      } else {
        state.team_1.captain = mention_members[1].user.id
        state.team_2.captain = mention_members[0].user.id
      }

      return message.reply('added the 2 players as captains!')

    })
  }
}