const Discord = require('discord.js')
const commandPrefix = process.env.COMMAND_PREFIX || '.'


const emoji = ['❌', '✅', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣']
const makeReaction = (i, message) => {
  if(i >= 4) return

  message.react(emoji[i]).then(messageReaction => {
    makeReaction(i + 1, messageReaction.message)
  })
}

module.exports = class Setup {
  constructor(settings) {
    this.settings = settings
    this.canceled = false
    this.chat_id = null
    this.currentOptions = 'main'
    this.message = {}
    this.client = {}
  }

  run(client, message) {
    this.client = client

    message.guild.fetchMember(message.author).then(guildMember => {
      const checkAdmin = guildMember.hasPermission('ADMINISTRATOR')
      if(!checkAdmin) return

      if(this.settings.state.setup) {
        return message.reply('the setup is already finished. Please reset everything by running the restart command to setup again.')
      }
      
      this.pass(client, message)
    })
  }

  pass(client, message) {
    this.canceled = false
    this.settings.state.setup = false
    this.settings.state.joinedUsers = []

    const { channel } = message

    const data = {
      title: 'Setup'
    }

    return channel.send('', this.setEmbed('main')).then(message => {
      makeReaction(0, message)
      this.message = message
      this.client.once('messageReactionAdd', this.messageReaction.bind(this))
    }).catch(console.error)
  }

  messageReaction(messageReaction, user) {
    const { message } = messageReaction
    if(message.id != this.message.id) return

    if(!this.canceled && !this.settings.state.setup) { // removeListener wouldnt work :(
      // really hacky
      this.client.once('messageReactionAdd', this.messageReaction.bind(this))
    }

    if(user.bot) return

    messageReaction.remove(user)
    if(this.settings.state.setup || this.canceled) return

    message.guild.fetchMember(user).then(guildMember => {
      const checkAdmin = guildMember.hasPermission('ADMINISTRATOR')

      if(!checkAdmin) return

      const emojiType = messageReaction.emoji.name

      switch(this.currentOptions) {
        case 'main':
          this.mainOptions(emojiType)
          break;
        case 'pickstyle':
          this.pickStyleOptions(emojiType)
          break;
        case 'mapstyle':
          this.mapStyleOptions(emojiType)
          break;
      }

      if(emojiType == emoji[0]) { // cancel
        this.message.edit('', this.setEmbed('quit'))
        // this.client.removeListener('messageReactionAdd', this.messageReaction) // why wont u work!!!
      }
    })
  }

  setEmbed(type) {
    return new Discord.RichEmbed(this.getOptions(type))
  }

  getOptions(type) {
    const settings = this.settings.settings
    const state = this.settings.state
    let inc = 1
    let fields = []

    switch(type) {
      case 'quit':
        this.canceled = true
        return {
          color: 0xF44336,
          title: '10 Man Setup',
          description: 'Setup Canceled :(',
        }
      case 'finish':
        this.settings.state.setup = true
        return {
          color: 0x4CAF50,
          title: '10 Man Setup',
          description: `Setup Complete! Start joining now using ${commandPrefix}ready`,
          fields: [
            {name: 'Team Pick Style', value: settings.pickStyle[state.pickStyle], inline: true},
            {name: 'Map Pick Style', value: settings.mapStyle[state.mapStyle], inline: true},
            // {name: 'Setup Map Pool', value: '['+mapPool.join(', ')+']', inline: true},
          ]
        }
      case 'main':
      case 'save':
        this.currentOptions = 'main'
        const mapPool = state.mapPool.map(i => settings.mapPool[i])
        return {
          color: 0x3F51B5,
          title: '10 Man Setup',
          description: '------------------------------------------------------------',
          fields: [
            {name: '1) Team Pick Style', value: settings.pickStyle[state.pickStyle]},
            {name: '2) Map Pick Style', value: settings.mapStyle[state.mapStyle]},
            // {name: '3) Setup Map Pool', value: '['+mapPool.join(', ')+']'},
          ]
        }
      case 'pickstyle':
        this.currentOptions = 'pickstyle'
        inc = 1
        fields = settings.pickStyle.map(style => {
          return {name: (inc++) + ') '+style, value: '\u200B'}
        })
        return {
          title: '10 Man Setup (Team Pick Style)',
          description: '------------------------------------------------------------',
          color: 0xFFC107,
          fields: fields
        }
      case 'mapstyle':
        this.currentOptions = 'mapstyle'
        inc = 1
        fields = settings.mapStyle.map(style => {
          return {name: (inc++) + ') '+style, value: '\u200B'}
        })
        return {
          title: '10 Man Setup (Map Pick Style)',
          description: '------------------------------------------------------------',
          color: 0xFFC107,
          fields: fields
        }
    }
  }

  mainOptions(emojiType) {
    const message = this.message

    if(emojiType == emoji[1]) { // finished
      message.edit('', this.setEmbed('finish'))
    } else if(emojiType == emoji[2]) { // team pick style
      message.edit('', this.setEmbed('pickstyle'))
    } else if(emojiType == emoji[3]) { // map pick style
      message.edit('', this.setEmbed('mapstyle'))
    }
  }

  pickStyleOptions(emojiType) {
    const message = this.message

    if(emojiType == emoji[2]) {
      this.settings.state.pickStyle = 0
    } else if(emojiType == emoji[3]) {
      this.settings.state.pickStyle = 1
    }

    message.edit('', this.setEmbed('save'))
  }

  mapStyleOptions(emojiType) {
    const message = this.message

    if(emojiType == emoji[2]) {
      this.settings.state.mapStyle = 0
    } else if(emojiType == emoji[3]) {
      this.settings.state.mapStyle = 1
    }

    message.edit('', this.setEmbed('save'))
  }
}