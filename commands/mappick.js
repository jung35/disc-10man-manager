const Discord = require('discord.js')
const emoji = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟']
const makeReaction = (i, message, limit) => {
  if(i >= limit) return // # of maps

  message.react(emoji[i]).then(messageReaction => {
    makeReaction(i + 1, messageReaction.message, limit)
  })
}

module.exports = class MapPick {
  constructor(settings) {
    this.settings = settings
    this.message = {}
    this.client = {}
    this.emojiLimit = 7
    this.guildMembers = {}
    this.finished = false
  }

  run(client, message) {
    this.client = client
    const { channel, guild } = message
    const { state, settings } = this.settings
    this.guildMembers = guild.members

    for(let i = 0; i < settings.mapPool.length; i++) {
      state.mapVote[settings.mapPool[i]] = []
    }

    return channel.send('', this.setEmbed()).then(message => {
      makeReaction(0, message, this.emojiLimit)
      this.message = message
      this.client.once('messageReactionAdd', this.messageReaction.bind(this))
    }).catch(console.error)
  }

  messageReaction(messageReaction, user) {
    const { message } = messageReaction
    if(message.id != this.message.id) return

    const { state, settings } = this.settings

    if(state.setup && !this.finished) { // removeListener wouldnt work :(
      // really hacky
      this.client.once('messageReactionAdd', this.messageReaction.bind(this))
    }

    if(user.bot) return

    messageReaction.remove(user)

    if(state.mapStyle == 0 && user.id != state.team_2.captain) return

    // make sure to stop if the setup is going on
    if(!state.setup) return

    const emojiType = messageReaction.emoji.name

    let pickedEmoji = 0;

    for(let i = 0; i < this.emojiLimit; i++) {
      if(emojiType == emoji[i]) {
        pickedEmoji = i
        break
      }
    }

    if(pickedEmoji < 0) return // invalid emoji

    if(state.mapStyle == 0) {
      state.map = settings.mapPool[pickedEmoji]
      state.mapVote[state.map].push(user.id)
      this.finished = true
      return this.message.edit('', this.setEmbed())
    }

    const pickedMap = settings.mapPool[pickedEmoji]

    let totalVote = 0

    for(let mapIndex in state.mapVote) {
      const map = state.mapVote[mapIndex]
      const i = map.indexOf(user.id)

      if(i > -1) {
        map.splice(i, 1)
        continue
      }

      totalVote += map.length
    }

    state.mapVote[pickedMap].push(user.id)
    totalVote++

    if(totalVote == 10) {
      this.finished = true
      let mostVotedMap = null
      let isTie = false
      let tieWith = null

      for(let mapIndex in state.mapVote) {
        const map = state.mapVote[mapIndex]
        if(mostVotedMap == null) {
          mostVotedMap = mapIndex
        } else if(state.mapVote[mostVotedMap].length < map.length) {
          mostVotedMap = mapIndex
          isTie = false
          tieWith = null
        } else if(state.mapVote[mostVotedMap].length < map.length) {
          isTie = true
          tieWith = mapIndex
        }
      }

      if(isTie) {
        this.finished = false
        settings.mapPool = [mostVotedMap, tieWith]
        state.mapVote = {}

        for(let i = 0; i < settings.mapPool.length; i++) {
          state.mapVote[settings.mapPool[i]] = []
        }
      }

      state.map = mostVotedMap
    }


    return this.message.edit('', this.setEmbed())
  }

  setEmbed() {
    return new Discord.RichEmbed(this.getOptions())
  }

  getOptions() {
    const { state, settings } = this.settings
    const guildMembers = this.guildMembers

    let title = 'Map Select (Majority Vote)'

    if(state.mapStyle == 0) {
      const team2Captain = guildMembers.find('id', state.team_2.captain)
      title = `Map Select (${team2Captain.user.username}'s pick)`
    }

    let fields = settings.mapPool.map((map, i) => {
      const mapVote = state.mapVote[map]
      if(mapVote == undefined) return null

      let votes = mapVote.length

      if(state.mapStyle == 0) {
        if(votes > 0) votes = 10

        return {
          name: `${i + 1}) ${map}`,
          value: `[${this.drawProgressBar(votes)}]`
        }
      }

      return {
        name: `${i + 1}) ${map}`,
        value: `[${this.drawProgressBar(votes)}] ${votes}/10`
      }
    }).filter(val => {return val != null})

    return {
      color: this.finished ? 0x4CAF50 : 0xFFC107,
      title: title,
      description: '------------------------------------------------------------',
      fields: fields
    }
  }

  drawProgressBar(amount) {
    const fill = '█'
    const empty = '▒'

    let bar = ''
    for(let i = 1; i <= 10; i++) {
      if(i <= amount) bar += fill
      else bar += empty
    }

    return bar
  }
}