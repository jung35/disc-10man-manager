const Discord = require('discord.js')
const MapPick = require('./mappick')

const emoji = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟']
const teamColors = [0x03A9F4, 0xFFC107]
const makeReaction = (i, message) => {
  if(i >= emoji.length) return

  message.react(emoji[i]).then(messageReaction => {
    makeReaction(i + 1, messageReaction.message)
  })
}

module.exports = class Start {
  constructor(settings) {
    this.settings = settings
    this.message = {}
    this.client = {}
    this.guildMembers = {}
    this.currentPick = -1
    this.finished = false
  }

  run(client, message) {
    this.client = client
    const { state, settings: stateVals } = this.settings
    const { channel, guild } = message

    this.guildMembers = guild.members

    guild.fetchMember(message.author).then(guildMember => {
      const checkAdmin = guildMember.hasPermission('ADMINISTRATOR')
      if(!checkAdmin) return

      if(!state.setup) {
        return message.reply('there\'s nothing to start!')
      }

      if(state.joinedUsers.length != 10) {
        return message.reply('there must be 10 players to start')
      }

      if(state.team_1.captain == null || state.team_2.captain == null) {
        return message.reply('there must be 2 captains before starting to pick teams')
      }

      state.pickTurn = stateVals.pickStyle[state.pickStyle].split('')

      return channel.send('', this.setEmbed()).then(message => {
        makeReaction(0, message)
        this.message = message
        this.client.once('messageReactionAdd', this.messageReaction.bind(this))
      }).catch(console.error)
    })
  }

  messageReaction(messageReaction, user) {
    const { message } = messageReaction
    if(message.id != this.message.id) return

    const { state } = this.settings

    if(state.setup && !this.finished) { // removeListener wouldnt work :(
      // really hacky
      this.client.once('messageReactionAdd', this.messageReaction.bind(this))
    }

    if(user.bot) return

    messageReaction.remove(user)

    // Either not the current turn or troll
    if((this.currentPick == 0 && state.team_1.captain != user.id) ||
       (this.currentPick == 1 && state.team_2.captain != user.id)) return

    // make sure to stop if the setup is going on
    if(!state.setup) return

    const emojiType = messageReaction.emoji.name

    let pickedPlayer = 0;

    for(let i = 0; i < emoji.length; i++) {
      if(emojiType == emoji[i]) {
        pickedPlayer = i
        break
      }
    }

    if(pickedPlayer < 0) return // invalid emoji

    pickedPlayer = state.joinedUsers[pickedPlayer]

    if(state.team_1.players.indexOf(pickedPlayer) > -1 || state.team_1.captain == pickedPlayer ||
       state.team_2.players.indexOf(pickedPlayer) > -1 || state.team_2.captain == pickedPlayer) return

    if(this.currentPick == 0) {
      state.team_1.players.push(pickedPlayer)
    } else if(this.currentPick == 1) {
      state.team_2.players.push(pickedPlayer)
    }

    this.currentPick = state.pickTurn.shift() == 'A' ? 0 : 1

    if(state.pickTurn.length == 0) {

      for(let i = 0; i < state.joinedUsers.length; i++) {
        pickedPlayer = state.joinedUsers[i]

        if(state.team_1.players.indexOf(pickedPlayer) == -1 && state.team_1.captain != pickedPlayer &&
           state.team_2.players.indexOf(pickedPlayer) == -1 && state.team_2.captain != pickedPlayer) {

          if(this.currentPick == 0) {
            state.team_1.players.push(pickedPlayer)
          } else if(this.currentPick == 1) {
            state.team_2.players.push(pickedPlayer)
          }

          break
        }
      }

      this.currentPick = -1
      this.finished = 1

      const mapPick = new MapPick(this.settings)
      mapPick.run(this.client, this.message)
    }

    this.message.edit('', this.setEmbed())
  }

  setEmbed() {
    return new Discord.RichEmbed(this.getOptions())
  }

  getOptions() {
    const guildMembers = this.guildMembers
    const { state } = this.settings

    if(this.currentPick == -1) {
      this.currentPick = state.pickTurn.shift() == 'A' ? 0 : 1
    }

    const team1Captain = guildMembers.find('id', state.team_1.captain)
    const team1Name = team1Captain.user.username
    const team1List = state.team_1.players.map(playerId => {
      return guildMembers.find('id', playerId)
    })

    team1List.unshift(team1Captain)

    const team2Captain = guildMembers.find('id', state.team_2.captain)
    const team2Name = team2Captain.user.username
    const team2List = state.team_2.players.map(playerId => {
      return guildMembers.find('id', playerId)
    })

    team2List.unshift(team2Captain)

    const playerList = state.joinedUsers.map((playerId, i) => {
      const playerName = guildMembers.find('id', playerId)
      const picked = (state.team_1.captain == playerId || state.team_1.players.indexOf(playerId) > -1 || state.team_2.captain == playerId || state.team_2.players.indexOf(playerId) > -1)

      if(picked) {
        return `~~${i + 1}) ${playerName}~~`
      }

      return `${i + 1}) ${playerName}`
    }).join('\n')

    let title = `10 Man Team Picks (${this.currentPick == 0 ? team1Name : team2Name}'s pick)`

    if(this.finished) {
      title = '10 Man Team Picks'
    }

    let fields = [
      {
        name: `Team ${team1Name}`,
        value: team1List.join('\n'),
        inline: true
      }, {
        name: `Team ${team2Name}`,
        value: team2List.join('\n'),
        inline: true
      }
    ]

    if(!this.finished) {
      fields.push({
        name: 'Players',
        value: playerList
      })
    }

    return {
      color: this.finished ? 0x4CAF50 : teamColors[this.currentPick],
      title: title,
      description: '------------------------------------------------------------',
      fields: fields
    }
  }
}