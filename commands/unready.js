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
    let foundUser = -1

    if(mention_members.length > 0) {
      mention_members.map(user => {
        let foundUser = state.joinedUsers.indexOf(user.id)
        if(foundUser == -1) return false

        state.joinedUsers.splice(foundUser, 1)
      })

      message.reply(`the accounts were removed from lobby! (${state.joinedUsers.length}/10)`)
      return false
    }

    foundUser = state.joinedUsers.indexOf(author.id)
    if(foundUser == -1) {
      message.reply('you\'re not in the lobby!')
      return false
    }

    state.joinedUsers.splice(foundUser, 1)

    message.reply(`you were successfully removed from lobby! (${state.joinedUsers.length}/10)`)
  }
}