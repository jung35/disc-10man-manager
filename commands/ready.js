const Discord = require('discord.js')

module.exports = class Ready {
  constructor(settings) {
    this.settings = settings
  }

  run(client, message) {
    const { state } = this.settings
    if(!state.setup) {
      message.reply('There is no lobby setup!').then(message => {
        message.react('😞')
      })

      return false
    }


    const { author, mentions } = message

    const mention_members = mentions.members.array()

    if(mention_members.length > 0) {
      if(state.joinedUsers.length + mention_members.length > 10) {
        message.reply('sorry not all users can join the lobby!')
        return false
      }

      mention_members.map(user => {
        if(state.joinedUsers.indexOf(user.id) > -1) return false
        state.joinedUsers.push(user.id)
      })

      message.reply(`the accounts were added! (${state.joinedUsers.length}/10)`)
      return false
    }

    if(state.joinedUsers.indexOf(author.id) > -1) {
      message.reply(`you're already added! (${state.joinedUsers.length}/10)`)
      return false
    }

    if(state.joinedUsers.length >= 10) {
      message.reply('sorry the lobby is full!')
      return false
    }

    state.joinedUsers.push(author.id)

    message.reply(`you were successfully added! (${state.joinedUsers.length}/10)`)
  }
}